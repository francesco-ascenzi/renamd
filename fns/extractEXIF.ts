// Ex: "C:\\Users\\Admin\\Pictures\\Wallpapers"
import fs from 'fs';

interface exifData {
  ok: boolean
}

function formatEXIF(exifChunk: Buffer): exifData | Error {

  console.log(exifChunk.toString('utf8'))

  return {
    ok: true
  };
}

/** Extract EXIF from .jpg file
 * 
 * @param {string} filePath - File path
 * @returns {Promise<any>}
 */
export default async function extractEXIF(filePath: string): Promise<exifData | Error> {
  try {
    const readStream: fs.ReadStream = fs.createReadStream(filePath);

    // Hold variables
    let bufferChunk: Buffer = Buffer.alloc(0);
    let remainingDataLength = 0;

    // If 0xFF is in one chunk and the 0xE1 is in another one | halfIndex == 0: full, 1: without 0xE1, 2: without EXIF length marker
    let halfIndex: number = 0;

    // For await readStream and process data
    for await (const chunk of readStream) {
      const chunkLength: number = chunk.length - 1;
      let startIndex = chunk.indexOf(0xFF);

      // If the chunk is not a complete EXIF segment
      if (remainingDataLength > 0) {


        if (halfIndex == 0) {

          // Add the remaining buffer data to the buffer
          if (remainingDataLength > chunkLength) {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, chunkLength)]);
            remainingDataLength = remainingDataLength - chunkLength;
          } else {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, remainingDataLength)]);
            remainingDataLength = 0;
          }

        } else if (halfIndex == 1 && chunk[0] == 0xE1) {

          startIndex = 0

        } else if (halfIndex == 2) {

          startIndex = 0

          // Check EXIF length
          let lengthMarker: number = chunk.readUInt16BE(0);

          if ((2 + lengthMarker) > chunkLength) {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, chunkLength)]);
            remainingDataLength = (0 + lengthMarker) - chunkLength;
          } else {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, lengthMarker)]);
          }

        } 

      // Search for the EXIF segment
      } else {

        while (startIndex != -1) {

          // APP1 segment | 0xFFE1
          if (chunk[startIndex + 1] == 0xE1) {

            // If marker length is in the next chunk
            if ((startIndex + 2) > chunkLength) {
              bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, startIndex + 1)]);
              remainingDataLength = 2;

              halfIndex = 2;
              break;

            } else {

              // Check EXIF length
              let lengthMarker: number = chunk.readUInt16BE(startIndex + 2);

              if ((startIndex + 2 + lengthMarker) > chunkLength) {
                bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, chunkLength)]);
                remainingDataLength = (startIndex + 2 + lengthMarker) - chunkLength;

                break;
              } else {
                bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, (startIndex + lengthMarker))]);
              }

            }

          // APP1 was cutted and it resides in the next chunk
          } else if ((startIndex + 1) > chunkLength) {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex)]);
            remainingDataLength = 1;

            halfIndex = 1;
            break;

          }
          
          startIndex = chunk.indexOf(0xFF, startIndex + 1);

        }

      }
    }

    // Try to format EXIF data
    const formattedEXIF = formatEXIF(bufferChunk);
    if (formattedEXIF instanceof Error) throw new Error(String(formattedEXIF));

    return formattedEXIF;
  } catch (err: unknown) {
    return new Error(String(err));
  }
}