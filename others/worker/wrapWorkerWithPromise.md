
# index.js
```
// set timeout for ensuring program stability
const WORKER_TIMEOUT = 60 * 1000; // one minute

const _utilWorker = new Worker('./util_worker.js');
const _jobs = Object.create(null);
const _DEBUG = false;
let _jobCounter = 0;

function _makeJob(fnName) {
  _jobCounter += 1;
  const id = _jobCounter;

  if (_DEBUG) {
    window.log.info(`Worker job ${ id } (${ fnName }) started`);
  }
  _jobs[id] = {
    fnName,
    start: Date.now(),
  };

  return id;
}

function _updateJob(id, data) {
  const { resolve, reject } = data;
  const { fnName, start } = _jobs[id];

  _jobs[id] = {
    ..._jobs[id],
    ...data,
    resolve: value => {
      _removeJob(id);
      const end = Date.now();
      window.log.info(
        `Worker job ${ id } (${ fnName }) succeeded in ${ end - start }ms`
      );
      return resolve(value);
    },
    reject: error => {
      _removeJob(id);
      const end = Date.now();
      window.log.info(
        `Worker job ${ id } (${ fnName }) failed in ${ end - start }ms`
      );
      return reject(error);
    },
  };
}

function _removeJob(id) {
  if (_DEBUG) {
    _jobs[id].complete = true;
  } else {
    delete _jobs[id];
  }
}

function _getJob(id) {
  return _jobs[id];
}

async function callWorker(fnName, ...args) {
  const jobId = _makeJob(fnName);

  return new Promise((resolve, reject) => {
    _utilWorker.postMessage([jobId, fnName, ...args]);

    _updateJob(jobId, {
      resolve,
      reject,
      args: _DEBUG ? args : null,
    });

    setTimeout(
      () => reject(new Error(`Worker job ${ jobId } (${ fnName }) timed out`)),
      WORKER_TIMEOUT
    );
  });
}

_utilWorker.onmessage = e => {
  const [jobId, errorForDisplay, result] = e.data;

  const job = _getJob(jobId);
  if (!job) {
    throw new Error(
      `Received worker reply to job ${ jobId }, but did not have it in our registry!`
    );
  }

  const { resolve, reject, fnName } = job;

  if (errorForDisplay) {
    return reject(
      new Error(
        `Error received from worker job ${ jobId } (${ fnName }): ${ errorForDisplay }`
      )
    );
  }

  return resolve(result);
};
```

# util_worker.js
```
'use strict';

const functions = {
  stringToArrayBufferBase64,
  arrayBufferToStringBase64,
};

onmessage = async e => {
  const [jobId, fnName, ...args] = e.data;

  try {
    const fn = functions[fnName];
    if (!fn) {
      throw new Error(`Worker: job ${jobId} did not find function ${fnName}`);
    }
    const result = await fn(...args);
    postMessage([jobId, null, result]);
  } catch (error) {
    const errorForDisplay = prepareErrorForPostMessage(error);
    postMessage([jobId, errorForDisplay]);
  }
};

function prepareErrorForPostMessage(error) {
  if (!error) {
    return null;
  }

  if (error.stack) {
    return error.stack;
  }

  return error.message;
}

function stringToArrayBufferBase64(string) {
  return dcodeIO.ByteBuffer.wrap(string, 'base64').toArrayBuffer();
}
function arrayBufferToStringBase64(arrayBuffer) {
  return dcodeIO.ByteBuffer.wrap(arrayBuffer).toString('base64');
}
```
