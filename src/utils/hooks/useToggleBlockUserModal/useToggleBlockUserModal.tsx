import { useState } from 'react';
import Confirm from '@/theme/confirm';
import Modal from '@/theme/modal';

export interface UseToggleBlockUserModalProps {
  name: string;
  onConfirm: () => void;
  submitting: boolean;
  isBlocked?: boolean;
}

export interface UseToggleBlockUserModalReturn {
  openToggleBlockModal: () => void;
  closeToggleBlockModal: () => void;
  confirmToggleBlockModal: JSX.Element;
}

export const useToggleBlockUserModal = ({
  onConfirm,
  submitting,
  name,
  isBlocked = false,
}: UseToggleBlockUserModalProps): UseToggleBlockUserModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openToggleBlockModal = (): void => {
    setIsOpen(true);
  };

  const closeToggleBlockModal = (): void => {
    setIsOpen(false);
  };

  const confirmButtonText = isBlocked ? 'Unblock' : 'Block';

  const confirmToggleBlockModal = (
    <Modal close={closeToggleBlockModal} isOpen={isOpen}>
      <Confirm
        yesText={`${confirmButtonText} user`}
        action={onConfirm}
        close={closeToggleBlockModal}
        submitting={submitting}
        question={
          <>
            {`Are you sure that you want to ${confirmButtonText.toLocaleLowerCase()} `}
            <strong>{name}</strong>?
          </>
        }
      />
    </Modal>
  );
  return {
    openToggleBlockModal,
    closeToggleBlockModal,
    confirmToggleBlockModal,
  };
};
