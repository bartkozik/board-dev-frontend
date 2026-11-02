import dayjs from 'dayjs';
import { MatchWaitingTime } from '@/users/types';

export const getWaitingForMatchTime = (createdAt: string, hasMatch: boolean): MatchWaitingTime => {
  if (hasMatch) return { quantity: 0, quantityType: 'days' };

  const now = dayjs();
  const createdDate = dayjs(createdAt);
  const days = now.diff(createdDate, 'day');

  if (days <= 7) return { quantity: days, quantityType: 'days' };
  else {
    const weeks = Math.floor(days / 7);
    return { quantity: weeks, quantityType: 'weeks' };
  }
};
