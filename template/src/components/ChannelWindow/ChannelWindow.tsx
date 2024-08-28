import React from 'react';
import { Channel } from '../../models/Channel.ts';
import { BsArrowReturnLeft } from 'react-icons/bs';

interface ChannelWindowProps {
  channel: Channel;
}

const ChannelWindow: React.FC<ChannelWindowProps> = ({ channel }) => {
  return (
    <div className="flex flex-col rounded-3xl border border-gray-700 bg-base-300 bg-opacity-50 p-6 h-full ">
      <header className="basis-1/10 h-auto flex-shrink-0">
        This is where all the controllers will be
      </header>
      <main className="basis-8/10 h-auto flex-1"></main>
      <div className="basis-1/10">
        <label className="input px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 focus:outline-none flex items-center gap-2">
          <input type="text" className="grow" placeholder="Type here" />
          <BsArrowReturnLeft />
        </label>
      </div>
    </div>
  );
};

export default ChannelWindow;
