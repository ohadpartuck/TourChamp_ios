'use strict';

var React = require('react-native');
//var _ = require('underscore');
var Parse = require('parse').Parse;
Parse.initialize("mWYkCl2OixqTNVogAN8QwSWJvz7R0ll7hWYyJs3P", "YBIy6ufbozlkSeGbbVzTQUOBUF20IhmYuGuPQjFx");
var tc = {};
//global variables
var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');

window.React = React;
window.Parse = Parse;
window.tc = tc;
window.p = function(msg){ console.log(msg)};
window.EventEmitter = EventEmitter;
window.Subscribable = Subscribable;

//window._ = _;
var Global = require('./lib/global');
window.Global = Global;

var LoginScreen  = require('./fb_login');
var LocalStorage = require('./Stores/LocalStorage');
var UserPage = require('./user_page');
var UserInfoScreen = require('./Screens/UserInfoScreen');
var ChallengeList = require('./challenge_list');
var ChallengeShow = require('./challenge_show');
var UserStore = require('./Stores/UserStore');
var ThemeList  = require('./theme_list');

var {
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    View,
    NavigatorIOS,
    TouchableHighlight,
    AlertIOS,
    Image
    } = React;

var TourChampIOs = React.createClass({
    mixins: [Subscribable.Mixin],

    getInitialState() {
        var that = this;
        Global.getAllThemes(null);
        Global.getAllChallenges(null);

        if (undefined == tc.user){
            if (Global.is_signed_in()) {
                Parse.User.current().fetch(
                    {
                        success: function (user) {
                            Global.initializeUser(user);
                            that.setState({stam: true})
                        }
                    })
            }
        }
        return {bootstrapped: false}
    },

    componentWillMount() {
        this.eventEmitter = new EventEmitter();

        LocalStorage.bootstrap(() => this.setState({bootstrapped: true}));
    },

    componentDidMount() {
        this.addListenerOn(this.eventEmitter, 'fb_login_success',  this.fbLoginCallback);
        this.addListenerOn(this.eventEmitter, 'logout_success',  this.logoutCallback);
    },

    fbLoginCallback(args){
        p('facebook login callback');
        this.setState({
            stam: args.someArg
        });
    },

    logoutCallback(args){
        p('logout callback');
        this.setState({
            stam: args.someArg
        });
    },


    renderScene(route, nav) {
        p('in renderScene');
        switch (route.id) {
            case 'authenticate':
                return <LoginScreen navigator={nav} props= {{events: this.eventEmitter}}/>;
            default:
                return  <View>Error</View>;
        }
    },

    _handleUserDataPress: function() {

        // Get by ref not prop
        this.refs.nav.push({
            component: UserPage,
            title: 'Achievements',
            props: {events: this.eventEmitter}
        });
    },


    render: function() {
        var render_screen;
        p('index render');

        if (this.state.bootstrapped === false) {
            return <View />
        }
        if (Global.is_signed_in()){

            return <NavigatorIOS
                style={styles.container}
                ref='nav'
                initialRoute={{
                    title: 'Tour Champ',
                    component: ThemeList,
                    rightButtonTitle: tc.user.displayName.split(' ')[0],
                    onRightButtonPress: this._handleUserDataPress ,
                    passProps: {
                        events: this.eventEmitter
                    }
                }}/>;

        }else{
            render_screen = 'authenticate';
        }

        return (
            <Navigator
                initialRoute={{ id: render_screen}}
                renderScene={this.renderScene}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }

                    return Navigator.SceneConfigs.FloatFromRight;
                }}
                onBack={() => {
                    if (route.index > 0) {
                        navigator.pop();
                    }
                }}
            />

        );
    }
});
var styles = React.StyleSheet.create({
    text: {
        color: 'black',
        backgroundColor: 'white',
        fontSize: 30,
        margin: 80
    },
    container: {
        flex: 1
    }
});

AppRegistry.registerComponent('TourChampIOs', () => TourChampIOs);
