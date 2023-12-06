function createFileName(gb, mb, kb) {
  let fileName = '';
  if (gb) {
    fileName += `${gb}GB_`;
  }
  if (mb) {
    fileName += `${mb}MB_`;
  }
  if (kb) {
    fileName += `${kb}KB_`;
  }

  if (!fileName.length) {
    fileName = 'empty_';
  }

  return fileName;
}

module.exports = { createFileName };
