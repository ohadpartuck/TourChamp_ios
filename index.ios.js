'use strict';

var React = require('react-native');
//var _ = require('underscore');
var Parse = require('parse').Parse;
Parse.initialize("mWYkCl2OixqTNVogAN8QwSWJvz7R0ll7hWYyJs3P", "YBIy6ufbozlkSeGbbVzTQUOBUF20IhmYuGuPQjFx");
var tc = {};
//global variables

window.React = React;
window.Parse = Parse;
window.tc = tc;
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
    AlertIOS,
    Image
    } = React;

var TourChampIOs = React.createClass({

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

        LocalStorage.bootstrap(() => this.setState({bootstrapped: true}));
    },

    renderScene(route, nav) {
        console.log('in renderScene');
        switch (route.id) {
            case 'authenticate':
                return <LoginScreen navigator={nav} />;
            case 'theme_list':
                return <ThemeList navigator={nav} />;
            default:
                return <View />;
        }
    },

    _handleUserDataPress: function() {

        // Get by ref not prop
        this.refs.nav.push({
            component: UserPage,
            title: 'Achievements'
        });
    },


    render: function() {
        var render_screen;
        console.log('here in index render');

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
                    onRightButtonPress: this._handleUserDataPress
                }}/>;

        }else{
            render_screen = 'authenticate';
            //return <NavigatorIOS
            //    style={styles.container}
            //    ref='nav'
            //    initialRoute={{
            //        title: 'Login',
            //        component: LoginScreen,
            //    }}/>;
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
