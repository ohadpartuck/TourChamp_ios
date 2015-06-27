'use strict';

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    ActivityIndicatorIOS,
    ScrollView,
    ListView,
    Image
    } = React;


var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
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
    thumb: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 5
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
    },
    textContainer: {
        flex: 1
    },
});


var UserPage = React.createClass({
    getInitialState() {
        Global.getAllThemes(null);
        Global.getAllChallenges(this.refreshPage.bind(this));

        this.state = {
            isLoading: true
        };
        return {isLoading: true};
    },

    componentDidMount() {
        var self = this;
    },

    refreshPage(){
        this.state = {
            isLoading: false
        };

        this.setState({ isLoading: false });
    },

    renderRow(challenge_id, sectionID, rowID) {
        var data = tc.allChallenges[challenge_id].attributes;
        return (
            <TouchableHighlight underlayColor='#dddddd'>
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
    },

    user_data(){
        var challenges_completed, badges_completed;

        if (tc.user.badages_completed) {
            var dataSource = new ListView.DataSource(
                    {rowHasChanged: (r1, r2) => r1.id !== r2.id}),
                challenges;
            challenges = dataSource.cloneWithRows(Object.keys(tc.user.badages_completed));

            badges_completed =
                <ListView
                    dataSource={challenges}
                    renderRow={this.renderRow.bind(this)}/>;

        }else{
            badges_completed = <Text>No Badges Completed. Keep working!</Text>;
        }

        if (tc.user.challenges_completed) {
            var dataSource = new ListView.DataSource(
                    {rowHasChanged: (r1, r2) => r1.id !== r2.id}),
                challenges;
            challenges = dataSource.cloneWithRows(Object.keys(tc.user.challenges_completed));

            challenges_completed =
                <ListView
                    dataSource={challenges}
                    renderRow={this.renderRow.bind(this)}/>;

        }else{
            challenges_completed = <Text>No Challenges Completed. Keep working!</Text>;
        }

        return {'badges_completed': badges_completed, 'challenges_completed': challenges_completed}
    },

    render() {

       var user_data = this.user_data();

        var spinner = this.state.isLoading ?
            ( <ActivityIndicatorIOS
                hidden='false'
                size='large'/> ) :
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {tc.user.displayName}
                </Text>
                <Text>
                    Points: {tc.user.points}
                </Text>

                <Text style={styles.welcome}>
                    Completed Badges
                </Text>
                {user_data['badges_completed']}


                <Text style={styles.welcome}>
                      Completed Challenges
                </Text>
                {user_data['challenges_completed']}

            </View>;

        return ( <View style={styles.container}>{spinner}</View>);
    }
});

module.exports = UserPage;