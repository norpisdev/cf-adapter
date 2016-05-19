# push2cloud-cf-adapter

[![npm](https://img.shields.io/npm/v/push2cloud-cf-adapter.svg)](https://npmjs.org/package/push2cloud-cf-adapter)

This repository is part of the push2cloud project. For contribution guidelines, issues, and general documentation, visit the main [push2cloud project page](https://github.com/push2cloud/push2cloud).


push2cloud-cf-adapter abstracts the cloud foundry api.
It's designed for use with [Node.js](https://nodejs.org/) and installable via `npm install --save push2cloud-cf-adapter`.


## Usage

```js
const cf = require('push2cloud-cf-adapter');

const api = cf({
  api: process.env.CF_API || 'https://api.lyra-836.appcloud.swisscom.com',
  username: process.env.CF_USER,
  password: process.env.CF_PWD,
  org: process.env.CF_ORG,
  space: process.env.CF_SPACE
});

// the callback way...
api.init((err, result) => {
  api.pushApp({
    name: 'temp-app',
    appPath: '/path/to/sampleApp'
  }, (err, app) => {
    api.stageApp({
      appGuid: app.metadata.guid
      // or: name: 'temp-app'
    }, (err) => {
      api.startAppAndWaitForInstances({
        appGuid: app.metadata.guid
        // or: name: 'temp-app'
      }, (err) => {
        // ...
      });
    });
  });
});

// or the promise way...
api.init()
.then((app) => {
  return api.pushApp({
    name: 'temp-app',
    appPath: '/path/to/sampleApp'
  });
})
.then((app) => {
  return api.stageApp({
    appGuid: app.metadata.guid
    // or: name: 'temp-app'
  });
})
.then(() => {
  return api.startAppAndWaitForInstances({
    appGuid: app.metadata.guid
    // or: name: 'temp-app'
  });
})
.then(() => {
  // ...
});

```

## Download

The source is available for download from
[GitHub](https://github.com/push2cloud/cf-adapter/archive/master.zip).
Alternatively, you can install using npm:

```sh
npm install --save push2cloud-cf-adapter
```

You can then `require()` push2cloud-cf-adapter as normal:

```js
const cf = require('push2cloud-cf-adapter');
```

## Documentation
Each asynchronous call can be done with classical callback style or with promise style.

<!-- ### Collections -->

* [`init`](#init)
* [`getInfo`](#getInfo)
* [`pushApp`](#pushApp)


<!-- ## Collections

Collection methods can iterate over Arrays, Objects, Maps, Sets, and any object that implements the ES2015 iterator protocol.
-->

<a name="init"></a>

### init([callback])

Retrieves information of the current space. i.e. apps, services, service bindings, routes, domains, etc...

__Arguments__

* `callback(err, result)` - A callback which is called when function has finished, or an error occurs.

__Example__


```js
const cf = require('push2cloud-cf-adapter');

const api = cf({
  api: 'https://the-url-to-the-cloud-foundry-api-endpoint',
  username: 'my-funny-username',
  password: 'my-very-secret-password',
  org: 'the-cf-org',
  space: 'the-cf-space',
  rejectUnauthorized: true, // optional
  maxRetries: 3, // optional
  delay: 1000, // optional
  delayFactor: 1 // optional
});

api.init((err, result) => {
  console.log(result);
  // {
  //   "apps": [
  //     {
  //       "name": "push2cloud-example-api-1.0.0",
  //       "unversionedName": "push2cloud-example-api",
  //       "guid": "cff85cc4-e217-47f0-b0e0-113d04e6e37d",
  //       "instances": 1,
  //       "memory": 512,
  //       "disk": 512,
  //       "state": "STARTED",
  //       "version": "1.0.0",
  //       "package_state": "STAGED"
  //     },
  //     {
  //       "name": "push2cloud-example-host-2.0.0",
  //       "unversionedName": "push2cloud-example-host",
  //       "guid": "9afc0b68-9004-4292-9284-6110bed72afb",
  //       "instances": 1,
  //       "memory": 512,
  //       "disk": 1024,
  //       "state": "STARTED",
  //       "version": "2.0.0",
  //       "package_state": "STAGED"
  //     }
  //   ],
  //   "serviceBindings": [
  //     {
  //       "service": "todo-db",
  //       "serviceInstanceGuid": "e0dc3f5e-7631-473e-ad3e-ebbf0549ad22",
  //       "app": "push2cloud-example-api-1.0.0",
  //       "unversionedName": "push2cloud-example-api",
  //       "appGuid": "cff85cc4-e217-47f0-b0e0-113d04e6e37d",
  //       "guid": "0d82e751-26ab-40b1-987a-8e1671b39c24"
  //     }
  //   ],
  //   "services": [
  //     {
  //       "name": "todo-db",
  //       "guid": "e0dc3f5e-7631-473e-ad3e-ebbf0549ad22",
  //       "type": "redis",
  //       "plan": "small"
  //     }
  //   ],
  //   "routes": [
  //     {
  //       "guid": "bd7cb2eb-f9fe-4b84-a7cd-1f43969e3ba9",
  //       "domain": "scapp.io",
  //       "domainGuid": "5f952bf2-618b-4584-b37e-92e406149285",
  //       "hostname": "push2cloud-example-host-iot-cf-test",
  //       "app": "push2cloud-example-host-2.0.0",
  //       "unversionedName": "push2cloud-example-host",
  //       "appGuid": "9afc0b68-9004-4292-9284-6110bed72afb"
  //     },
  //     {
  //       "guid": "47542223-1a74-45e9-8857-7baab1b29941",
  //       "domain": "scapp.io",
  //       "domainGuid": "5f952bf2-618b-4584-b37e-92e406149285",
  //       "hostname": "push2cloud-example-api-iot-cf-test",
  //       "app": "push2cloud-example-api-1.0.0",
  //       "unversionedName": "push2cloud-example-api",
  //       "appGuid": "cff85cc4-e217-47f0-b0e0-113d04e6e37d"
  //     }
  //   ],
  //   "envVars": [
  //     {
  //       "env": {
  //         "SYSTEM_VERSION": "1.0.0"
  //       },
  //       "name": "push2cloud-example-api-1.0.0",
  //       "unversionedName": "push2cloud-example-api"
  //     },
  //     {
  //       "env": {
  //         "SYSTEM_VERSION": "1.0.0",
  //         "PUSH2CLOUD_EXAMPLE_API_HOST": "https://push2cloud-example-api-iot-cf-test.scapp.io"
  //       },
  //       "name": "push2cloud-example-host-2.0.0",
  //       "unversionedName": "push2cloud-example-host"
  //     }
  //   ],
  //   "domains": [
  //     {
  //       "guid": "5f952bf2-618b-4584-b37e-92e406149285",
  //       "name": "scapp.io"
  //     },
  //     {
  //       "guid": "dc478cd0-5185-4a48-a964-1e53d868daf2",
  //       "name": "applicationcloud.io"
  //     }
  //   ]
  // }
});
```

---------------------------------------

<a name="getInfo"></a>

### getInfo([callback])

Retrieves information of the cloud foundry platform.

__Arguments__

* `callback(err, result)` - A callback which is called when function has finished, or an error occurs.

__Example__

```js
api.getInfo((err, result) => {
  console.log(result);
  // {
  //   "name": "",
  //   "build": "",
  //   "support": "https://developer.swisscom.com/contact",
  //   "version": 0,
  //   "description": "Cloud Foundry provided by Swisscom",
  //   "authorization_endpoint": "https://login.lyra-836.appcloud.swisscom.com",
  //   "token_endpoint": "https://uaa.lyra-836.appcloud.swisscom.com",
  //   "min_cli_version": null,
  //   "min_recommended_cli_version": null,
  //   "api_version": "2.52.0",
  //   "app_ssh_endpoint": "ssh.lyra-836.appcloud.swisscom.com:2222",
  //   "app_ssh_host_key_fingerprint": "6d:d2:8c:09:64:b6:fc:2b:50:3c:a9:cb:2e:be:d4:a7",
  //   "app_ssh_oauth_client": "ssh-proxy",
  //   "logging_endpoint": "wss://loggregator.lyra-836.appcloud.swisscom.com:443",
  //   "doppler_logging_endpoint": "wss://doppler.lyra-836.appcloud.swisscom.com:443"
  // }
});
```

---------------------------------------

<a name="pushApp"></a>

### pushApp([callback])

Creates and uploads an app.

__Arguments__

* `options` - An options containing:
  * `name` - The app name.
  * `appPath` - The path to for the app on the filesystem.
  * `buildpack` - *Optional* Buildpack to build the app. 3 options:
    * a) Blank or not set means autodetection.
    * b) A Git Url pointing to a buildpack.
    * c) Name of an installed buildpack.
  * `command` - *Optional* The command to start an app after it is staged, maximum length: 4096 (e.g. 'rails s -p $PORT' or 'java com.org.Server $PORT').
  * `env` - *Optional* Object containing key/value pairs of all the environment variables to run in your app. Does not include any system or service variables.
  * `disk` - *Optional* The maximum amount of disk available to an instance of an app. i.e. 256MB, 1G, 256, 1024
  * `memory` - *Optional* The amount of memory each instance should have. i.e. 256MB, 1G, 256, 1024
  * `instances` - *Optional* The number of instances of the app to run. To ensure optimal availability, ensure there are at least 2 instances.
* `callback(err, result)` - A callback which is called when function has finished, or an error occurs.

__Example__

```js
api.pushApp({
  name: 'temp-app',
  appPath: '/path/to/sampleApp'
}, (err, result) => {});
```
