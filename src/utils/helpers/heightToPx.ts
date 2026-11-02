export function heightToPx(value?: string | number): string {
  switch (true) {
    case value == null:
      return 'auto';

    case typeof value === 'number':
      return `${value}px`;

    case typeof value === 'string' && value.endsWith('px'):
      return value;

    case typeof value === 'string':
      return `${value}px`;

    default:
      return 'auto';
  }
}
