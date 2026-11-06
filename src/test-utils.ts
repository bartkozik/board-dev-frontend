import { render, queries, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}): RenderResult<typeof queries, HTMLElement, HTMLElement> & { user: typeof userEvent } => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent,
    ...render(ui, { wrapper: BrowserRouter }),
  };
};
