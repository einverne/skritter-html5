/*
 * 
 * Model: StudyUser
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Represents a user who can study using the application and also stores user-specific settings.
 * 
 */
define([
    'backbone'
], function() {
    var Skritter = window.skritter;
    
    var User = Backbone.Model.extend({
	
	initialize: function() {
	    _.bindAll(this);
	    
	    //loads the active user automatically if one exists
	    if (localStorage.getItem('active'))
		this.set(JSON.parse(localStorage.getItem(localStorage.getItem('active'))));
	    
	    //save user settings as they are changed
	    this.on('change', this.cache);
	},
		
	defaults: {
	    id: null,
	    accessToken: null,
	    expiresIn: null,
	    lastActive: null,
	    lastLogin: null,
	    lastSync: null,
	    parts: {
		defn: true,
		rdng: true,
		rune: true,
		tone: true
	    },
	    refreshToken: null,
	    thresholds: {
		distance: 200,
		direction: 45,
		length: 200,
		strictness: 0
	    }
	},
		
	cache: function() {
	    if (this.isLoggedIn()) {
		localStorage.setItem(this.get('id'), JSON.stringify(this));
	    }
	},
		
	isLoggedIn: function() {
	    if (this.get('accessToken'))
		return true;
	    return false;
	},
		
	login: function(username, password, callback) {
	    self = this;
	    Skritter.manager.login(username, password, function(data) {
		if (data.statusCode === 200) {
		    localStorage.setItem('active', data.user_id);
		    self.set({
			accessToken: data.access_token,
			expiresIn: data.expires_in,
			id: data.user_id,
			refreshToken: data.refresh_token
		    });
		}
		callback(data);
	    });
	},
		
	logout: function() {
	    localStorage.removeItem('active');
	    Skritter.storage.clear();
	    Skritter.application.reload();
	    window.location.hash = '';
	}
	
    });
    
    return User;
});