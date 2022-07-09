export const diffYear = (date1: Date, date2: Date): number => {
  try {
    let diff = (date2.getTime() - date1.getTime()) / 1000;
    diff /= 60 * 60 * 24;
    return Math.abs(Math.round(diff / 365.25));
  } catch (e) {
    return 25;
  }
};

export const getDateFromDMYString = (input: string): Date => {
  if (!input) {
    return null;
  }

  // 12/02/2022
  const rawArr = input.split('-');
  const day = parseInt(rawArr[0]);
  const month = parseInt(rawArr[1]);
  const year = parseInt(rawArr[2]);

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
};

export const getDateString = (inputDate: Date): string => {
  const date = inputDate.getDate();
  const month = inputDate.getMonth() + 1; // take care of the month's number here ⚠️
  const year = inputDate.getFullYear();

  return `${date}/${month}/${year}`;
};
