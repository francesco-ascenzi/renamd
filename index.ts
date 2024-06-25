import { exiftool } from 'exiftool-vendored';
import fs from 'fs';
import path from 'path';
import welcomeMessage from './fns/core/welcomeMessage.js';
import prompt from './fns/core/readUserInput.js';

// Main process
(async () => {

  await welcomeMessage();

  let dirPath: string | Error = await prompt('Paste your dir path:\n> ', 8000);
  if (dirPath instanceof Error) {
    console.error('Ciao!');
    return 1;
  }

  dirPath = path.join(dirPath.trim().replace(/"+/gmi, '')); // Convert to the os rules set

  let filesList: string[] = [];
  try {
    filesList = await fs.promises.readdir(dirPath);

    if (filesList.length == 0) throw new Error('No file was found');
  } catch (err: unknown) {
    console.error(err);
    return 1;
  }

  const filesListLength: number = filesList.length;
  for (let i = 0; i < filesListLength; i++) {
    const filePath: string = path.join(dirPath, filesList[i]);

    try {
      const metaData = await exiftool.read(filePath);

      console.log(metaData);
    } catch (err: unknown) {
      console.error(err);
    }
  }

})();