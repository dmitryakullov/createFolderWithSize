const { LogInfo } = require('../utils');

const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();

describe('LogInfo', () => {
  const SAVE_CONSOLE_LOG = console.log;
  const SAVE_CONSOLE_ERROR = console.error;
  const SAVE_PERFORMANCE_NOW = performance.now;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    performance.now = jest.fn(() => 796940);
  });
  afterAll(() => {
    console.log = SAVE_CONSOLE_LOG;
    console.error = SAVE_CONSOLE_ERROR;
    performance.now = SAVE_PERFORMANCE_NOW;
  });

  test('should log "start" message', () => {
    const log = new LogInfo();
    log.start();

    expect(mockConsoleLog).toHaveBeenCalledWith('The folder creation process has started');
  });

  test('should log "progress" message', () => {
    const log = new LogInfo();
    log.progress(3, 5);

    expect(mockConsoleLog).not.toHaveBeenCalled();

    log.progress(4, 5);

    expect(mockConsoleLog).toHaveBeenCalledWith('80% Created...');
  });

  test('should log "finish" message', () => {
    const log = new LogInfo();
    log.finish('FOLDER_NAME');

    expect(mockConsoleLog).toHaveBeenCalledWith(
      `\n\n\nTook 0 seconds\n\nYour folder "FOLDER_NAME" was successfully created!\n`
    );
  });

  test('should log "config error" message', () => {
    const ERROR_MESSAGE = 'Test Error';
    const log = new LogInfo();
    log.configError(ERROR_MESSAGE);

    expect(mockConsoleError).toHaveBeenCalledWith(
      `\n\nERROR!\nPlease, correct the "config.json" file format.\nError message: ${ERROR_MESSAGE}\n\n`
    );
  });
});
