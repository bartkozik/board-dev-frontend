import { Tooltip } from '@mantine/core';
import clsx from 'clsx';
import styles from './NumberAvatar.module.scss';

interface NumberAvatarProps {
  className?: string;
  itemsList: string[];
}

const NumberAvatar = ({ itemsList, className }: NumberAvatarProps): JSX.Element => {
  const tooltipDisplay = (
    <div className={styles.tooltipList}>
      {itemsList.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
  return (
    <Tooltip
      events={{ hover: true, focus: true, touch: false }}
      arrowPosition="side"
      classNames={{ tooltip: styles.tooltip }}
      label={tooltipDisplay}
      position="right"
      offset={{ mainAxis: 14, crossAxis: -17 }}
      multiline
      w={155}
    >
      <div className={clsx(styles.root, className)}>{`+ ${itemsList.length}`}</div>
    </Tooltip>
  );
};

export default NumberAvatar;
