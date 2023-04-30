#!/usr/bin/env node

/* eslint-env node */

import * as esbuild from "esbuild";

const arg = process.argv[2];
const env = process.env.NODE_ENV;

const options = {
  entryPoints: [
    "./src/background.js",
    "./src/content.js",
    "./src/popup/index.js",
    "./src/popup/index.html",
    "./src/popup/index.css",
    {
      in: `./src/manifest.${process.env.BROWSER}.json`,
      out: "manifest",
    },
    {
      in: "./icon.png",
      out: "icon",
    },
  ],
  loader: {
    ".html": "copy",
    ".css": "copy",
    ".json": "copy",
    ".png": "copy",
  },
  outbase: "src",
  outdir: arg === "watch" ? "./build" : arg,
  target: "es6",
  bundle: true,
  allowOverwrite: true,
  minify: env === "production",
  sourcemap: env === "development",
};

if (arg === "watch") {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else await esbuild.build(options);
