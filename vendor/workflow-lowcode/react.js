import {
  jsonValues,
  settingsFields
} from "./chunk-CJ25FB45.js";

// src/features/workflow/lowcode-adapter/react.tsx
import { useContext, useEffect, useRef } from "react";
import { RuntimeContext } from "@mofang/low-code-page/runtime";
var same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
function PuckSettingsBridge({
  settings,
  formId = "main"
}) {
  const runtime = useContext(RuntimeContext);
  const latest = useRef(settings);
  const syncing = useRef(false);
  useEffect(() => {
    latest.current = settings;
  }, [settings]);
  useEffect(() => {
    if (!runtime) return;
    const names = new Set(
      settingsFields(runtime.engine.definition, formId).map(
        (field) => field.name
      )
    );
    let previous = runtime.engine.store.getState().forms[formId] ?? {};
    return runtime.engine.store.subscribe((state) => {
      const next = state.forms[formId] ?? {};
      if (!syncing.current && !latest.current.readOnly && !runtime.host.context.readOnly) {
        for (const [name, value] of Object.entries(next))
          if (!same(previous[name], value) && names.has(name))
            latest.current.onFieldChange?.(name, value);
      }
      previous = next;
    });
  }, [runtime, formId]);
  useEffect(() => {
    if (!runtime) return;
    const values = jsonValues(settings.values);
    syncing.current = true;
    try {
      for (const [id, field] of Object.entries(
        runtime.engine.definition.logic.fields
      )) {
        if ((field.formId ?? "main") !== formId) continue;
        const name = field.name ?? id;
        const value = Object.hasOwn(values, name) ? values[name] : field.defaultValue ?? null;
        if (!same(
          runtime.engine.store.getState().forms[formId]?.[name],
          value
        ))
          runtime.engine.setField(id, value, false);
      }
    } finally {
      syncing.current = false;
    }
  }, [runtime, settings.values, formId]);
  return null;
}
export {
  PuckSettingsBridge
};
//# sourceMappingURL=react.js.map
