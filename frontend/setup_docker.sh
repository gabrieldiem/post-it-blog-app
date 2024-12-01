#!/usr/bin/env bash

# A helper function to add color to a string message
print_colored_message() {
    color=$1
    shift
    printf "\e[${color}m$@\e[0m\n"
}

# List of available colors
RED="31";GREEN="32";GREEN_BOLD="1;32";YELLOW="33";YELLOW_BOLD="1;33";

print_colored_message $YELLOW_BOLD "══ Setting up [FRONTEND] Blog App with DB ══"

SCRIPT_DIR="$(dirname "$0")"

BUILD_MODE="dev"

if [[ "$1" == "--prod" ]]; then
    BUILD_MODE="prod" 
fi

###################################
#          FRONTEND SETUP         #
###################################

"$SCRIPT_DIR"/setup_frontend.sh --"$BUILD_MODE"

npm cache clean --force

print_colored_message $GREEN_BOLD "══ Finished setup ══"
