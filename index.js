const fs = require('fs');
const { DEFAULT_SAFE_SIZE, KB_1, MB_1, GB_1, TEXT } = require('./constants');
const { createFolderName, getSafeStringSize, log } = require('./utils');

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
  log.start();

  fs.mkdirSync(resultFolderPath);

  const configData = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));
  const { gigabyte = 0, megabytes = 0, kilobytes = 0 } = configData;

  const folderName = createFolderName(gigabyte, megabytes, kilobytes);

  const folderWithSizePath = `${resultFolderPath}/${folderName}`;
  fs.mkdirSync(folderWithSizePath);

  const SAFE_STRING_SIZE_MB = getSafeStringSize(DEFAULT_SAFE_SIZE, MB_1);

  const stringLength = GB_1 * gigabyte + MB_1 * megabytes + KB_1 * kilobytes;

  const amountOfFiles = Math.ceil(stringLength / GB_1);

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

      await new Promise((res) => {
        writeStream.write(fileText, (error) => {
          if (error) throw new Error(error);

          res();
        });
      });
    }

    log.progress(fileNumber, amountOfFiles);

    await new Promise((res) => {
      writeStream.end(() => res());
    });
  }

  const endTime = performance.now();

  log.end(startTime, endTime, folderName);
}
