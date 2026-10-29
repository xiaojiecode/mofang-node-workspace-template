import { i as isPlainObject, M as MofangSDKError } from "./create-sdk-sNCJXGJG.js";
import { b, c, d, f, e, a, k, n, t } from "./create-sdk-sNCJXGJG.js";
function matchesMessage(event, filter) {
  const typeMatches = !filter.types?.length || filter.types.some(
    (type) => type === event.type || type.endsWith(".*") && event.type.startsWith(type.slice(0, -1))
  );
  return typeMatches && (!filter.workflowId || event.scope?.workflowId === filter.workflowId) && (!filter.runId || event.scope?.runId === filter.runId) && (!filter.nodeRunId || event.scope?.nodeRunId === filter.nodeRunId);
}
function validationFailure(message, code) {
  return new MofangSDKError(message, {
    kind: "rejected",
    code,
    retryable: false
  });
}
function freezeForProgram(value) {
  if (Array.isArray(value)) {
    for (const item of value) freezeForProgram(item);
    return Object.freeze(value);
  }
  if (isPlainObject(value)) {
    for (const item of Object.values(value)) freezeForProgram(item);
    return Object.freeze(value);
  }
  return value;
}
function pageProgramContext(options) {
  const read = options.read;
  return freezeForProgram({
    context: options.context,
    deliveries: options.deliveries,
    read: (ref, readOptions) => {
      if (!read) {
        return Promise.reject(
          validationFailure(
            "宿主没有授予引用读取，程序不能自行取数",
            "read_unavailable"
          )
        );
      }
      return read(ref, readOptions);
    }
  });
}
function assertPlainJSON(value, label) {
  if (Array.isArray(value)) {
    for (const item of value) assertPlainJSON(item, label);
    return;
  }
  if (isPlainObject(value)) {
    for (const item of Object.values(value)) assertPlainJSON(item, label);
    return;
  }
  const plain = value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
  if (!plain) {
    throw validationFailure(
      `${label} 不是可序列化的 JSON 值`,
      "invalid_proposal"
    );
  }
}
function assertDeclaredFields(fields, declaration) {
  if (!declaration) {
    throw validationFailure(
      "没有拿到服务端的输入字段声明，这次准备无法校验",
      "declaration_unavailable"
    );
  }
  for (const field of fields) {
    if (!declaration.fields.includes(field)) {
      throw validationFailure(
        `输入字段不在服务端声明里：${field}`,
        "input_field_not_declared"
      );
    }
  }
}
function assertInputPreparation(preparation, declaration) {
  switch (preparation.kind) {
    case "prepared": {
      const fields = Object.keys(preparation.values);
      assertDeclaredFields(fields, declaration);
      for (const key of Object.keys(preparation.fieldSources)) {
        if (!fields.includes(key)) {
          throw validationFailure(
            `字段来源指的字段不在本次提交里：${key}`,
            "invalid_proposal"
          );
        }
      }
      for (const value of Object.values(preparation.values)) {
        assertPlainJSON(value, "输入值");
      }
      for (const ref of preparation.usedRefs) {
        if (!ref.id) {
          throw validationFailure("引用缺少 ID", "invalid_proposal");
        }
      }
      break;
    }
    case "requires_input": {
      if (!preparation.reason || preparation.fields.length === 0) {
        throw validationFailure(
          "补参提案必须写明原因与缺哪些字段",
          "invalid_proposal"
        );
      }
      assertDeclaredFields(preparation.fields, declaration);
      break;
    }
  }
}
function planInputPreparation(preparation, declaration, credential) {
  assertInputPreparation(preparation, declaration);
  if (preparation.kind === "requires_input") {
    return {
      kind: "skip",
      reason: `程序要求补参：${preparation.fields.join("、")}`
    };
  }
  return {
    kind: "prepare",
    body: {
      ...credential,
      values: preparation.values,
      usedRefs: preparation.usedRefs,
      fieldSources: preparation.fieldSources
    }
  };
}
async function applyInputPreparation(sdk, preparation, declaration, credential) {
  const planned = planInputPreparation(preparation, declaration, credential);
  if (planned.kind === "skip") {
    return { prepared: null, skippedReason: planned.reason };
  }
  return {
    prepared: await sdk.inputs.prepare(planned.body),
    skippedReason: null
  };
}
function assertProgramFrozenForPreparation(frozen, running) {
  if (frozen.revisionId !== running.revisionId || frozen.programHash !== running.programHash) {
    throw validationFailure(
      "正在运行的页面程序版本与这次准备冻结的版本不一致",
      "program_revision_mismatch"
    );
  }
}
const paramTypes = /* @__PURE__ */ new Set([
  "string",
  "integer",
  "number",
  "boolean",
  "object",
  "array",
  "url",
  "image",
  "video",
  "product"
]);
const businessParamTypes = ["image", "video", "product"];
const schemaObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
function reference(root, ref) {
  if (!ref.startsWith("#/"))
    throw new Error(`无法读取冻结 Schema 引用：${ref}`);
  let current = root;
  for (const raw of ref.slice(2).split("/")) {
    const key = decodeURIComponent(raw).replace(/~1/g, "/").replace(/~0/g, "~");
    const object = schemaObject(current);
    if (!Object.hasOwn(object, key))
      throw new Error(`冻结 Schema 引用不存在：${ref}`);
    current = object[key];
  }
  return schemaObject(current);
}
function resolveSchema(root, value) {
  let current = schemaObject(value);
  const seen = /* @__PURE__ */ new Set();
  let annotations = {};
  while (typeof current.$ref === "string") {
    const ref = current.$ref;
    if (seen.has(ref)) throw new Error("冻结 Schema 存在循环引用");
    seen.add(ref);
    const rest = { ...current };
    delete rest.$ref;
    annotations = { ...rest, ...annotations };
    current = reference(root, ref);
  }
  return { ...current, ...annotations };
}
function nullableMember(root, value) {
  const schema = resolveSchema(root, value);
  if (Array.isArray(schema.anyOf) && schema.anyOf.length === 2) {
    const nonNull = schema.anyOf.filter(
      (member) => schemaObject(member).type !== "null"
    );
    if (nonNull.length === 1) {
      const annotations = { ...schema };
      delete annotations.anyOf;
      return {
        schema: { ...resolveSchema(root, nonNull[0]), ...annotations },
        nullable: true
      };
    }
  }
  return {
    schema,
    nullable: Array.isArray(schema.type) && schema.type.includes("null")
  };
}
function describe(root, name, value, required, depth = 0) {
  const { schema, nullable } = nullableMember(root, schemaObject(value));
  const identity = schemaObject(schema["x-mf-type-ref"]);
  const rawType = typeof identity.paramType === "string" ? identity.paramType : Array.isArray(schema.type) ? schema.type.find((value2) => value2 !== "null") : schema.type;
  const kind = typeof identity.paramType !== "string" && rawType === "string" && schema.format === "mf-url" ? "url" : rawType;
  const type = typeof kind === "string" && paramTypes.has(kind) ? kind : void 0;
  return {
    name,
    title: typeof schema.title === "string" ? schema.title : name,
    description: typeof schema.description === "string" ? schema.description : "",
    type,
    required,
    nullable,
    configBeforeRun: depth === 0 && schema["x-mf-config-before-run"] === true,
    capabilitySwitchPaths: depth === 0 && name !== "item" ? capabilitySwitchPaths(root, value) : [],
    ...Object.hasOwn(schema, "default") ? { defaultValue: schema.default } : {},
    ui: schemaObject(schema["x-mf-ui"]),
    schema,
    ...type === "array" && schema.items && depth < 32 ? {
      element: describe(root, "", schema.items, false, depth + 1)
    } : {}
  };
}
function capabilitySwitchPaths(root, value) {
  const paths = [];
  const visit = (value2, pointer, depth) => {
    if (depth > 32) throw new Error("能力开关路径超过冻结 Schema 深度限制");
    const schema = resolveSchema(root, value2);
    const typeRef = schemaObject(schema["x-mf-type-ref"]);
    if (businessParamTypes.includes(
      typeRef.paramType
    ))
      return;
    if (schema.type === "boolean" && schema["x-mf-capability-switch"] === true)
      paths.push(pointer);
    if (schema.type !== "object" || schema.additionalProperties !== false)
      return;
    for (const [name, child] of Object.entries(
      schemaObject(schema.properties)
    ))
      visit(
        child,
        pointer + "/" + name.replace(/~/g, "~0").replace(/\//g, "~1"),
        depth + 1
      );
  };
  visit(value, "", 0);
  return paths.sort();
}
function schemaFields(root) {
  const schema = resolveSchema(root, root);
  const required = Array.isArray(schema.required) ? schema.required : [];
  const order = schemaObject(schema["x-mf-ui"]).order;
  const names = Object.keys(schemaObject(schema.properties));
  const ordered = Array.isArray(order) ? order.filter(
    (name) => typeof name === "string" && names.includes(name)
  ) : [];
  const allNames = [.../* @__PURE__ */ new Set([...ordered, ...names.sort()])];
  return allNames.map(
    (name) => describe(
      root,
      name,
      schemaObject(schema.properties)[name],
      required.includes(name)
    )
  );
}
function matchingSchemaFields(left, right) {
  if (!left.type || left.type !== right.type) return false;
  if (left.type !== "array") return true;
  return Boolean(
    left.element && right.element && matchingSchemaFields(left.element, right.element)
  );
}
function authoringSchema(root) {
  const visit = (value, seen) => {
    if (typeof value === "boolean") return value;
    let schema = schemaObject(value);
    if (typeof schema.$ref === "string" && schema.$ref.startsWith("#/")) {
      const ref = schema.$ref;
      if (seen.has(ref)) throw new Error("不能编辑循环 Schema 引用");
      const nextSeen = /* @__PURE__ */ new Set([...seen, ref]);
      const target = resolveSchema(root, reference(root, ref));
      const identity = schemaObject(target["x-mf-type-ref"]);
      const annotations = { ...schema };
      delete annotations.$ref;
      if (typeof identity.id === "string")
        return visit({ ...annotations, $ref: identity.id }, nextSeen);
      return visit({ ...target, ...annotations }, nextSeen);
    }
    schema = { ...schema };
    delete schema.$defs;
    delete schema["x-mf-type-ref"];
    if (schema.properties)
      schema.properties = Object.fromEntries(
        Object.entries(schemaObject(schema.properties)).map(
          ([key, field]) => [key, visit(field, seen)]
        )
      );
    if (schema.items !== void 0) schema.items = visit(schema.items, seen);
    for (const key of ["anyOf", "oneOf", "allOf"]) {
      const members = schema[key];
      if (Array.isArray(members))
        schema[key] = members.map((member) => visit(member, seen));
    }
    return schema;
  };
  return schemaObject(visit(root, /* @__PURE__ */ new Set()));
}
export {
  MofangSDKError,
  applyInputPreparation,
  assertInputPreparation,
  assertProgramFrozenForPreparation,
  authoringSchema,
  businessParamTypes,
  b as classifyErrorCode,
  c as createMofangSDK,
  d as createSerialQueue,
  f as failureFromReceipt,
  freezeForProgram,
  e as isDeeplyEqual,
  a as isTerminalNodeAction,
  k as keepStableValue,
  matchesMessage,
  matchingSchemaFields,
  n as nodeBusinessView,
  pageProgramContext,
  planInputPreparation,
  resolveSchema,
  schemaFields,
  schemaObject,
  t as toMofangSDKError
};
