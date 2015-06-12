'use strict';

var ChallengeShow = require('./challenge_show');
var Global = require('./lib/global');
var Parse = require('parse').Parse;
Parse.initialize("mWYkCl2OixqTNVogAN8QwSWJvz7R0ll7hWYyJs3P", "YBIy6ufbozlkSeGbbVzTQUOBUF20IhmYuGuPQjFx");

var React = require('react-native');
var {
    StyleSheet,
    Image,
    View,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    ListView,
    Text,
    Component
} = React;

var styles = StyleSheet.create({
    headline: {
        marginBottom: 0
    },
    thumb: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 5
    },
    container: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: '#dcdcdc'
    },
    textContainer: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'red'
    },
    description: {
        fontSize: 10,
        color: '#656565'
    },
    rowContainer: {
        width: Global.rowWidthByDevice(),
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 15,
        margin: 2
    },
    location: {

    },
    points: {
      flex: 1
    }
});


class ChallengeList extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
                            {rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.state = {
            isLoading: false,
            dataSource: dataSource.cloneWithRows(this.props.challenges)
        };
        this.setState({ stam: true
                        }); // this will re call the render method
    }

    rowPressed(challenge_id) {
        var challenge = this.props.challenges.filter(prop => prop.id === challenge_id)[0];

        this.props.navigator.push({
            title: challenge.attributes.name + ' Challenge',
            component: ChallengeShow,
            passProps: {challenge: challenge}
        });
    }


    renderRow(rowData, sectionID, rowID) {
        var data = rowData.attributes;
        return (
            <TouchableHighlight onPress={() => this.rowPressed(rowData.id)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <Image style={styles.thumb} source={{uri: "http://lorempixel.com/100/100/?rnd="+Math.random()}} />
                        <View  style={styles.textContainer}>
                            <Text style={styles.title}>{data.name}</Text>
                            <Text style={styles.description}
                                numberOfLines={4}>{data.description}</Text>
                            <Text style={styles.location}>{data.location}</Text>
                            <Text style={styles.points}>Points: {data.points}</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        console.log(this.state.isLoading);

        var spinner = this.state.isLoading ?
            ( <ActivityIndicatorIOS
                hidden='false'
                size='large'/> ) :
            ( <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}/>
            </View>);

        return ( <ScrollView>{spinner}</ScrollView>);
    }

}


module.exports = ChallengeList;

