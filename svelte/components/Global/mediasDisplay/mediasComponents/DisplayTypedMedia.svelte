<script lang="ts">
  import { onMount } from "svelte";

  import DisplayImage from "./DisplayImage.svelte";
  import DisplayVideo from "./DisplayVideo.svelte";
  import DisplayAudio from "./DisplayAudio.svelte";

  /////////////////////////////////////////////////
  //  <DisplayTypedMedia {mediaSrc} {index} {mediaType} {displayMode} {alt}? />
  // Display a media according to its type and entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string | {};
  export let index: number;
  export let mediaType: string;
  export let displayMode: { target: string; small: boolean };
  export let alt: string = mediaType;

  let small: string = displayMode.small ? "small" : "full";
  let media: string = "list" === displayMode.target ? "media-small" : "media-grid";
  let gridScale: string = "grid" === displayMode.target ? " a-simul-cursor" : "";

  let coverImage: string;
  let animation_url: string = "";

  // $: "object" === typeof mediaSrc ? (animation_url = mediaSrc.animation_url) : (animation_url = "");
  $: mediaSrc && uptadeMediaSrc();

  const uptadeMediaSrc = () => {
    if ("object" === typeof mediaSrc) {
      animation_url = mediaSrc.animation_url;
      coverImage = mediaSrc.mediaSrc;
    }
  };

  // onMount(() => uptadeMediaSrc());

  $: console.log("🚀 ~ file: MediasDisplayer.svelte ~ line 30 ~ mediaSrc", mediaSrc);
</script>

<div id="media-{small}-{index}" class="media {media} media-{mediaType}{gridScale}">
  {#if "" === animation_url}
    {#if "image" === mediaType}
      <DisplayImage {mediaSrc} {alt} />
    {:else if "video" === mediaType}
      <DisplayVideo {mediaSrc} small={displayMode.small} />
    {/if}
  {:else if coverImage}
    <DisplayAudio
      mediaSrc={coverImage}
      {animation_url}
      small={displayMode.small}
      deployed={"preview" === displayMode.target}
      {alt}
    />
  {/if}
</div>
