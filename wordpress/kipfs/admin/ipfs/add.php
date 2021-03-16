<?php
// ipfs add file
// return cid
function ipfs_add($attachmentId, $version = IPFS_CID_VERSION)
{
  $api = new RestClient(['base_url' => IPFS_API]);

  $boundary = md5(time());
  $file = file_get_contents(get_attached_file($attachmentId));
  $parts = array(
    array(
      "type" => "file",
      "name" => ipfs_get_attached_file_meta($attachmentId)->filename,
      "content" => $file,
    ),
  );
  $buffer = $api->multipart($parts, $boundary);
  $headers = [
    'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
    'Content-Length' => strlen($buffer),
  ];
  
  $result = $api->post("/add?cid-version=$version", $buffer, $headers);

  return ($result->info->http_code == 200) ? $result->decode_response()->Hash :  $result->error;
}
