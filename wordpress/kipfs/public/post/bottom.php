<?php
// add IPFS content at bottom of post
add_filter('the_content', function ($content)
{
  if (is_singular() && in_the_loop() && is_main_query()) {
    $content .= ipfs_links();
  }
  return $content;
});
