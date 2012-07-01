﻿#include "../extendables/extendables.jsx"var http = require("http");var ui = require("ui");if (  app.documents.length > 0 ){    main();} else {    app.documents.add();    main();}function main() {    var docRef = app.activeDocument;    with(docRef.viewPreferences){        horizontalMeasurementUnits = MeasurementUnits.points;        verticalMeasurementUnits = MeasurementUnits.points;    }    var mixins = {        'centered': {            'size': [300, 50],            'justify': 'left'        },        'square': {            'size': [300, 200],             'justify': 'left'        },        'help': {            'helpTip': 'clickerdy click',        },        'button': ['centered', 'help']    };    /* structure */    var dialog = new ui.Dialog('A friendly welcome').with(mixins);        dialog.column('stuff').using('square')        .text('twitter_username_label','Twitter handle (excluding @ symbol)')        .input('twitter_username','dvsch')        .text('tweet_no_label','# of Tweets (up to five)')        .input('tweet_no','5')        .button('confirm', 'OK!').using('button');             /* event handlers */       dialog.stuff.confirm.on('click').do(function () {        this.window.close(1);         });    show = dialog.window.show();    if( show == 1){         var tweeter = dialog.stuff.twitter_username.text,               tweetNo = parseInt(dialog.stuff.tweet_no.text);        getTweets(tweeter,tweetNo);    }}function getTweets(username,tweetNo) {    var docRef = app.activeDocument;    var response = http.get("https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+username+"&count="+tweetNo+"");    var tweets;    var tweetTexts = [];    if (response.status == 200) {        tweets = JSON.parse(response.body);        //$.writeln(tweets[0]['text']);        for (var i = 0; i < tweets.length; i++){                tweetTexts.push(tweets[i]['text']);         }    } else {        $.writeln("Connection failed");    }   if ( docRef.textFrames.item.length > 0){       docRef.textFrames.item(0).contents = tweetTexts.join('\n\n');   } else {       var myPage = docRef.pages.item(0);       var myTextFrame = docRef.pages.item(0).textFrames.add({geometricBounds:[72, 72, 288, 288], contents:tweetTexts.join('\n\n')});   }    }