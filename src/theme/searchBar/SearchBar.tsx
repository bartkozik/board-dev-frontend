import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import Button from '@/theme/button';
import Input from '@/theme/input';
import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
  withoutButtonInMobileView?: boolean;
}

const SearchBar = ({ className, placeholder, withoutButtonInMobileView }: SearchBarProps): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPhrase = searchParams.get('phrase') || '';
  const [localQuery, setLocalQuery] = useState(initialPhrase);
  const [searchQuery, setSearchQuery] = useState(initialPhrase);

  useEffect(() => {
    setSearchParams((params) => {
      searchQuery ? params.set('phrase', searchQuery) : params.delete('phrase');
      return params;
    });
  }, [searchQuery]);

  useEffect(() => {
    const phraseFromUrl = searchParams.get('phrase') || '';
    if (phraseFromUrl !== searchQuery) {
      setLocalQuery(phraseFromUrl);
      setSearchQuery(phraseFromUrl);
    }
  }, [searchParams]);

  const noLocalQuery = localQuery === '';

  useEffect(() => {
    if (noLocalQuery) {
      setSearchParams((params) => {
        params.delete('phrase');
        return params;
      });
    }
  }, [localQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLocalQuery(event.target.value);
  };

  const handleSearchOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchClick();
    }
  };

  const handleSearchClick = (): void => {
    setSearchParams((params) => {
      if (localQuery === '') params.delete('phrase');
      else params.set('phrase', localQuery);

      return params;
    });
  };

  const handleInputReset = (): void => {
    setLocalQuery('');
    setSearchQuery('');
    setSearchParams((params) => {
      params.delete('phrase');
      return params;
    });
  };

  return (
    <div className={clsx(styles.root, className)}>
      <Input
        className={clsx(styles.searchInput, { [styles.maxWidthInput]: withoutButtonInMobileView })}
        name="Search"
        onChange={handleInputChange}
        onReset={handleInputReset}
        onKeyDown={handleSearchOnKeyDown}
        placeholder={placeholder || 'Search...'}
        type="search"
        value={localQuery}
      />
      <Button
        className={clsx({ [styles.withoutButtonInMobileView]: withoutButtonInMobileView })}
        text="Search"
        variant="secondary"
        onClick={handleSearchClick}
        disabled={localQuery === ''}
      />
    </div>
  );
};

export default SearchBar;
