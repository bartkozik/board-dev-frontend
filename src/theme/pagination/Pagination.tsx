import clsx from 'clsx';
import { DEFAULT_PAGE_SIZE } from '@/domain/constants';
import Icon, { icons } from '../icon';
import styles from './Pagination.module.scss';

interface PaginationSummaryProps {
  activePage: number;
  allItemsCount: number;
  itemsPerPage: number;
}
interface PaginationButtonsProps {
  onChange: (page: number) => void;
  pages: number;
  range: number;
  activePage: number;
}

export interface PaginationProps {
  pages: number;
  activePage: number;
  allItemsCount: number;
  itemsPerPage?: number;
  range?: number;
  onChangeActivePage: (page: number) => void;
}

const PaginationSummary = ({ itemsPerPage, activePage, allItemsCount }: PaginationSummaryProps): React.JSX.Element => {
  const firstItemIndex = (activePage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(activePage * itemsPerPage, allItemsCount);

  return (
    <div className={styles.summary}>
      {firstItemIndex} - {lastItemIndex} <span className={styles.text}>of </span>
      {allItemsCount} <span className={styles.text}>records</span>
    </div>
  );
};

const PaginationButtons = ({ onChange, activePage, pages, range }: PaginationButtonsProps): React.JSX.Element => {
  const pageRange = range < pages ? range : pages;
  const side = Math.floor(pageRange / 2);
  const startPage = activePage - side < 1 ? 1 : activePage > pages - side ? pages - pageRange + 1 : activePage - side;
  const visiblePages = Array.from({ length: pageRange }, (_, i) => i + startPage);

  const backButton = (
    <button onClick={() => onChange(activePage - 1)} disabled={activePage === 1} className={styles.arrowBtn}>
      <Icon icon={icons.back} />
    </button>
  );

  const firstPageButton = !visiblePages.includes(1) && visiblePages[0] - 1 > 1 && (
    <button onClick={() => onChange(1)} className={styles.pageBtn}>
      1
    </button>
  );

  const previousPagesButton = visiblePages[0] >= range - 1 && (
    <button onClick={() => onChange(startPage - 1)} className={styles.pageBtn}>
      ...
    </button>
  );

  const furtherPagesButton = !visiblePages.includes(pages) && (
    <button onClick={() => onChange(startPage + pageRange + 1)} className={styles.pageBtn}>
      ...
    </button>
  );

  const lastPageButton = !visiblePages.includes(pages) && (
    <button onClick={() => onChange(pages)} className={styles.pageBtn}>
      {pages}
    </button>
  );

  const nextButton = (
    <button onClick={() => onChange(activePage + 1)} disabled={activePage === pages} className={styles.arrowBtn}>
      <Icon icon={icons.back} className={styles.nextPage} />
    </button>
  );

  return (
    <div className={styles.buttons}>
      {backButton}
      {firstPageButton}
      {previousPagesButton}
      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(styles.pageBtn, { [styles.active]: p === activePage })}
        >
          {p}
        </button>
      ))}
      {furtherPagesButton}
      {lastPageButton}
      {nextButton}
    </div>
  );
};

const Pagination = ({
  pages,
  activePage,
  range = 3,
  allItemsCount,
  itemsPerPage = DEFAULT_PAGE_SIZE,
  onChangeActivePage,
}: PaginationProps): React.JSX.Element => {
  return (
    <div className={styles.root}>
      <PaginationSummary allItemsCount={allItemsCount} activePage={activePage} itemsPerPage={itemsPerPage} />
      {pages > 1 && (
        <PaginationButtons onChange={onChangeActivePage} pages={pages} range={range} activePage={activePage} />
      )}
    </div>
  );
};

export default Pagination;
