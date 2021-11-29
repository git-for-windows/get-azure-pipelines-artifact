import fetch from 'node-fetch'
import {get} from '../src/downloader'
import {mocked} from 'ts-jest/utils'

const buildIdResponse = {
  count: 1,
  value: [
    {
      _links: {
        self: {
          href: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/Builds/73427'
        },
        web: {
          href: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_build/results?buildId=73427'
        },
        sourceVersionDisplayUri: {
          href: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/builds/73427/sources'
        },
        timeline: {
          href: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/builds/73427/Timeline'
        },
        badge: {
          href: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/status/22'
        }
      },
      properties: {},
      tags: [],
      validationResults: [],
      plans: [{planId: '294f4465-9475-43cd-a7f5-fb071dd52b25'}],
      triggerInfo: {
        'ci.sourceBranch': 'refs/heads/main',
        'ci.sourceSha': '2aa3bdf2c681810376f86dedd0b2f544b425eace',
        'ci.message': 'Update 6 packages',
        'ci.triggerRepository': 'git-for-windows/git-sdk-64'
      },
      id: 73427,
      buildNumber: '73427',
      status: 'completed',
      result: 'succeeded',
      queueTime: '2021-03-29T03:15:02.4106708Z',
      startTime: '2021-03-29T03:15:18.5120843Z',
      finishTime: '2021-03-29T03:49:59.8824069Z',
      url: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/Builds/73427',
      definition: {
        drafts: [],
        id: 22,
        name: 'git-sdk-64-minimal',
        url: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/Definitions/22?revision=42',
        uri: 'vstfs:///Build/Definition/22',
        path: '\\',
        type: 'build',
        queueStatus: 'enabled',
        revision: 42,
        project: {
          id: 'f3317b6a-fa67-40d4-9a33-b652e06943df',
          name: 'git',
          description: 'Git for Windows',
          url: 'https://dev.azure.com/Git-for-Windows/_apis/projects/f3317b6a-fa67-40d4-9a33-b652e06943df',
          state: 'wellFormed',
          revision: 58,
          visibility: 'public',
          lastUpdateTime: '2018-05-01T10:31:00.293Z'
        }
      },
      project: {
        id: 'f3317b6a-fa67-40d4-9a33-b652e06943df',
        name: 'git',
        description: 'Git for Windows',
        url: 'https://dev.azure.com/Git-for-Windows/_apis/projects/f3317b6a-fa67-40d4-9a33-b652e06943df',
        state: 'wellFormed',
        revision: 58,
        visibility: 'public',
        lastUpdateTime: '2018-05-01T10:31:00.293Z'
      },
      uri: 'vstfs:///Build/Build/73427',
      sourceBranch: 'refs/heads/main',
      sourceVersion: '2aa3bdf2c681810376f86dedd0b2f544b425eace',
      priority: 'normal',
      reason: 'individualCI',
      requestedFor: {
        displayName: 'Microsoft.VisualStudio.Services.TFS',
        url: 'https://spsprodcus1.vssps.visualstudio.com/A7ef732d2-e7e4-499c-8f88-7ee74b5c51cc/_apis/Identities/00000002-0000-8888-8000-000000000000',
        _links: {
          avatar: {
            href: 'https://dev.azure.com/Git-for-Windows/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA'
          }
        },
        id: '00000002-0000-8888-8000-000000000000',
        uniqueName: null,
        imageUrl: null,
        descriptor:
          's2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA'
      },
      requestedBy: {
        displayName: 'Microsoft.VisualStudio.Services.TFS',
        url: 'https://spsprodcus1.vssps.visualstudio.com/A7ef732d2-e7e4-499c-8f88-7ee74b5c51cc/_apis/Identities/00000002-0000-8888-8000-000000000000',
        _links: {
          avatar: {
            href: 'https://dev.azure.com/Git-for-Windows/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA'
          }
        },
        id: '00000002-0000-8888-8000-000000000000',
        uniqueName: null,
        imageUrl: null,
        descriptor:
          's2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA'
      },
      lastChangedDate: '2021-03-29T03:50:00.2Z',
      lastChangedBy: {
        displayName: 'Microsoft.VisualStudio.Services.TFS',
        url: 'https://spsprodcus1.vssps.visualstudio.com/A7ef732d2-e7e4-499c-8f88-7ee74b5c51cc/_apis/Identities/00000002-0000-8888-8000-000000000000',
        _links: {
          avatar: {
            href: 'https://dev.azure.com/Git-for-Windows/_apis/GraphProfile/MemberAvatars/s2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA'
          }
        },
        id: '00000002-0000-8888-8000-000000000000',
        uniqueName: null,
        imageUrl: null,
        descriptor:
          's2s.MDAwMDAwMDItMDAwMC04ODg4LTgwMDAtMDAwMDAwMDAwMDAwQDJjODk1OTA4LTA0ZTAtNDk1Mi04OWZkLTU0YjAwNDZkNjI4OA'
      },
      orchestrationPlan: {planId: '294f4465-9475-43cd-a7f5-fb071dd52b25'},
      logs: {
        id: 0,
        type: 'Container',
        url: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/builds/73427/logs'
      },
      repository: {
        id: 'git-for-windows/git-sdk-64',
        type: 'GitHub',
        clean: null,
        checkoutSubmodules: false
      },
      keepForever: true,
      retainedByRelease: false,
      triggeredByBuild: null
    }
  ]
}

const artifactResponse = {
  count: 2,
  value: [
    {
      id: 12184,
      name: 'git-artifacts',
      source: 'fd490c07-0b22-5182-fac9-6d67fe1e939b',
      resource: {
        type: 'PipelineArtifact',
        data: 'A7DC9A9D5763E9B7A287E22EBE4BBE297B74AAC544823A86AD215C0D9A8EEDD001',
        properties: {
          RootId:
            'B1146F8C4772281CA63EA26BE97329B69A740CA21B7C3B8B74AFE4BEE9B30DE902',
          artifactsize: '49185757'
        },
        url: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/builds/73427/artifacts?artifactName=git-artifacts&api-version=6.0',
        downloadUrl:
          'https://artprodcus3.artifacts.visualstudio.com/Ac037a06e-1e3b-41a1-b045-ce593a4d2ab4/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/artifact/cGlwZWxpbmVhcnRpZmFjdDovL0dpdC1mb3ItV2luZG93cy9wcm9qZWN0SWQvZjMzMTdiNmEtZmE2Ny00MGQ0LTlhMzMtYjY1MmUwNjk0M2RmL2J1aWxkSWQvNzM0MjcvYXJ0aWZhY3ROYW1lL2dpdC1hcnRpZmFjdHM1/content?format=zip'
      }
    },
    {
      id: 12185,
      name: 'git-sdk-64-minimal',
      source: 'fd490c07-0b22-5182-fac9-6d67fe1e939b',
      resource: {
        type: 'Container',
        data: '#/15737294/git-sdk-64-minimal',
        properties: {
          localpath: 'D:\\a\\1\\s\\git-sdk-64-minimal',
          artifactsize: '249437960'
        },
        url: 'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/builds/73427/artifacts?artifactName=git-sdk-64-minimal&api-version=6.0',
        downloadUrl:
          'https://dev.azure.com/Git-for-Windows/f3317b6a-fa67-40d4-9a33-b652e06943df/_apis/build/builds/73427/artifacts?artifactName=git-sdk-64-minimal&api-version=6.0&%24format=zip'
      }
    }
  ]
}

jest.mock('node-fetch')
const {Response} = jest.requireActual('node-fetch')

test('can obtain build ID', async () => {
  mocked(fetch)
    .mockReturnValueOnce(
      Promise.resolve(new Response(JSON.stringify(buildIdResponse)))
    )
    .mockReturnValueOnce(
      Promise.resolve(new Response(JSON.stringify(artifactResponse)))
    )
  const {cacheId} = await get(
    'git-for-windows/git',
    '22',
    'git-sdk-64-minimal',
    undefined
  )
  expect(fetch).toHaveBeenCalledTimes(2)
  expect(cacheId).toEqual('git-for-windows.git-22-git-sdk-64-minimal-73427')
})
