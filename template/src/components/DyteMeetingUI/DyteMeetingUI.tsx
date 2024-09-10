import {
  DyteRecordingToggle,
  DyteRecordingIndicator,
  DyteParticipantCount,
  DyteGrid,
  DyteCameraToggle,
  DyteMicToggle,
  DyteAudioVisualizer,
  DyteParticipantTile,
  DyteButton,
  DyteDialogManager,
  DyteSettingsToggle,
  DyteLeaveButton,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { useEffect } from 'react';
import {
  decrementChannelParticipantsCount,
  incrementChannelParticipantsCount,
} from '../../services/channel.service.ts';

interface DyteMeetingProps {
  setCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelId: string;
}

const DyteMeetingUI: React.FC<DyteMeetingProps> = ({ setCall, channelId }) => {
  const { currentUser } = useAuth();
  const { meeting } = useDyteMeeting();

  const roomState = useDyteSelector(m => m.self.roomState);

  useEffect(() => {
    const decrement = async () => {
      await decrementChannelParticipantsCount(channelId);
    };
    const increment = async () => {
      await incrementChannelParticipantsCount(channelId);
    };
    if (roomState === 'joined') {
      increment();
    }
    console.log(roomState);
    if (roomState === 'left' || roomState === 'ended') {
      setCall(prev => !prev);
      decrement();
    }
  }, [roomState, channelId, setCall]);

  return (
    <div className="flex w-full h-56">
      {roomState === 'init' && (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <DyteDialogManager meeting={meeting} />
          <div className="flex w-full h-full items-center justify-around p-[10%]">
            <div className="relative">
              <DyteParticipantTile
                meeting={meeting}
                participant={meeting.self}
                className="rounded-3xl h-44 bg-base-300"
              >
                <div className="avatar placeholder">
                  <div className="bg-base-300 text-neutral-content w-14 rounded-full">
                    {currentUser.userData!.avatarUrl ? (
                      <img
                        src={currentUser.userData!.avatarUrl}
                        alt="User Avatar"
                      />
                    ) : (
                      <span>
                        {currentUser.userData!.username[0].toLocaleUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="absolute flex"
                  style={{
                    top: '15px',
                    right: '15px',
                  }}
                >
                  <DyteSettingsToggle size="sm" />
                </div>
                <DyteAudioVisualizer participant={meeting.self} slot="start" />
                <div
                  id="user-actions"
                  className="absolute flex gap-2"
                  style={{
                    bottom: '15px',
                    right: '15px',
                  }}
                >
                  <DyteMicToggle meeting={meeting} size="sm" />
                  <DyteCameraToggle meeting={meeting} size="sm" />
                </div>
              </DyteParticipantTile>
              <DyteButton
                kind="wide"
                className="flex items-center text-sm font-semibold px-3 py-1 rounded-full hover:bg-accent-focus transition-colors text-white bg-primary"
                onClick={async () => {
                  await meeting.join();
                }}
              >
                Join
              </DyteButton>
            </div>
          </div>
        </div>
      )}
      {roomState === 'joined' && (
        <>
          <center className="flex flex-col rounded-t-3xl w-full h-64 border-b border-gray-700 ">
            <DyteDialogManager meeting={meeting} />
            <div className="flex justify-between w-full pt-4 text-white">
              <div
                id="header-left"
                className="flex w-1/3 justify-start items-center h-[48px] px-4"
              >
                <DyteRecordingIndicator meeting={meeting} />
              </div>
              <div
                id="header-center"
                className="flex gap-2 w-1/3 items-center justify-center h-[48px]"
              >
                <DyteRecordingToggle
                  meeting={meeting}
                  variant="button"
                  size="sm"
                />
                <DyteMicToggle meeting={meeting} size="sm" />
                <DyteCameraToggle meeting={meeting} size="sm" />
                <DyteLeaveButton size="sm" />
              </div>
              <div
                id="header-right"
                className="flex w-1/3 items-center  justify-end h-[48px] px-4"
              >
                <DyteParticipantCount meeting={meeting} />
              </div>
            </div>
            <div className="justify-center w-full h-full">
              <DyteGrid meeting={meeting} className="w-1/4" />
            </div>
          </center>
        </>
      )}
    </div>
  );
};

export default DyteMeetingUI;
