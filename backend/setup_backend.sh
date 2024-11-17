#!/usr/bin/env bash

# A helper function to add color to a string message
print_colored_message() {
    color=$1
    shift
    printf "\e[${color}m$@\e[0m\n"
}

BUILD_MODE="dev"

if [[ "$1" == "--prod" ]]; then
    BUILD_MODE="prod" 
fi

# List of available colors
RED="31";GREEN="32";GREEN_BOLD="1;32";YELLOW="33";YELLOW_BOLD="1;33";

SCRIPT_DIR_FRONTEND="$(dirname "$0")"

print_colored_message $YELLOW_BOLD "══ Setting up [BACKEND] Blog App with DB ══"

print_colored_message $YELLOW_BOLD "══ Installing NPM modules ══"

if [[ "$BUILD_MODE" == "prod" ]]; then
  print_colored_message $YELLOW_BOLD "══ Production Build Mode. Omitting devDependencies ══"
  npm --prefix "$SCRIPT_DIR_FRONTEND" --loglevel info --omit=dev install
else
  print_colored_message $YELLOW_BOLD "══ Development Build Mode. Including devDependencies ══"
  npm --prefix "$SCRIPT_DIR_FRONTEND" --loglevel info --include=dev install 
fi
