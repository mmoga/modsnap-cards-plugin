/* eslint-disable react/display-name */
// https://awhitepixel.com/blog/wordpress-gutenberg-create-custom-block-tutorial/

const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const { __, _e } = wp.i18n;
const { ServerSideRender } = wp.editor;
const { withSelect, select } = wp.data;
const {
  RichText,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} = wp.blockEditor;
const {
  ToggleControl,
  TextControl,
  PanelBody,
  PanelRow,
  SelectControl,
  Button,
  Toolbar,
  Placeholder,
  Disabled,
} = wp.components;

class MSBlockEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: true,
    };
  }

  getBlockControls = () => {
    const { attributes, setAttributes } = this.props;

    return (
      <BlockControls>
        <Toolbar>
          <Button
            label={this.state.editMode ? 'Preview' : 'Edit'}
            icon={this.state.editMode ? 'format-image' : 'edit'}
            className="my-custom-button"
            onClick={() => this.setState({ editMode: !this.state.editMode })}
          />
        </Toolbar>
      </BlockControls>
    );
  };

  render() {
    const { attributes, setAttributes } = this.props;
    const choicesDeals = [];
    const choicesFinancial = [];

    if (this.props.taxonomiesDeal) {
      choicesDeals.push({
        value: 0,
        label: __('Select a category', 'modsnap'),
        disabled: true,
      });
      this.props.taxonomiesDeal.forEach((category) => {
        // console.log(category);
        choicesDeals.push({ value: category.id, label: category.name });
      });
    } else {
      choicesDeals.push({ value: 0, label: __('Loading...', 'modsnap') });
    }

    if (this.props.taxonomiesFinancial) {
      choicesFinancial.push({
        value: 0,
        label: __('Select a category', 'modsnap'),
        disabled: true,
      });
      this.props.taxonomiesFinancial.forEach((category) => {
        // console.log(category);
        choicesFinancial.push({ value: category.id, label: category.name });
      });
    } else {
      choicesFinancial.push({ value: 0, label: __('Loading...', 'modsnap') });
    }

    return [
      // this.getInspectorControls(),
      this.getBlockControls(),

      <div>
        {this.state.editMode && (
          <Fragment>
            {/* Add a select for the taxonomy types. 
                  Then get the category ID of it, like the select below */}
            <SelectControl
              label={__('Select a type of deal', 'modsnap')}
              options={[
                { value: null, label: 'Select a type', disabled: true },
                { value: 'experience-type', label: 'Deal' },
                { value: 'financial-type', label: 'Financial' },
              ]}
              value={attributes.selectedDealType}
              onChange={(newval) => {
                setAttributes({ selectedDealType: newval });
                setAttributes({ selectedCategoryId: 0 });
              }}
            />

            {attributes.selectedDealType === 'experience-type' ? (
              <SelectControl
                label={__('Selected category ', 'modsnap')}
                options={choicesDeals}
                value={attributes.selectedCategoryId}
                onChange={(newval) =>
                  setAttributes({ selectedCategoryId: parseInt(newval) })
                }
              />
            ) : (
              <SelectControl
                label={__('Selected category ', 'modsnap')}
                options={choicesFinancial}
                value={attributes.selectedCategoryId}
                onChange={(newval) => {
                  setAttributes({ selectedCategoryId: parseInt(newval) });
                  console.log(attributes.selectedDealType);
                }}
              />
            )}

            <TextControl
              style={{ maxWidth: '100px' }}
              label={__('Post limit', 'modsnap')}
              type="number"
              value={attributes.setCardLimit}
              onChange={(newval) =>
                setAttributes({ setCardLimit: parseInt(newval) })
              }
              min={3}
            />
          </Fragment>
        )}
        {!this.state.editMode && (
          <ServerSideRender
            isColumnLayout
            block={this.props.name}
            attributes={{
              // selectedPostId: attributes.selectedPostId,
              selectedCategoryId: attributes.selectedCategoryId,
              setCardLimit: attributes.setCardLimit,
              selectedDealType: attributes.selectedDealType,
            }}
          />
        )}
      </div>,
    ];
  }
}

registerBlockType('modsnap/cards-grid', {
  title: 'Modsnap Cards Grid',
  icon: 'grid-view',
  category: 'common',
  description: __('Add a grid of cards by Deal category.', 'modsnap'),
  keywords: [__('grid', 'modsnap'), __('card', 'modsnap')],
  attributes: {
    // selectedPostId: {
    //   type: 'number',
    // },
    selectedDealType: {
      type: 'string',
    },
    selectedCategoryId: {
      type: 'number',
    },
    setCardLimit: {
      type: 'number',
    },
  },
  edit: withSelect((select) => ({
    // financial-type
    taxonomiesFinancial: select('core').getEntityRecords(
      'taxonomy',
      'financial-type'
    ),
    taxonomiesDeal: select('core').getEntityRecords(
      'taxonomy',
      'experience-type'
    ),
  }))(MSBlockEdit),

  save: () => null,
});
