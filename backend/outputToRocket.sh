#!/bin/sh
# Simple script used by Google Cloud Build to output a secret variable to the Rocket.toml file

echo "[global.databases]" > Rocket.toml
echo $1 >> Rocket.toml
