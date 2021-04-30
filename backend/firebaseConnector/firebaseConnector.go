package main

import (
	"C"
	"context"
	firebase "firebase.google.com/go/v4"
)

var app *firebase.App

//export initialize
func initialize() *C.char {
	var err error

	app, err = firebase.NewApp(context.Background(), nil)

	if err != nil {
		return C.CString(err.Error())
	}

	return C.CString("")
}

func main() { }