const { React, getModule } = require('powercord/webpack');
const { ContextMenu: { ItemGroup }, Icons: { FontAwesome } } = require('powercord/components');

let classes = null;

setImmediate(async () => {
  classes = {
    ...await getModule([ 'scrollbar', 'scrollerWrap' ]),
    ...await getModule([ 'itemToggle', 'checkbox' ])
  };
});

const { ContextMenu: { Button } } = require('powercord/components');

class JoinTheCallButton extends Button {
  onClick () {
    return super.onClick();
  }

  render () {
    const button = (
      <div
        className={[
          classes.item,
          this.props.image && classes.itemImage,
          classes.clickable,
          this.props.disabled && classes.disabled
        ].filter(Boolean).join(' ')}
        onClick={this.onClick.bind(this)}
        role='button'
      >
        <span className={classes.label} style={{ color: this.props.color }}>
          {this.props.name}
        </span>

        {this.props.image
          ? this.getButtonImage()
          : this.props.icon
            ? <FontAwesome icon={this.props.icon}/>
            : <div className={classes.hint}>
              {this.props.hint}
            </div>}
      </div>
    );

    if (this.props.seperate) {
      return React.createElement(ItemGroup, {
        children: [ button ]
      });
    }

    return button;
  }

  getButtonImage () {
    return super.getButtonImage();
  }
}

module.exports.JoinTheCallButton = JoinTheCallButton;
