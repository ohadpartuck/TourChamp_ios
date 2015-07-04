'use strict';

var ChallengeList = require('./challenge_list');
var {
    StyleSheet,
    Image,
    View,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    ListView,
    Text,
    Component,
    PixelRatio
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
        marginTop: 0,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
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
        margin: 2,
        borderRadius: 5
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'center',
    },
});

class ThemeList extends Component {

    constructor(props) {
        super(props);
        Global.getAllThemes(this.handleResponse.bind(this));
        Global.getAllChallenges();
        this.state = {
            isLoading: true
        };
    }

    rowPressed(ThemeId) {
        var theme = tc.allThemes[ThemeId];

        Global.getChallengesForTheme(theme, this.handleChallengesForThemeResponse.bind(this))
    }

    handleChallengesForThemeResponse(theme, challenges){
        this.props.navigator.push({
            id: 'challenge_list',
            title: "Challenges For " + theme.attributes.badge,
            component: ChallengeList,
            passProps: {theme: theme, challenges: challenges}
        });
    }


    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight onPress={() => this.rowPressed(rowData.id)}
                underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <Image style={styles.thumb} source={{ uri: rowData.attributes.photo_url }} />
                        <View  style={styles.textContainer}>
                            <Text style={styles.title}>{rowData.attributes.badge}</Text>
                            <Text style={styles.description}
                                numberOfLines={2}>{rowData.attributes.description}</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    handleResponse(response) {
        this.setState({isLoading:  false}); // this will re call the render method
        this.state.isLoading = false;
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
        this.state.dataSource = dataSource.cloneWithRows(response);
        this.props.themes = response;
    }

    logOut(){
        Parse.User.logOut();
        // TODO go back to login page
        this.setState({isLoading:  false});
    }


    render() {
        console.log(this.state.isLoading);

        var spinner = this.state.isLoading ?
            ( <ActivityIndicatorIOS
                hidden='false'
                size='large'/> ) :
            ( <View style={styles.container}>
                <Text style={styles.headline}>Badges to acheive near Tel Aviv</Text>
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}/>
            </View>);

        return ( <ScrollView>{spinner}</ScrollView>);
    }
}

module.exports = ThemeList;

