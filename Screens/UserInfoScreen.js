'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  Navigator,
  TouchableOpacity,
} = React;

//var Video = require('react-native-video');
var UserStoreSync = require('../Mixins/UserStoreSync');
var UserStore = require('../Stores/UserStore');
var UserActions = require('../Actions/UserActions');
var styles = require('./Styles');

var UserInfoScreen = React.createClass({
  mixins: [UserStoreSync],

  afterUpdateUserFromStore() {
    var user = Parse.User.current().attributes; //UserStore.getState();

    if (!user.email) {
      this.props.navigator.replace({id: 'authenticate'});
    }
  },



  render() {
    return (
      <View style={styles.background}>
        <View style={styles.backgroundOverlay} />

        <View style={styles.contentContainer}>
          <Image source={{uri: tc.user.avatar_url}}
              style={styles.profilePicture} />
          <Text style={styles.name}>
                  {tc.user.displayName}
          </Text>

          <TouchableOpacity onPress={UserActions.signOut}>
            <Text>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
});

module.exports = UserInfoScreen;
