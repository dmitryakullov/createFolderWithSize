const fs = require('fs');
const { DEFAULT_SAFE_SIZE, KB_1, MB_1, GB_1, TEXT } = require('./constants');
const { createFolderName, getSafeStringSize } = require('./utils');

const startTime = performance.now();

const resultFolderPath = `${__dirname}/result`;

if (fs.existsSync(resultFolderPath)) {
  fs.rm(resultFolderPath, { recursive: true, force: true }, () => {
    createFolder();
  });
} else {
  createFolder();
}

function createFolder() {
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

  const createFile = (fileNumber = 1) => {
    const writeStream = fs.createWriteStream(
      `${folderWithSizePath}/${Math.round(Math.random() * 10000000)}_file.q`
    );

    const currentLength =
      fileNumber === amountOfFiles ? stringLength - GB_1 * (fileNumber - 1) : GB_1;
    const safeLoop = Math.ceil(currentLength / SAFE_STRING_SIZE_MB);

    const writeStringInFile = (writeFileNumber = 1) => {
      let fileText = '';

      if (writeFileNumber === safeLoop) {
        fileText = TEXT.repeat(currentLength - SAFE_STRING_SIZE_MB * (safeLoop - 1));
      } else {
        fileText = TEXT.repeat(SAFE_STRING_SIZE_MB);
      }

      writeStream.write(fileText, (error) => {
        if (error) {
          throw new Error('An error has occurred!');
        }

        const nextWriteFileNumber = writeFileNumber + 1;

        if (nextWriteFileNumber <= safeLoop) {
          writeStringInFile(nextWriteFileNumber);

          return;
        }

        const messageAfterCreationFiles = 3;
        if (fileNumber % messageAfterCreationFiles === 0) {
          const createdPercentage = Math.round((100 / amountOfFiles) * fileNumber);
          console.log(`${createdPercentage}% Created...`);
        }

        writeStream.end(() => {
          const nextFileNumber = fileNumber + 1;

          if (nextFileNumber <= amountOfFiles) {
            createFile(nextFileNumber);

            return;
          }

          const endTime = performance.now();

          const tookTime = Math.round(endTime - startTime) / 1000;

          console.log(
            /* eslint-disable max-len */
            `\n\n\nTook ${tookTime} seconds\n\nYour folder "${folderName}" was successfully created!\n`
          );
        });
      });
    };

    writeStringInFile();
  };

  createFile();
}
