import React, { useState } from 'react';
import NoteComponent from '../NoteComponent/NoteComponent.tsx';
import { Note } from '../../models/Note.ts';
import { useNavigate } from 'react-router-dom';

const PinnedNotesCarouselWidget: React.FC = () => {
  const navigate = useNavigate();
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>(
    JSON.parse(localStorage.getItem('pinnedNotes')!)
  );

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const handleNext = (): void => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % pinnedNotes.length);
  };

  const handlePrev = (): void => {
    setCurrentSlide(
      prevSlide => (prevSlide - 1 + pinnedNotes.length) % pinnedNotes.length
    );
  };

  const getPrevSlide = () => {
    return (currentSlide - 1 + pinnedNotes.length) % pinnedNotes.length;
  };

  const getNextSlide = () => {
    return (currentSlide + 1) % pinnedNotes.length;
  };

  if (!pinnedNotes || pinnedNotes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col gap-3 justify-center items-center text-warning bg-base-200 rounded-3xl">
        <h1 className="font-semibold text-md">No pinned notes</h1>
        <button
          className="text-sm font-semibold px-3 py-1 rounded-3xl bg-primary hover:bg-opacity-75 text-white"
          onClick={() => navigate('/app/notes')}
        >
          Go to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {pinnedNotes?.map((note, index) => {
        let slideClass = 'opacity-0 scale-50';

        if (index === currentSlide) {
          slideClass = 'opacity-100 scale-100 z-20 pointer-events-auto';
        } else if (index === getPrevSlide() || index === getNextSlide()) {
          slideClass = 'opacity-50 scale-75 z-10 pointer-events-none';
        }

        return (
          <div
            className={`carousel-item absolute w-1/3 transition-all transform duration-500 ease-in-out ${slideClass}`}
            style={{
              left:
                index === getPrevSlide()
                  ? '0%'
                  : index === getNextSlide()
                  ? '66%'
                  : '33%',
            }}
            key={note.id}
          >
            <NoteComponent
              note={note}
              pinnedNotes={pinnedNotes}
              setPinnedNotes={setPinnedNotes}
            />
          </div>
        );
      })}

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-0 btn btn-circle z-30"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 btn btn-circle z-30"
      >
        ❯
      </button>
    </div>
  );
};

export default PinnedNotesCarouselWidget;
