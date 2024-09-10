import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { createNote, getNoteByHandle } from '../../services/notes.service.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { useNoteModal } from '../../providers/NoteModalProvider.tsx';

interface newNoteState {
  title: string;
  createdOn: number;
  content: string | null;
}

const initialNoteData: newNoteState = {
  title: '',
  content: null,
  createdOn: 0,
};

const labelColors: Record<string, string> = {
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
};

const NewNoteWidget: React.FC = () => {
  const { currentUser } = useAuth();
  const { openModal } = useNoteModal();

  const [showNewNoteModal, setShowNewNoteModal] = useState<boolean>(false);
  const [newNoteData, setNewNoteData] = useState<newNoteState>(initialNoteData);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    labelColors.indigo
  );

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNewNoteModal(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const handleModalToggle = (): void => {
    setShowNewNoteModal(prevValue => !prevValue);
  };

  const handleInputChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewNoteData({
        ...newNoteData,
        [key]: event.target.value,
      });
    };

  const handleCreateNewNoteClick = async (): Promise<void> => {
    const newNoteId = await createNote(
      newNoteData.title,
      currentUser.userData!.username,
      selectedLabel
    );

    const newNote = await getNoteByHandle(newNoteId);
    openModal(newNote);
    setShowNewNoteModal(false);
    setSelectedLabel(labelColors.indigo);
    setNewNoteData(initialNoteData);
  };

  return (
    <div className="h-full flex justify-center items-center rounded-3xl bg-primary">
      {!showNewNoteModal ? (
        <button
          className="w-full h-full font-semibold text-2xl px-3 py-1 rounded-3xl bg-primary transition-colors text-white"
          onClick={handleModalToggle}
        >
          New Note
        </button>
      ) : (
        <div className="w-full h-full fixed flex">
          <div className="w-full h-full relative bg-base-300 rounded-3xl flex flex-col gap-5 p-4 justify-center items-center">
            <button
              onClick={handleModalToggle}
              className="absolute top-5 right-5"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-semibold">Create New Note</h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text">Title</span>
                  <span className="badge badge-accent badge-outline text-accent">
                    Optional
                  </span>
                </div>
                <input
                  autoFocus
                  type="text"
                  value={newNoteData.title}
                  onChange={handleInputChange('title')}
                  className="input input-sm w-full rounded-3xl bg-base-200 bg-opacity-50 focus:border-transparent focus:outline-accent"
                />
              </label>
              <div className="flex gap-3 flex-col">
                <span className="label-text">Label</span>
                <div className="flex gap-2">
                  {Object.keys(labelColors).map((label, index) => (
                    <span
                      key={index}
                      onClick={() => setSelectedLabel(labelColors[label])}
                      className={`${labelColors[label]} w-6 h-6 rounded-full flex  items-center justify-center cursor-pointer`}
                    >
                      {selectedLabel === labelColors[label] && (
                        <FaCheck className="text-xs text-primary-content text-opacity-50" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors text-white"
                onClick={handleCreateNewNoteClick}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewNoteWidget;
