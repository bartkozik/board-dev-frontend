import clsx from 'clsx';
import { UrlInfo } from '@/users/types';
import Button from '../button';
import Icon, { icons } from '../icon';
import MarkdownOverlay from '../markdownOverlay';
import styles from './SummaryPreview.module.scss';

interface SummaryPreviewProps {
  className?: string;
  long: string;
  short: string;
  urls?: UrlInfo[];
  onClick?: () => void;
}

const ExternalLinkButton = ({ url, text }: UrlInfo): JSX.Element => (
  <Button
    icon={<Icon icon={icons.external} />}
    text={text}
    externalHref={url}
    variant="primary"
    className={styles.button}
  />
);

const SummaryPreviewSection = ({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}): JSX.Element => (
  <div className={clsx(styles.section, className)}>
    <h3 className={styles.label}>{label}</h3>
    <MarkdownOverlay value={value} />
  </div>
);

const SummaryPreview = ({ className, long, short, urls, onClick }: SummaryPreviewProps): JSX.Element => {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.externalLinkButtons}>
        {urls?.map(({ url, text }) => (
          <ExternalLinkButton url={url} text={text} key={url} />
        ))}
      </div>
      <SummaryPreviewSection label="Short summary" value={short} className={styles.shortSummary} />
      <SummaryPreviewSection label="Long summary" value={long} />
      {onClick && <Button onClick={onClick} text="Edit summary" variant="secondary" />}
    </div>
  );
};

export default SummaryPreview;
