#!/usr/bin/env bash

# A helper function to add color to a string message
print_colored_message() {
    color=$1
    shift
    printf "\e[${color}m$@\e[0m\n"
}

# List of available colors
RED="31";GREEN="32";GREEN_BOLD="1;32";YELLOW="33";YELLOW_BOLD="1;33";

print_colored_message $YELLOW_BOLD "══ Setting up [PROJECT] Blog App with DB ══"

SCRIPT_DIR="$(dirname "$0")"

BUILD_MODE="dev"

if [[ "$1" == "--prod" ]]; then
    BUILD_MODE="prod" 
fi

###################################
#          GENERAL SETUP          #
###################################

print_colored_message $YELLOW_BOLD "══ Installing nvm (Node Version Manager) ══"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh

print_colored_message $YELLOW_BOLD "══ Installing NodeJS version 22 with nvm ══"
nvm install 22

print_colored_message $YELLOW_BOLD "══ Setting NodeJS version 22 with nvm ══"
nvm use 22

###################################
#          FRONTEND SETUP         #
###################################

sudo "$SCRIPT_DIR"/../frontend/setup_frontend.sh --"$BUILD_MODE"

###################################
#          BACKEND SETUP         #
###################################

sudo "$SCRIPT_DIR"/../backend/setup_backend.sh --"$BUILD_MODE"

print_colored_message $GREEN_BOLD "══ Finished setup ══"
