import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Tab } from '@/domain/types';
import styles from './Tabs.module.scss';

type TabsProps = {
  className?: string;
  onTabClick?: (tab: Tab) => void;
  tabs: Tab[];
  tabsSize?: 'small' | 'regular';
};

const Tabs = ({ className, onTabClick, tabs, tabsSize = 'small' }: TabsProps): JSX.Element => {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const handleTabClick = (tab: Tab): void => {
    onTabClick?.(tab);
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab(tabs.find(({ value }) => value === tab) || tabs[0]);
  }, [tab]);

  return (
    <div className={clsx(styles.root, className)}>
      <div className={clsx(styles.detailsOptions, styles[tabsSize])}>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={clsx(styles.headline, { [styles.selected]: activeTab?.value === tab.value })}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {<div className={styles.content}>{activeTab?.element}</div>}
    </div>
  );
};

export default Tabs;
