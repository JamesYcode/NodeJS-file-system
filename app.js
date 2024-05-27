const fs = require('fs/promises');

// * open (32) file descriptor
// * What is a decriptor? It is a unique number that is assigned to the opened file. (basically an id)

// * After open a file, you can read or write.

(async () => {
  // commands

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, 'r');
      existingFileHandle.close();
    } catch (e) {
      const newFileHandle = await fs.open(path, 'w');
      console.log('A new file was successfully created');
      newFileHandle.close();
    }
  };

  const CREATE_FILE = 'create a file';
  const DELETE_FILE = 'delete a file';
  const RENAME_FILE = 'rename a file';
  const ADD_TO_FILE = 'add a file';

  const commandFileHandler = await fs.open('./command.txt', 'r');

  commandFileHandler.on('change', async () => {
    // Get the file size
    const size = (await commandFileHandler.stat()).size;
    // Allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // The location at which we want to start filling our buffer
    const offset = 0;
    // How many bytes we want to read
    const length = buff.byteLength;
    // The position that we want to start reading the file from
    const position = 0;

    // We always want to read the whole content (from beginning all the way to the end)
    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString('utf-8');

    // Create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
  });

  const watcher = fs.watch('./command.txt');

  for await (const ev of watcher) {
    if (ev.eventType === 'change') {
      commandFileHandler.emit('change');
    }
  }
})();

// Decoder will take some data that we can't understand as humans and turn it into something meaningful.
// Encoder does the opposite of decoder.
// * Decoder and Encoder for Node.JS can only understand character decoder and encoder. Need to install third party package for other files such as video or image.
