require('shelljs/global');

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

// Don't need to build web app if NODE_ENV is testing
if (process.env.NODE_ENV !== 'testing') {
  printTitle('Build web application');

  cd(`./${webapp.path}`);
  exec('yarn');
  statusBuild = exec('yarn run build').code;
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
exec('yarn')


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