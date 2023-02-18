<script lang="ts">
  /////////////////////////////////////////////////
  //  <MediaDisplayImage {mediaSrc} {alt}? {height}? />
  // Display Image
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let alt: string = "image";
  export let height: number = undefined;
</script>

<img src={mediaSrc} {alt} height={height ? `${height}px` : ""} />
