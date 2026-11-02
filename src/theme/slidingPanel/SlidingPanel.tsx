import { ReactNode, useRef } from 'react';
import clsx from 'clsx';
import { useOnClickOutside } from '@/utils/hooks';
import { icons } from '../icon';
import IconButton from '../iconButton';
import styles from './SlidingPanel.module.scss';

interface SlidingPanelProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

interface SlidingPanelHeaderProps {
  title: string;
  children?: ReactNode;
}

interface SlidingPanelBodyProps {
  children: ReactNode;
}

function SlidingPanel({ children, isOpen, onClose }: SlidingPanelProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    ref: panelRef,
    handler: onClose,
  });

  return (
    <div className={clsx({ [styles.overlay]: isOpen })}>
      <div className={clsx(styles.slidingPanel, { [styles.open]: isOpen })} ref={panelRef}>
        <div className={styles.actionBtns}>
          <IconButton onClick={onClose} icon={icons.close} className={styles.close} />
        </div>
        {children}
      </div>
    </div>
  );
}

const Header = ({ title, children }: SlidingPanelHeaderProps): JSX.Element => (
  <div className={styles.header}>
    <h3 className={styles.title}>{title}</h3>
    {children}
  </div>
);

const Body = ({ children }: SlidingPanelBodyProps): JSX.Element => <div className={styles.wrapper}>{children}</div>;

SlidingPanel.Header = Header;
SlidingPanel.Body = Body;

export default SlidingPanel;
