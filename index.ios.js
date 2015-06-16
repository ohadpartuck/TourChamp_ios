'use strict';

var React = require('react-native');
var Parse = require('parse').Parse;
Parse.initialize("mWYkCl2OixqTNVogAN8QwSWJvz7R0ll7hWYyJs3P", "YBIy6ufbozlkSeGbbVzTQUOBUF20IhmYuGuPQjFx");
var tc = {};
//global variables

window.React = React;
window.Parse = Parse;
window.tc = tc;
var Global = require('./lib/global');
window.Global = Global;

var LoginScreen  = require('./fb_login');
var LocalStorage = require('./Stores/LocalStorage');
var UserStore = require('./Stores/UserStore');
var ThemeList  = require('./theme_list');

var {
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    View,
    Image
    } = React;

var TourChampIOs = React.createClass({

    getInitialState() {
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
            case 'user-info':
                return <UserInfoScreen navigator={nav} />;
            default:
                return <View />;
        }
    },

//<React.NavigatorIOS
//    style={styles.container}
//    initialRoute={{
//        title: 'Tour Champ',
//        component: FBLogin,
//    }}/>


    render: function() {

        console.log('here in index render');

        if (this.state.bootstrapped === false) {
            return <View />
        }
        return (
            <Navigator
                initialRoute={{ id: 'authenticate'}}
                renderScene={this.renderScene}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }

                    return Navigator.SceneConfigs.FloatFromRight;
                }} />

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
