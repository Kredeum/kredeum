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
        'https://gateway.pinata.cloud' => 'https://gateway.pinata.cloud',
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
      'uid' => 'ipfs_pinata_key',
      'label' => 'IPFS_PINATA_KEY',
      'section' => 'first_section',
      'type' => 'text',
      'placeholder' => 'pinata key',
      'default' => '',
      'helper' => __('Enter your Pinata Key', 'kipfs'),
    ),
    array(
      'uid' => 'ipfs_pinata_secret',
      'label' => 'IPFS_PINATA_SECRET',
      'section' => 'first_section',
      'type' => 'text',
      'placeholder' => 'pinata secret',
      'default' => '',
      'helper' => __('Enter your Pinata Secret', 'kipfs'),
    ),
    array(
      'uid' => 'metamask_address',
      'label' => 'METAMASK_ADDRESS',
      'section' => 'first_section',
      'type' => 'metamask',
      'placeholder' => 'Connect to Metamask to get address'
    )
  );
}
