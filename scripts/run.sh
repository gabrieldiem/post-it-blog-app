#!/usr/bin/env bash

# A helper function to add color to a string message
print_colored_message() {
    color=$1
    shift
    printf "\e[${color}m$@\e[0m\n"
}

# List of available colors
RED="31";GREEN="32";GREEN_BOLD="1;32";YELLOW="33";YELLOW_BOLD="1;33";
SCRIPT_DIR_BACKEND="$(dirname "$0")"

print_colored_message $YELLOW_BOLD "══ Starting Project: Backend and Frontend ══"

print_colored_message $YELLOW_BOLD "══ Building Frontend ══"
npm --prefix "$SCRIPT_DIR_BACKEND"/../frontend/ui run build

# Start both commands in a subshell, so they belong to the same process group
print_colored_message $YELLOW_BOLD "══ Starting servers ══"
npm --prefix "$SCRIPT_DIR_BACKEND"/../backend/ start | sed -e $'s/^/\033[1;33m[BACKEND]\033[0m /' & 
BACKEND_PID=$!

npm --prefix "$SCRIPT_DIR_BACKEND"/../frontend/server start | sed -e $'s/^/\033[1;32m[FRONTEND]\033[0m /' &
FRONTEND_PID=$!

# Handle Ctrl+C
trap "echo -e '\n\033[1;37mTerminating backend server with PID $BACKEND_PID and frontend server with PID $FRONTEND_PID.\033[0m'; kill -9 $BACKEND_PID $FRONTEND_PID; exit -1;" SIGINT

# Wait for both processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID
