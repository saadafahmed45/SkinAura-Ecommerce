"use strict";

const fs = require("fs");

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
    fs.promises.readlink = async function patchedPromisesReadlink(path, options) {
      try {
        return await promisesReadlink.call(fs.promises, path, options);
      } catch (error) {
        throw normalizeReadlinkError(error);
      }
    };
  }

  Object.defineProperty(fs, "__skinauraReadlinkCompat", {
    value: true,
  });
}
