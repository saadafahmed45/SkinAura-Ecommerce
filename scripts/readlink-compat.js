"use strict";

const fs = require("fs");
const path = require("path");

// Ensure essential .next development directories exist upfront
try {
  const clientRoot = path.resolve(__dirname, "..");
  fs.mkdirSync(path.join(clientRoot, ".next", "static", "development"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(clientRoot, ".next", "static", "chunks"), {
    recursive: true,
  });
} catch {}

if (!fs.__skinauraReadlinkCompat) {
  const readlink = fs.readlink;
  const readlinkSync = fs.readlinkSync;
  const promisesReadlink = fs.promises && fs.promises.readlink;

  const normalizeReadlinkError = (error) => {
    if (error && error.code === "EISDIR") {
      error.code = "EINVAL";
    }
    return error;
  };

  fs.readlink = function patchedReadlink(path, options, callback) {
    if (typeof options === "function") {
      return readlink.call(fs, path, (error, result) => {
        options(normalizeReadlinkError(error), result);
      });
    }

    return readlink.call(fs, path, options, (error, result) => {
      callback(normalizeReadlinkError(error), result);
    });
  };

  fs.readlinkSync = function patchedReadlinkSync(path, options) {
    try {
      return readlinkSync.call(fs, path, options);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };

  if (promisesReadlink) {
    fs.promises.readlink = async function patchedPromisesReadlink(
      path,
      options
    ) {
      try {
        return await promisesReadlink.call(fs.promises, path, options);
      } catch (error) {
        throw normalizeReadlinkError(error);
      }
    };
  }

  // Auto-create missing parent directories for .next atomic temporary files on Windows
  const ensureParentDir = (filePath) => {
    if (
      typeof filePath === "string" &&
      (filePath.includes(".next") || filePath.includes("_buildManifest"))
    ) {
      try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      } catch {}
    }
  };

  const origOpen = fs.open;
  fs.open = function (p, flags, mode, callback) {
    ensureParentDir(p);
    return origOpen.apply(fs, arguments);
  };

  const origOpenSync = fs.openSync;
  fs.openSync = function (p, flags, mode) {
    ensureParentDir(p);
    return origOpenSync.apply(fs, arguments);
  };

  if (fs.promises && fs.promises.open) {
    const origPromisesOpen = fs.promises.open;
    fs.promises.open = async function (p, flags, mode) {
      ensureParentDir(p);
      return origPromisesOpen.apply(fs.promises, arguments);
    };
  }

  const origWriteFile = fs.writeFile;
  fs.writeFile = function (p, data, options, callback) {
    ensureParentDir(p);
    return origWriteFile.apply(fs, arguments);
  };

  const origWriteFileSync = fs.writeFileSync;
  fs.writeFileSync = function (p, data, options) {
    ensureParentDir(p);
    return origWriteFileSync.apply(fs, arguments);
  };

  if (fs.promises && fs.promises.writeFile) {
    const origPromisesWriteFile = fs.promises.writeFile;
    fs.promises.writeFile = async function (p, data, options) {
      ensureParentDir(p);
      return origPromisesWriteFile.apply(fs.promises, arguments);
    };
  }

  Object.defineProperty(fs, "__skinauraReadlinkCompat", {
    value: true,
  });
}
