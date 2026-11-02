import { ReactNode } from 'react';
import clsx from 'clsx';
import { heightToPx } from '@/utils/helpers';
import styles from './Table.module.scss';

interface TableProps {
  children: ReactNode;
  className?: string;
}

const Table = ({ children, className }: TableProps): JSX.Element => {
  return <table className={clsx('table', className)}>{children}</table>;
};

interface HeaderProps {
  children?: ReactNode;
  columnNames?: string[];
  className?: string;
}

const Header = ({ children, columnNames, className }: HeaderProps): JSX.Element => {
  return (
    <thead className={className}>
      <tr>
        {children}
        {columnNames && columnNames.map((name) => <th key={name}>{name}</th>)}
      </tr>
    </thead>
  );
};

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body = ({ children, className }: BodyProps): JSX.Element => {
  return <tbody className={className}>{children}</tbody>;
};

interface RowProps {
  onClick?: () => void;
  children?: ReactNode | ReactNode[];
  className?: string;
  tableRowHeight?: number | string;
  rowId?: string;
}

const Row = ({ children, onClick, className = '', tableRowHeight, rowId }: RowProps): JSX.Element => {
  const forced = heightToPx(tableRowHeight);
  return (
    <tr
      tabIndex={0}
      onClick={onClick}
      className={clsx(className, styles.forcedRowHeight, {
        [styles.clickableRow]: onClick,
      })}
      data-row-id={rowId}
      style={{ '--forced-height': forced } as React.CSSProperties}
    >
      {children}
    </tr>
  );
};

interface CellProps extends TableProps {
  label: string;
}

const Cell = ({ children, label }: CellProps): JSX.Element => {
  return <td data-label={label}>{children}</td>;
};

interface SpacerProps {
  className?: string;
}

const Spacer = ({ className }: SpacerProps): JSX.Element => {
  return (
    <tbody className={clsx(styles.spacer, className)} aria-hidden="true">
      <tr />
    </tbody>
  );
};

interface NoItemsProps {
  noItemsFound: boolean;
  text: string;
  colSpan?: number;
}

const NoItems = ({ noItemsFound, text, colSpan = 4 }: NoItemsProps): JSX.Element => {
  if (!noItemsFound) return <></>;
  return (
    <Table.Row>
      <td colSpan={colSpan} className={styles.noItems}>
        <div>{text}</div>
      </td>
    </Table.Row>
  );
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
Table.Spacer = Spacer;
Table.NoItems = NoItems;

export default Table;
