import Icon, { icons } from '@/theme/icon';
import styles from './MatchIcon.module.scss';

const MatchIcon = (): JSX.Element => {
  return (
    <div className={styles.root}>
      <Icon icon={icons.matched} />
    </div>
  );
};

export default MatchIcon;