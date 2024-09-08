import { useEffect, useState } from 'react';
import NoteComponent from '../NoteComponent/NoteComponent.tsx';
import { Note } from '../../models/Note.ts';
import NewNoteModal from '../NewNoteModal/NewNoteModal.tsx';
import { useAuth } from '../../providers/AuthProvider.tsx';
import {
  getUserNotes,
  subscribeToUserNotes,
} from '../../services/notes.service.ts';

const Notes: React.FC = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);

  // fetching user notes
  useEffect(() => {
    if (currentUser.userData?.username) {
      const fetchNotes = async () => {
        const notesData = await getUserNotes(currentUser.userData!.username);
        setNotes(notesData);
      };

      fetchNotes();

      const unsubscribe = subscribeToUserNotes(
        currentUser.userData.username,
        (updatedNotes: Note[]) => {
          // Update the notes
          setNotes(updatedNotes);

          // Check if any of the pinned notes are in the updated notes
          setPinnedNotes(prevPinnedNotes => {
            return prevPinnedNotes.map(pinnedNote => {
              const updatedNote = updatedNotes.find(
                note => note.id === pinnedNote.id
              );
              return updatedNote ? updatedNote : pinnedNote;
            });
          });
        }
      );

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.userData!.username]);
  // fetching pinned notes from localStorage
  useEffect(() => {
    const storedPinnedNotes = localStorage.getItem('pinnedNotes');
    if (storedPinnedNotes) {
      setPinnedNotes(JSON.parse(storedPinnedNotes));
    }
  }, []);

  return (
    <div className="flex gap-10 h-full overflow-y-scroll bg-base-200 rounded-3xl p-6 bg-opacity-50">
      <div className="flex flex-1 flex-col">
        <header className="h-auto flex flex-shrink-0 flex-row-reverse justify-between pb-6">
          <NewNoteModal />
        </header>
        <main className="flex flex-col gap-6">
          <div className="collapse  collapse-arrow ">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Pinned Notes
            </div>
            <div className="collapse-content pb-6 flex flex-wrap gap-6">
              {pinnedNotes.map(note => (
                <NoteComponent
                  key={note.id}
                  note={note}
                  pinnedNotes={pinnedNotes}
                  setPinnedNotes={setPinnedNotes}
                />
              ))}
            </div>
            <div className="collapse-content">{/* <NoteComponent /> */}</div>
          </div>
          <div className="collapse collapse-arrow">
            <input type="checkbox" defaultChecked />
            <div className="collapse-title text-xl font-medium">All Notes</div>
            <div className="collapse-content flex flex-wrap gap-5">
              {notes.map(note => (
                <NoteComponent
                  key={note.id}
                  note={note}
                  pinnedNotes={pinnedNotes}
                  setPinnedNotes={setPinnedNotes}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
