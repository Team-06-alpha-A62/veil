import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider.tsx';

interface ParticipantsInputProps {
  participants: string[];
  setParticipants: (participants: string[]) => void;
  channelParticipants?: string[] | undefined;
  teamMembers?: string[];
  disabled?: boolean;
}

const ParticipantsInput: React.FC<ParticipantsInputProps> = ({
  participants,
  setParticipants,
  channelParticipants,
  teamMembers = [],
  disabled = false,
}) => {
  const { currentUser } = useAuth();
  const [participantsInput, setParticipantsInput] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleRemoveParticipant = (participantIndex: number): void => {
    setParticipants(
      participants.filter((_, index) => index !== participantIndex)
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setParticipantsInput(value);
    if (value.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleParticipantClick = (participant: string): void => {
    if (!participants.includes(participant)) {
      setParticipants([...participants, participant]);
      setParticipantsInput('');
    }
  };

  const renderFilteredParticipants = () => {
    const filteredParticipants = (
      teamMembers.length > 0 ? teamMembers : currentUser.userData!.friends
    ).filter(
      user =>
        participantsInput &&
        user.toLowerCase().includes(participantsInput.toLowerCase()) &&
        !channelParticipants?.includes(user)
    );

    if (filteredParticipants.length === 0) {
      return <p>No participant found</p>;
    }

    return filteredParticipants.map(user => (
      <li key={user} onClick={() => handleParticipantClick(user)}>
        <a>{user}</a>
      </li>
    ));
  };

  return (
    <div className="form-control w-full gap-2 dropdown dropdown-bottom">
      <label htmlFor="participants" className="label">
        <span className="label-text">Add Participants</span>
      </label>

      <div className="p-2 flex items-center gap-2 flex-wrap rounded-3xl bg-base-200 bg-opacity-50">
        {participants.map((participant, index) => (
          <div key={participant} className="flex items-center gap-1">
            <span className="badge badge-primary text-primary-content gap-1">
              {participant}
              <span
                onClick={() => handleRemoveParticipant(index)}
                className="cursor-pointer text-primary-content hover:text-gray-800"
              >
                &times;
              </span>
            </span>
          </div>
        ))}
        <input
          type="text"
          value={participantsInput}
          onChange={handleInputChange}
          className="input bg-transparent input-sm flex-grow rounded-3xl border-none focus:outline-none"
          disabled={disabled}
        />
      </div>
      {isOpen && !disabled && (
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
        >
          {renderFilteredParticipants()}
        </ul>
      )}
    </div>
  );
};

export default ParticipantsInput;
