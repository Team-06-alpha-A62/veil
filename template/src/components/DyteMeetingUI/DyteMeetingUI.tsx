import {
  DyteClock,
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
import { decrementChannelParticipantsCount } from '../../services/channel.service.ts';

interface DyteMeetingProps {
  setCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelId: string;
}

const DyteMeetingUI: React.FC<DyteMeetingProps> = ({ setCall, channelId }) => {
  const { currentUser } = useAuth();
  const { meeting } = useDyteMeeting();

  const roomState = useDyteSelector(m => m.self.roomState);

  useEffect(() => {
    const updateChannelMeetingState = async () => {
      await decrementChannelParticipantsCount(channelId);
    };
    console.log(roomState);
    if (roomState === 'left' || roomState === 'ended') {
      setTimeout(() => {
        if (roomState === 'ended') {
          updateChannelMeetingState();
        }
        setCall(prev => !prev);
      }, 1000);
    }
  }, [roomState]);

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
        <center className="rounded-t-3xl w-full h-56 border-b border-gray-700">
          <DyteDialogManager meeting={meeting} />
          <div className="flex justify-between w-full text-white">
            <div id="header-left" className="flex items-center h-[48px]">
              <DyteRecordingIndicator meeting={meeting} />
            </div>
            <div id="header-right" className="flex items-center h-[48px] p-4">
              <DyteParticipantCount meeting={meeting} />
            </div>
          </div>
          <DyteGrid meeting={meeting} />
          <div className="flex h-40 gap-2 justify-center items-end">
            <DyteMicToggle meeting={meeting} size="md" />
            <DyteCameraToggle meeting={meeting} size="md" />
            <DyteLeaveButton size="md" />
          </div>
        </center>
      )}
      {roomState === 'ended' && (
        <center className="w-full flex justify-center items-center h-40">
          <h3>You have left the meeting</h3>
        </center>
      )}
    </div>
  );

  // return (
  //   <>
  //     <div>
  //       <DyteGrid className="rounded-t-3xl" meeting={meeting} />
  //     </div>
  //     <div>
  //       <DyteCameraToggle meeting={meeting} size="sm" />
  //       <DyteMicToggle meeting={meeting} size="sm" />
  //     </div>
  //   </>
  // );
};

export default DyteMeetingUI;
