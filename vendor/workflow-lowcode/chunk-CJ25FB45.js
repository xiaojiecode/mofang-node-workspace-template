// src/features/workflow/lowcode-adapter/settings.ts
function resolveSettingsFormId(page) {
  const explicit = page.extensions?.workflow?.settingsFormId;
  if (explicit) return explicit;
  const forms = new Set(
    Object.values(page.logic?.fields ?? {}).map(
      (field) => field.formId ?? "main"
    )
  );
  if (forms.size && !forms.has("main"))
    throw new Error("\u914D\u7F6E\u9875\u9762\u9700\u8981\u660E\u786E\u7ED1\u5B9A settingsFormId");
  return "main";
}
function settingsFields(page, formId) {
  return Object.entries(page.logic?.fields ?? {}).filter(([, field]) => (field.formId ?? "main") === formId).map(([id, field]) => ({ ...field, id, name: field.name ?? id }));
}
function jsonValues(value) {
  return JSON.parse(JSON.stringify(value));
}

export {
  resolveSettingsFormId,
  settingsFields,
  jsonValues
};
//# sourceMappingURL=chunk-CJ25FB45.js.map
