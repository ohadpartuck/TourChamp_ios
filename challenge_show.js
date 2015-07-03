'use strict';

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
    container: {
        marginTop: 0,
        backgroundColor: '#dcdcdc'
    },
    heading: {
        backgroundColor: '#F8F8F8',
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD'
    },
    image: {
        flex: 0.9,
        height: 200,
        padding: 5,
        margin: 5,
        borderRadius: 5
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        margin: 5,
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    description: {
        fontSize: 18,
        color: '#656565',
        marginBottom: 5
    },
    location: {
        flex: 0.5,
        color: 'black',
        marginBottom: 10
    },
    challenge_container: {
        width: Global.rowWidthByDevice() - 10,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        padding: 15,
        margin: 10
    },
    mark_as_done_button: {
        backgroundColor: '#5cb85c',
        padding: 30,
        borderRadius: 10,
        marginBottom: 20
    },
    mark_as_done_button_text: {
       color: 'white',
       fontSize: 18
    },
    completed_button: {
        backgroundColor: '#5bc0de',
        padding: 30,
        borderRadius: 10,
        marginBottom: 20
    }
});

class ChallengeShow extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.id !== r2.id});

        //var challenge = this.props.navigator.route.passProps.challenge;
        var challenge = this.props.challenge;
        this.state = {
            isLoading: false,
            dataSource: dataSource.cloneWithRows(challenge)
        };
        this.setState({ stam: true
        }); // this will re call the render method

    }

    buttonClicked() {
        //Global.mark_challenge_completed(this.props.navigator.route.passProps.challenge);
        Global.mark_challenge_completed(this.props.challenge);
    }

    render() {

        //var challenge_obj = this.props.navigator.route.passProps.challenge;
        var challenge_obj = this.props.challenge;
        var challenge = challenge_obj.attributes;

        var button;
        if (Global.is_challenge_completed(challenge_obj.id)) {
            button = <TouchableHighlight
                style={styles.completed_button}>
                <Text style={styles.mark_as_done_button_text}>Challenge Completed! ({challenge.points} points)</Text>
            </TouchableHighlight>

        }else{
            button = <TouchableHighlight
                style={styles.mark_as_done_button}
                onPress={this.buttonClicked.bind(this)}>
                <Text style={styles.mark_as_done_button_text}>Mark As Done! ({challenge.points} points)</Text>
            </TouchableHighlight>
        }

        return (
        <ScrollView style={styles.container}>

            <View style={styles.challenge_container}>
                <Text style={styles.title}>{challenge.name}</Text>
                <Text style={styles.location}>{challenge.location}</Text>
                <Text style={styles.description}>{challenge.description}</Text>

                <Image style={styles.image}
                    source={{uri: "http://lorempixel.com/400/400/?rnd="+Math.random()}} />

                {button}

            </View>

        </ScrollView>
        );
    }
}

module.exports = ChallengeShow;