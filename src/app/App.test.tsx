import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from './App';

window.scrollTo = jest.fn();

describe('App', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('exists', () => {
    const app = render(<App />);
    expect(app).toBeTruthy();
  });
});
