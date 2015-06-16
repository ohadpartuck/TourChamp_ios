'use strict';
//var React = require('react-native');
//var Parse = require('parse').Parse;
//Parse.initialize("mWYkCl2OixqTNVogAN8QwSWJvz7R0ll7hWYyJs3P", "YBIy6ufbozlkSeGbbVzTQUOBUF20IhmYuGuPQjFx");

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    } = React;

var LinearGradient = require('react-native-linear-gradient');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  backgroundOverlay: {
    opacity: 0.5,
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loginContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#ffffff',
    margin: 10,
    opacity: 0.8,
  },
  aboutButtonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#efefef',
    opacity: 0.8,
  },
  contentContainer: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
  },
  name: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 15,
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'transparent',
    left: 0,
    right: 0,
  },
  aboutTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

var FacebookLoginManager = require('NativeModules').FacebookLoginManager;

var FacebookLogin = React.createClass({
  getInitialState() {
    return {
      result: '...'
    }
  },

  componentDidMount() {
    var self = this;
  },

  login() {
    var that = this;
    FacebookLoginManager.newSession((error, info) => {
      if (error) {
        this.setState({result: error});
      } else {
        var url = `https://graph.facebook.com/v2.3/${info.userId}?access_token=${info.token}` +
            '&fields=name,email,picture&format=json';

        fetch(url).then(function(response){
          that.handle_get_user_login(response);
        });
      }
    });

  },

  handle_get_user_login(response) {
    var that = this,
        fb_user = JSON.parse(response._bodyText),
        password  =  fb_user.id + '123';

    var u = new Parse.User({
      username: fb_user.id,
      password: password,
      photo_url: "http://graph.facebook.com/"+fb_user.id+"/picture?type=square",
      displayName: fb_user.name,
      email: fb_user.email
    });

    u.signUp().then(function(user) {
      that.setState({result: 'sign up success'});
    }, function(msg) {
      if (that.user_existed(msg.message)) {
        that.login_user(fb_user, password);
      }else{
        that.setState({result: 'sign up failure'});
      }

    });
  },

  login_user(fb_user, password){
    var that = this;
    Parse.User.logIn(fb_user.id, password).then(function(user) {
      console.log('here in logged_in');
      that.setState({result: 'logged_in'});
    }, function(msg) {
      that.setState({result: 'failure logged_id'});
    });
  },

  user_existed(error_message){
    return error_message.includes("already taken");
  },

//<TouchableOpacity onPress={this.login} style={ {padding:50, backgroundColor: 'black'}}>
//  <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
//    <Text style={styles.welcome}>
//      Sign in with Facebook
//    </Text>
//  </LinearGradient>
//</TouchableOpacity>
  render() {
    console.log('here in fb_login render');
    return (
        <View style={styles.container}>
           <TouchableHighlight onPress={this.login}>
               <Text style={styles.welcome}>
                   Facebook Login
                 </Text>
             </TouchableHighlight>

          <Text style={styles.instructions}>
            {this.state.result}
          </Text>
        </View>
    );
  }
});

module.exports = FacebookLogin;