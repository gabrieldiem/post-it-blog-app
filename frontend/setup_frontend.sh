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

print_colored_message $YELLOW_BOLD "══ Setting up [FRONTEND] Blog App with DB ══"

print_colored_message $YELLOW_BOLD "══ Installing NPM modules ══"

DEV_DEPS_OPTION="--include=dev"

if [[ "$BUILD_MODE" == "prod" ]]; then
  print_colored_message $YELLOW_BOLD "══ Production Build Mode. Omitting devDependencies ══"
  DEV_DEPS_OPTION="--omit=dev"
else
  print_colored_message $YELLOW_BOLD "══ Development Build Mode. Including devDependencies ══"
fi

print_colored_message $YELLOW_BOLD "══ Installing dependencies for UI ══"
npm --prefix "$SCRIPT_DIR_FRONTEND"/ui --loglevel info "$DEV_DEPS_OPTION" install

print_colored_message $YELLOW_BOLD "══ Installing dependencies for Server ══"
npm --prefix "$SCRIPT_DIR_FRONTEND"/server --loglevel info "$DEV_DEPS_OPTION" install
