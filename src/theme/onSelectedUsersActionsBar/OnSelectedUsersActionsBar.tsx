import React, { ReactNode } from 'react';
import BottomActionBar from '../bottomActionBar';
import Button from '../button/Button';
import styles from './OnSelectedUsersActionsBar.module.scss';

interface OnSelectedUsersActionsBarProps {
  selectedCount: number;
  onDeselect: () => void;
  children: ReactNode;
}

const OnSelectedUsersActionsBar = ({
  selectedCount,
  onDeselect,
  children,
}: OnSelectedUsersActionsBarProps): JSX.Element => {
  return (
    <BottomActionBar isVisible={selectedCount > 0} className={styles.root}>
      <p className={styles.selectedUsersInfo}>
        <span>{selectedCount}</span>
        <span>selected</span>
        <Button onClick={onDeselect} variant="text" text="deselect" className={styles.deselect} />
      </p>
      <div className={styles.actions}>{children}</div>
    </BottomActionBar>
  );
};

export default OnSelectedUsersActionsBar;
