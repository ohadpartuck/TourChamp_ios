'use strict';

var React = require('react-native');
var Parse = require('parse').Parse;
var FBLogin  = require('./fb_login');
var ThemeList  = require('./theme_list');
var tc = {};
Parse.initialize("mWYkCl2OixqTNVogAN8QwSWJvz7R0ll7hWYyJs3P", "YBIy6ufbozlkSeGbbVzTQUOBUF20IhmYuGuPQjFx");



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
              component: FBLogin,
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
