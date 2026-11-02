import { useEffect, useRef, useState } from 'react';
import { Link, Location } from 'react-router-dom';
import clsx from 'clsx';
import { useOnClickOutside } from '@/utils/hooks';
import styles from './DropdownMenu.module.scss';

export interface DropdownItem {
  id: string;
  label: string;
  action?: () => void;
  to?: string;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  children?: JSX.Element;
  className?: string;
  dropdownClassName?: string;
  selectActiveFromUrl?: Location;
}

const DropdownMenu = ({
  items,
  children,
  className,
  dropdownClassName,
  selectActiveFromUrl,
}: DropdownMenuProps): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  useOnClickOutside({ ref, handler: () => setIsMenuOpen(false) });

  useEffect(() => {
    if (selectActiveFromUrl) {
      const activeItem = items.find((item) => item.to && selectActiveFromUrl.pathname.includes(item.to));

      setActiveItemId(activeItem ? activeItem.id : null);
    }
  }, [selectActiveFromUrl?.pathname, items]);

  const onItemClick = (id: string, action?: () => void): void => {
    if (!selectActiveFromUrl) setActiveItemId(id);
    setIsMenuOpen(false);
    action?.();
  };

  const getDropdownItem = ({ id, label, to, action }: DropdownItem): JSX.Element => {
    const isActive = id === activeItemId;
    const itemClass = clsx(styles.item, { [styles.selected]: isActive });

    const handleOnClick = (): void => onItemClick(id, action);

    const linkItem = to && (
      <Link key={id} to={to} className={itemClass} onClick={handleOnClick}>
        {label}
      </Link>
    );

    const item = (
      <li key={id} className={itemClass} onClick={handleOnClick}>
        {label}
      </li>
    );

    return linkItem || item;
  };

  return (
    <div className={clsx(styles.root, className)} ref={ref}>
      <button
        className={clsx(styles.button, { [styles.buttonActive]: isMenuOpen })}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {children}
      </button>
      <div className={clsx(styles.dropdownWrapper, dropdownClassName, { [styles.showDropdown]: isMenuOpen })}>
        <ul className={styles.dropdown}>{items.map((item) => getDropdownItem(item))}</ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
