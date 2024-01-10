const { DEFAULT_SAFE_SIZE } = require('./constants');

function getSafeStringSize(safeLength, mb1) {
  return !safeLength || safeLength > 500 || safeLength < 10 || typeof safeLength !== 'number'
    ? DEFAULT_SAFE_SIZE * mb1
    : safeLength * mb1;
}

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

  folderName += 'size';
  return folderName;
}

const log = {
  start: () => console.log('The folder creation process has started'),
  progress: (fileNumber, amountOfFiles) => {
    const messageAfterCreationFiles = 4;

    if (fileNumber % messageAfterCreationFiles === 0) {
      const createdPercentage = Math.round((100 / amountOfFiles) * fileNumber);
      console.log(`${createdPercentage}% Created...`);
    }
  },
  end: (startTime, endTime, folderName) => {
    const tookTime = Math.round(endTime - startTime) / 1000;

    console.log(
      `\n\n\nTook ${tookTime} seconds\n\nYour folder "${folderName}" was successfully created!\n`
    );
  },
};

module.exports = {
  createFolderName,
  getSafeStringSize,
  log,
};
