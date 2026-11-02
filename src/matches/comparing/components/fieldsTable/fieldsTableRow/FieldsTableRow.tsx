import { getValueByKeyName } from '@/matches/comparing/utils';
import { Field } from '@/matches/types';
import Table from '@/theme/table';
import { User } from '@/users/types';

interface FieldsTableRow {
  field: Field;
  user?: User;
  withoutFieldLabel?: boolean;
  rowHeights?: Record<string, number>;
}

const FieldsTableRow = ({ field, user, withoutFieldLabel = false, rowHeights }: FieldsTableRow): JSX.Element => {
  const rowId = field.compareId;
  const forcedHeight = rowHeights?.[rowId] ? rowHeights[rowId] : undefined;

  //standard focus area field hidden for Dell users
  const isfocusAreaRowHidden =
    (user?.isConnectedWithDellCompany && field.keyName === 'NonprofitFocusAreas') ||
    (!user?.isConnectedWithDellCompany && field.keyName === 'NonprofitFocusAreasDell');

  if (isfocusAreaRowHidden) return <></>;

  return (
    <Table.Row rowId={rowId} tableRowHeight={forcedHeight}>
      {!withoutFieldLabel && <Table.Cell label="Label">{field.label}</Table.Cell>}
      <Table.Cell label="Value">{getValueByKeyName(field.keyName, user)}</Table.Cell>
    </Table.Row>
  );
};

export default FieldsTableRow;
