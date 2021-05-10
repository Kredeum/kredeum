<?php
// ipfs nft storage insert file (add and pin)
// return cid
function ipfs_nft_storage_insert($attachmentId, $version = IPFS_CID_VERSION)
{
  $api = new RestClient(['base_url' => 'https://api.nft.storage']);

  $boundary = md5(time());
  $file = file_get_contents(get_attached_file($attachmentId));
  $filename = ipfs_get_attached_file_meta($attachmentId)->filename;
  $parts = array(
    array(
      "type" => "file",
      "name" => $filename,
      "content" => $file,
    )
  );

  $buffer = $api->multipart($parts, $boundary);
  $headers = [
    'Authorization' => 'Bearer ' . IPFS_NFT_STORAGE_KEY,
    'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
    'Content-Length' => strlen($buffer),
  ];
  $result = $api->post("/upload", $buffer, $headers);

  // var_dump($result->decode_response()->value->cid);
  // var_dump($result->decode_response()->value->files[0]->name);

  return ($result->info->http_code == 200) ?
    $result->decode_response()->value->cid . '/' .
    $result->decode_response()->value->files[0]->name
    :  $result->error;
}
