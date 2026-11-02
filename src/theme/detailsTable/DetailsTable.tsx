import React from 'react';
import clsx from 'clsx';
import Table from '@/theme/table';
import InfoBar, { InfoBarProps } from '../infoBar';
import TableLayout from '../tableLayout';
import styles from './DetailsTable.module.scss';

const getInfoBarContent = (isIncompleteData: boolean, lastDataModification?: string): InfoBarProps | null => {
  if (isIncompleteData) return { message: 'Incomplete', variant: 'warning' };
  else if (lastDataModification) return { message: `Last updated at: ${lastDataModification}`, variant: 'info' };
  return null;
};

export interface Detail {
  label: string;
  value: string | React.JSX.Element;
}

interface DetailsTableProps {
  details: Detail[];
  className?: string;
  tableClassName?: string;
  loading?: boolean;
  isIncompleteData?: boolean;
  lastDataModification?: string;
}

const DetailsTable = ({
  details,
  className,
  tableClassName,
  loading = false,
  isIncompleteData = false,
  lastDataModification,
}: DetailsTableProps): React.JSX.Element => {
  const infoBarContent = getInfoBarContent(isIncompleteData, lastDataModification);

  return (
    <TableLayout loadingContent={loading} className={clsx(styles.root, className)}>
      {infoBarContent && <InfoBar {...infoBarContent} />}
      <Table className={clsx(styles.table, tableClassName)}>
        <Table.Body>
          {details.map((detail, index) => (
            <Table.Row key={index}>
              <Table.Cell label="Label">{detail.label}</Table.Cell>
              <Table.Cell label="Value">{detail.value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableLayout>
  );
};

export default DetailsTable;
