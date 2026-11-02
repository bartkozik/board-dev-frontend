import React, { forwardRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Loader from '@/theme/loader';
import styles from './Button.module.scss';

type ButtonProps = {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  externalHref?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text?: ReactNode;
  to?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'text' | 'outlined';
  maxWidth?: boolean;
  name?: string;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      active = false,
      className = '',
      disabled,
      externalHref = '',
      icon,
      loading = false,
      onClick,
      text,
      to = '',
      type = 'button',
      variant = 'primary',
      maxWidth = false,
      ...rest
    }: ButtonProps,
    ref
  ): JSX.Element => {
    const classes = {
      className: clsx(styles.root, className, styles[variant], {
        [styles.externalHref]: externalHref,
        [styles.active]: active,
        [styles.maxWidth]: maxWidth,
        [styles.disabled]: disabled,
        [styles.withIcon]: icon,
      }),
    };

    const content = (
      <>
        <Loader loading={loading} small white={variant !== 'secondary'} className={styles.loader} />
        {!loading && icon}
        {!loading && text}
      </>
    );

    const linkElement = (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} {...classes}>
        {icon}
        <span>{text}</span>
      </Link>
    );

    const btnElement = (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        {...classes}
        type={type}
        onClick={(event) => onClick?.(event)}
        disabled={disabled || loading}
        {...rest}
      >
        {content}
      </button>
    );

    const externalLinkElement = (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...classes}
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );

    const component = (): JSX.Element => {
      if (to) return linkElement;
      else if (externalHref) return externalLinkElement;
      else return btnElement;
    };

    return component();
  }
);

Button.displayName = 'Button';

export default Button;
