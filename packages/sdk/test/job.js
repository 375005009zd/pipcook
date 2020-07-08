const { test } = require('tap');
const { PipcookClient } = require('../');
const { readJson } = require('fs-extra');
const path = require('path');

test('pipeline api.job test', async t => {
  const client = new PipcookClient('http://localhost', 6927);
  const name = 'bayes-job-test';
  const pipelineFile = path.join(__dirname, 'text-bayes-classification.json');
  const config = await readJson(pipelineFile);
  
  // prepare
  await client.job.remove();
  await client.pipeline.remove();
  //create pipeline
  let pipeline = await client.pipeline.create(config, { name });
  t.equal(typeof pipeline, 'object');
  t.equal(typeof pipeline.id, 'string');
  // create job
  const jobObj = await client.job.run({pipelineId: pipeline.id, tuna: true});
  t.equal(typeof jobObj, 'object');
  t.equal(typeof jobObj.id, 'string');

  // info
  const jobInfoObj = await client.job.info(jobObj.id);
  t.equal(typeof jobInfoObj, 'object');
  t.equal(typeof jobInfoObj.id, 'string');
  // stop
  if (jobInfoObj.status === 1) {
    await client.job.stop(jobInfoObj.id);
  }
  await client.job.remove(jobObj.id);
  await client.pipeline.remove(pipeline.id);
  t.end();
});
