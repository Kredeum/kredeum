<?php
// ipfs pinata insert file (add and pin)
// return cid
function ipfs_pinata_insert($attachmentId, $version = IPFS_CID_VERSION)
{
  $api = new RestClient(['base_url' => IPFS_PINATA_API]);

  $boundary = md5(time());
  $file = file_get_contents(get_attached_file($attachmentId));
  $filename = ipfs_get_attached_file_meta($attachmentId)->filename;
  $parts = array(
    array(
      "type" => "file",
      "name" => $filename,
      "content" => $file,
    ),
    array(
      "type" => "json",
      "name" => "pinataOptions",
      "content" => '{"cidVersion": "' . $version . '"}'
    ),
    array(
      "type" => "json",
      "name" => "pinataMetadata",
      "content" => '{"name": "' . $filename . '", "keyvalues":{ "address": "0x123"}}'
    )
  );

  $buffer = $api->multipart($parts, $boundary);
  $headers = [
    'pinata_api_key' => IPFS_PINATA_KEY,
    'pinata_secret_api_key' => IPFS_PINATA_SECRET,
    'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
    'Content-Length' => strlen($buffer),
  ];
  $result = $api->post("/pinning/pinFileToIPFS", $buffer, $headers);

  // echo 'KO';
  // var_dump($result);

  return ($result->info->http_code == 200) ? $result->decode_response()->IpfsHash :  $result->error;
}
