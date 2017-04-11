# > Clone the master branch into `notes` folder
# > Vagrant shared memory is not used due to various of problems with
#   doing `npm install` on Windows e.g. creating symbolic link and its speed.
git clone https://github.com/nus-mtp/sashimi-note.git notes
cd notes

# > Install all the necessary dependencies to run the webapp and platform.
# > npm is used here instead of yarn due to yarn failed to properly
#   run post-install script for some modules (e.g. node-sass, phantomjs-prebuilt).
# > bootstrap.sh will run all the command using root permission, therefore
#   --unsafe-perm is used here to allow npm to run as root
npm install --unsafe-perm

# > npm install should run be completed at this stage.
echo "."
echo "Starting express server on port 8080"

# > Explicitly set server PORT to 8080.
# > nohup is used so that the server does not get killed by
#   SIGHUP (signal hang up).
# > nohup required that the process to be properly demonized by
#   detaching its stdin, stdout and stderr with `0<&- &>/dev/null`.
env PORT=8080 nohup npm start 0<&- &>/dev/null &

# > The express server should be running with port 8080 at this stage.
echo "Navigate to localhost:8080 to open the application"

# > Provide additional instructions for new vagrant users
echo "-"
echo "-"
echo "To shutdown vagrant, run  'vagrant halt'"
echo "To access vagrant, run    'vagrant ssh'"
