const core = require('@actions/core');
const exec = require('@actions/exec');

(async () => {
  const hit = core.getState('hit') === 'true';
  const key = core.getState('key');
  const path = core.getState('path');
  const bucket = core.getState('bucket');
  const region = core.getState('region');

  if (!region || hit) return;

  core.info('Uploading cache to S3...');

  const file = `${key}.tar.gz`;

  await exec.exec(`tar -czf ${file} ${path}`);
  await exec.exec(`aws s3 cp ${file} s3://${bucket}/${file}`);
})();
