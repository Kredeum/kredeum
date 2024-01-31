type Mediatype = "image" | "gif" | "audio" | "video" | "pdf";

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
    label: ".mp3, .wav, .ogg, .oga, .aac",
    format: "audio/mpeg, audio/wav, audio/x-wav, audio/ogg, .aac"
  },
  video: {
    label: ".mp4, .webm",
    format: "video/mp4, video/webm"
  },
  pdf: {
    label: ".pdf",
    format: "application/pdf"
  }
};

const getSupportedImage = (mediaType: Mediatype): string => {
  return mediaType === "audio" || mediaType === "pdf"
    ? SUPPORTED_MEDIATYPES.image.format.concat(", ", SUPPORTED_MEDIATYPES.gif.format)
    : SUPPORTED_MEDIATYPES[mediaType].format;
};

const getMediaSelection = (contentType: string): Mediatype => {
  let selectMediatype: Mediatype = "image";
  const types = contentType.split("/");
  const MIME1 = types[0];
  const MIME2 = types[1];

  if (Object.prototype.hasOwnProperty.call(SUPPORTED_MEDIATYPES, MIME1)) {
    selectMediatype = MIME1 as Mediatype;
  }
  if (Object.prototype.hasOwnProperty.call(SUPPORTED_MEDIATYPES, MIME2)) {
    selectMediatype = MIME2 as Mediatype;
  }

  return selectMediatype;
};

export type { Mediatype };
export { SUPPORTED_MEDIATYPES, getSupportedImage, getMediaSelection };
