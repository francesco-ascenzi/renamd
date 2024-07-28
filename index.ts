import fs from 'fs';
import path from 'path';
import { isKeyInObject, isObject } from 'vdck';

import welcomeMessage from './lib/core/welcomeMessage.js';
import prompt from './lib/core/readUserInput.js';
import extractEXIF from './lib/extractEXIF.js';
import formatDate from './lib/formatDate.js';

// Main process
(async () => {

  await welcomeMessage();

  // Wait user's input folder path
  let dirPath: string | Error = prompt('Paste your dir path:\n> ', 8000);
  if (dirPath instanceof Error) {
    console.error(`[${new Date().toISOString()}] Error: ${dirPath}`);
    return 1;
  }
  dirPath = path.join(dirPath.trim().replace(/"+/gmi, ''));

  // Retrieve folders and files from the user's input folder path
  let filesList: string[] = [];
  try {
    filesList = await fs.promises.readdir(dirPath);
    if (filesList.length == 0) throw new Error('No file was found');
  } catch (err: unknown) {
    console.error(`[${new Date().toISOString()}] Error:`, err);
    return 1;
  }

  // Initialize map object and start to map folders/files within
  const mapObj: { [key: string]: any } = {};
  const filesListLength: number = filesList.length;
  for (let i = 0; i < filesListLength; i++) {
    const fullPath = path.join(dirPath, filesList[i]);

    try {
      // Element stats
      const elementStats = await fs.promises.stat(fullPath);
      if (await elementStats.isDirectory() && !(filesList[i] in mapObj)) {
        Object.assign(mapObj, { [filesList[i]]: {} });

        // Read subdir
        const folderFiles: string[] = await fs.promises.readdir(fullPath);
        for (let j = 0; j < folderFiles.length; j++) {
          const folderFile = path.join(fullPath, folderFiles[j]);

          if (!(await (await fs.promises.stat(folderFile)).isDirectory())) {
            const subFile = folderFiles[j].split('.')[0];
            if (!(subFile in mapObj[filesList[i]])) {
              Object.assign(mapObj[filesList[i]], { [subFile]: 0 });
            } else if (subFile in mapObj[filesList[i]]) {
              mapObj[filesList[i]][subFile] += 1;
            }      
          }
        }
      }
    } catch (err: unknown) {
      console.error(`[${new Date().toISOString()}] Error: ${err}`);
      return 1;
    }
  }

  // Analyze files and rename them
  for (let i = 0; i < filesListLength; i++) {
    const filePath: string = path.join(dirPath, filesList[i]);

    try {
      if (filesList[i].match(/\.jpg$/gmi)) {
        const fileMetadata = await fs.promises.stat(filePath);
        const fileExif = await extractEXIF(filePath);

        let fileName: string | null = null;

        // Exif
        if (isObject(fileExif, 1) && isKeyInObject(fileExif, 'Photo', 'o', { minLength: 1 })) {
          if (isKeyInObject(fileExif.Photo, 'DateTimeOriginal', 'd')) {
            fileName = formatDate(fileExif.Photo.DateTimeOriginal);
          } else if (isKeyInObject(fileExif.Photo, 'DateTimeDigitized', 'd')) {
            fileName = formatDate(fileExif.Photo.DateTimeDigitized);
          }
        }

        // MetaData
        if (!fileName && isKeyInObject(fileMetadata, 'ctimeMs', 'nf')) {
          fileName = formatDate(new Date(fileMetadata.ctimeMs));
        }

        if (fileName) {
          let dirName = fileName.split('_')[0];

          if (!(dirName in mapObj)) {
            Object.assign(mapObj, { [dirName]: {
              [fileName]: 0
            }});
            await fs.promises.mkdir(path.join(dirPath, dirName));
            await fs.promises.rename(filePath, path.join(dirPath, dirName, `${fileName}.jpg`));
            continue;
          } else if ((dirName in mapObj) && !(fileName in mapObj[dirName])) {
            Object.assign(mapObj[dirName], { [fileName]: 0 });
            await fs.promises.rename(filePath, path.join(dirPath, dirName, `${fileName}.jpg`));
            continue;
          } else if ((dirName in mapObj) && (fileName in mapObj[dirName])) {
            mapObj[dirName][fileName] += 1;
            await fs.promises.rename(filePath, path.join(dirPath, dirName, `${fileName}_${mapObj[dirName][fileName]}.jpg`));
          }
        }
      }
    } catch (err: unknown) {
      console.error(`[${new Date().toISOString()}] Error: ${err}`);
      return 1;
    }
  }

})();