/** Format date to a yyymmdd_hhmmss string
 * 
 * @param {Date} originalDate - Original date
 * @returns {string}
 * 
 * @author Frash | Francesco Ascenzi
 * @fund https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A
 * @license Apache 2.0
 */
export default function formatDate(originalDate: Date) {
  const year: string = String(originalDate.getUTCFullYear());
  const month: string = String(originalDate.getUTCMonth() + 1).padStart(2, '0');
  const day: string = String(originalDate.getUTCDate()).padStart(2, '0');

  const hour: string = String(originalDate.getUTCHours()).padStart(2, '0');
  const minutes: string = String(originalDate.getUTCMinutes()).padStart(2, '0');
  const seconds: string = String(originalDate.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}_${hour}${minutes}${seconds}`;
}