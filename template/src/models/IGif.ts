export interface IGif {
  id: string;
  slug: string;
  url: string;
  bitly_url: string;
  embed_url: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
      size: string;
      frames: string;
      mp4: string;
      mp4_size: string;
      webp: string;
      webp_size: string;
    };
  };
}
