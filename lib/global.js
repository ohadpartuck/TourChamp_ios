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
        var query = new Parse.Query("Theme"),
            that  = this;
        if (tc.allThemes) {
            if (callback) {
                callback(tc.allThemes);
            }
        } else {
            query.find({
                success: function (results) {
                    var themeHash = {};
                        for (var i = 0; i < results.length; i++) {
                        themeHash[results[i].id] = results[i]
                    }

                    tc.allThemes = themeHash;
                    tc.allThemesInArray = results;
                    if (callback) {
                        callback(tc.allThemes);
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    },


    getAllChallenges: function(callback){
        var query = new Parse.Query('Challenge');
        if (tc.allChallenges) {
            if (callback) {
                callback(tc.allChallenges);
            }
        } else {
            query.find({
                success: function (results) {
                    var challengeHash = {};
                    for (var i = 0; i < results.length; i++) {
                        challengeHash[results[i].id] = results[i]
                    }

                    tc.allChallenges = challengeHash;
                    tc.allChallengesInArray = results;
                    if (callback) {
                        callback(tc.allChallenges);
                    }

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
    },

    is_signed_in(){
        if (undefined != Parse.User.current()){
            tc.user = Parse.User.current().attributes;
            return true;
        }
        return false;
    },

    is_challenge_completed(challenge_id){
       return challenge_id in tc.user.challenges_completed
    },

    initializeUser: function(user){
        tc.user = user.attributes;
        tc.firstName = tc.user.displayName.split(' ')[0];
    },

    logOut: function(){
        Parse.User.logOut();
    }





};


module.exports = Global;