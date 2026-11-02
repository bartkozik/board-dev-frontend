import { render, screen } from '@testing-library/react';
import PageHeader from '@/theme/pageHeader';

const title = 'Test title';
const testText = 'Test text';

const ChildComponent = (): JSX.Element => <div>{testText}</div>;

describe(`PageHeader`, () => {
  it(`renders correctly when title is provided `, () => {
    render(<PageHeader title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.queryByText(title)).toBeVisible();
  });

  it(`renders with child component if provided `, () => {
    const { getByText, queryByText } = render(
      <PageHeader title={title}>
        <ChildComponent />
      </PageHeader>
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(testText)).toBeInTheDocument();
    expect(queryByText(testText)).toBeVisible();
  });
});
