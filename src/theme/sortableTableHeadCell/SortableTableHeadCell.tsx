import React from 'react';
import clsx from 'clsx';
import { SortColumn, SortDirection } from '@/domain/sorting';
import Icon, { icons } from '../icon/Icon';
import styles from './SortableTableHeadCell.module.scss';

interface TriangleIconProps {
  className: string;
}

const TriangleIcon = ({ className }: TriangleIconProps): JSX.Element => (
  <Icon icon={icons.triangle} className={className} />
);

interface SortableTableHeadCellProps<T> {
  column: T;
  icon?: React.ReactNode;
  sortColumn: T;
  sortDirection: SortDirection;
  updateSort: (column: T) => void;
}

const SortableTableHeadCell = <T extends SortColumn>({
  column,
  icon,
  sortColumn,
  sortDirection,
  updateSort,
}: SortableTableHeadCellProps<T>): JSX.Element => {
  const isCurrentColumn = sortColumn === column;
  const isFlipped = sortDirection === SortDirection.Asc;

  const renderArrows = (): JSX.Element => {
    const activeColumn = <TriangleIcon className={clsx(styles.triangle, { [styles.flipped]: isFlipped })} />;
    const inactiveColumn = (
      <>
        <TriangleIcon className={clsx(styles.triangle, styles.flipped)} />
        <TriangleIcon className={styles.triangle} />
      </>
    );

    return isCurrentColumn ? activeColumn : inactiveColumn;
  };

  return (
    <th className={styles.root} data-th={column} onClick={() => updateSort && updateSort(column)}>
      <div className={styles.header}>
        {column}
        <div className={styles.icon}>{icon}</div>
        <div className={styles.triangleContainer}>{renderArrows()}</div>
      </div>
    </th>
  );
};

export default SortableTableHeadCell;
