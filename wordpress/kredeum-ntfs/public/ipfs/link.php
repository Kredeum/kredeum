<?php
// return IPFS url from CID
function ipfs_url($cid)
{
  return $cid ? IPFS_GATEWAY . "/ipfs/$cid" : "";
}

// return IPFS link from CID
function ipfs_link($cid, $text = "")
{
  if (!$text) $text = $cid;
  $url = ipfs_url($cid);

  return $cid ? "<a href='$url'>$text</a>" : "";
}
