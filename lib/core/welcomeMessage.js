// Constants and variables
const subTitle = '\n\n' +
    'Renamd is a tool to organize your files into datetime renamed folders\n' +
    `\x1b[30m@author: Frash | Francesco Ascenzi\x1b[0m\n\n`;
/** Prints out the welcome message
 *
 * @return {Promise<void>}
 *
 * @author Frash | Francesco Ascenzi
 * @fund https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A
 * @license Apache 2.0
 */
export default async function welcomeMessage() {
    await new Promise(resolve => setTimeout(resolve, 150));
    process.stdout.write('\x1Bc');
    console.info(` @@@@@@@  @@@@@@@@ @@@  @@@  @@@@@@  @@@@@@@@@@  @@@@@@@ \n`);
    await new Promise(resolve => setTimeout(resolve, 150));
    process.stdout.write('\x1Bc');
    console.info(` @@@@@@@  @@@@@@@@ @@@  @@@  @@@@@@  @@@@@@@@@@  @@@@@@@ \n` +
        ` @@!  @@@ @@!      @@!@!@@@ @@!  @@@ @@! @@! @@! @@!  @@@ \n`);
    await new Promise(resolve => setTimeout(resolve, 150));
    process.stdout.write('\x1Bc');
    console.info(` @@@@@@@  @@@@@@@@ @@@  @@@  @@@@@@  @@@@@@@@@@  @@@@@@@ \n` +
        ` @@!  @@@ @@!      @@!@!@@@ @@!  @@@ @@! @@! @@! @@!  @@@ \n` +
        `\x1b[30m @!@!!@!  @!!!:!   @!@@!!@! @!@!@!@! @!! @!@  !@! \x1b[0m\n`);
    await new Promise(resolve => setTimeout(resolve, 150));
    process.stdout.write('\x1Bc');
    console.info(` @@@@@@@  @@@@@@@@ @@@  @@@  @@@@@@  @@@@@@@@@@  @@@@@@@ \n` +
        ` @@!  @@@ @@!      @@!@!@@@ @@!  @@@ @@! @@! @@! @@!  @@@ \n` +
        `\x1b[30m @!@!!@!  @!!!:!   @!@@!!@! @!@!@!@! @!! !!!:!   @!@  !@! \n` +
        ` !!: :!!  !!:      !!:  !!! !!:  !!! !!:     !!: !!:  !!! \x1b[0m\n`);
    await new Promise(resolve => setTimeout(resolve, 150));
    process.stdout.write('\x1Bc');
    console.info(` @@@@@@@  @@@@@@@@ @@@  @@@  @@@@@@  @@@@@@@@@@  @@@@@@@ \n` +
        ` @@!  @@@ @@!      @@!@!@@@ @@!  @@@ @@! @@! @@! @@!  @@@ \n` +
        `\x1b[30m @!@!!@!  @!!!:!   @!@@!!@! @!@!@!@! @!! !!!:!   @!@  !@! \n` +
        ` !!: :!!  !!:      !!:  !!! !!:  !!! !!:     !!: !!:  !!! \n` +
        ` :   : : : :: ::: ::    :   :   : :  :      :   :: :  :   \x1b[0m`);
    await new Promise(resolve => setTimeout(resolve, 150));
    console.info(subTitle);
}
