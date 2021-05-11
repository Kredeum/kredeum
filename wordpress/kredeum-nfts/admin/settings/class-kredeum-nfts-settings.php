<?php
/**
 * Class derived from :
 * https://www.smashingmagazine.com/2016/04/three-approaches-to-adding-configurable-fields-to-your-plugin/
 * https://github.com/rayman813/smashing-custom-fields/blob/master/smashing-fields-approach-1/smashing-fields.php
 *
 * @package kredeum/nfts
 */

/**
 * Class Kredeum_Nfts_Settings
 *
 * @variable string $slug Settings slug
 */
class Kredeum_Nfts_Settings {

	/**
	 * Slug
	 *
	 * @var string $slug Settings slug
	 */
	private $slug = 'ipfs_settings';

	/**
	 * Constructor
	 */
	public function __construct() {
		// Hook into the admin menu.
		add_action( 'admin_menu', array( $this, 'page_create' ) );

		// Add Settings and Fields.
		add_action( 'admin_init', array( $this, 'sections_create' ) );
		add_action( 'admin_init', array( $this, 'fields_create' ) );
	}

	/**
	 * Page create
	 */
	public function page_create() {
		// Add the submenu item and page.
		$parent_slug = 'nfts';
		$page_title  = __( 'NFTs settings', 'kredeum-nfts' );
		$menu_title  = __( 'NFTs Settings', 'kredeum-nfts' );
		$capability  = 'upload_files';
		$menu_slug   = $this->slug;
		$callback    = array( $this, 'page_content' );
		$position    = 100;

		add_submenu_page( $parent_slug, $page_title, $menu_title, $capability, $menu_slug, $callback, $position );
	}

	/**
	 * Page content
	 */
	public function page_content() {
		echo '<div class="wrap">';
		echo '<h2>' . esc_html( __( 'NFTs Kredeum', 'kredeum-nfts' ) ) . '</h2>';

		echo '<form action="options.php" method="POST">';
		settings_fields( $this->slug );
		do_settings_sections( $this->slug );
		submit_button();
		echo '</form></div>';
	}

	/**
	 * Sections create
	 */
	public function sections_create() {
		add_settings_section( 'first_section', __( 'Settings', 'kredeum-nfts' ), array( $this, 'section_callback' ), $this->slug );
	}

	/**
	 * Sections callback
	 *
	 * @param array $arguments Arguments.
	 */
	public function section_callback( $arguments ) {
		switch ( $arguments['id'] ) {
			case 'first_section':
				echo '<p>' . esc_html( __( 'Here you can set IPFS options', 'kredeum-nfts' ) ) . '</p>';
				break;
		}
	}

	/**
	 * Fields Create
	 */
	public function fields_create() {
		$fields = kredeum_nfts_fields( $this->slug );

		foreach ( $fields as $field ) {
			add_settings_field( $field['uid'], $field['label'], array( $this, 'field_callback' ), $this->slug, $field['section'], $field );
			register_setting( $this->slug, $field['uid'] );
		}
	}

	/**
	 * Field callback
	 *
	 * @param array $arguments Arguments.
	 */
	public function field_callback( $arguments ) {
		$value = get_option( $arguments['uid'] );
		if ( ! $value ) {
			$value = $arguments['default'];
		}

		switch ( $arguments['type'] ) {
			case 'metamask':
				wp_nonce_field( 'nonce_action', 'nonce_field' );
				printf( '<kredeum-metamask />' );
				break;
			case 'text':
			case 'password':
			case 'number':
				printf( '<input name="%1$s" id="%1$s" type="%2$s" placeholder="%3$s" value="%4$s" />', esc_html( $arguments['uid'] ), esc_html( $arguments['type'] ), esc_html( $arguments['placeholder'] ), esc_html( $value ) );
				break;
			case 'textarea':
				esc_html( printf( '<textarea name="%1$s" id="%1$s" placeholder="%2$s" rows="5" cols="50">%3$s</textarea>', esc_html( $arguments['uid'] ), esc_html( $arguments['placeholder'] ), esc_html( $value ) ) );
				break;
			case 'select':
			case 'multiselect':
				if ( ! empty( $arguments['options'] ) && is_array( $arguments['options'] ) ) {
					$attributes     = '';
					$options_markup = '';
					foreach ( $arguments['options'] as $key => $label ) {
						$selected        = is_array( $value ) ? selected( $value[ array_search( $key, $value, true ) ], $key, false ) : '';
						$options_markup .= sprintf( '<option value="%s" %s>%s</option>', $key, $selected, $label );
					}
					if ( 'multiselect' === $arguments['type'] ) {
						$attributes = ' multiple="multiple" ';
					}
					printf( '<select name="%1$s[]" id="%1$s" %2$s>%3$s</select>', esc_html( $arguments['uid'] ), esc_html( $attributes ), esc_html( $options_markup ) );
				}
				break;
			case 'radio':
			case 'checkbox':
				if ( ! empty( $arguments['options'] ) && is_array( $arguments['options'] ) ) {
					$options_markup = '';
					$iterator       = 0;
					foreach ( $arguments['options'] as $key => $label ) {
						$iterator++;
						$options_markup .= sprintf( '<label for="%1$s_%6$s"><input id="%1$s_%6$s" name="%1$s[]" type="%2$s" value="%3$s" %4$s /> %5$s</label><br/>', $arguments['uid'], $arguments['type'], $key, checked( $value[ array_search( $key, $value, true ) ], $key, false ), $label, $iterator );
					}
					printf( '<fieldset>%s</fieldset>', esc_html( $options_markup ) );
				}
				break;
		}

		if ( array_key_exists( 'helper', $arguments ) ) {
			printf( '<span class="helper"> %s</span>', esc_html( $arguments['helper'] ) );
		}

		if ( array_key_exists( 'supplimental', $arguments ) ) {
			printf( '<p class="description">%s</p>', esc_html( $$arguments['supplimental'] ) );
		}
	}
}
new Kredeum_Nfts_Settings();
