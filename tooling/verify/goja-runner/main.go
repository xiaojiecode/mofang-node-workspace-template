// Command goja-check runs local fixture assertions in the platform's Goja version.
// It does not emulate Workflow scheduling, Tool accounting or authorization.
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/dop251/goja"
)

type request struct {
	Source string `json:"source"`
	Test   string `json:"test"`
}

func run() error {
	var input request
	decoder := json.NewDecoder(io.LimitReader(os.Stdin, 12<<20))
	if err := decoder.Decode(&input); err != nil {
		return err
	}
	vm := goja.New()
	timer := time.AfterFunc(3*time.Second, func() { vm.Interrupt("fixture timeout") })
	defer timer.Stop()
	code := "(function(){'use strict';\n" + input.Source + "\n" + input.Test + "\n})()"
	value, err := vm.RunString(code)
	if err != nil {
		return err
	}
	if promise, ok := value.Export().(*goja.Promise); ok {
		switch promise.State() {
		case goja.PromiseStatePending:
			return fmt.Errorf("fixture returned an unsettled promise")
		case goja.PromiseStateRejected:
			return fmt.Errorf("fixture rejected: %s", promise.Result())
		}
		value = promise.Result()
	}
	if goja.IsUndefined(value) {
		return fmt.Errorf("fixture did not return a result")
	}
	return json.NewEncoder(os.Stdout).Encode(value.Export())
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
