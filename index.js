const fs = require('fs');
const { createFileName } = require('./utils');

const files_path = `${__dirname}/file`;

const KB_1 = 1024;
const MB_1 = 1024 * KB_1;
const GB_1 = 1024 * MB_1;

const DEFAULT_SAFE_SIZE = 150;

if (fs.existsSync(files_path)) {
  fs.rm(files_path, { recursive: true, force: true }, () => {
    createFile();
  });
} else {
  createFile();
}

function createFile() {
  fs.mkdirSync(files_path);

  const configData = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));
  const {
    gigabyte = 0,
    megabytes = 0,
    kilobytes = 0,
    safe_string_length_loop_mb = DEFAULT_SAFE_SIZE,
  } = configData;

  const SAFE_STRING_SIZE_MB =
    !safe_string_length_loop_mb ||
    safe_string_length_loop_mb > 500 ||
    safe_string_length_loop_mb < 10 ||
    typeof safe_string_length_loop_mb !== 'number'
      ? DEFAULT_SAFE_SIZE * MB_1
      : safe_string_length_loop_mb * MB_1;

  const filename = createFileName(gigabyte, megabytes, kilobytes);

  const writeStream = fs.createWriteStream(`${files_path}/${filename}size.txt`);

  const stringLength = GB_1 * gigabyte + MB_1 * megabytes + KB_1 * kilobytes;

  const safeLoop = Math.floor(stringLength / SAFE_STRING_SIZE_MB);

  for (let i = 0; i < safeLoop + 1; i++) {
    let fileText = '';

    console.log(i, SAFE_STRING_SIZE_MB);

    if (i === safeLoop) {
      fileText = 'A'.repeat(stringLength - SAFE_STRING_SIZE_MB * safeLoop);
    } else {
      fileText = 'A'.repeat(SAFE_STRING_SIZE_MB);
    }

    writeStream.write(fileText);
  }

  writeStream.end();
}
