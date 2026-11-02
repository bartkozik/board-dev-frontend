import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from '@/app/routes';
import { convertFirstLetterToUpperCase } from '@/utils/helpers/convertFirstLetterToUpperCase';
import styles from './Breadcrumbs.module.scss';

export interface BreadcrumbType {
  label: string;
  route?: string;
  param?: string;
}

interface BreadcrumbsProps {
  breadcrumbs?: BreadcrumbType[];
  className?: string;
}

const Breadcrumbs = ({ breadcrumbs: breadcrumbsFromProps, className }: BreadcrumbsProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbsFromUrlLabels: string[] = location.pathname.split('/').slice(1);

  const breadcrumbs: BreadcrumbType[] = breadcrumbsFromProps
    ? breadcrumbsFromProps.map(({ label, route: routeKey, param }) => {
        return { label: `${label} / `, route: routeKey && routes[routeKey].path(param || '') };
      })
    : breadcrumbsFromUrlLabels.map((label, index, arr) => {
        return {
          label: `${convertFirstLetterToUpperCase(label).replace(/-/g, ' ')} / `,
          route: index === arr.length - 1 ? undefined : `/${breadcrumbsFromUrlLabels.slice(0, index + 1).join('/')}/`,
        };
      });

  return (
    <nav className={clsx(styles.root, className)}>
      <ol className={styles.breadcrumbsWrapper}>
        {breadcrumbs.map(({ label, route }, index): JSX.Element => {
          return (
            <li key={label + index} className={styles.breadcrumb}>
              {route ? (
                <div className={clsx(styles.label, styles.withLink)} onClick={() => navigate(route)}>
                  {label}
                </div>
              ) : (
                <div className={styles.label}>{label}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
export default Breadcrumbs;
