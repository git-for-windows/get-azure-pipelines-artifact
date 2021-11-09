import {Readable} from 'stream'
import fetch from '@adobe/node-fetch-retry'
import fs from 'fs'
import https from 'https'
import unzipper from 'unzipper'

async function fetchJSONFromURL<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (res.status !== 200) {
    throw new Error(
      `Got code ${res.status}, URL: ${url}, message: ${res.statusText}`
    )
  }
  return res.json()
}

function mkdirp(directoryPath: string): void {
  try {
    const stat = fs.statSync(directoryPath)
    if (stat.isDirectory()) {
      return
    }
    throw new Error(`${directoryPath} exists, but is not a directory`)
  } catch (e) {
    if (!(e instanceof Object) || (e as any).code !== 'ENOENT') {
      throw e
    }
  }
  fs.mkdirSync(directoryPath, {recursive: true})
}

export async function unzip(
  url: string,
  bytesToExtract: number,
  stripPrefix: string,
  outputDirectory: string,
  verbose: boolean | number,
  storeZipAs?: string
): Promise<string[]> {
  const files: string[] = []
  let progress =
    verbose === false
      ? (path: string): void => {
          if (path !== undefined) {
            files.push(path)
          }
        }
      : (path: string): void => {
          if (path !== undefined) {
            files.push(path)
            process.stderr.write(`${path}\n`)
          }
        }
  if (typeof verbose === 'number') {
    let counter = 0
    progress = (path?: string): void => {
      if (path !== undefined) {
        files.push(path)
        if (++counter % verbose === 0) {
          process.stderr.write(`${counter} items extracted\n`)
        }
      }
    }
  }
  mkdirp(outputDirectory)

  return new Promise<string[]>((resolve, reject) => {
    const callback = (res: Readable): void => {
      if (storeZipAs) {
        process.stderr.write(`Writing ${storeZipAs}\n`)
        res.pipe(fs.createWriteStream(storeZipAs)).on('error', reject)
      }
      res
        .on('error', reject)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
          if (!entry.path.startsWith(stripPrefix)) {
            process.stderr.write(
              `warning: skipping ${entry.path} because it does not start with ${stripPrefix}\n`
            )
          }
          const entryPath = `${outputDirectory}/${entry.path.substring(
            stripPrefix.length
          )}`
          if (entryPath.endsWith('/')) {
            mkdirp(entryPath.replace(/\/$/, ''))
            entry.autodrain()
          } else {
            progress(entryPath)
            entry
              .pipe(fs.createWriteStream(`${entryPath}`))
              .on('finish', () => {
                bytesToExtract -= fs.statSync(entryPath).size
              })
          }
        })
        .on('error', reject)
        .on('finish', progress)
        .on('finish', () => {
          bytesToExtract === 0
            ? resolve(files)
            : // eslint-disable-next-line prefer-promise-reject-errors
              reject(`${bytesToExtract} bytes left to extract`)
        })
    }
    if (url.startsWith('file:')) {
      callback(fs.createReadStream(url.substring('file:'.length)))
    } else {
      https.get(url, callback).on('error', reject)
    }
  })
}

export async function get(
  repository: string,
  definitionId: string,
  artifactName: string,
  stripPrefix?: string,
  reasonFilter = 'all'
): Promise<{
  artifactName: string
  stripPrefix: string
  bytesToExtract: number
  cacheId: string
  download: (
    outputDirectory: string,
    verbose?: number | boolean,
    storeZipAs?: string
  ) => Promise<string[]>
}> {
  if (!repository || !definitionId) {
    throw new Error(
      `Need repository and definitionId (got ${repository} and ${definitionId})`
    )
  }
  const baseURL = `https://dev.azure.com/${repository}/_apis/build/builds`
  const data = await fetchJSONFromURL<{
    count: number
    value: [{id: string; downloadURL: string}]
  }>(
    `${baseURL}?definitions=${definitionId}&statusFilter=completed&resultFilter=succeeded&reasonFilter=${reasonFilter}&$top=1`
  )
  if (data.count !== 1) {
    throw new Error(`Unexpected number of builds: ${data.count}`)
  }
  const getURL = async (): Promise<{url: string; bytesToExtract: number}> => {
    const data2 = await fetchJSONFromURL<{
      count: number
      value: [
        {
          name: string
          resource: {downloadUrl: string; properties: {artifactsize: number}}
        }
      ]
    }>(`${baseURL}/${data.value[0].id}/artifacts`)
    if (!artifactName) {
      if (data2.value.length !== 1) {
        throw new Error(
          `Cannot deduce artifact name (candidates: ${data2.value
            .map(e => e.name)
            .join(', ')})`
        )
      }
      artifactName = data2.value[0].name
    }
    const filtered = data2.value.filter(e => e.name === artifactName)
    if (filtered.length !== 1) {
      throw new Error(
        `Could not find ${artifactName} in ${data2.value
          .map(e => e.name)
          .join(', ')}`
      )
    }

    return {
      url: filtered[0].resource.downloadUrl,
      bytesToExtract: filtered[0].resource.properties.artifactsize
    }
  }

  const {url, bytesToExtract} = await getURL()

  if (!stripPrefix) {
    stripPrefix = `${artifactName}/`
  }

  const download = async (
    outputDirectory: string,
    verbose: number | boolean = false,
    storeZipAs?: string
  ): Promise<string[]> => {
    let delayInSeconds = 1
    for (;;) {
      try {
        return await unzip(
          url,
          bytesToExtract,
          stripPrefix || `${artifactName}/`,
          outputDirectory,
          verbose,
          storeZipAs
        )
      } catch (e) {
        delayInSeconds *= 2
        if (delayInSeconds >= 60) {
          throw e
        }
        process.stderr.write(
          `Encountered problem downloading/extracting ${url}: ${e}; Retrying in ${delayInSeconds} seconds...\n`
        )
        await new Promise((resolve, _reject) =>
          setTimeout(resolve, delayInSeconds * 1000)
        )
      }
    }
  }

  const cacheId = `${repository}-${definitionId}-${artifactName}-${data.value[0].id}`.replace(
    '/',
    '.'
  )
  return {artifactName, stripPrefix, download, bytesToExtract, cacheId}
}
