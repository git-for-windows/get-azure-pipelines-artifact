# Download an artifact from an Azure Pipeline

Use this Action to download an artifact from an Azure Pipeline.

## Getting Started

```yaml
name: Download stuff from an Azure Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-16.04
    steps:
    - name: Download a build artifact from an Azure Pipeline
      uses: git-for-windows/get-azure-pipelines-artifact@v0
      with:
        repository: git/git
        definitionId: 10
        artifact: sparse
    - run: sudo dpkg -i sparse_*.deb
```

## Input parameters

### Repository

This Action needs to know in which repository the artifact lives. Example: [https://dev.azure.com/git/git/_build](https://dev.azure.com/git/git/_build) shows the Azure Pipelines of the `git/git` repository. It can be configured like this:

```yaml
- uses: git-for-windows/get-azure-pipelines-artifact@v0
  with:
    repository: git/git
```

### Pipeline definition ID

Every Azure Pipeline has a numerical identifier that is part of the URL. For example, the "Build sparse for Ubuntu" Pipeline in `git/git` at [https://dev.azure.com/git/git/_build?definitionId=10](https://dev.azure.com/git/git/_build?definitionId=10) has the identifier `10`. It needs to be configured via the `definitionId` key.

```yaml
- uses: git-for-windows/get-azure-pipelines-artifact@v0
  with:
    definitionId: 10
```

### Artifact name

Pipelines can have an arbitrary number of artifacts, which are identified by a name. The `artifact` parameter specifies which one to download. It can be omitted if the given Pipeline run has only one artifact attached to it.

### Build filters

The `reasonFilter` parameter can be added to filter by the reason for a build.
A list of accepted reasons can be found [here](https://docs.microsoft.com/en-us/rest/api/azure/devops/build/builds/list?view=azure-devops-rest-6.0#buildreason). This parameter defaults to `all` if omitted.

### Strip prefix

Pipeline artifacts can contain entire directory structures. The `stripPrefix` parameter allows filtering by a given path prefix; Any files matching that prefix will be written (after stripping the prefix), all other files will be skipped.

### Output location

By default, the artifact files will be stored in the current directory. The `path` parameter can be used to override that.

This directory needs to be unless caching is turned off.

### Caching

To accelerate this Action, artifacts are cached once downloaded. This can be turned off by setting the input parameter `cache` to `false`.

## Developing _this_ Action

> First, you'll need to have a reasonably modern version of `node` handy, such as Node 12.

Install the dependencies

```bash
$ npm install
```

Build the Action and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```
