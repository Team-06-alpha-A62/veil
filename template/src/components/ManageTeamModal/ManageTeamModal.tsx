import React, { useEffect, useState } from 'react';
import { Team } from '../../models/Team';
import { UserRole } from '../../enums/UserRole';
import { Participant } from '../../models/Participant';
import { FaUserGroup } from 'react-icons/fa6';
import DragZone from '../DragZone/DragZone';
import { uploadImage } from '../../services/storage.service';
import {
  addMemberToTeam,
  changeTeamImage,
  deleteTeam,
  updateTeamMemberRole,
  updateTeamName,
  getJoinRequests,
  acceptJoinRequest,
  declineJoinRequest,
} from '../../services/teams.service';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

import { BiSolidEditAlt } from 'react-icons/bi';

interface ManageTeamModalProps {
  team: Team;
  onClose: () => void;
  currentUsername: string;
}

interface TeamState {
  imageUrl: string | null;
  title: string | null;
  participants: {
    [username: string]: Participant;
  };
}

const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  team,
  onClose,
  currentUsername,
}) => {
  const [teamState, setTeamState] = useState<TeamState>({
    imageUrl: team.imageUrl!,
    title: team.name,
    participants: { ...team.members },
  });

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newMembers, setNewMembers] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<Participant[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    teamState.imageUrl
  );

  const isOwner = team.owner === currentUsername;

  useEffect(() => {
    const fetchJoinRequests = async () => {
      const requests = await getJoinRequests(team.id);
      setJoinRequests(requests);
    };
    fetchJoinRequests();
  }, [team.id]);

  const handleFileChange = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setTeamState(prevState => ({
      ...prevState,
      imageUrl: previewUrl,
    }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTeamState(prevState => ({
      ...prevState,
      title: value,
    }));
  };

  const handleRoleChange = (username: string, newRole: UserRole) => {
    setTeamState(prevState => ({
      ...prevState,
      participants: {
        ...prevState.participants,
        [username]: {
          ...prevState.participants[username],
          role: newRole,
        },
      },
    }));
  };

  const handleSaveChanges = async () => {
    let updatedImageUrl = teamState.imageUrl;

    if (imageFile) {
      updatedImageUrl = await uploadImage(imageFile);
      await changeTeamImage(team.id, updatedImageUrl);
      setTeamState(prevState => ({
        ...prevState,
        imageUrl: updatedImageUrl,
      }));
    } else if (!imageFile && !imagePreviewUrl) {
      await changeTeamImage(team.id, '');
      setTeamState(prevState => ({
        ...prevState,
        imageUrl: '',
      }));
    }

    if (teamState.title && teamState.title !== team.name) {
      await updateTeamName(team.id, teamState.title);
    }

    Object.keys(team.members).forEach(async username => {
      if (
        team.members[username].role !== teamState.participants[username].role
      ) {
        await updateTeamMemberRole(
          team.id,
          username,
          teamState.participants[username].role
        );
      }
    });

    onClose();
  };

  const handleAddClick = async (): Promise<void> => {
    try {
      for (const member of newMembers) {
        await addMemberToTeam(team.id, member, team.owner);
      }
      setNewMembers([]);
    } catch (error) {
      console.error('Failed to add new members to the team:', error);
    }
  };

  const handleAcceptJoinRequest = async (username: string) => {
    try {
      await acceptJoinRequest(team.id, username);
      setJoinRequests(joinRequests.filter(req => req.username !== username));
    } catch (error) {
      console.error('Failed to accept join request:', error);
    }
  };

  const handleDeclineJoinRequest = async (username: string) => {
    try {
      await declineJoinRequest(team.id, username);
      setJoinRequests(joinRequests.filter(req => req.username !== username));
    } catch (error) {
      console.error('Failed to decline join request:', error);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setTeamState(prevState => ({
      ...prevState,
      imageUrl: '',
    }));
    setIsEditingImage(false);
  };

  const handleDeleteTeam = async () => {
    if (isOwner) {
      await deleteTeam(team.id);
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-base-200 bg-opacity-75 flex justify-center items-center z-10">
      <div className="relative bg-base-100 flex flex-col gap-5 rounded-3xl p-6 shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          &times;
        </button>
        <div className="flex">
          <div className="border-r border-gray-600 pr-4 w-[400px]">
            <div className="flex flex-col mb-6">
              {isEditingImage ? (
                <div className="flex gap-3 items-center">
                  <DragZone
                    handleFileChange={handleFileChange}
                    width={144}
                    height={96}
                    imageUrl={imagePreviewUrl || ''}
                  />
                  <div className="flex flex-col mt-2 space-x-2">
                    <button
                      className="text-orange-500 text-sm"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                    <button
                      className="text-error text-sm"
                      onClick={() => {
                        setIsEditingImage(false);
                        setImageFile(null);
                        setImagePreviewUrl(teamState.imageUrl);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex relative justify-between items-center w-1/2 space-x-3">
                  <div className="flex-1 avatar placeholder">
                    <div className="bg-base-300 text-neutral-content w-36 rounded-lg h-24  flex items-center justify-center">
                      {teamState.imageUrl ? (
                        <img
                          src={teamState.imageUrl}
                          alt="Team"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserGroup className="text-3xl text-neutral-content" />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingImage(true)}
                    className="flex-1"
                  >
                    <BiSolidEditAlt className="size-6 opacity-50" />
                  </button>
                </div>
              )}
              <div className="flex gap-3 mt-6 w-1/2">
                <input
                  type="text"
                  className={`w-24 text-xl font-semibold bg-transparent border-none focus:ring-0 ${
                    isEditingTitle ? 'bg-gray-700' : ''
                  }`}
                  value={teamState.title || ''}
                  onChange={handleTitleChange}
                  readOnly={!isEditingTitle}
                />
                {!isEditingTitle && (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="flex-1"
                  >
                    <BiSolidEditAlt className="size-6 opacity-50" />
                  </button>
                )}
                {isEditingTitle && (
                  <button
                    className="text-error text-sm"
                    onClick={() => {
                      setIsEditingTitle(false);
                      setTeamState(prevState => ({
                        ...prevState,
                        title: team.name,
                      }));
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Members</h3>
              <div className="flex flex-col relative gap-3 bg-base-200 p-3 rounded-xl h-[300px] overflow-y-auto">
                {Object.entries(teamState.participants)
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .sort(([_A, participantA], [_B, participantB]) =>
                    participantA.role === UserRole.OWNER
                      ? -1
                      : participantB.role === UserRole.OWNER
                      ? 1
                      : 0
                  )
                  .map(([username, participant]) => (
                    <div
                      key={username}
                      className="flex items-center justify-between bg-base-300 rounded-xl px-4 py-2 hover:bg-base-300 transition"
                    >
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-9 rounded-full">
                            {participant.avatarUrl ? (
                              <img
                                src={participant.avatarUrl}
                                alt="User Avatar"
                                className="rounded-full"
                              />
                            ) : (
                              <div className="bg-gray-500 w-9 h-9 flex items-center justify-center rounded-full text-white">
                                {username[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base text-white font-semibold">
                            {username}
                          </span>
                          {participant.role === UserRole.OWNER && (
                            <span className="text-xs text-gray-400">Owner</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.role !== UserRole.OWNER &&
                          username !== currentUsername && (
                            <button
                              className="text-sm text-blue-500 hover:underline"
                              onClick={() =>
                                handleRoleChange(
                                  username,
                                  participant.role === UserRole.MODERATOR
                                    ? UserRole.MEMBER
                                    : UserRole.MODERATOR
                                )
                              }
                            >
                              {participant.role === UserRole.MODERATOR
                                ? 'Remove Moderator'
                                : 'Make Moderator'}
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-4 pl-4 w-[400px]">
            <label htmlFor="participants" className="label">
              <span className="label-text">Add Participants</span>
            </label>
            <div className="flex items-center gap-4 justify-center">
              <ParticipantsInput
                participants={newMembers}
                setParticipants={setNewMembers}
                channelParticipants={Object.keys(team.members)}
                showText={false}
              />
              <button
                onClick={handleAddClick}
                className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
              >
                Add
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Join Requests</h3>
              <div className="flex flex-col relative gap-3 bg-base-200 p-3 rounded-xl h-[350px] overflow-y-auto">
                {joinRequests.map(request => (
                  <div
                    key={request.username}
                    className="flex items-center justify-between bg-base-300 rounded-xl px-4 py-2 hover:bg-base-300 transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-9 rounded-full">
                          {request.avatarUrl ? (
                            <img
                              src={request.avatarUrl}
                              alt="User Avatar"
                              className="rounded-full"
                            />
                          ) : (
                            <div className="bg-gray-500 w-9 h-9 flex items-center justify-center rounded-full text-white">
                              {request.username[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base text-white font-semibold">
                          {request.username}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-success"
                        onClick={() =>
                          handleAcceptJoinRequest(request.username)
                        }
                      >
                        <BsCheckCircle size={20} />
                      </button>
                      <button
                        className="text-error"
                        onClick={() =>
                          handleDeclineJoinRequest(request.username)
                        }
                      >
                        <BsXCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="text-sm bg-error text-white px-4 py-2 rounded-full"
            disabled={!isOwner}
            onClick={handleDeleteTeam}
            title={!isOwner ? 'Only the owner can delete this team' : ''}
          >
            Delete Team
          </button>
          <button
            className="text-sm bg-success text-white px-4 py-2 rounded-full"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTeamModal;