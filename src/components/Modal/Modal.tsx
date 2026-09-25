import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import NoteForm from '../NoteForm/NoteForm';
import React, { useEffect } from 'react';
import type { NewNote } from '../types/note';

interface ModalProps {
  onClose: () => void;
  onCreateNote: (value: NewNote) => void;
}

export default function Modal({ onClose, onCreateNote }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <NoteForm onClose={onClose} onSubmit={onCreateNote} />
      </div>
    </div>,
    document.body
  );
}
