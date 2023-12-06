const DEFAULT_SAFE_SIZE = 150;

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

module.exports = { createFolderName, getSafeStringSize, DEFAULT_SAFE_SIZE };
