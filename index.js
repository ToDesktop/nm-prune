const walk = require('walk-filtered');
const path = require('path');
const findRoot = require('find-root');
const fs = require('fs-extra');

const prep = (projectPath) => {
  const root = findRoot(projectPath);
  let pruneJson = null;
  let usingCustomPrune = false;
  let prunePath = path.join(root, 'prune.json');

  try {
    pruneJson = fs.readJsonSync(prunePath);
    usingCustomPrune = true;
  } catch (e) {
    prunePath = path.join(__dirname, 'default-prune.json');
    pruneJson = fs.readJsonSync(prunePath);
  }

  const shouldPruneFile = pth =>
    (pruneJson.files || []).includes(path.basename(pth).toLowerCase()) ||
    (pruneJson.extensions || []).includes(path.extname(pth).toLowerCase());

  const shouldPruneDir = pth =>
    (pruneJson.directories || []).includes(path.basename(pth).toLowerCase());

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
      files.push(path.join(modulePath, pth));
    }
    if (stats.isDirectory() && shouldPruneDir(pth)) {
      dirCount += 1;
      dirs.push(path.join(modulePath, pth));
    }
  };

  const onFinish = () => ({
    modulePath,
    usingCustomPrune,
    prunePath,
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
