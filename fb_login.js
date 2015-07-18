'use strict';


var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    } = React;

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

  componentWillMount: function() {
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
      tc.user = user.attributes;
      Global.initializeUser(user);
      that.props.navigator.pop();
      that.setState({result: 'logged_in', user: user.attributes});
      that.props.props.events.emit('fb_login_success', { someArg: 'argValue' });
    }, function(msg) {
      that.setState({result: 'failure logged_id'});
    });
  },

  user_existed(error_message){
    if (undefined == error_message){
      console.log('error');
      return false;
    }
    return error_message.includes("already taken");
  },

  render() {

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