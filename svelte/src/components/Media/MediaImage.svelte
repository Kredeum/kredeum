<script lang="ts">
  /////////////////////////////////////////////////
  //  <MediaImage {src} {alt}? {height}? />
  // Display Image
  /////////////////////////////////////////////////
  export let src: string;
  export let alt: string = "image";
  export let height: number | undefined = undefined;
</script>

<img {src} {alt} height={height ? `${height}px` : ""} />
