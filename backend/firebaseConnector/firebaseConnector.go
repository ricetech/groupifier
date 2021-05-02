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

//export verify_idtoken
func verify_idtoken(idToken string) (*C.char, *C.char, *C.char) {
	client, err := app.Auth(context.Background())
	if err != nil {
		return C.CString(""), C.CString(""), C.CString(err.Error())
	}

	token, err := client.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		return C.CString(""), C.CString(""), C.CString(err.Error())
	}

	return C.CString(token.UID), C.CString(token.Subject), C.CString("")
}

func main() { }