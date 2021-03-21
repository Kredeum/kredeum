<?php

add_action('admin_menu', 'nfts_menu');
function nfts_menu()
{
  add_menu_page(
    __('NFTs Kredeum', 'kipfs'),
    __('NFTs', 'kipfs'),
    'edit_posts',
    'nfts',
    'nfts_options',
    'dashicons-format-gallery',
    11
  );
  add_submenu_page(
    'nfts',
    __('NFTs Kredeum', 'kipfs'),
    __('NFTs Kredeum', 'kipfs'),
    'edit_posts',
    'nfts'
  );
}
function nfts_options()
{
  echo '<kredeum-nft/>';
}
