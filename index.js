const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

(async () => {
  const key = core.getInput('key');
  const path = core.getInput('path');
  const bucket = core.getInput('bucket');
  const region = core.getInput('region');

  if (!region) {
    core.info('No AWS region, skipping cache');
    core.setOutput('cache-hit', 'false');
    return;
  }

  const file = `${key}.tar.gz`;

  await exec.exec('mkdir -p .cache');
  await exec.exec(`aws s3 cp s3://${bucket}/${file} .cache/${file}`, [], {
    ignoreReturnCode: true,
  });

  let hit = false;

  if (fs.existsSync(`.cache/${file}`)) {
    await exec.exec(`mkdir -p ${path}`);
    await exec.exec(`tar -xzf .cache/${file} -C ${path}`);
    hit = true;
  }

  core.setOutput('cache-hit', hit.toString());

  // save state for post
  core.saveState('hit', hit.toString());
  core.saveState('key', key);
  core.saveState('path', path);
  core.saveState('bucket', bucket);
  core.saveState('region', region);
})();
