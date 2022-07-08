const handleMediaType = (uploadedMediatypes: Array<string>): string => {
  let selectedMediaType = "";
  if (uploadedMediatypes) {
    switch (uploadedMediatypes[0]) {
    case "video":
      selectedMediaType = "video";
      break;
    case "image":
      if (uploadedMediatypes[1] === "gif") {
        selectedMediaType = "gif";
      } else {
        selectedMediaType = "image";
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
      selectedMediaType = "audio";
      break;
    default:
      selectedMediaType = "";
      break;
    }
  }

  return selectedMediaType;
};

export { handleMediaType };
