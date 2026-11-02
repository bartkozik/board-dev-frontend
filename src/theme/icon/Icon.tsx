import { FunctionComponent, SVGProps } from 'react';
import AddUserIcon from '@/theme/assets/svg/add-user.svg?react';
import AddIcon from '@/theme/assets/svg/add.svg?react';
import ArrowDownIcon from '@/theme/assets/svg/arrowDown.svg?react';
import Back from '@/theme/assets/svg/arrowLeft.svg?react';
import BlockIcon from '@/theme/assets/svg/block.svg?react';
import CheckmarkIcon from '@/theme/assets/svg/checkmark.svg?react';
import Close from '@/theme/assets/svg/close.svg?react';
import CorporateIcon from '@/theme/assets/svg/corp.svg?react';
import DotsIcon from '@/theme/assets/svg/dots.svg?react';
import Dropdown from '@/theme/assets/svg/dropdown.svg?react';
import ExclamationMark from '@/theme/assets/svg/exclamation-mark.svg?react';
import ExternalIcon from '@/theme/assets/svg/external.svg?react';
import FilterIcon from '@/theme/assets/svg/filter.svg?react';
import SearchIcon from '@/theme/assets/svg/magnifier.svg?react';
import MatchIcon from '@/theme/assets/svg/match.svg?react';
import MatchedIcon from '@/theme/assets/svg/matched.svg?react';
import NotActiveIcon from '@/theme/assets/svg/not-active.svg?react';
import PencilIcon from '@/theme/assets/svg/pencil.svg?react';
import RefreshIcon from '@/theme/assets/svg/refresh.svg?react';
import Sad from '@/theme/assets/svg/sad.svg?react';
import TableIcon from '@/theme/assets/svg/table.svg?react';
import Tick from '@/theme/assets/svg/tick.svg?react';
import RemoveIcon from '@/theme/assets/svg/trash.svg?react';
import TriangleIcon from '@/theme/assets/svg/triangle-icon.svg?react';
import UserIcon from '@/theme/assets/svg/user.svg?react';

export const icons = {
  addUser: AddUserIcon,
  arrowDown: ArrowDownIcon,
  back: Back,
  block: BlockIcon,
  checkmark: CheckmarkIcon,
  close: Close,
  corporate: CorporateIcon,
  dots: DotsIcon,
  dropdown: Dropdown,
  exclamationMark: ExclamationMark,
  match: MatchIcon,
  matched: MatchedIcon,
  notActive: NotActiveIcon,
  pencil: PencilIcon,
  refresh: RefreshIcon,
  remove: RemoveIcon,
  sad: Sad,
  search: SearchIcon,
  tick: Tick,
  triangle: TriangleIcon,
  user: UserIcon,
  add: AddIcon,
  external: ExternalIcon,
  table: TableIcon,
  filter: FilterIcon,
};

export const iconSize = {
  small: {
    width: 20,
    height: 20,
  },
  medium: {
    width: 24,
    height: 24,
  },
  large: {
    width: 36,
    height: 36,
  },
};

interface IconProps {
  ariaLabel?: string;
  className?: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  size?: (typeof iconSize)[keyof typeof iconSize];
}

const Icon = ({ ariaLabel, className, icon, size = iconSize.small }: IconProps): JSX.Element => {
  const Component = icon;
  return <Component height={size.height} className={className} width={size.width} aria-label={ariaLabel} />;
};

export default Icon;
