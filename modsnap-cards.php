<?php
/**
 * Plugin Name: Modsnap Custom Cards
 * Description: A custom plugin made for Dindy with ❤️. This imitates AWSM Team cards, but makes it more adpated for what Modsnap needs.
 * Version: 1.0
 * Author: Matthew Mogavero
 * Author URI: https://mogavero.dev
 * Text domain: modsnap-cards
 *
 * @package modsnap-custom-cards
 */

add_action("wp_enqueue_scripts", "modsnap_cards_external");
function modsnap_cards_external()
{
  wp_enqueue_style(
    "modsnap-cards",
    plugin_dir_url(__FILE__) . "./css/ms-cards.css"
  );
  wp_enqueue_script("modsnap-cards", plugin_dir_url(__FILE__) . "js/drawer.js");
}

// Register card post type
add_action("init", "modsnap_register_post_type");
function modsnap_register_post_type()
{
  $labels = [
    "name" => __("Cards"),
    "singular_name" => __("Card"),
    "add_new" => __("Add New", "modsnap-cards"),
    "add_new_item" => __("Add New Card"),
    "featured_image" => "Card Image",
    "set_featured_image" => "Add Card Image",
  ];
  $args = [
    "labels" => $labels,
    "has_archive" => true,
    "public" => true,
    "hierarchical" => false,
    "supports" => [
      "title",
      "editor",
      // 'excerpt',
      // 'custom-fields',
      "thumbnail",
      // 'page-attributes',
    ],
    "rewrite" => ["slug" => "cards"],
    "show_in_rest" => true,
    "show_in_admin_bar" => false,
    "show_in_nav_menus" => false,
    "publicly_queryable" => false,
    "query_var" => false,
    "menu_position" => 20,
    "menu_icon" => "dashicons-grid-view",
  ];
  register_post_type("modsnap_card", $args);
}

function modsnap_get_backend_preview_thumb($post_ID)
{
  $post_thumbnail_id = get_post_thumbnail_id($post_ID);
  if ($post_thumbnail_id) {
    $post_thumbnail_img = wp_get_attachment_image_src(
      $post_thumbnail_id,
      "thumbnail"
    );
    return $post_thumbnail_img[0];
  }
}

add_filter("manage_modsnap_card_posts_columns", "modsnap_filter_posts_columns");
function modsnap_filter_posts_columns($columns)
{
  $columns = [
    "cb" => '<input type="checkbox" />',
    "featured_image" => __("Image", "modsnap-cards"),
    "title" => __("Name", "modsnap-cards"),
    "subheading" => __("Subheading", "modsnap-cards"),
    "taxonomy-modsnap_category" => __("Categories", "modsnap-cards"),
    "date" => __("Date"),
  ];
  return $columns;
}

add_action(
  "manage_modsnap_card_posts_custom_column",
  "modsnap_card_column",
  10,
  2
);
function modsnap_card_column($column, $post_id)
{
  // Image column
  if ("featured_image" === $column) {
    echo get_the_post_thumbnail($post_id, [80, 80]);
  }
  // Subheader column
  if ("subheader" === $column) {
    $price = get_post_meta($post_id, "price_per_month", true);

    if (!$price) {
      _e("n/a");
    } else {
      echo '$ ' . number_format($price, 0, ".", ",") . " p/m";
    }
  }
}

add_action("init", "modsnap_register_taxonomy");
function modsnap_register_taxonomy()
{
  $labels = [
    "name" => __("Categories"),
    "singular_name" => __("Category"),
    "search_items" => __("Search Categories"),
    "all_items" => __("All Categories"),
    "edit_item" => __("Edit Category"),
    "update_item" => __("Update Categories"),
    "add_new_item" => __("Add New Category"),
    "new_item_name" => __("New Category Name"),
    "menu_name" => __("Categories"),
  ];

  $args = [
    "labels" => $labels,
    "hierarchical" => true,
    "sort" => true,
    "args" => ["orderby" => "term_order"],
    "rewrite" => ["slug" => "category"],
    "show_admin_column" => true,
    "show_in_rest" => true,
  ];

  register_taxonomy("modsnap_category", ["modsnap_card"], $args);
}

add_action("init", function () {
  wp_register_script(
    "ms-block-js",
    plugin_dir_url(__FILE__) . "build/js/modsnap-cards-block.js"
  );

  register_block_type("modsnap/cards-grid", [
    "editor_script" => "ms-block-js",
    "render_callback" => "ms_block_render",
    "attributes" => [
      "myRichHeading" => [
        "type" => "string",
      ],
      "myRichText" => [
        "type" => "string",
      ],
      "textAlignment" => [
        "type" => "string",
        "default" => "center",
      ],
      "toggle" => [
        "type" => "boolean",
        "default" => true,
      ],
      "favoriteAnimal" => [
        "type" => "string",
        "default" => "dogs",
      ],
      "favoriteColor" => [
        "type" => "string",
        "default" => "#DDDDDD",
      ],
      "activateLasers" => [
        "type" => "boolean",
        "default" => false,
      ],
      "selectedPostId" => [
        "type" => "number",
        "default" => 0,
      ],
      "selectedCategoryId" => [
        "type" => "number",
        "default" => 0,
      ],
    ],
  ]);
});

function ms_block_render($attr, $content)
{
  $whatToShow = "";
  if ($attr["selectedCategoryId"] > 0) {
    $categoryId = $attr["selectedCategoryId"];
    if (!$categoryId) {
      return $whatToShow;
    }
    $args = [
      "post_type" => "modsnap_card",
      "post_status" => "publish",
      "tax_query" => [
        [
          "taxonomy" => "modsnap_category",
          "field" => "term_id",
          "terms" => $categoryId,
        ],
      ],
      "orderby" => "title",
      "order" => "ASC",
    ];
    $query = new WP_Query($args);
    if ($query->have_posts()):
      $whatToShow = '<div class="ms-cards__container">';
      $whatToShow .= '<div class="ms-cards__wrapper">';
      while ($query->have_posts()):
        $query->the_post();
        $featured_img_url = get_the_post_thumbnail_url(get_the_ID(), "medium");
        $whatToShow .= '<div class="ms-card">';
        $whatToShow .=
          '<figure><img src="' .
          esc_url($featured_img_url) .
          '" alt="" width="300" height="300" />
          <figcaption>
          <h3>' .
          get_the_title() .
          '</h3>
          <p>Something goes here</p>
          </figcaption>
          </figure>
          ';
        $whatToShow .= '<div class="ms-card-details">';
        $whatToShow .= "<h3>" . get_the_title() . "</h3>";
        $whatToShow .= get_the_content();
        $whatToShow .= "</div>";
        $whatToShow .= "</div>";
      endwhile;
      $whatToShow .= "</div>";
      $whatToShow .= "</div>";
    endif;
    wp_reset_postdata(); //important
  }
  return $whatToShow;
}