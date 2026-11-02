import { formatDate } from './formatDate';

afterEach(() => {
  jest.clearAllMocks();
});

describe('formatDate', () => {
  it('correctly format provided string to DD/MM/YYYY format by default ', () => {
    expect(formatDate('2024-02-07T13:15:30')).toBe('07/02/2024');
    expect(formatDate('202135991')).toBe('07/02/2024');
  });

  it('correctly format provided Date to DD/MM/YYYY format by default ', () => {
    expect(formatDate(new Date(2024, 1, 7))).toBe('07/02/2024');
  });

  it('correctly format provided string to custom format', () => {
    expect(formatDate('2024-02-07T13:15:30', 'YYYY/MM/DD')).toBe('2024/02/07');
    expect(formatDate('202135991', 'YYYY/MM')).toBe('2024/02');
  });

  it('correctly format provided Date to custom format', () => {
    expect(formatDate(new Date(2024, 1, 7), 'YYYY/DD/MM')).toBe('2024/07/02');
    expect(formatDate(new Date(2024, 1, 8), 'MM/YYYY')).toBe('02/2024');
  });

  it('returns empty string if invalid date string provided with default format', () => {
    expect(formatDate('a1s2d3')).toBe('');
    expect(formatDate('13:15:30:2024-02-07T')).not.toBe('07/02/2024');
    expect(formatDate('13:15:30:2024-02-07T')).toBe('');
  });

  it('returns empty string if invalid date string provided with custom format', () => {
    expect(formatDate('a1s2d3', 'MM/YYYY')).toBe('');
    expect(formatDate('13:15:30:2024-02-07T', 'YYYY/DD/MM')).not.toBe('2024/07/02');
    expect(formatDate('13:15:30:2024-02-07T', 'YYYY/MM')).toBe('');
  });

  it('returns provided date format string if invalid date format provided', () => {
    expect(formatDate(new Date(2024, 1, 8), 'iiiiiiii')).toBe('iiiiiiii');
    expect(formatDate('202135991', 'ww/tt')).toBe('ww/tt');
    expect(formatDate('2024-02-07T13:15:30', 'RR/OO')).toBe('RR/OO');
  });
});
