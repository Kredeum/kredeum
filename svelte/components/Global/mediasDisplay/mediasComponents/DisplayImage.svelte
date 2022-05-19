<script lang="ts">
  /////////////////////////////////////////////////
  //  <DisplayImage {mediaSrc} {alt}? {height}? />
  // Display a Image according to its entering parameters
  /////////////////////////////////////////////////
  export let mediaSrc: string;
  export let alt: string = "image";
  export let height: number = undefined;
</script>

<img src={mediaSrc} {alt} height={height ? height : undefined} />
