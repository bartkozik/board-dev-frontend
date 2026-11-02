import { Field } from '@/matches/types';
import Table from '@/theme/table';
import { User } from '@/users/types';
import FieldsTableRow from './fieldsTableRow';

interface FieldsTableProps {
  fields: Field[];
  user?: User;
  className?: string;
  withoutFieldLabel?: boolean;
  rowHeights?: Record<string, number>;
}

const FieldsTable = ({
  fields = [],
  user,
  className,
  withoutFieldLabel = false,
  rowHeights,
}: FieldsTableProps): JSX.Element | null => {
  if (!fields) return null;

  return (
    <Table className={className}>
      <Table.Body>
        {fields.map((field, index) => (
          <FieldsTableRow
            key={`${field.keyName}-${index}`}
            field={field}
            user={user}
            withoutFieldLabel={withoutFieldLabel}
            rowHeights={rowHeights}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

export default FieldsTable;
