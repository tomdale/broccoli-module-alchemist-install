#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var cwd = process.cwd();
var pkgPath = path.join(cwd, 'package.json');
var pkg = JSON.parse(fs.readFileSync(pkgPath));
var main = pkg.main;
var debug = require('debug')('broccoli-module-alchemist-install');

if (!main) {
  throw new Error("Unable to rewrite package.json main; no existing main entry.");
}

try {
  console.log('Verifying compatibility of ' + main);
  require(path.join(cwd, main));
  console.log('Compatibility verified, using ' + main);
} catch (e) {
  console.log('Exception caught while evaluating ' + main);
  debug(e.stack ? e.stack : e);
  // Remove leading 'src' directory.
  // src/system/server.js -> system/server.js
  var mainPath = main.split(path.sep).slice(1).join(path.sep);
  // system/server.js -> dist/cjs/system/server.js
  var cjsMain = path.join('dist', 'cjs', mainPath);

  try {
    console.log('Verifying compatibility of ' + cjsMain);
    console.log('Requiring ' + path.join(cwd, cjsMain));
    require(path.join(cwd, cjsMain));
    console.log('Switching package main to ' + cjsMain);

    pkg.main = cjsMain;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  } catch (f) {
    debug(f.stack ? f.stack : f);
    console.log('Could not load ' + main + ' or ' + cjsMain);
  }
}
