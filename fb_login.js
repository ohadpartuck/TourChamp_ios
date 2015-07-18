'use strict';


var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Image
    } = React;

var LinearGradient = require('react-native-linear-gradient');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#F5FCFF',
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
    borderRadius: 5
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
    margin: 10,
    color: 'black',
    opacity: 0.8,
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
  bgImageWrapper: {
    position: 'absolute',
    top: 20, bottom: 10, left: 10, right: 10
  },
  bgImage: {
    flex: 1,
    resizeMode: "stretch"
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
          <View style={styles.bgImageWrapper}>
            <Image source={{uri: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Shahar_Pe'er_Israel_tennis_championship_2008.jpg"}} style={styles.bgImage} />
          </View>
          <View style={{backgroundColor: 'transparent'}}>
            <TouchableHighlight onPress={this.login}>
              <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={{
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 5
              }}>
                <Text style={styles.buttonText}>
                  Sign in with Facebook
                </Text>
              </LinearGradient>
            </TouchableHighlight>
          </View>

        </View>


    );
  }
});

module.exports = FacebookLogin;