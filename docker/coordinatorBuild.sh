#!/bin/bash

docker build -t vm ./vm/
docker build -t shinken ./docker_shinken/shinken_basic/