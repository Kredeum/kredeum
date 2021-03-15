<?php

function kipfs_fields()
{
  return array(
    array(
      'uid' => 'ipfs_auto',
      'label' => 'IPFS_AUTO',
      'section' => 'first_section',
      'type' => 'select',
      'options' => array(__('No', 'kipfs'), __('Yes', 'kipfs'),),
      'default' => '0',
      'helper' => __('Check to automaticaly push your new medias to IPFS on upload', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_cid_version',
      'label' => 'IPFS_CID_VERSION',
      'section' => 'first_section',
      'section' => 'first_section',
      'type' => 'select',
      'options' => array(0, 1),
      'default' => '0',
      'helper' => __('Choose IPFS CID version', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_gateway',
      'label' => 'IPFS_GATEWAY',
      'section' => 'first_section',
      'type' => 'select',
      'options' => array(
        'https://dweb.link' => 'https://dweb.link',
        'https://ipfs.io' => 'https://ipfs.io',
        'https://ipfs.infura.io' => 'https://ipfs.infura.io',
        'http://ipfs.kredeum.tech:8080' => 'http://ipfs.kredeum.tech:8080',
        'http://ipfs.lan' => 'http://ipfs.lan',
        'http://127.0.0.1:8080' => 'http://127.0.0.1:8080',
      ),
      'default' => 'https://ipfs.infura.io',
      'helper' => __('Choose your prefered IPFS gateway', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_api',
      'label' => 'IPFS_API',
      'section' => 'first_section',
      'type' => 'select',
      'options' => array(
        'http://192.168.1.43:5001/api/v0' => 'http://192.168.1.43:5001/api/v0',
        'http://ipfs.kredeum.tech:5001/api/v0' => 'http://ipfs.kredeum.tech:5001/api/v0',
        'https://ipfs.infura.io:5001/api/v0' => 'https://ipfs.infura.io:5001/api/v0',
        'http://localhost:5001/api/v0' => 'http://localhost:5001/api/v0',
      ),
      'default' => 'https://ipfs.infura.io:5001/api/v0',
      'helper' => __('Choose your prefered IPFS API', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_cluster_api',
      'label' => 'IPFS_CLUSTER_API',
      'section' => 'first_section',
      'type' => 'select',
      'options' => array('http://192.168.1.43:9094'=> 'http://192.168.1.43:9094'),
      'default' => 'http://192.168.1.43:9094',
      'helper' => __('Choose your prefered IPFS Cluster API', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_pinning_api',
      'label' => 'IPFS_PINNING_API',
      'section' => 'first_section',
      'type' => 'select',
      'options' => array(false),
      'default' => false,
      'helper' => __('Choose your prefered IPFS Pinning API', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_pinata_key',
      'label' => 'IPFS_PINATA_KEY',
      'section' => 'first_section',
      'type' => 'text',
      'placeholder' => 'pinata key',
      'default' => '',
      'helper' => __('Enter your Pinata Key', 'kipfs'),
    ),
  );
}
