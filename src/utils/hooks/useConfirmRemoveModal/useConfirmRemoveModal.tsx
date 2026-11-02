import { useState } from 'react';
import Confirm from '@/theme/confirm';
import Modal from '@/theme/modal';

export interface UseConfirmRemoveModalProps {
  name: string;
  onConfirm: () => void;
  submitting: boolean;
}

export interface UseConfirmRemoveModalReturn {
  openModal: () => void;
  closeModal: () => void;
  confirmRemoveModal: JSX.Element;
}

export const useConfirmRemoveModal = ({
  onConfirm,
  submitting,
  name,
}: UseConfirmRemoveModalProps): UseConfirmRemoveModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (): void => {
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const confirmRemoveModal = (
    <Modal close={closeModal} isOpen={isOpen}>
      <Confirm
        yesText="Remove"
        action={onConfirm}
        close={closeModal}
        submitting={submitting}
        question={
          <>
            Are you sure that you want to remove <strong>{name}</strong>?
          </>
        }
      />
    </Modal>
  );
  return {
    openModal,
    closeModal,
    confirmRemoveModal,
  };
};
