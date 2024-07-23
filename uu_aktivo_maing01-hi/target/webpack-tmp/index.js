var mod=require("module");
var isDoc = typeof document !== "undefined";
var uri = ((mod ? mod.uri : isDoc && (document.currentScript || Array.prototype.slice.call(document.getElementsByTagName("script"), -1)[0] || {}).src) || "").toString();
uri = uri.split(/\//).slice(0, -1).join("/") + "/"; // runtime publicPath configuration required for proper linking of styles, background images, ...
var floatingVersion = "/0.0.0/";
if (uri.substr(-floatingVersion.length) !== floatingVersion) floatingVersion = "/0.x/";
if (uri.substr(-floatingVersion.length) === floatingVersion) uri = uri.substr(0, uri.length - floatingVersion.length) + "/0.1.0/";
__webpack_public_path__ = process.env.NODE_ENV === "test" && uri === "/" ? "file://" + eval("__filename").replace(/[^/\\]*$/, "") : uri;
module.exports = require("__project__/index.js");
var ex = module.exports;
if (ex && typeof ex === "object") {
  if (!("version" in ex)) Object.defineProperty(ex, "version", { configurable: true, value: process.env.VERSION });
  if (!("name" in ex)) Object.defineProperty(ex, "name", { configurable: true, value: process.env.OUTPUT_NAME.split(/[\/\\]/).pop() });
  if (!("namespace" in ex)) Object.defineProperty(ex, "namespace", { configurable: true, value: process.env.NAMESPACE });
}
