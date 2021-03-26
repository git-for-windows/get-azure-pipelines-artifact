import fs from 'fs'
import https from 'https'
import {Readable} from 'stream'
import unzipper from 'unzipper'
import fetch from '@adobe/node-fetch-retry'

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
    if (!e || e.code !== 'ENOENT') {
      throw e
    }
  }
  fs.mkdirSync(directoryPath, {recursive: true})
}

async function unzip(
  url: string,
  stripPrefix: string,
  outputDirectory: string,
  verbose: boolean | number
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
    https
      .get(url, (res: Readable): void => {
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
              entry.pipe(fs.createWriteStream(`${entryPath}`))
            }
          })
          .on('error', reject)
          .on('finish', progress)
          .on('finish', () => resolve(files))
      })
      .on('error', reject)
  })
}

export async function get(
  repository: string,
  definitionId: string,
  artifactName: string,
  stripPrefix?: string
): Promise<{
  artifactName: string
  cacheId: string
  download: (
    outputDirectory: string,
    verbose?: number | boolean
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
    `${baseURL}?definitions=${definitionId}&statusFilter=completed&resultFilter=succeeded&$top=1`
  )
  if (data.count !== 1) {
    throw new Error(`Unexpected number of builds: ${data.count}`)
  }
  let url: string | undefined
  const getURL = async (): Promise<string> => {
    const data2 = await fetchJSONFromURL<{
      count: number
      value: [{name: string; resource: {downloadUrl: string}}]
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
    return filtered[0].resource.downloadUrl
  }

  if (!artifactName) {
    url = await getURL()
  }

  const download = async (
    outputDirectory: string,
    verbose: number | boolean = false
  ): Promise<string[]> => {
    if (!url) {
      url = await getURL()
    }
    let delayInSeconds = 1
    for (;;) {
      try {
        return await unzip(
          url,
          stripPrefix || `${artifactName}/`,
          outputDirectory,
          verbose
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

  const cacheId = `${repository}-${definitionId}-${artifactName}-${data.value[0].id}`
  return {artifactName, download, cacheId}
}
