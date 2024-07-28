import fs from 'fs';
import exif from 'exif-reader';

/** Extract EXIF from .jpg file
 * 
 * @param {string} filePath - File path
 * @returns {Promise<any | Error>}
 * 
 * @author Frash | Francesco Ascenzi
 * @fund https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A
 * @license Apache 2.0
 */
export default async function extractEXIF(filePath: string): Promise<any> {

  // Initialize buffer chunk hold
  let bufferChunk: Buffer = Buffer.alloc(0);

  try {
    // Initialize read stream
    const readStream: fs.ReadStream = fs.createReadStream(filePath);

    let remainingDataLength = 0;
    let searchNextChunk: number = -1; // searchNextChunk == 0: full, 1: without 0xE1, 2: without EXIF length marker

    // For await the read stream and process data
    for await (const chunk of readStream) {
      const chunkLength: number = chunk.length;
      let startIndex = chunk.indexOf(0xFF);

      // If the chunk is not a complete EXIF segment
      if (searchNextChunk != -1) {
        if (searchNextChunk == 0) {
          if (chunk[0] == 0xE1) {

            // Check EXIF length
            let lengthMarker: number = chunk.readUInt16BE(1);

            // Retrieve remaining data from the next chunk
            if ((lengthMarker + 2) > chunkLength) {
              bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, chunkLength)]);
              remainingDataLength = (lengthMarker + 2) - chunkLength;
              searchNextChunk = 2;
              continue;
            // Add to the bufferChunk and keep going
            } else {
              bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, lengthMarker)]);
            }
          } else {
            bufferChunk = Buffer.concat([]);
          }
        } else if (searchNextChunk == 1) {
          // Check EXIF length
          let lengthMarker: number = chunk.readUInt16BE(0);

          // Retrieve remaining data from the next chunk
          if ((lengthMarker + 1) > chunkLength) {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, chunkLength)]);
            remainingDataLength = (lengthMarker + 1) - chunkLength;
            searchNextChunk = 2;
            continue;
          // Add to the bufferChunk and keep going
          } else {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, lengthMarker)]);
          }
        } else if (searchNextChunk == 2) {
          // Retrieve remaining data from the next chunk
          if (remainingDataLength > chunkLength) {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, chunkLength)]);
            remainingDataLength = remainingDataLength - chunkLength;
            searchNextChunk = 2;
            continue;
          // Add to the bufferChunk and keep going
          } else {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(0, remainingDataLength)]);
          }
        }
      }

      // Search for the EXIF segment
      while (startIndex != -1) {

        // Search in the next chunk
        if (chunk[startIndex + 1] > chunkLength) {
          bufferChunk = Buffer.concat([bufferChunk, Buffer.from([chunk[startIndex]])]);
          searchNextChunk = 0;
          break;
        // APP1 segment | 0xFFE1
        } else if (chunk[startIndex + 1] == 0xE1) {
          if (chunk[startIndex + 2] > chunkLength) {
            bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, chunkLength)]);
            searchNextChunk = 1;
          } else {
            // Check EXIF length
            let lengthMarker: number = chunk.readUInt16BE(startIndex + 2);

            // Retrieve remaining data from the next chunk
            if ((startIndex + 2 + lengthMarker) > chunkLength) {
              bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, chunkLength)]);
              remainingDataLength = (startIndex + 2 + lengthMarker) - chunkLength;
              searchNextChunk = 2;
              break;
            // Add to the bufferChunk and keep going
            } else {
              bufferChunk = Buffer.concat([bufferChunk, chunk.slice(startIndex, (startIndex + lengthMarker))]);
            }
          }
        }

        // Keep searching
        startIndex = chunk.indexOf(0xFF, (startIndex + 1));
      }
    }
  } catch (err: unknown) {
    console.error(err);
    throw new Error(String(err));
  }

  // Slice buffer chunk to the "Exif"
  bufferChunk = bufferChunk.slice(bufferChunk.toString('ascii').indexOf('Exif'));

  // Format Exif
  const exifData: any = (exif as any)(bufferChunk);

  if (exifData instanceof Error) {
    throw new Error(String(exifData));
  }

  // Return
  return exifData;
}