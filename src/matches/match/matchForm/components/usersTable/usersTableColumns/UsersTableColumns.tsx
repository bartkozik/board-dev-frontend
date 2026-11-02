import { SortColumn, SortDirection } from '@/domain/sorting';
import SortableTableHeadCell from '@/theme/sortableTableHeadCell';
import { NonAdminUserRole, RawUserRole } from '@/users/types';
import { USER_ROLE_FIELD_MAPPINGS } from '../columnsConfig';

interface UsersTableColumnsProps {
  role: NonAdminUserRole;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  updateSort: (column: SortColumn) => void;
}

const UsersTableColumns = ({ role, sortColumn, sortDirection, updateSort }: UsersTableColumnsProps): JSX.Element => {
  const sortColumnNameFromRole = role === RawUserRole.NPO ? SortColumn.NonProfit : SortColumn.TechLeader;

  return (
    <>
      {USER_ROLE_FIELD_MAPPINGS[role].map((column, index, columns) => {
        if (index === columns.length - 1) {
          return <th key={column.label} data-th="Action"></th>;
        }
        return (
          <SortableTableHeadCell
            key={column.label + role}
            column={(column.label as SortColumn) || sortColumnNameFromRole}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            updateSort={updateSort}
          />
        );
      })}
    </>
  );
};

export default UsersTableColumns;
