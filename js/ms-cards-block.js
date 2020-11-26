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

  getInspectorControls = () => {
    const { attributes, setAttributes } = this.props;
    return (
      <InspectorControls>
        <PanelBody
          title={__('Most awesome settings ever', 'modsnap')}
          initialOpen
        >
          <PanelRow>
            <ToggleControl
              label={__('Toggle me', 'modsnap')}
              checked={attributes.toggle}
              onChange={(newval) => setAttributes({ toggle: newval })}
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              label={__('Type in post ID', 'modsnap')}
              type="number"
              value={attributes.selectedPostId}
              onChange={(newval) =>
                setAttributes({ selectedPostId: parseInt(newval) })
              }
            />
          </PanelRow>{' '}
          <PanelRow>
            <SelectControl
              label="What's your favorite animal?"
              value={attributes.favoriteAnimal}
              options={[
                { label: 'Dogs', value: 'dogs' },
                { label: 'Cats', value: 'cats' },
                { label: 'Something else', value: 'weird_one' },
              ]}
              onChange={(newval) => setAttributes({ favoriteAnimal: newval })}
            />
          </PanelRow>
          <PanelRow>
            <ColorPicker
              color={attributes.favoriteColor}
              onChangeComplete={(newval) =>
                setAttributes({ favoriteColor: newval.hex })
              }
              disableAlpha
            />
          </PanelRow>
          <PanelRow>
            <CheckboxControl
              label="Activate lasers?"
              checked={attributes.activateLasers}
              onChange={(newval) => setAttributes({ activateLasers: newval })}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    );
  };

  getBlockControls = () => {
    const { attributes, setAttributes } = this.props;

    return (
      <BlockControls>
        <AlignmentToolbar
          value={attributes.textAlignment}
          onChange={(newalign) => setAttributes({ textAlignment: newalign })}
        />
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
    // if (this.props.posts) {
    //   choices.push({ value: 0, label: __('Select a post', 'modsnap') });
    //   this.props.posts.forEach((post) => {
    //     console.log(post.modsnap_category);
    //     choices.push({ value: post.id, label: post.title.rendered });
    //   });
    // } else {
    //   choices.push({ value: 0, label: __('Loading...', 'modsnap') });
    // }

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
      this.getInspectorControls(),
      this.getBlockControls(),

      <div className={alignmentClass}>
        {this.state.editMode && (
          <Fragment>
            {/* <RichText
              tagName="h2"
              placeholder="Write your heading here"
              value={attributes.myRichHeading}
              onChange={(newtext) => setAttributes({ myRichHeading: newtext })}
            />
            <RichText
              tagName="p"
              placeholder="Write your paragraph here"
              value={attributes.myRichText}
              onChange={(newtext) => setAttributes({ myRichText: newtext })}
            /> */}
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
              toggle: attributes.toggle,
              favoriteAnimal: attributes.favoriteAnimal,
              favoriteColor: attributes.favoriteColor,
              activateLasers: attributes.activateLasers,
              selectedPostId: attributes.selectedPostId,
              selectedCategoryId: attributes.selectedCategoryId,
            }}
          >
            {/* <Disabled>
              <RichText.Content tagName="h2" value={attributes.myRichHeading} />
              <RichText.Content tagName="p" value={attributes.myRichText} />
            </Disabled> */}
          </ServerSideRender>
        )}
      </div>,
    ];
  }
}

registerBlockType('modsnap/cards-grid', {
  title: 'Modsnap Cards',
  icon: 'grid-view',
  category: 'common',
  description: __('Add a card grid by category.', 'modsnap'),
  keywords: [__('grid', 'modsnap'), __('card', 'modsnap')],
  attributes: {
    // myRichHeading: {
    //   type: 'string',
    // },
    // myRichText: {
    //   type: 'string',
    // },
    textAlignment: {
      type: 'string',
      default: 'center',
    },
    toggle: {
      type: 'boolean',
      default: true,
    },
    favoriteAnimal: {
      type: 'string',
      default: 'dogs',
    },
    favoriteColor: {
      type: 'string',
      default: '#DDDDDD',
    },
    activateLasers: {
      type: 'boolean',
      default: false,
    },
    selectedPostId: {
      type: 'number',
    },
    selectedCategoryId: {
      type: 'number',
    },
  },
  supports: {
    align: ['wide', 'full'],
  },
  edit: withSelect((select) =>
    // const currentPostId = select('core/editor').getCurrentPostId();
    // const query = {
    //   per_page: -1,
    //   exclude: currentPostId,
    // };
    ({
      // posts: select('core').getEntityRecords('postType', 'modsnap_card', query),
      taxonomies: select('core').getEntityRecords(
        'taxonomy',
        'modsnap_category'
      ),
    })
  )(FirstBlockEdit),

  save: () => null,
});
