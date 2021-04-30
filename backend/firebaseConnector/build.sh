#!/bin/bash

if [ $# -eq 0 ]
  then
    # If we don't pass any arguments, build in the current folder
    go build -buildmode=c-archive -o ./build/libfirebase.a ./firebaseConnector.go
  else
    # If some arguments are passed, we will assume this is being called from cargo
    cd firebaseConnector
    go build -buildmode=c-archive -o "$1"/libfirebase.a ./firebaseConnector.go
fi