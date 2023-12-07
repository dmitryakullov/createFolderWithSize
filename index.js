const fs = require('fs');
const { createFolderName, getSafeStringSize, DEFAULT_SAFE_SIZE } = require('./utils');

const startTime = performance.now();

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

  const SAFE_STRING_SIZE_MB = getSafeStringSize(safe_string_length_size_mb, MB_1);

  const stringLength = GB_1 * gigabyte + MB_1 * megabytes + KB_1 * kilobytes;

  const amountOfFiles = Math.ceil(stringLength / GB_1);

  for (let fileNumber = 1; fileNumber <= amountOfFiles; fileNumber++) {
    const writeStream = fs.createWriteStream(
      `${folderWithSizePath}/${Math.round(Math.random() * 10000000)}_file.txt`
    );

    const currentLength =
      fileNumber === amountOfFiles ? stringLength - GB_1 * (fileNumber - 1) : GB_1;
    const safeLoop = Math.ceil(currentLength / SAFE_STRING_SIZE_MB);

    for (let writeFileNumber = 1; writeFileNumber <= safeLoop; writeFileNumber++) {
      let fileText = '';

      if (writeFileNumber === safeLoop) {
        fileText = TEXT.repeat(currentLength - SAFE_STRING_SIZE_MB * (safeLoop - 1));
      } else {
        fileText = TEXT.repeat(SAFE_STRING_SIZE_MB);
      }

      writeStream.write(fileText);
    }

    writeStream.end();
  }

  const endTime = performance.now();

  console.log(
    `\nYour folder "${folderName}" was successfully created!\n${endTime - startTime}ms\n`
  );
}
