#!/usr/bin/env bash

# A helper function to add color to a string message
print_colored_message() {
    color=$1
    shift
    printf "\e[${color}m$@\e[0m\n"
}

# List of available colors
RED="31";GREEN="32";GREEN_BOLD="1;32";YELLOW="33";YELLOW_BOLD="1;33";

print_colored_message $YELLOW_BOLD "══ Starting Project: Backend and Frontend ══"

# Start both commands in a subshell, so they belong to the same process group

npm --prefix ./backend/ start | sed -e $'s/^/\033[1;33m[BACKEND]\033[0m /' & 
BACKEND_PID=$!

npm --prefix ./frontend/ start | sed -e $'s/^/\033[1;32m[FRONTEND]\033[0m /' &
FRONTEND_PID=$!

# Handle Ctrl+C
trap "echo -e '\n\033[1;37mTerminating backend with PID $BACKEND_PID and frontend with pid $FRONTEND_PID.\033[0m'; kill -9 $BACKEND_PID $FRONTEND_PID; exit -1;" SIGINT

# Wait for both processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID