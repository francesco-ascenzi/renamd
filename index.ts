import fs from 'fs';
import path from 'path';
import welcomeMessage from './fns/core/welcomeMessage.js';
import prompt from './fns/core/readUserInput.js';
import extractEXIF from './fns/extractEXIF.js';

// Constants and variables
const errorLine = '\x1b[31m> Error:\x1b[0m';

// Main process
(async () => {

  await welcomeMessage();

  // let dirPath: string | Error = prompt('Paste your dir path:\n> ', 8000);
  // if (dirPath instanceof Error) {
  //   console.error(errorLine, dirPath);
  //   return 1;
  // }

  // DA ELIMINARE
  let dirPath = "C:\\Users\\Admin\\Pictures\\Wallpapers";

  dirPath = path.join(dirPath.trim().replace(/"+/gmi, '')); // Convert based on os path format rules set

  let filesList: string[] = [];
  try {
    filesList = await fs.promises.readdir(dirPath);

    if (filesList.length == 0) throw new Error('No file was found');
  } catch (err: unknown) {
    console.error(errorLine, err);
    return 1;
  }

  const filesListLength: number = filesList.length;
  for (let i = 0; i < filesListLength; i++) {
    const filePath: string = path.join(dirPath, filesList[i]);

    try {
      if (filePath.match(/\.jpg$/gmi)) {
        console.log(`${filesList[i]}:\n`);
        await extractEXIF(filePath);
      }
    } catch (err: unknown) {
      console.error(errorLine, err);
      return 1;
    }
  }

})();