/*
 * 
 * Model: User
 * 
 * Created By: Joshua McFarland
 * 
 * Authentication Properties
 * access_token
 * refresh_token
 * expires_in
 * token_type
 * user_id
 * 
 * Public Properties
 * id
 * name
 * created
 * aboutMe
 * country
 * avatar
 * private
 * anonymous
 * 
 * Settings Properties
 * addFrequency
 * addSimplified
 * addTraditional
 * allowEmailsFromSkritter
 * animationSpeed
 * autoAddComponentCharacters
 * chineseStudyParts
 * colorTones
 * eccentric
 * email
 * hideReading
 * japaneseStudyParts
 * orderWeight
 * sourceLang
 * retentionIndex
 * reviewSimplified
 * reviewTraditional
 * showHeisig
 * squigs
 * studyAllListWritings
 * studyRareWritings
 * targetLang
 * timezone
 * 
 */
define([
    'backbone'
], function() {
    
    var User = Backbone.Model.extend({
	
	initialize: function() {
	    //save user settings when they are changed
	    this.on('change', this.cache);
	},
		
	defaults: {
	    lastLogin: null,
	    lastSync: null,
	    orderStrictness: 0
	},
		
	cache: function() {
	    if (this.isLoggedIn()) {
		localStorage.setItem(this.get('user_id'), JSON.stringify(this));
	    }
	},
		
	isLoggedIn: function() {
	    if (this.has('access_token'))
		return true;
	    return false;
	},
		
	fetch: function(callback) {
	    if (!this.isLoggedIn()) {
		callback();
		return;
	    }
	    //get the logged in users settings from the server
	    Skritter.api.getUser(this.get('user_id'), _.bind(function(data) {
		this.set(data);
		callback(data);
	    }, this));
	},
		
	getAvatar: function() {
	    return "<img src='data:image/png;base64," + this.get('avatar') +"' />";
	},
		
	getStudyParts: function() {
	    if (this.get('targetLang') === 'zh')
		return this.get('chineseStudyParts');
	    return this.get('japaneseStudyParts');
	},
		
	login: function(username, password, callback) {
	    Skritter.api.authenticateUser(username, password, _.bind(function(auth) {
		//automatically return if authentication was unsuccessfull
		if (auth.statusCode !== 200) {
		    callback(auth);
		    return;
		}
		this.set(auth);
		this.fetch(function(data) {
		    localStorage.setItem('activeUser', auth.user_id);
		    callback(auth, data);
		});
	    }, this));
	},
		
	logout: function() {
	    localStorage.removeItem('activeUser');
	}
    });
    
    
    return User;
});