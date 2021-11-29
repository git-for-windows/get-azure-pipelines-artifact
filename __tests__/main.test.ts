/* eslint-disable no-console */
import * as child_process from 'child_process'
import * as path from 'path'
import * as process from 'process'
import fs from 'fs'

async function runAction(
  options?: child_process.SpawnOptionsWithoutStdio
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const nodeExePath = process.execPath
    const scriptPath = path.join(__dirname, '..', 'lib', 'main.js')

    const child = child_process
      .spawn(nodeExePath, [scriptPath], options)
      .on('error', reject)
      .on('close', resolve)

    child.stderr.on('data', data => console.log(`${data}`))
    child.stdout.on('data', data => console.log(`${data}`))
  })
}

if (process.env.RUN_NETWORK_TESTS !== 'true') {
  test('skipping tests requiring network access', async () => {
    console.log(
      `If you want to run tests that access the network, set:\nexport RUN_NETWORK_TESTS=true`
    )
  })
} else {
  jest.setTimeout(5 * 60 * 1000) // this can easily take a minute or five

  test('download `sparse` artifact', async () => {
    const getSparsePackages = async (): Promise<string[]> => {
      const files = await fs.promises.readdir('.')
      return files.filter(e => e.match(/^sparse_.*\.deb$/))
    }

    for (const sparsePackage of await getSparsePackages()) {
      await fs.promises.unlink(sparsePackage)
    }

    expect(
      await runAction({
        env: {
          INPUT_REPOSITORY: 'git/git',
          INPUT_DEFINITIONID: '10',
          INPUT_VERBOSE: 'true',
          INPUT_CACHE: 'true'
        }
      })
    ).toEqual(0)
    expect(await getSparsePackages()).toHaveLength(1)
  })
}
