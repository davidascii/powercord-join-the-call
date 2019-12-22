const { Plugin } = require('powercord/entities');
const { getModule, getModuleByDisplayName, React } = require('powercord/webpack');
const { inject } = require('powercord/injector');
const { JoinTheCallSubmenu } = require('./components/JoinTheCallSubmenu');
const { clipboard } = require('electron');

class Cellophane extends Plugin {
  startPlugin () {
    this.pluginCommand();
    this.joinCallButton();
  }

  pluginCommand () {
    this.registerCommand(
      'joincall',
      [ 'entrarnacall', 'seguir', 'follow' ],
      'send a hello world',
      '{c} [userID] [args]',
      async args => ({
        send: false,
        result: (args[0].length !== 18 || isNaN(args[0])) ? 'Invalid user ID' : await this.joinCallCommand(args[0], args[1])
      })
    );
  }

  async joinCallCommand (id, options) {
    const err = [];
    let user;

    options = (options === '--this-server');

    try {
      user = await getModule([ 'getUser' ], false).getUser(id);
      this.followUser(user.id, options);
    } catch (message) {
      let errorMessage;

      // eslint-disable-next-line no-unused-expressions
      message.hasOwnProperty('body')
        ? errorMessage = ((message.body.code === 10013) ? `I wasn't able to find a user with the id ${id}. Make sure you provide a valid user id!` : JSON.stringify(message.body))
        : errorMessage = `Unknown error: ${message}`;

      err.push(errorMessage);
    }

    return (!err.length) ? `Following ${user.username}#${user.discriminator}...` : err.join(',\n');
  }

  clickCopyIdButton (buttons) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].innerText === 'Copy ID') {
        buttons[i].click();
        return clipboard.readText();
      }
    }
  }

  async joinCallButton () {
    const userCallItem = await getModuleByDisplayName('UserCallItem');

    inject('cellophane-joincalliten', userCallItem.prototype, 'render', (_, res) => {
      const privateCall = res.props.action;

      const callOptions = [ '🔈 This Server', '🔈 Other Server', '📞 DM Call' ];

      res = React.createElement(JoinTheCallSubmenu, {
        name: 'Join the Call',
        getItems: () =>
          callOptions
            .map(button => ({
              type: 'button',
              name: button,
              color: (button === callOptions[0]) ? '#40B883' : (button === callOptions[1]) ? '#d84142' : '#b5b7ba',
              onClick: () => {
                const oldText = clipboard.readText();
                const buttons = document.getElementsByClassName('clickable-11uBi-');

                (button === callOptions[0])
                  ? this.followUser(this.clickCopyIdButton(buttons), true)
                  : (button === callOptions[1])
                    ? this.followUser(this.clickCopyIdButton(buttons))
                    : privateCall();

                clipboard.writeText(oldText);
              }
            }))
      });
      return res;
    });
  }

  async followUser (id, localServer = false) {
    const { selectVoiceChannel } = await getModule([ 'selectVoiceChannel' ]);
    const { getChannels } = await getModule([ 'getChannels' ]);
    const { getGuildId } = await getModule([ 'getGuildId' ]);
    const { getChannel } = await getModule([ 'getChannel' ]);
    const getVoiceStates = await getModule([ 'getVoiceStates' ]); // getVoiceStatesForChannel

    let channels = Object.values(getChannels()).filter(c => c.type === 2);

    if (localServer) {
      channels = Object.values(channels).filter(c => c.guild_id === getGuildId());
    }

    const voiceChannels = Object.values(channels).reduce((voiceChannels, channel) => {
      voiceChannels.push(channel.id);

      return voiceChannels;
    }, []);

    for (const channelId of voiceChannels) { // for (let i = 0; i < voiceChannels.length; i++)
      const voiceChannelsInfo = getVoiceStates.getVoiceStatesForChannel(getChannel(channelId)).filter(c => c.userId === id);

      if (voiceChannelsInfo.length) {
        selectVoiceChannel(voiceChannelsInfo[0].channelId);
      }
    }
  }
}

module.exports = Cellophane;
