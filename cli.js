#!/usr/bin/env node

const nmPrune = require('.');
const { Confirm, } = require('enquirer');
const prettyBytes = require('pretty-bytes');
const fs = require('fs-extra');
const meow = require('meow');

const cli = meow(
  `
Usage
  $ nm-prune <input>

Options
  -f, --force  Skip confirmation and run
  -l, --prune-license  Prune license files too

Examples
  $ nm-prune --force
  Scanning node_modules…
  
  Pruning /Users/dave/code/nm-prune/node_modules
  Delete 1773 files (6.54 MB) and 126 folders

  Removing files…
  ✔ Files removed
  
  Removing directories…
  ✔ Directories removed
`,
  {
    flags: {
      force: {
        type: 'boolean',
        alias: 'f',
        default: false,
      },
      pruneLicense: {
        type: 'boolean',
        alias: 'l',
        default: false,
      },
    },
  }
);

const force = !!cli.flags.force;
const pruneLicense = !!cli.flags.pruneLicense;

// eslint-disable-next-line no-console
const log = str => console.log(str);

log('Scanning node_modules…\n');

nmPrune.prep(process.cwd(), { pruneLicense, }).then(info =>
  new Promise((resolve) => {
    log(`Pruning ${info.modulePath}`);
    if (info.usingCustomPrune) {
      log(`Using custom prune: ${info.prunePath}`);
    }
    const message = `Delete ${info.fileCount} files (${prettyBytes(info.size)}) and ${
      info.dirCount
    } folders`;
    if (force) {
      log(message);
      return resolve(true);
    }
    const question = new Confirm({ message, });
    return question.run().then(resolve, (err) => {
      log(err);
    });
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
      })
      .catch(e => log(e));
  }));
