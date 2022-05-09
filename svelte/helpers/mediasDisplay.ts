import type { NftType } from "lib/ktypes";
import { nftGetImageLink } from "lib/knft-get-metadata";

const divMediaImage = (src: string, alt = "image", height?: number) => {
  const heightString = height ? `height="${height}"` : "";
  return `<img alt=${alt} src=${src} ${heightString}/>`;
};

const divMediaVideo = (src: string, small = true) => {
  let video: string;
  if (small) {
    video = "<video preload=\"metadata\" style=\"border-radius: initial;\">";
  } else {
    video =
      "<video autoplay=\"true\"  controls=\"\" controlslist=\"nodownload\" loop=\"\" playsinline=\"\" preload=\"metadata\" style=\"border-radius: initial;\">";
  }
  video += `<source src="${src}" type="video/mp4"></video>`;
  return video;
};

const divMedia = (nft: NftType, index: number, small = false, display: string = "grid") => {
  const mediaContentType = nft.contentType?.split("/");
  const mediaType = mediaContentType[0] || "image";

  const mediaSrc = nftGetImageLink(nft);
  let div: string = "";
  if (small) {
    if ("list" === display) {
      div = `<div id="media-small-${index}" class="media media-small media-${mediaType}">`;
    } else {
      div += `<div id="media-small-${index}" class="media media-grid media-${mediaType}">`;
    }
  } else {
    if ("list" === display) {
      div = `<div id="media-full-${index}" class="media media-${mediaType}">`;
    } else {
      div += `<div id="media-full-${index}" class="media media-grid media-${mediaType}">`;
    }
  }
  div += "<div class='a-simul-cursor'>";
  if (mediaType == "video") {
    div += divMediaVideo(mediaSrc, small);
  } else if (mediaType == "image") {
    div += divMediaImage(mediaSrc, nft?.name);
  } else {
    div += "<div class='media-text'></div>";
  }
  div += "</div>";
  div += "</div>";

  // console.log("divMedia div", div);
  return div;
};

export { divMedia };
