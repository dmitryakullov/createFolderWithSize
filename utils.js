const { DEFAULT_SAFE_SIZE } = require('./constants');

function getSafeStringSize(safeLength, mb1) {
  if (!safeLength || safeLength > 500 || safeLength < 10 || typeof safeLength !== 'number') {
    return DEFAULT_SAFE_SIZE * mb1;
  }
  return safeLength * mb1;
}

const createIndex = () => Date.now().toString(32);

function createFolderName(gb, mb, kb) {
  let folderName = '';
  if (gb) {
    folderName += `${gb}GB_`;
  }
  if (mb) {
    folderName += `${mb}MB_`;
  }
  if (kb) {
    folderName += `${kb}KB_`;
  }

  if (!folderName.length) {
    folderName = 'empty_';
  }

  folderName += `size_${createIndex()}`;
  return folderName;
}

class LogInfo {
  constructor() {
    this.startTime = performance.now();
  }

  start() {
    console.log('The folder creation process has started');
  }

  progress(fileNumber, amountOfFiles) {
    const messageAfterCreationFiles = 4;

    if (fileNumber % messageAfterCreationFiles === 0) {
      const createdPercentage = Math.round((100 / amountOfFiles) * fileNumber);
      console.log(`${createdPercentage}% Created...`);
    }
  }

  finish(folderName) {
    const endTime = performance.now();
    const tookTime = Math.round(endTime - this.startTime) / 1000;

    console.log(
      `\n\n\nTook ${tookTime} seconds\n\nYour folder "${folderName}" was successfully created!\n`
    );
  }

  configError(error) {
    console.error(
      `\nError!\nPlease, correct the "config.json" file format.\nError message: ${error}`
    );
  }
}

module.exports = {
  createFolderName,
  getSafeStringSize,
  LogInfo,
};
