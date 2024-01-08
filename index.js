const fs = require('fs');
const { DEFAULT_SAFE_SIZE, KB_1, MB_1, GB_1, TEXT } = require('./constants');
const { createFolderName, getSafeStringSize, pause } = require('./utils');

const startTime = performance.now();

const resultFolderPath = `${__dirname}/result`;

if (fs.existsSync(resultFolderPath)) {
  fs.rm(resultFolderPath, { recursive: true, force: true }, () => {
    createFile();
  });
} else {
  createFile();
}

async function createFile() {
  fs.mkdirSync(resultFolderPath);

  const configData = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));
  const { gigabyte = 0, megabytes = 0, kilobytes = 0 } = configData;

  const folderName = createFolderName(gigabyte, megabytes, kilobytes);

  const folderWithSizePath = `${resultFolderPath}/${folderName}`;
  fs.mkdirSync(folderWithSizePath);

  const SAFE_STRING_SIZE_MB = getSafeStringSize(DEFAULT_SAFE_SIZE, MB_1);

  const stringLength = GB_1 * gigabyte + MB_1 * megabytes + KB_1 * kilobytes;

  const amountOfFiles = Math.ceil(stringLength / GB_1);

  console.log('The folder creation process has started.');

  for (let fileNumber = 1; fileNumber <= amountOfFiles; fileNumber++) {
    const writeStream = fs.createWriteStream(
      `${folderWithSizePath}/${Math.round(Math.random() * 10000000)}_file.q`
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

      await pause(100);
    }

    await pause(1000);

    if (!(fileNumber % 4)) {
      console.log('Work in progress...');
    }

    writeStream.end();

    await pause(1000);
  }

  const endTime = performance.now();

  const tookTime = Math.round(endTime - startTime) / 1000;

  console.log(
    `\n\n\n${tookTime} seconds\n\nYour folder "${folderName}" was successfully created!\n`
  );
}
