require('shelljs/global');

// print process.argv
var isYarn = process.env.npm_execpath.indexOf('yarn') !== -1;
var CMD_BINARY = (isYarn) ? 'yarn' : 'npm';
var CMD_INSTALL = (isYarn) ? CMD_BINARY : CMD_BINARY + ' install';

var platform = {
  path: 'sashimi-platform',
  buildPath: 'public'
};
var webapp = {
  path: 'sashimi-webapp',
  buildPath: 'dist'
};
var statusBuild = -1;
var statusStart = -1;

printTitle('Install web application dependency');
cd(`./${webapp.path}`);
exec(CMD_INSTALL);

// Don't need to build web app if NODE_ENV is testing
if (process.env.NODE_ENV !== 'testing') {
  printTitle('Build web app to dist folder');
  statusBuild = exec(CMD_BINARY + ' run build').code;
  throwErrorIfFailedToExec(statusBuild, 'build failed')

  printTitle('Copy webapp to server folder');

  mkdir('-p', webapp.buildPath);
  mkdir('-p', `../${platform.path}/${platform.buildPath}`);
  rm('-rf', `../${platform.path}/${platform.buildPath}`);
  cp('-R', webapp.buildPath, `../${platform.path}`);
  mv(`../${platform.path}/${webapp.buildPath}`, `../${platform.path}/${platform.buildPath}`);

  ls(`../${platform.path}/${platform.buildPath}`).forEach(function(file) {
    console.log(file);
  });
}


cd(`..`);


printTitle('Run web server')

cd(`./${platform.path}`);
exec(CMD_INSTALL)


function throwErrorIfFailedToExec(statusCode, message) {
  if (statusCode !== 0) {
    printTitle(`Error: ${message}`);
    printMessage(`Script exit(${statusCode})`);    
    exit(1);
  }
}

function printMessage(message) {
  var echoMsg = message || '';
  echo(` [Deploy] > ${echoMsg}`);
}

function printTitle(message) {
  var echoMsg = message || '----------------';
  echo('');
  echo(` [Deploy] ${echoMsg}`);
  echo('');
}