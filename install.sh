#!/usr/bin/env sh

# Simple install script base
# for an npm, grunt, bower based project
# credit to Larry Davis who wrote most of this
# for a project we worked on together
# https://github.com/lazd
# I've just tweaked this for my needs
# if he had this posted to GitHub I'd just fork it :P

# disable tracing in shell output (for CI server console)
set +x

# Single line echo
if [ "`echo -e "abc\c"`" = "abc" ]; then
    alias echoe="echo -e"
else
    alias echoe="echo"
fi

# parse options
while getopts ":c" opt; do
  case "$opt" in
    c)
      USE_COLOR=false;
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

# if not using color, use plain text instead of unicode
# CI is borking the special character
if $USE_COLOR ; then
  OK="[√]"
else
  OK="[OK]"
fi

# output with color
# -c turns this off
green() {
  if $USE_COLOR ; then
    echoe "\033[32m$1\033[0m$2"
  else
    echoe $1 $2
  fi
}

red() {
  if $USE_COLOR ; then
  echoe "\033[31m$1\033[0m$2"
  else
    echoe $1 $2
  fi
}

echo "Checking for build dependencies..."

# Check for node, error if not available
if ! which node >/dev/null 2>&1; then
  red " [X] " "\c"
  echo "Node must be installed to build. Visit nodejs.org to download Node"
  exit 1
else
  green " $OK " "\c"
  echo "Node"
fi

# Check for npm, error if not available
if ! which npm >/dev/null 2>&1; then
  red " [X] " "\c"
  echo "npm must be installed to build"
  exit 1
else
  green " $OK " "\c"
  echo "npm"
fi

# Get list of NPM modules
npmList=`npm list -g`

# Check for grunt
if ! echo $npmList | grep grunt@ >/dev/null 2>&1; then
  echo ""
  echoe "grunt must be installed globally, install it with 'sudo npm install -g grunt'? [y/n] \c"
  read installGrunt
  if [ $installGrunt = "y" ]; then
    echo "running sudo npm install -g grunt..."
    sudo npm install -g grunt

    if [ $? -ne 0 ]; then
      red " [X] " "\c"
      echo "Failed to install grunt"
      exit 1
    fi
  else
    red " [X] " "\c"
    echo "grunt must be installed to build"
    exit 1
  fi
else
  green " $OK " "\c"
  echo "grunt"
fi

echo ""
echo "Installing modules"

# Install node modules
npm install >/dev/null

if [ $? -eq 0 ]; then
  green " $OK " "\c"
  echo "npm"
else
  red " [X] " "\c"
  echo "npm";
  exit 1
fi


echo ""
echo "Run one of the following commands to build:"
echo ""
echo "  grunt       # partial build for development"
echo "  grunt full  # full build with documentation"
echo "  grunt watch   # build full and start watching"