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

  const shouldPruneFile = pth =>
    (pruneFile.files || []).includes(path.basename(pth)) ||
    (pruneFile.extensions || []).includes(path.extname(pth));

  const shouldPruneDir = pth => (pruneFile.directories || []).includes(path.basename(pth));

  const modulePath = path.join(root, 'node_modules');

  let size = 0;
  let fileCount = 0;
  let dirCount = 0;
  const files = [];
  const dirs = [];

  const process = (pth, stats) => {
    if (stats.isFile() && shouldPruneFile(pth)) {
      size += stats.size;
      fileCount += 1;
      files.push(path.join(root, pth));
    }
    if (stats.isDirectory() && shouldPruneDir(pth)) {
      dirCount += 1;
      dirs.push(path.join(root, pth));
    }
  };

  const onFinish = () => ({
    modulePath,
    usingCustomPrune,
    customPrunePath,
    size,
    files,
    fileCount,
    dirs,
    dirCount,
  });

  return new Promise(resolve => walk(modulePath, process, true, () => resolve(onFinish())));
};

module.exports = {
  prep,
};
