const supportedImageFormats = ["jpeg", "png", "webp", "svg+xml", "bmp", "x-icon", "vnd.microsoft.icon", "gif"];
const supportedAudiosFormats = ["mpeg", "wav", "x-wav", "aac", "ogg"];

const handleMediaType = (uploadedMediatypes: Array<string>): string => {
  let selectedMediaType = "";
  if (uploadedMediatypes) {
    switch (uploadedMediatypes[0]) {
    // case "video":
    //   selectedMediaType = "video";
    //   break;
    case "image":
      if (supportedImageFormats.includes(uploadedMediatypes[1])) {
        if (uploadedMediatypes[1] === "gif") {
          selectedMediaType = "gif";
        } else {
          selectedMediaType = "image";
        }
      }
      break;
      // case "text":
      //   if (uploadedMediatypes[1] === "html") {
      //     selectedMediaType = "web";
      //   } else {
      //     selectedMediaType = "text";
      //   }
      //   break;
      // case "application":
      //   if (uploadedMediatypes[1] === "pdf") {
      //     selectedMediaType = "text";
      //   } else {
      //     selectedMediaType = "text";
      //   }
      //   break;
    case "audio":
      if (supportedAudiosFormats.includes(uploadedMediatypes[1])) selectedMediaType = "audio";
      break;
    default:
      selectedMediaType = "";
      break;
    }
  }

  return selectedMediaType;
};

export { handleMediaType };
