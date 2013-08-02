/*
 * 
 * Module: LocalStorageAdapter
 * 
 * Created By: Joshua McFarland
 * 
 */
define(function() {
   
    var clear = function(database, tableName, callback) {
	if (tableName) {
	    window.localStorage.setItem(database + '-' + tableName, '');
	    if (typeof callback === 'function')
		callback();
	    return;
	}
	
	for (var key in window.localStorage)
	{
	    if (key.indexOf(database + '-') !== -1) {
		window.localStorage.setItem(key, '');
	    }
	}
	if (typeof callback === 'function')
	    callback();
    };
    
    var deleteDatabase = function(databaseName, callback) {
	for (var key in window.localStorage) {
	    if (key.indexOf(databaseName + '-') !== -1) {
		window.localStorage.removeItem(key);
	    }
	}
	if (typeof callback === 'function')
	    callback();
    };
    
    var getItems = function(database, tableName, callback) {
	var items = window.localStorage.getItem(database + '-' + tableName);
	if (!items) {
	    callback(null);
	    return;
	}
	callback(JSON.parse(items));
    };
    
    var setItems = function(database, tableName, items, callback) {
	items = JSON.stringify(items);
	window.localStorage.setItem(database + '-' + tableName, items);
	if (typeof callback === 'function')
	    callback();
    };
    
    return {
	clear: clear,
	deleteDatabase: deleteDatabase,
	getItems: getItems,
	setItems: setItems
    };
    
});