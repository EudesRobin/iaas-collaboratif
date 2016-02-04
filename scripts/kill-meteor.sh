#!/bin/sh

# Author : Robin Eudes

# Use : Kill Meteor Process

kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`
echo "All meteor process killed"
