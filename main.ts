import * as core from '@actions/core'
import {unzip, get} from './src/downloader'
import {restoreCache, saveCache} from '@actions/cache'
import {readdirSync, unlinkSync} from 'fs'

async function run(): Promise<void> {
  try {
    const {artifactName, stripPrefix, download, cacheId} = await get(
      core.getInput('repository'),
      core.getInput('definitionId'),
      core.getInput('artifact'),
      core.getInput('stripPrefix')
    )
    const outputDirectory = core.getInput('path') || artifactName
    let useCache = core.getInput('cache') === 'true'
    const verbose: number | boolean = ((input?: string) =>
      input && input.match(/^\d+$/) ? parseInt(input) : input === 'true')(
      core.getInput('verbose')
    )

    const isDirectoryEmpty = (path: string): boolean => {
      try {
        return readdirSync(path).length === 0
      } catch (e) {
        return e && e.code === 'ENOENT'
      }
    }

    let needToDownload = true
    let storeZipAs: string | undefined
    if (useCache) {
      try {
        if (!isDirectoryEmpty(outputDirectory)) {
          storeZipAs = `${outputDirectory}/.${cacheId}.zip`
          if (await restoreCache([storeZipAs], cacheId)) {
            await unzip(
              `file:${storeZipAs}`,
              stripPrefix,
              outputDirectory,
              verbose
            )
            core.info(`Cached ${cacheId} was successfully restored`)
            needToDownload = false
          }
        } else if (await restoreCache([outputDirectory], cacheId)) {
          core.info(`Cached ${cacheId} was successfully restored`)
          needToDownload = false
        }
      } catch (e) {
        core.warning(`Cannot use @actions/cache (${e})`)
        useCache = false
      }
    }

    if (needToDownload) {
      core.info(`Downloading ${artifactName}`)
      await download(outputDirectory, verbose, storeZipAs)

      try {
        if (
          useCache &&
          !(await saveCache([storeZipAs || outputDirectory], cacheId))
        ) {
          core.warning(`Failed to cache ${cacheId}`)
        }
      } catch (e) {
        core.warning(`Failed to cache ${cacheId}: ${e.message}`)
      }

      if (storeZipAs) {
        unlinkSync(storeZipAs)
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
