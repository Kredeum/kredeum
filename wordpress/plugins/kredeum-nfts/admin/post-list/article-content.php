<?php
/**
 * Article content
 *
 * @package kredeum/nfts
 */

namespace KredeumNFTs\Storage;

/**
 * Kredeum NFTs post html to pdf content
 *
 * @param string $post_title .
 * @param string $post_author .
 * @param string $post_date .
 * @param string $post_content .
 * @param string $featured_image_url url of post featured image.
 *
 * @return string html string to build in pdf
 */
function html_content_get( $post_title, $post_author, $post_date, $post_content, $featured_image_url ) {

	return '
        <html>
        <head>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, Helvetica, sans-serif;
                padding: 60px;
            }
            
            h1 {
                margin-bottom: 1em;
            }
            
            h2, h3, h4, h5, h6 {
                margin-bottom: 0.5em;
            }
            
            ul, ol {
                margin-bottom: 1em;
                padding-left: 1em;
            }
            
            .nftcovercontainer {
                page-break-after: always;
                height: 100%;
                // margin: auto;
            }
            
            .nftcover {
                height: 580px;
                width: 580px;
                border: 2px solid black;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
            
            .coverimg {
                background-color: black;
                width: 100%;
                height: 350px;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            
            .nftcovertext {
                padding: 30px;
            }
            
            .content {
                // padding: 60px;
            }
            
            .content p {
                margin-bottom: 1em;
            }
                                        
            .content img {
                max-width: 100%;
                width: auto;
                height: 200px;
                margin-bottom: 1em;
            }							
        </style>
        </head>
        <body>
            <div class="nftcovercontainer">
                <div class="nftcover">
                    <div class="coverimg" style="background-image: url(' . $featured_image_url . ')"></div>
                    <div class="nftcovertext">
                        <h1>' . $post_title . '</h1>
                        <p><strong>Author:</strong> ' . $post_author . '</p>
                        <p><strong>Date:</strong> ' . $post_date . '</p>
                    </div>
                </div>
            </div>
            <div class="content">' .
				$post_content . '
            </div>
        </body>
        </html>
    ';
}
