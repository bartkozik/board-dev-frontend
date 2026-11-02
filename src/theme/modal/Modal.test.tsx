import { render, screen } from '@testing-library/react';
import Modal from '@/theme/modal';

const Text = <p>Test text</p>;
const onClickMockFn = jest.fn();

const ChildComponent = (): JSX.Element => <div>Child component</div>;

describe(`Modal`, () => {
  it(`renders correctly when isOpen attribute is truthy `, () => {
    render(
      <Modal isOpen={true} close={onClickMockFn}>
        {Text}
      </Modal>
    );
    expect(screen.getByText('Test text')).toBeInTheDocument();
    expect(screen.queryByText('Test text')).toBeVisible();
  });

  it(`doesn't renders when isOpen attribute is falsy `, () => {
    render(
      <Modal isOpen={false} close={onClickMockFn}>
        {Text}
      </Modal>
    );
    expect(screen.queryByText('Test text')).toBeNull();
  });

  it(`renders with child component `, () => {
    render(
      <Modal isOpen={true} close={onClickMockFn}>
        <ChildComponent />
      </Modal>
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });
});
