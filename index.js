const walk = require('walk-filtered');
const path = require('path');
const findRoot = require('find-root');
const fs = require('fs-extra');

const prep = (projectPath, options = {}) => {
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

  let files = pruneJson.files || [];
  const extensions = pruneJson.extensions || [];
  const directories = pruneJson.directories || [];
  if (options.pruneLicense) files = files.concat(pruneJson.licenses || []);

  const shouldPruneFile = pth =>
    files.includes(path.basename(pth).toLowerCase()) ||
    extensions.includes(path.extname(pth).toLowerCase());

  const shouldPruneDir = pth => directories.includes(path.basename(pth).toLowerCase());

  const modulePath = path.join(root, 'node_modules');

  let size = 0;
  let fileCount = 0;
  let dirCount = 0;
  const filesToPrune = [];
  const dirsToPrune = [];

  const process = (pth, stats) => {
    if (stats.isFile() && shouldPruneFile(pth)) {
      size += stats.size;
      fileCount += 1;
      filesToPrune.push(path.join(modulePath, pth));
    }
    if (stats.isDirectory() && shouldPruneDir(pth)) {
      dirCount += 1;
      dirsToPrune.push(path.join(modulePath, pth));
    }
  };

  const onFinish = () => ({
    modulePath,
    usingCustomPrune,
    prunePath,
    size,
    files: filesToPrune,
    fileCount,
    dirs: dirsToPrune,
    dirCount,
  });

  return new Promise(resolve => walk(modulePath, process, true, () => resolve(onFinish())));
};

module.exports = {
  prep,
};
