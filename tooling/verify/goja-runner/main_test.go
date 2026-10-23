package main

import (
	"strings"
	"testing"
)

func TestEvaluate(t *testing.T) {
	tests := []struct {
		name    string
		source  string
		fixture string
		wantErr string
	}{
		{
			name:    "synchronous final expression",
			source:  "const program = {ready: true};",
			fixture: "({passed: program.ready});",
		},
		{
			name:    "asynchronous final expression",
			source:  "const program = {ready: true};",
			fixture: "(async () => { await Promise.resolve(); return {passed: program.ready}; })();",
		},
		{
			name:    "assertion rejects after await",
			fixture: "(async () => { await Promise.resolve(); throw new Error('late assertion'); })();",
			wantErr: "fixture rejected: Error: late assertion",
		},
		{
			name:    "unsettled promise",
			fixture: "new Promise(() => {});",
			wantErr: "fixture returned an unsettled promise",
		},
		{
			name:    "missing expression does not reuse source completion",
			source:  "({passed: true});",
			fixture: "const unused = 1;",
			wantErr: "fixture did not return a result",
		},
		{
			name:    "empty fixture does not reuse source completion",
			source:  "({passed: true});",
			wantErr: "fixture did not return a result",
		},
		{
			name:    "fulfilled without result",
			fixture: "(async () => { await Promise.resolve(); })();",
			wantErr: "fixture did not return a result",
		},
		{
			name:    "top level return is not a script",
			fixture: "return {passed: true};",
			wantErr: "SyntaxError",
		},
		{
			name:    "synchronous assertion",
			fixture: "throw new Error('failed assertion');",
			wantErr: "failed assertion",
		},
		{
			name:    "source failure",
			source:  "throw new Error('source failure');",
			fixture: "({passed: true});",
			wantErr: "source failure",
		},
		{
			name:    "strict fixture",
			fixture: "undeclared = 1; ({passed: true});",
			wantErr: "ReferenceError",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			value, err := evaluate(request{Source: tt.source, Test: tt.fixture})
			if tt.wantErr != "" {
				if err == nil || !strings.Contains(err.Error(), tt.wantErr) {
					t.Fatalf("evaluate error = %v, want substring %q", err, tt.wantErr)
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			result, ok := value.Export().(map[string]any)
			if !ok || result["passed"] != true {
				t.Fatalf("evaluate result = %#v, want passed: true", value.Export())
			}
		})
	}
}
