import React, { PureComponent } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { StreamChat } from 'stream-chat';
import {
  Avatar,
  Chat,
  Channel,
  MessageList,
  MessageInput,
  ChannelList,
  IconBadge,
} from 'stream-chat-expo';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import truncate from 'lodash/truncate';

const theme = {
  'avatar.image': 'border-radius: 6px',
  colors: {
    primary: 'blue',
  },
};

const chatClient = new StreamChat('sauzpvyxyvbh');
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoid2l0aGVyZWQtdW5pdC04In0._5qRI48gWSfoYW0raK9acNhLlT71GzyrVaBmdO6pF78';

const user = {
  id: 'withered-unit-8',
  name: 'Withered unit',
  image:
    'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
};

chatClient.setUser(user, userToken);

class CustomChannelPreview extends PureComponent {
  channelPreviewButton = React.createRef();

  onSelectChannel = () => {
    this.props.setActiveChannel(this.props.channel);
  };

  render() {
    const { channel } = this.props;
    const unreadCount = channel.countUnread();

    return (
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottomColor: '#EBEBEB',
          borderBottomWidth: 1,
          padding: 10,
        }}
        onPress={this.onSelectChannel}
      >
        <Avatar image={channel.data.image} size={40} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingLeft: 10,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontWeight: unreadCount > 0 ? 'bold' : 'normal',
                fontSize: 14,
                flex: 9,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {channel.data.name}
            </Text>
            <IconBadge unread={unreadCount} showNumber>
              <Text
                style={{
                  color: '#767676',
                  fontSize: 11,
                  flex: 3,
                  textAlign: 'right',
                }}
              >
                {this.props.latestMessage.created_at}
              </Text>
            </IconBadge>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class ChannelListScreen extends PureComponent {
  static navigationOptions = () => ({
    headerTitle: (
      <Text style={{ fontWeight: 'bold' }}>Awesome Conversations</Text>
    ),
  });

  render() {
    return (
      <SafeAreaView>
        <Chat client={chatClient}>
          <View style={{ display: 'flex', height: '100%', padding: 10 }}>
            <ChannelList
              filters={{ type: 'messaging', members: { $in: ['withered-unit-8'] } }}
              sort={{ last_message_at: -1 }}
              Preview={CustomChannelPreview}
              onSelect={(channel) => {
                this.props.navigation.navigate('Channel', {
                  channel,
                });
              }}
            />
          </View>
        </Chat>
      </SafeAreaView>
    );
  }
}

class ChannelScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const channel = navigation.getParam('channel');
    return {
      headerTitle: (
        <Text style={{ fontWeight: 'bold' }}>{channel.data.name}</Text>
      ),
    };
  };

  render() {
    const { navigation } = this.props;
    const channel = navigation.getParam('channel');

    return (
      <SafeAreaView>
        <Chat client={chatClient}>
          <Channel client={chatClient} channel={channel}>
            <View style={{ display: 'flex', height: '100%' }}>
              <MessageList />
              <MessageInput />
            </View>
          </Channel>
        </Chat>
      </SafeAreaView>
    );
  }
}

const RootStack = createStackNavigator(
  {
    ChannelList: {
      screen: ChannelListScreen,
    },
    Channel: {
      screen: ChannelScreen,
    },
  },
  {
    initialRouteName: 'ChannelList',
  },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}