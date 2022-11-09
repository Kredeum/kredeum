type Mediatype = "image" | "gif" | "audio";

const SUPPORTED_MEDIATYPES = {
  image: {
    label: ".png, .jpg, .jpeg, .webp, .svg, .bmp, .ico",
    format: "image/png, image/jpeg, image/webp, image/svg+xml, image/bmp, image/x-icon"
  },
  gif: {
    label: ".gif",
    format: "image/gif"
  },
  audio: {
    label: ".mp3, .wav, .ogg, .aac",
    format: "audio/mpeg, audio/wav, audio/x-wav, audio/ogg, .aac"
  }
};

const getSupportedImage = (mediaType: Mediatype): string => {
  return mediaType === "audio"
    ? SUPPORTED_MEDIATYPES.image.format.concat(", ", SUPPORTED_MEDIATYPES.gif.format)
    : SUPPORTED_MEDIATYPES[mediaType].format;
};

export type { Mediatype };
export { SUPPORTED_MEDIATYPES, getSupportedImage };
