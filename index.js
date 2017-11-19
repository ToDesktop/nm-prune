const walk = require('walk-filtered');
const path = require('path');
const findRoot = require('find-root');
const fs = require('fs-extra');

const prep = (projectPath) => {
  const root = findRoot(projectPath);
  let pruneFile = null;
  let usingCustomPrune = false;
  let customPrunePath = '';
  customPrunePath = path.join(root, 'prune.json');

  try {
    pruneFile = fs.readJsonSync(customPrunePath);
    usingCustomPrune = true;
  } catch (e) {
    pruneFile = fs.readJsonSync(path.join(__dirname, 'default-prune.json'));
  }

  const nm = path.join(root, 'node_modules');

  let size = 0;
  let fileCount = 0;
  let dirCount = 0;
  const files = [];
  const dirs = [];

  return new Promise((resolve) => {
    walk(
      nm,
      (pth, stats) => {
        if (stats.isFile()) {
          if (
            (pruneFile.files || []).includes(path.basename(pth)) ||
            (pruneFile.extensions || []).includes(path.extname(pth))
          ) {
            size += stats.size;
            fileCount += 1;
            files.push(path.join(root, pth));
          }
        }
        if (stats.isDirectory()) {
          if ((pruneFile.directories || []).includes(path.basename(pth))) {
            dirCount += 1;
            dirs.push(path.join(root, pth));
          }
        }
      },
      true,
      () => {
        resolve({
          usingCustomPrune,
          customPrunePath,
          size,
          files,
          fileCount,
          dirs,
          dirCount,
        });
      },
    );
  });
};

module.exports = {
  prep,
};
