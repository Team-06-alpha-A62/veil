export const createDyteMeeting = async (): Promise<string> => {
  const url = 'https://api.dyte.io/v2/meetings';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization:
        'Basic YThhNTAxM2UtODFhYy00ZWRhLTlhYzctN2ZjMTNiNzIzYjc4OmFjNDY3MmIzMTVmNGU4ZjkwNzVi',
    },
    body: '{"title":"string","preferred_region":"ap-south-1","record_on_start":false,"live_stream_on_start":false,"recording_config":{"max_seconds":60,"file_name_prefix":"string","video_config":{"codec":"H264","width":1280,"height":720,"watermark":{"url":"http://example.com","size":{"width":1,"height":1},"position":"left top"},"export_file":true},"audio_config":{"codec":"AAC","channel":"stereo","export_file":true},"storage_config":{"type":"aws","access_key":"string","secret":"string","bucket":"string","region":"us-east-1","path":"string","auth_method":"KEY","username":"string","password":"string","host":"string","port":0,"private_key":"string"},"dyte_bucket_config":{"enabled":true}},"ai_config":{"transcription":{"keywords":["string"],"language":"en-US","profanity_filter":false},"summarization":{"word_limit":500,"text_format":"markdown","summary_type":"general"}},"persist_chat":false,"summarize_on_end":false}',
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data.data.id;
};

export const addDyteMeetingParticipant = async (
  meetingId: string,
  preset: string,
  username: string,
  avatarUrl: string
) => {
  const url = `https://api.dyte.io/v2/meetings/${meetingId}/participants`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization:
        'Basic YThhNTAxM2UtODFhYy00ZWRhLTlhYzctN2ZjMTNiNzIzYjc4OmFjNDY3MmIzMTVmNGU4ZjkwNzVi',
    },
    body: `{"name":"${username}","picture":"${
      avatarUrl ||
      'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png'
    }","preset_name":"${preset}","custom_participant_id":"string"}`,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data.data.token;
};
