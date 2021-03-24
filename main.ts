import * as core from '@actions/core'
import {get} from './src/downloader'
import {restoreCache, saveCache} from '@actions/cache'
import {readdirSync} from 'fs'

async function run(): Promise<void> {
  try {
    const {artifactName, download, cacheId} = await get(
      core.getInput('repository'),
      core.getInput('definitionId'),
      core.getInput('artifact')
    )
    const outputDirectory = core.getInput('path') || artifactName
    let useCache = core.getInput('cache') === 'true'
    const verbose = core.getInput('verbose')

    const isDirectoryEmpty = (path: string): boolean => {
      try {
        return readdirSync(path).length === 0
      } catch (e) {
        return e && e.code === 'ENOENT'
      }
    }

    if (useCache && !isDirectoryEmpty(outputDirectory)) {
      throw new Error(`Directory '${outputDirectory}' not empty`)
    }

    let needToDownload = true
    try {
      if (useCache && (await restoreCache([outputDirectory], cacheId))) {
        core.info(`Cached ${cacheId} was successfully restored`)
        needToDownload = false
      }
    } catch (e) {
      core.warning(`Cannot use @actions/cache (${e})`)
      useCache = false
    }

    if (needToDownload) {
      core.info(`Downloading ${artifactName}`)
      await download(
        outputDirectory,
        verbose.match(/^\d+$/) ? parseInt(verbose) : verbose === 'true'
      )

      try {
        if (useCache && !(await saveCache([outputDirectory], cacheId))) {
          core.warning(`Failed to cache ${cacheId}`)
        }
      } catch (e) {
        core.warning(`Failed to cache ${cacheId}: ${e.message}`)
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
