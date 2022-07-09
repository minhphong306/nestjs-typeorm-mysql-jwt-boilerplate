export const diffYear = (date1: Date, date2: Date): number => {
  let diff = (date2.getTime() - date1.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  return Math.abs(Math.round(diff / 365.25));
};

export const getDateFromDMYString = (input: string): Date => {
  if (!input) {
    return null;
  }

  // 12/02/2022
  const rawArr = input.split('/');
  const day = parseInt(rawArr[0]);
  const month = parseInt(rawArr[1]);
  const year = parseInt(rawArr[2]);

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
};
