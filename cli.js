#!/usr/bin/env node

const nmPrune = require('.');
const Confirm = require('prompt-confirm');
const prettyBytes = require('pretty-bytes');
const fs = require('fs-extra');

// eslint-disable-next-line no-console
const log = str => console.log(str);

log('Scanning node_modules…\n');

nmPrune.prep(process.cwd()).then(info =>
  new Promise((resolve) => {
    log(`Pruning ${info.modulePath}`);
    if (info.usingCustomPrune) {
      log(`Using custom prune: ${info.customPrunePath}`);
    }
    const q = new Confirm(`Delete ${info.fileCount} files (${prettyBytes(info.size)}) and ${info.dirCount} folders`);
    q.ask(resolve);
  }).then((doDelete) => {
    if (!doDelete) {
      log('Ok, nothing has changed');
      return null;
    }
    log('\nRemoving files…');
    return Promise.all(info.files.map(fullPath => fs.remove(fullPath)))
      .then(() => {
        log('✔ Files removed\n');
        log('Removing directories…');
        return Promise.all(info.dirs.map(fullPath => fs.remove(fullPath)));
      })
      .then(() => {
        log('✔ Directories removed');
      });
  }));
