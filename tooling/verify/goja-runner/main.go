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
	value, err := evaluate(input)
	if err != nil {
		return err
	}
	return json.NewEncoder(os.Stdout).Encode(value.Export())
}

// evaluate runs a normal JavaScript fixture and checks its final expression result.
func evaluate(input request) (goja.Value, error) {
	vm := goja.New()
	timer := time.AfterFunc(3*time.Second, func() { vm.Interrupt("fixture timeout") })
	defer timer.Stop()
	// Keep source completion separate so an empty fixture cannot reuse its result.
	if _, err := vm.RunScript("program.js", "'use strict';\n"+input.Source); err != nil {
		return nil, err
	}
	// Seed an undefined completion; the strict directive is itself an expression.
	value, err := vm.RunScript("goja-test.js", "'use strict';\nvoid 0;\n"+input.Test)
	if err != nil {
		return nil, err
	}
	if promise, ok := value.Export().(*goja.Promise); ok {
		switch promise.State() {
		case goja.PromiseStatePending:
			return nil, fmt.Errorf("fixture returned an unsettled promise")
		case goja.PromiseStateRejected:
			return nil, fmt.Errorf("fixture rejected: %s", promise.Result())
		}
		value = promise.Result()
	}
	if goja.IsUndefined(value) {
		return nil, fmt.Errorf("fixture did not return a result")
	}
	return value, nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
