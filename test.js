import path from 'path';
import test from 'ava';
// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'nm-prune';

test('sanity test', t =>
  m.prep(process.cwd()).then((info) => {
    const {
      fileCount,
      dirCount,
      prunePath,
      usingCustomPrune,
      modulePath,
      files,
      dirs,
      size,
    } = info;
    t.is(typeof info, 'object');
    t.is(modulePath, path.join(__dirname, 'node_modules'));
    t.is(usingCustomPrune, false);
    t.pass(prunePath.includes('default-prune.json'));
    t.pass(size > 1000);
    t.pass(Array.isArray(files));
    t.pass(Array.isArray(dirs));
    t.pass(fileCount > 100);
    t.pass(dirCount > 50);
  }));
