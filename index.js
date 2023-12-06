const fs = require('fs');
const { createFolderName, getSafeStringSize, DEFAULT_SAFE_SIZE } = require('./utils');

const resultFolderPath = `${__dirname}/result`;

const KB_1 = 1024;
const MB_1 = 1024 * KB_1;
const GB_1 = 1024 * MB_1;
const TEXT = 'A';

if (fs.existsSync(resultFolderPath)) {
  fs.rm(resultFolderPath, { recursive: true, force: true }, () => {
    createFile();
  });
} else {
  createFile();
}

function createFile() {
  fs.mkdirSync(resultFolderPath);

  const configData = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));
  const {
    gigabyte = 0,
    megabytes = 0,
    kilobytes = 0,
    safe_string_length_size_mb = DEFAULT_SAFE_SIZE,
  } = configData;

  const folderName = createFolderName(gigabyte, megabytes, kilobytes);

  const folderWithSizePath = `${resultFolderPath}/${folderName}`;
  fs.mkdirSync(folderWithSizePath);

  const stringLength = GB_1 * gigabyte + MB_1 * megabytes + KB_1 * kilobytes;

  const SAFE_STRING_SIZE_MB = getSafeStringSize(safe_string_length_size_mb, MB_1);

  const writeStream = fs.createWriteStream(
    `${folderWithSizePath}/${Math.round(Math.random() * 10000000)}_file.txt`
  );

  const safeLoop = Math.floor(stringLength / SAFE_STRING_SIZE_MB);

  for (let i = 0; i < safeLoop + 1; i++) {
    let fileText = '';

    if (i === safeLoop) {
      fileText = TEXT.repeat(stringLength - SAFE_STRING_SIZE_MB * safeLoop);
    } else {
      fileText = TEXT.repeat(SAFE_STRING_SIZE_MB);
    }

    writeStream.write(fileText);
  }

  writeStream.end();

  console.log(`\nYour folder "${folderName}" was successfully created!\n`);
}
