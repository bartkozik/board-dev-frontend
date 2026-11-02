import { Link, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { routes } from '@/app/routes';
import DropdownMenu, { DropdownItem } from '@/theme/dropdownMenu';
import Icon, { icons, iconSize } from '@/theme/icon';
import { useUserRoles } from '@/utils/hooks';
import { MenuLink } from '../types';
import styles from './Navbar.module.scss';

const getNonAdminNavbarLinks = (): MenuLink[] => [
  {
    label: 'Dashboard',
    name: 'dashboard',
    to: routes.Dashboard.path(),
  },
];

const getAdminUserNavbarLinks = (): MenuLink[] => [
  {
    label: 'User list',
    name: 'users',
    to: routes.Users.path('list'),
  },
  {
    label: 'Companies',
    name: 'companies',
    to: routes.CorporateClients.path('list'),
  },
  {
    label: 'Matching',
    name: 'matches',
    to: routes.Matches.path('inComparison'),
  },
];

interface LinkComponentProps {
  isSublink?: boolean;
  link: MenuLink;
}

const LinkComponent = ({ isSublink, link }: LinkComponentProps): JSX.Element => {
  const { label, to, icon } = link;
  const location = useLocation();

  return (
    <Link
      to={to}
      className={clsx(location.pathname.includes(link.name) ? styles.linkActive : styles.linkNotActive, {
        [styles.disabled]: link.disabled,
      })}
    >
      {!isSublink && <div className={styles.linkIcon}>{icon}</div>}
      <span>{label}</span>
    </Link>
  );
};

interface NavbarvLinksProps {
  link: MenuLink;
}
const NavbarvLinks = ({ link }: NavbarvLinksProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const mapMenuLinksToDropdownItems = (menuLinks: MenuLink[]): DropdownItem[] => {
    return menuLinks.map((link) => ({
      id: link.name,
      label: link.label,
      to: link.to,
      action: () => {
        navigate(link.to);
      },
    }));
  };

  const linkWithSublinks = link.sublinks && (
    <DropdownMenu
      items={mapMenuLinksToDropdownItems(link.sublinks)}
      className={clsx(
        styles.dropdownLink,
        location.pathname.includes(link.name) ? styles.linkActive : styles.linkNotActive
      )}
      dropdownClassName={styles.dropdownMenu}
      selectActiveFromUrl={location}
    >
      <span className={styles.linkLabel}>
        {link.label}
        <Icon icon={icons.arrowDown} size={iconSize.medium} />
      </span>
    </DropdownMenu>
  );

  return linkWithSublinks || <LinkComponent link={link} />;
};

const Navbar = (): JSX.Element | null => {
  const { isAdmin, isTechLeaderOrNPO } = useUserRoles();

  const navbarLinks = [
    ...(isTechLeaderOrNPO ? getNonAdminNavbarLinks() : []),
    ...(isAdmin ? getAdminUserNavbarLinks() : []),
  ];

  return (
    <div className={styles.root}>
      <ul className={styles.navList}>
        {navbarLinks.map((link) => (
          <li key={link.name} className={styles.link}>
            <NavbarvLinks link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default observer(Navbar);
