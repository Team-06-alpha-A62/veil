import { useState, useEffect } from 'react';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput';
import { useAuth } from '../../providers/AuthProvider';
import { createTeam } from '../../services/teams.service';
import DragZone from '../DragZone/DragZone';
import { uploadImage } from '../../services/storage.service';
import { createChannel } from '../../services/channel.service';
import { ChannelType } from '../../enums/ChannelType';
import { ChannelCategory } from '../../enums/ChannelCategory';

interface TeamData {
  name: string;
  isPrivate: boolean;
}

const initialTeamData = {
  name: '',
  isPrivate: false,
};

const CreateTeamModal: React.FC = () => {
  const { currentUser } = useAuth();
  const [showTeamModal, setShowTeamModal] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<TeamData>(initialTeamData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleCreateTeamClick = async (): Promise<void> => {
    let imageUrl = '';

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }
    console.log(currentUser.userData!.username);
    const teamId = await createTeam(
      teamData.name,
      currentUser.userData!.username,
      [...participants, currentUser.userData!.username],
      teamData.isPrivate,
      imageUrl
    );

    const channelPromises = [
      createChannel(
        'Welcome and Rules',
        currentUser.userData!.username,
        [...participants, currentUser.userData!.username],
        ChannelType.TEAM,
        teamData.isPrivate,
        teamId,
        ChannelCategory.INFORMATION
      ),
      createChannel(
        'Announcements',
        currentUser.userData!.username,
        [...participants, currentUser.userData!.username],
        ChannelType.TEAM,
        teamData.isPrivate,
        teamId,
        ChannelCategory.INFORMATION
      ),
      createChannel(
        'General',
        currentUser.userData!.username,
        [...participants, currentUser.userData!.username],
        ChannelType.TEAM,
        teamData.isPrivate,
        teamId,
        ChannelCategory.TEXT_CHANNELS
      ),
      createChannel(
        'Off-topic',
        currentUser.userData!.username,
        [...participants, currentUser.userData!.username],
        ChannelType.TEAM,
        teamData.isPrivate,
        teamId,
        ChannelCategory.TEXT_CHANNELS
      ),
    ];

    await Promise.all(channelPromises);

    setTeamData(initialTeamData);
    setParticipants([]);
    setImageFile(null);
    setImagePreviewUrl(null);
    handleModalToggle();
  };

  const handleModalToggle = (): void => {
    setShowTeamModal(prevValue => !prevValue);
  };

  const handleInputChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setTeamData({
        ...teamData,
        [key]: event.target.value,
      });
    };

  const handleFileChange = (file: File) => {
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTeamModal(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <>
      <button
        className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
        onClick={handleModalToggle}
      >
        Create Team
      </button>
      {showTeamModal && (
        <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-300 bg-opacity-75 z-10">
          <div className="w-96 h-auto relative bg-base-100 rounded-3xl flex flex-col gap-5 p-4">
            <button
              onClick={handleModalToggle}
              className="absolute top-5 right-5 text-base-content"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-semibold text-base-content">
                Create Team
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text text-base-content">
                    Team Name
                  </span>
                </div>
                <input
                  autoFocus
                  placeholder="Enter team name"
                  value={teamData.name}
                  onChange={handleInputChange('name')}
                  type="text"
                  className="flex-1 px-4 py-2 rounded-3xl bg-base-200 input-sm placeholder-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:ring-dashed caret-primary"
                />
              </label>
              <ParticipantsInput
                participants={participants}
                setParticipants={setParticipants}
              />
              <div className="form-control items-start">
                <label className="label cursor-pointer flex gap-4">
                  <span className="label-text">Private</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={teamData.isPrivate}
                    onChange={() =>
                      setTeamData(prev => ({
                        ...prev,
                        isPrivate: !prev.isPrivate,
                      }))
                    }
                  />
                </label>
              </div>

              <div>
                <span className="label-text">Upload Team Image</span>
                <DragZone
                  handleFileChange={handleFileChange}
                  width={350}
                  height={150}
                  imageUrl={imagePreviewUrl || ''}
                />
              </div>
            </div>
            <button
              className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors text-white"
              onClick={handleCreateTeamClick}
            >
              Create Team
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTeamModal;
