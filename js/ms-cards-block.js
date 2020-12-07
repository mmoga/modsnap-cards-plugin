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
  CheckboxControl,
  SelectControl,
  ColorPicker,
  Button,
  Toolbar,
  Placeholder,
  Disabled,
} = wp.components;

class FirstBlockEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: true,
    };
  }

  // getInspectorControls = () => {
  //   const { attributes, setAttributes } = this.props;
  //   return (
  //     <InspectorControls>
  //       <PanelBody
  //         title={__('Most awesome settings ever', 'modsnap')}
  //         initialOpen
  //       >
  //         <PanelRow>
  //           <TextControl
  //             label={__('Type in post ID', 'modsnap')}
  //             type="number"
  //             value={attributes.selectedPostId}
  //             onChange={(newval) =>
  //               setAttributes({ selectedPostId: parseInt(newval) })
  //             }
  //           />
  //         </PanelRow>{' '}
  //       </PanelBody>
  //     </InspectorControls>
  //   );
  // };

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
    const alignmentClass =
      attributes.textAlignment != null
        ? `has-text-align-${attributes.textAlignment}`
        : '';
    const choices = [];

    if (this.props.taxonomies) {
      choices.push({ value: 0, label: __('Select a category', 'modsnap') });
      this.props.taxonomies.forEach((category) => {
        // console.log(category);
        choices.push({ value: category.id, label: category.name });
      });
    } else {
      choices.push({ value: 0, label: __('Loading...', 'modsnap') });
    }

    return [
      // this.getInspectorControls(),
      this.getBlockControls(),

      <div className={alignmentClass}>
        {this.state.editMode && (
          <Fragment>
            <SelectControl
              label={__('Selected category', 'modsnap')}
              options={choices}
              value={attributes.selectedCategoryId}
              onChange={(newval) =>
                setAttributes({ selectedCategoryId: parseInt(newval) })
              }
            />
          </Fragment>
        )}
        {!this.state.editMode && (
          <ServerSideRender
            isColumnLayout
            block={this.props.name}
            attributes={{
              // myRichHeading: attributes.myRichHeading,
              // myRichText: attributes.myRichText,
              textAlignment: attributes.textAlignment,
              selectedPostId: attributes.selectedPostId,
              selectedCategoryId: attributes.selectedCategoryId,
            }}
          />
        )}
      </div>,
    ];
  }
}

registerBlockType('modsnap/cards-grid', {
  title: 'Modsnap Cards',
  icon: 'grid-view',
  category: 'common',
  description: __('Add a card grid by Deal category.', 'modsnap'),
  keywords: [__('grid', 'modsnap'), __('card', 'modsnap')],
  attributes: {
    textAlignment: {
      type: 'string',
      default: 'center',
    },
    selectedPostId: {
      type: 'number',
    },
    selectedCategoryId: {
      type: 'number',
    },
  },
  edit: withSelect((select) => ({
    taxonomies: select('core').getEntityRecords('taxonomy', 'experience-type'),
  }))(FirstBlockEdit),

  save: () => null,
});
