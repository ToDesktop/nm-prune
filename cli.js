#!/usr/bin/env node

const nmPrune = require('.');
const Confirm = require('prompt-confirm');
const prettyBytes = require('pretty-bytes');
const fs = require('fs-extra');
const meow = require('meow');

const cli = meow(
  `
Usage
  $ npm-prune <input>

Options
  -f, --force  Skip confirmation and run

Examples
  $ nm-prune
  🌈 unicorns 🌈
`,
  {
    alias: {
      f: 'force',
    },
  },
);

const force = !!cli.flags.force;

// eslint-disable-next-line no-console
const log = str => console.log(str);

log('Scanning node_modules…\n');

nmPrune.prep(process.cwd()).then(info =>
  new Promise((resolve) => {
    log(`Pruning ${info.modulePath}`);
    if (info.usingCustomPrune) {
      log(`Using custom prune: ${info.prunePath}`);
    }
    const q = `Delete ${info.fileCount} files (${prettyBytes(info.size)}) and ${
      info.dirCount
    } folders`;
    if (force) {
      log(q);
      return resolve(true);
    }
    const question = new Confirm(q);
    return question.ask(resolve);
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
