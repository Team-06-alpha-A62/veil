import React, { useState, useEffect } from 'react';
import { useNoteModal } from '../../providers/NoteModalProvider.tsx';
import Draggable from 'react-draggable';
import { updateNote } from '../../services/notes.service.ts';
import { debounce } from 'lodash';
import dayjs from 'dayjs';

const SingleNoteDetailsModal: React.FC = () => {
  const { isOpen, note, closeModal, modalPosition, setModalPosition } =
    useNoteModal();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
    }
  }, [note]);

  const debouncedSave = debounce(() => {
    if (note) {
      updateNote(note.id, { title, content });
    }
    setIsLoading(false);
  }, 500);

  useEffect(() => {
    setIsLoading(true);
    if (note) {
      debouncedSave();
    }

    // Cancel debounce on cleanup
    return () => {
      debouncedSave.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStop = (_event: any, data: { x: number; y: number }) => {
    setModalPosition({ x: data.x, y: data.y });
    localStorage.setItem(
      'modalPosition',
      JSON.stringify({ x: data.x, y: data.y })
    );
  };

  if (!isOpen || !note) return null;

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: modalPosition.x, y: modalPosition.y }}
      onStop={handleDragStop}
    >
      <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center z-10 pointer-events-none">
        <div className="relative w-1/5 h-auto bg-base-100 rounded-3xl flex flex-col pointer-events-auto shadow-lg">
          <div
            className={`flex justify-between h-10 px-4 rounded-t-3xl ${note.label} handle`}
          >
            <div className="flex items-center">
              {isLoading && (
                <span className="loading loading-ring loading-md"></span>
              )}
            </div>
            <button className="text-white" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="px-4 pt-4">
            <input
              className="text-lg font-semibold bg-transparent focus:outline-none"
              type="text"
              name="title"
              id="title"
              autoFocus
              value={title}
              onChange={handleTitleChange}
              required
            />
            <p className="font-light text-sm opacity-50">
              Created: {dayjs(note.createdOn).format('D MMMM YYYY [at] HH:mm')}
            </p>
          </div>

          <textarea
            autoFocus
            className="w-full bg-transparent focus:outline-none resize-none p-4"
            name="content"
            id="content"
            rows={8}
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default SingleNoteDetailsModal;
