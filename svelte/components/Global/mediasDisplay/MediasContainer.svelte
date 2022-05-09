<script lang="ts">
  import { NftType } from "lib/ktypes";

  export let nft: NftType;
  export let MIMEType: string = "image";
  export let MIMESubtype: string = "jpeg";
  export let imgLink: string = "";

  $: mediaContentType = nft.contentType?.split("/");
  $: MIMEType = mediaContentType[0];
  $: MIMESubtype = mediaContentType[1];
</script>
