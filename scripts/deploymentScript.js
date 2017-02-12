require('shelljs/global');

const platform = {
  path: 'sashimi-platform',
  buildPath: 'public'
};
const webapp = {
  path: 'sashimi-webapp',
  buildPath: 'dist'
};
let statusBuild = -1;
let statusStart = -1;


printTitle('Build web application');

cd(`./${webapp.path}`);
exec('yarn');
statusBuild = exec('yarn run build').code;
throwErrorIfFailedToExec(statusBuild, 'build failed')



printTitle('Copy webapp to server folder');

let tempWebappBuildPath = `${webapp.buildPath}/*`;
let tempPlatformBuildPath = `../${platform.path}/${platform.buildPath}/*`;

mkdir('-p', tempWebappBuildPath);
mkdir('-p', tempPlatformBuildPath);

rm('-rf', tempPlatformBuildPath);
cp('-R', tempWebappBuildPath, tempPlatformBuildPath);

ls(tempPlatformBuildPath).forEach(function(file) {
  console.log(file);
});

cd(`..`);


printTitle('Run web server')

cd(`./${platform.path}`);
exec('yarn')


function throwErrorIfFailedToExec(statusCode, message) {
  if (statusCode !== 0) {
    printTitle(`Error: ${message}`);
    printMessage(`Script exit(${statusCode})`);    
    exit(1);
  }
}

function printMessage(message) {
  let echoMsg = message || '';
  echo(` [Deploy] > ${echoMsg}`);
}

function printTitle(message) {
  let echoMsg = message || '----------------';
  echo('');
  echo(` [Deploy] ${echoMsg}`);
  echo('');
}