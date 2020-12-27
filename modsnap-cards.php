<?php
/**
 * Plugin Name: Modsnap Custom Cards
 * Description: A custom plugin made for Dindy with ❤️. This extends Toolset with cards.
 * Version: 1.2
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

add_action("init", function () {
  wp_register_script(
    "ms-block-js",
    plugin_dir_url(__FILE__) . "build/js/modsnap-cards-block.js"
  );

  register_block_type("modsnap/cards-grid", [
    "editor_script" => "ms-block-js",
    "render_callback" => "ms_block_render",
    "attributes" => [
      "setCardLimit" => [
        "type" => "number",
        "default" => 3,
      ],
      "selectedCategoryId" => [
        "type" => "number",
        "default" => 0,
      ],
      "selectedDealType" => [
        "type" => "string",
        "default" => "",
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
      "post_type" => "deal",
      "post_status" => "publish",
      "tax_query" => [
        [
          "taxonomy" => strval($attr["selectedDealType"]),
          "field" => "term_id",
          "terms" => $categoryId,
        ],
      ],
      "orderby" => "title",
      "order" => "ASC",
    ];
    $query = new WP_Query($args);

    if ($query->have_posts()):
      $i = 1;
      $whatToShow = '<div class="ms-cards__container">';
      $whatToShow .= '<div class="ms-cards__wrapper">';
      while ($query->have_posts() && $i <= $attr["setCardLimit"]):
        $i++;
        $query->the_post();
        $dealImageUrl = get_post_meta(get_the_ID(), "wpcf-deal-image", true);
        $whatToShow .= '<div class="ms-card">';
        $whatToShow .=
          '<div class="card-image" style="background-image: url(' .
          esc_url($dealImageUrl) .
          ');">
          <div class="image-caption">
          <h3 class="image-caption-title">' .
          get_the_title() .
          '</h3>
          <div class="ms-open-button"></div>
          </div>
          </div>
          ';
        $whatToShow .= '<div class="ms-card-details">';
        $whatToShow .= '<div class="ms-close-button"></div>';
        $whatToShow .= '<div class="details__wrapper">';
        // Left side
        $whatToShow .= '<div class="details--left">';
        $whatToShow .=
          '<h3 class="details-heading">' . get_the_title() . "</h3>";
        $whatToShow .=
          '<p class="details-content">' . get_the_content() . "</p>";
        // End .details--left
        $whatToShow .= "</div>";
        // Right side
        $whatToShow .= '<div class="details--right">';
        $whatToShow .= '<div class="details-highlights">';
        $whatToShow .= "<div>";
        // Display location
        $whatToShow .= '<p class="single-dynamic">';
        $whatToShow .= '<span class="single-sm-heading">Location</span><br/>';
        $whatToShow .=
          types_render_field("city") . ", " . types_render_field("state");
        $whatToShow .= "</p>";
        // Display keys
        if (types_render_field("keys")) {
          $whatToShow .= '<p class="single-dynamic">';
          $whatToShow .= '<span class="single-sm-heading">Keys</span><br/>';
          $whatToShow .= types_render_field("keys");
          $whatToShow .= "</p>";
        }
        // Display "units"
        if (types_render_field("units")) {
          $whatToShow .= '<p class="single-dynamic">';
          $whatToShow .= '<span class="single-sm-heading">Units</span><br/>';
          $whatToShow .= types_render_field("units");
          $whatToShow .= "</p>";
        }
        // Display square feet
        if (types_render_field("sf")) {
          $whatToShow .= '<p class="single-dynamic">';
          $whatToShow .=
            '<span class="single-sm-heading">Square Feet</span><br/>';
          $whatToShow .= types_render_field("sf");
          $whatToShow .= "</p>";
        }
        $whatToShow .= "</div>";
        $whatToShow .= "<div>";
        // Display transaction value
        $whatToShow .= '<p class="single-dynamic">';
        $whatToShow .=
          '<span class="single-sm-heading">Transaction Value</span><br/>';
        $whatToShow .= "$" . types_render_field("transaction-value");
        $whatToShow .= "</p>";
        // Display "type"
        if (types_render_field("deal-type")) {
          $whatToShow .= '<p class="single-dynamic">';
          $whatToShow .= '<span class="single-sm-heading">Type</span><br/>';
          $whatToShow .= types_render_field("deal-type");
          $whatToShow .= "</p>";
        }
        $whatToShow .= "</div>";
        // End .details-highlights
        $whatToShow .= "</div>";
        // End .details--right
        $whatToShow .= "</div>";

        $whatToShow .= "</div>";
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