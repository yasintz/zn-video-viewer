const cp = require('child_process');

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    cp.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
}

async function runPackageJsonScript(scriptName) {
  const { scripts } = require('../../package.json');
  const scriptValue = scripts[scriptName];

  if (!scriptValue) {
    throw new Error('Script not found in package.json');
  }

  return execShellCommand(`yarn ${scriptValue}`);
}

module.exports = { runPackageJsonScript, execShellCommand };
