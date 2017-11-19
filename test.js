import path from 'path';
import test from 'ava';
import m from '.';

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
    t.is(prunePath, path.join(__dirname, 'default-prune.json'));
    t.true(size > 1000);
    t.true(Array.isArray(files));
    t.true(Array.isArray(dirs));
    t.true(fileCount > 100);
    t.true(dirCount > 50);
  }));
