import Chip from '@/theme/chip';
import { RawUserRole } from '@/users/types';

interface PublicChipProps {
  role: RawUserRole;
}

const PublicChip = ({ role }: PublicChipProps): JSX.Element => {
  const isAdmin = ![RawUserRole.NPO, RawUserRole.TechLeader].includes(role);

  if (isAdmin) return <></>;

  return <Chip label="Public" variant="regular" />;
};

export default PublicChip;
