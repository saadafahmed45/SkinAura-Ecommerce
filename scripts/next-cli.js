#!/usr/bin/env node
"use strict";

const path = require("path");

const readlinkCompat = path
  .join(__dirname, "readlink-compat.js")
  .replace(/\\/g, "/");
const requireOption = `--require="${readlinkCompat}"`;

process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
  ? `${requireOption} ${process.env.NODE_OPTIONS}`
  : requireOption;

require(readlinkCompat);
require("next/dist/bin/next");
