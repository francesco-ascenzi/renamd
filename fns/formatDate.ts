export default function formatDate(originalDate: Date) {
  // Calcola l'offset dell'ora italiana (CET/CEST)
  const isDaylightSavingTime = (date: Date) => {
    const january = new Date(date.getFullYear(), 0, 1);
    const july = new Date(date.getFullYear(), 6, 1);
    const stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
    return date.getTimezoneOffset() < stdTimezoneOffset;
  };

  const offset = isDaylightSavingTime(originalDate) ? 2 : 1;

  // Aggiungi l'offset per ottenere l'ora italiana
  const italianDate = new Date(originalDate.getTime() + offset * 60 * 60 * 1000);

  // Formatta la data e l'ora
  const year: string = String(italianDate.getUTCFullYear());
  const month: string = String(italianDate.getUTCMonth() + 1).padStart(2, '0');
  const day: string = String(italianDate.getUTCDate()).padStart(2, '0');

  const hour: string = String(italianDate.getUTCHours()).padStart(2, '0');
  const minutes: string = String(italianDate.getUTCMinutes()).padStart(2, '0');
  const seconds: string = String(italianDate.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}_${hour}${minutes}${seconds}`;
}