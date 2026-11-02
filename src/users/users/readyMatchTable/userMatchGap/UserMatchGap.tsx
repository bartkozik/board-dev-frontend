import clsx from 'clsx';
import { MatchWaitingTime } from '@/users/types';
import styles from './UserMatchGap.module.scss';

const MAX_DOTS_RENDER = 5;

interface UserMatchGapProps {
  matchGap?: MatchWaitingTime;
}

const UserMatchGap = ({ matchGap }: UserMatchGapProps): JSX.Element | null => {
  if (!matchGap) return null;

  const { quantity, quantityType } = matchGap;

  const dots = Array(Math.min(quantity, 5))
    .fill(null)
    .map((_, index) => (
      <div key={index} className={clsx(styles.dot, { [styles.redDot]: quantity > MAX_DOTS_RENDER })} />
    ));

  const quantityByDays = quantityType === 'days' && (
    <span>
      {quantity} {quantity === 1 ? 'day' : 'days'}
    </span>
  );

  const quantityByWeeks = quantityType === 'weeks' && (
    <div className={styles.weeksContainer}>
      <div className={styles.dots}>{dots}</div>
      <span>
        {quantity} {quantity === 1 ? 'week' : 'weeks'}
      </span>
    </div>
  );

  return <div className={styles.root}>{quantityByDays || quantityByWeeks}</div>;
};

export default UserMatchGap;
