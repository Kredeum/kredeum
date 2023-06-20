<?php
/**
 * Posts columns
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/// Posts
add_filter('manage_posts_columns', function ($columns) {
	$columns['kre-post-archive'] = __( 'Article archive', 'article-archive' );
	$columns['kre-post-uri'] = __( 'Article uri', 'article-uri' );
	return $columns;
});


add_action(
	'manage_posts_custom_column',
	function ($column, $post_id) {
		if ($column === 'kre-post-archive') {
			echo '<a href="#" class="button">Archive</a>';
		}
	},
	10,
	2
);