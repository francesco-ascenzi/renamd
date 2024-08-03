# RENAMD
Renamd is a small utility tool that rename your .jpg files based on the earliest available creation date found in either EXIF or fs.stat metadata.

## Version 0.2.0
Fix & features:
- If Exif was not found, it keeps going.
- Use modified date if it's lesser than creation date.

### Summary
- [Requirements](#requirements)
- [How to use it](#howtouseit)
- [Funding](#funding)
- [Author](#author)
- [License](#license)

## Requirements
To use this tool, you must have:
- **Node.js** version 18.0.0 or higher.
- **Typescript** version 5.4.5 or higher.
- A **CLI** to execute ```node index.js```.

## How to use it
Open your CLI and navigate to the folder of this tool, then:
- Install tool's dependencies:  

```npm i```

- Build files with:  

```npm run build```

- Start the tool with:  

```node index.js```

- Paste your folder's files path with ```"``` quotation marks as down below:

```"C:\Users\Administrator\Desktop\test"```

- Press "Enter" and it will do all the dirty work for you.

## Funding
If you liked this tool, consider funding it at [@PayPal](https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A) (the link is within package.json too)

## Author
Frash | Francesco Ascenzi ([@fra.ascenzi](https://www.instagram.com/fra.ascenzi) on IG)

# License
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

