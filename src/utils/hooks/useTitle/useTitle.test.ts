import { renderHook } from '@testing-library/react';
import { useTitle } from '@/utils/hooks';

const testTitle = 'Test title';

describe('useTitle', () => {
  it('adds title to page correctly', () => {
    expect(document.title).toEqual('');

    renderHook(() => useTitle(testTitle));

    expect(document.title).toEqual(`Board.Dev — ${testTitle}`);
  });
});
