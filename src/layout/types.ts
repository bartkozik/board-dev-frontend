export interface MenuLink {
  disabled?: boolean;
  icon?: React.ReactNode;
  label: string;
  name: string;
  to: string;
  sublinks?: MenuLink[];
}
