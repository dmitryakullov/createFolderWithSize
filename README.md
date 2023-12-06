You must have NODE JS installed!

Instruction how to create file with size.

1. Fill `config.json` with required folder sizes

2. Open console in this directory and run `npm start`

3. Wait for the `Your file was successfully created!` message in the console

4. Folder with the required size will be created in the `/result` folder

NOTE: If you encounter an `RangeError: Invalid string length` error in the console,
then reduce the `"safe_string_length_size_mb"` property in the `config.json`
