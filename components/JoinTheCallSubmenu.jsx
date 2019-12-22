const { JoinTheCallButton } = require('./JoinTheCallButton');
const { ContextMenu: { Submenu, ItemGroup }, AsyncComponent } = require('powercord/components');
const { React, getModule, getModuleByDisplayName, constants: { Colors } } = require('powercord/webpack');

const Clickable = AsyncComponent.from(getModuleByDisplayName('Clickable'));
const Icon = AsyncComponent.from(getModuleByDisplayName('Icon'));
const VerticalScroller = AsyncComponent.from(getModuleByDisplayName('VerticalScroller'));

let AppReferencePositionLayer = null;
let isFragment = null;
let classes = null;

setImmediate(async () => {
  ({ AppReferencePositionLayer } = await getModule([ 'AppReferencePositionLayer' ]));
  ({ isFragment } = await getModule([ 'isFragment' ]));
  classes = {
    ...await getModule([ 'scrollbar', 'scrollerWrap' ]),
    ...await getModule([ 'itemToggle', 'checkbox' ])
  };
});

class JoinTheCallSubmenu extends Submenu {
  async componentDidUpdate () {
    return super.componentDidUpdate();
  }

  async componentDidMount () {
    return super.componentDidMount();
  }

  componentWillUnmount () {
    return super.componentWillUnmount();
  }

  render () {
    const _this = this;
    const children = this.state.items.map(item => <JoinTheCallButton {...item} />);

    const length = isFragment(children) ? children.props.children.length : children.length;
    const submenu = length === 0
      ? null
      : React.createElement(Clickable, {
        innerRef: this.setRef,
        className: [ classes.itemSubMenu, this.state.open && classes.selected ].filter(Boolean).join(' '),
        onClick: !this.props.disabled && this.handleClick,
        onMouseEnter: !this.props.disabled && this.handleMouseEnter,
        onMouseLeave: !this.props.disabled && this.handleMouseLeave
      }, React.createElement('div', {
        className: classes.label
      }, <span style={{ color: '#40B883' }}>{this.props.name}</span>), React.createElement('div', {
        className: classes.hint
      }, this.props.hint), React.createElement(Icon, {
        name: 'Nova_Caret',
        color: '#40B883',
        className: classes.caret
      }), this.state.open
        ? React.createElement(AppReferencePositionLayer, {
          position: this.getLayerPosition(),
          align: this.getLayerAlignment(),
          autoInvert: true,
          nudgeAlignIntoViewport: true,
          spacing: 12,
          reference: this.ref
          // eslint-disable-next-line prefer-arrow-callback
        }, function () {
          return React.createElement('div', {
            className: classes.subMenuContext,
            onClick: (e) => e.stopPropagation()
          }, (typeof _this.props.scroller !== 'undefined' ? _this.props.scroller !== false : length > 8)
            ? React.createElement(VerticalScroller, {
              className: [ classes.contextMenu, classes.scroller ].filter(Boolean).join(' '),
              theme: classes.themeGhostHairline,
              backgroundColor: _this.props.theme === 'light' ? Colors.WHITE : Colors.PRIMARY_DARK_800
            }, children)
            : React.createElement('div', {
              className: classes.contextMenu
            }, children));
        })
        : null);

    if (this.props.seperate) {
      return React.createElement(ItemGroup, {
        children: [ submenu ]
      });
    }

    return submenu;
  }

  getLayerPosition () {
    return super.getLayerPosition();
  }

  getLayerAlignment () {
    return super.getLayerAlignment();
  }
}

module.exports.JoinTheCallSubmenu = JoinTheCallSubmenu;
