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

var Global = {

    rowWidthByDevice: function(){

        if (2 == PixelRatio.get()){
            //iPhone 4, 4S
            //iPhone 5, 5c, 5s
            //iPhone 6
            return 310;
        }else if(3 == PixelRatio.get()){
            //iPhone 6 plus
            return 400;
        }else if (3.5 == PixelRatio.get()){
            //Nexus 6
            return 450;
        }else{
            return 350;
        }
    },

    mark_challenge_completed: function(challenge) {
        Parse.Cloud.run('mark_challenge_completed', { challenge_id: challenge.id }, {
            success: function (response) {
                console.log('success mark_challenge_completed');
                //updateCompleted(challenge.id);
            },
            error: function (error) {
                console.log('error mark_challenge_completed');
                //updateCompleted(challenge.id);
            }
        });
    },

    getAllThemes: function(callback) {
        var query = new Parse.Query("Theme");
        if (tc.allThemes) {
            callback(tc.allThemes);
        } else {
            query.find({
                success: function (results) {
                    var themeHash = {};
                    for (var i = 0; i < results.length; i++) {
                        themeHash[results[i].id] = results[i]
                    }

                    tc.allThemes = themeHash;
                    tc.allThemesInArray = results;
                    callback(results);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    },

    getChallengesForTheme: function(theme, callback) {
        var query = new Parse.Query("Theme");
        query.include("challenges");
        query.get(theme.id, {
            success: function (theme) {
                if (callback) {
                    callback(theme, theme.attributes.challenges);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    setUser: function(user) {
        tc['user'] = user.attributes;
        localStorage.setItem('user',JSON.stringify(tc.user()));
    }


};



module.exports = Global;