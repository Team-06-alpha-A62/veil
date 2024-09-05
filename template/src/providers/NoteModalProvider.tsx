import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Note } from '../models/Note';

interface NoteModalContextType {
  note: Note | null;
  isOpen: boolean;
  openModal: (note: Note) => void;
  closeModal: () => void;
}

const NoteModalContext = createContext<NoteModalContextType | undefined>(
  undefined
);

export const NoteModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [note, setNote] = useState<Note | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = (note: Note) => {
    setNote(note);
    setIsOpen(true);
  };

  const closeModal = () => {
    setNote(null);
    setIsOpen(false);
  };

  return (
    <NoteModalContext.Provider value={{ note, isOpen, openModal, closeModal }}>
      {children}
    </NoteModalContext.Provider>
  );
};

export const useNoteModal = () => {
  const context = useContext(NoteModalContext);
  if (context === undefined) {
    throw new Error('useNoteModal must be used within a NoteModalProvider');
  }
  return context;
};
