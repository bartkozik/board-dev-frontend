import { Tab } from '@/domain/types';
import { RawUserRole, User } from './types';

export const getFilteredTabs = (tabs: Tab[], user: User | null): Tab[] => {
  const isAdmin = Boolean(user?.roles.includes(RawUserRole.Admin));

  return tabs.filter((tab) => {
    if (!user) return false;
    if (tab.value === 'formPreview' || tab.value === 'trainingMaterials') return !isAdmin;
    if (tab.value === 'summary') return Boolean(user.longFormSummary || user.shortFormSummary);
    return true;
  });
};

export const getUserName = (user: User | null): string => {
  if (!user) return '';
  const { primaryContactFullName, name } = user;
  const contactName = primaryContactFullName ? ` - ${primaryContactFullName}` : '';
  return name + contactName;
};
