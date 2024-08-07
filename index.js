const fs = require('fs');
const path = require('path');

const { DEFAULT_SAFE_SIZE, KB_1, MB_1, GB_1, TEXT_DATA } = require('./constants');
const { createFolderName, getSafeStringSize, LogInfo } = require('./utils');

const log = new LogInfo();

const resultFolderPath = path.join(__dirname, '/result');

function getConfigData() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json'), 'utf8'));
  } catch (error) {
    log.configError(error);
  }

  return data;
}

const configData = getConfigData();

if (!configData.removeResultFolder && fs.existsSync(resultFolderPath)) {
  fs.rm(resultFolderPath, { recursive: true, force: true }, () => {
    createFile();
  });
} else {
  createFile();
}

async function createFile() {
  log.start();

  fs.mkdirSync(resultFolderPath);

  const { gigabyte = 0, megabytes = 0, kilobytes = 0 } = configData;

  const folderName = createFolderName(gigabyte, megabytes, kilobytes);

  const folderWithSizePath = path.join(resultFolderPath, folderName);
  fs.mkdirSync(folderWithSizePath);

  const SAFE_STRING_SIZE_MB = getSafeStringSize(DEFAULT_SAFE_SIZE, MB_1);

  const stringLength = GB_1 * gigabyte + MB_1 * megabytes + KB_1 * kilobytes;

  const amountOfFiles = Math.ceil(stringLength / GB_1);

  for (let fileNumber = 1; fileNumber <= amountOfFiles; fileNumber++) {
    const innerFolderForFiles = path.join(folderWithSizePath, `f${Math.ceil(fileNumber / 5)}`);
    if (!fs.existsSync(innerFolderForFiles)) {
      fs.mkdirSync(innerFolderForFiles);
    }

    const writeStream = fs.createWriteStream(
      path.join(innerFolderForFiles, `/${Number(`${Math.random()}`.slice(2)).toString(32)}.q`)
    );

    const currentLength =
      fileNumber === amountOfFiles ? stringLength - GB_1 * (fileNumber - 1) : GB_1;
    const safeLoop = Math.ceil(currentLength / SAFE_STRING_SIZE_MB);

    for (let writeFileNumber = 1; writeFileNumber <= safeLoop; writeFileNumber++) {
      let fileText = '';

      if (writeFileNumber === safeLoop) {
        fileText = TEXT_DATA.repeat(currentLength - SAFE_STRING_SIZE_MB * (safeLoop - 1));
      } else {
        fileText = TEXT_DATA.repeat(SAFE_STRING_SIZE_MB);
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

  log.finish(folderName);
}
