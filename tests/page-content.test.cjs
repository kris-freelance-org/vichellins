/* eslint-disable @typescript-eslint/no-require-imports -- This CommonJS test loader compiles the TypeScript source in memory. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");

// Use the project's existing TypeScript compiler; no separate test runtime needed.
require.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
};
const { pageDefinitions, defaultPageContent, safeContentLink } = require("../src/lib/page-content.ts");
const { validatePageContent, mergePageContent, imageSlots } = require("../src/lib/page-content-validation.ts");

test("every registered public page has valid defaults and a unique route", () => {
  const paths = new Set();
  for (const [key, definition] of Object.entries(pageDefinitions)) {
    assert.equal(validatePageContent(key, defaultPageContent(key)).error, undefined, key);
    assert(!paths.has(definition.path), `Duplicate route: ${definition.path}`);
    paths.add(definition.path);
  }
});

test("new fields merge into saved content without reviving removed sections", () => {
  const result = mergePageContent("about", { values: { title: "Our story" }, collections: { sections: [] } });
  assert.equal(result.values.title, "Our story");
  assert(result.values.intro);
  assert.deepEqual(result.collections.sections, []);
});

test("default content is isolated from edits", () => {
  const content = defaultPageContent("workspace");
  content.collections.amenities[0].title = "Changed";
  assert.equal(defaultPageContent("workspace").collections.amenities[0].title, "Fast Wi-Fi");
});

test("script URLs, protocol-relative URLs and backslash redirects are rejected", () => {
  for (const link of ["javascript:alert(1)", "data:text/html,x", "//evil.test", "/\\evil.test", "https://safe.test\n.evil.test"]) assert.equal(safeContentLink(link), false, link);
  for (const link of ["/shop?sort=newest", "https://example.com/help", "mailto:help@example.com", "tel:+2348000000000"]) assert.equal(safeContentLink(link), true, link);
  const data = defaultPageContent("faq");
  data.values.help_link = "javascript:alert(1)";
  assert.match(validatePageContent("faq", data).error, /website address/);
});

test("unexpected fields never reach published content", () => {
  const data = defaultPageContent("about");
  data.values.adminRole = "owner";
  data.collections.sections[0]._editorId = "temporary";
  const result = validatePageContent("about", data).data;
  assert.equal(result.values.adminRole, undefined);
  assert.equal(result.collections.sections[0]._editorId, undefined);
});

test("malformed payloads and excessive collections are rejected", () => {
  assert(validatePageContent("workspace", null).error);
  const data = defaultPageContent("faq");
  data.collections.questions = Array.from({ length: 51 }, () => ({ question: "Q", answer: "A" }));
  assert.match(validatePageContent("faq", data).error, /50/);
  data.collections.questions = [{ question: {}, answer: "A" }];
  assert(validatePageContent("faq", data).error);
});

test("negative, fractional, and excessive workspace prices are rejected", () => {
  for (const price of ["-1", "3.5", "NaN", "100000001", ""]) {
    const data = defaultPageContent("workspace");
    data.values.day_price = price;
    assert(validatePageContent("workspace", data).error, price);
  }
});

test("unapproved remote images are rejected", () => {
  const data = defaultPageContent("workspace");
  data.values.banner = "https://unapproved.example/banner.jpg";
  assert.match(validatePageContent("workspace", data).error, /valid image/);
  data.values.banner = "javascript:alert(1)";
  assert(validatePageContent("workspace", data).error);
});

test("reordered gallery images retain the correct upload destinations", () => {
  const data = defaultPageContent("workspace");
  data.collections.gallery = [{ image: "/first.jpg", alt: "First" }, { image: "/second.jpg", alt: "Second" }];
  data.collections.gallery.reverse();
  const slots = imageSlots("workspace", data);
  slots.find(slot => slot.name === "image__gallery__0__image").set("/replacement.jpg");
  assert.deepEqual(data.collections.gallery, [{ image: "/replacement.jpg", alt: "Second" }, { image: "/first.jpg", alt: "First" }]);
});

test("existing workspace pages default to sizing that avoids enlargement", () => {
  const old = defaultPageContent("workspace");
  delete old.values.banner_fit;
  const content = mergePageContent("workspace", old);
  assert.equal(content.values.banner_fit, "natural");
  content.values.banner_fit = "cover";
  assert.equal(validatePageContent("workspace", content).error, undefined);
  content.values.banner_fit = "invalid";
  assert.match(validatePageContent("workspace", content).error, /valid option/);
});
