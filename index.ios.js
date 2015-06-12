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

var FBLogin  = require('./fb_login');
var ThemeList  = require('./theme_list');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
    } = React;

var TourChampIOs = React.createClass({

  render: function() {
    return (
        <React.NavigatorIOS
            style={styles.container}
            initialRoute={{
              title: 'Tour Champ',
              component: ThemeList,
            }}/>
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
