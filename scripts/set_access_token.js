const fs = require('fs');
const path = require('path');

const accessToken = fs.readFileSync(path.join('./', 'sk.eyJ1Ijoic3VtaXQ5MjUiLCJhIjoiY2xrcTF4bzdjMnc4ODNmcnptbTltMHZ6eCJ9.omvrjrLXaiXeRrzDsoPjYg'));

if (!accessToken) {
  process.exit(1);
}

// eslint-disable-next-line no-new-wrappers
const fileContents = `{ "sk.eyJ1Ijoic3VtaXQ5MjUiLCJhIjoiY2xrcTF4bzdjMnc4ODNmcnptbTltMHZ6eCJ9.omvrjrLXaiXeRrzDsoPjYg": "${new String(accessToken).trim()}" }`;
fs.writeFileSync(path.join('./', 'env.json'), fileContents);