import dayjs from 'dayjs';

export const DATE_FORMAT = {
  DEFAULT: 'DD/MM/YYYY',
  FULL: 'DD MMMM YYYY',
};

export const formatDate = (date: string | Date, format = DATE_FORMAT.DEFAULT): string => {
  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format(format) : '';
};
