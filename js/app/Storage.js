/*
 * 
 * Module: Storage
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'storage/IndexedDbAdapter',
    'storage/SQLiteAdapter',
    'lodash'
], function(IndexedDbAdapter, SQLiteAdapter) {
    
    function Storage(type) {
	this.database = null;
	this.name = null;
	this.storage = null;
	this.type = type;
	this.version = 1;
	
	switch (type)
	{
	    case 'indexeddb':
		this.storage = IndexedDbAdapter;
		break;
	    case 'sqlite':
		this.storage = SQLiteAdapter;
		break;
	    case 'websql':
		this.storage = IndexedDbAdapter;
		break;
	}
    }
    
    
    Storage.prototype.clear = function(tableName, callback) {
	this.storage.clear(this.database, tableName, function(event) {
	   if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.clearAll = function(callback) {
	this.storage.clearAll(this.database, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.deleteDatabase = function(databaseName, callback) {
	this.storage.deleteDatabase(databaseName, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };

    Storage.prototype.openDatabase = function(databaseName, databaseVersion, callback) {
	this.storage.openDatabase(databaseName, databaseVersion, _.bind(function(event) {
	    this.database = event;
	    this.name = databaseName;
	    this.version = databaseVersion;
	    callback(event);
	}, this));
    };

    Storage.prototype.getItem = function(tableName, key, callback) {
	this.storage.getItem(this.database, tableName, key, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.getItems = function(tableName, callback) {
	this.storage.getItems(this.database, tableName, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.getItemsAt = function(tableName, items, callback) {
	this.storage.getItemsAt(this.database, tableName, items, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.removeItem = function(tableName, key, callback) {
	this.storage.removeItem(this.database, tableName, key, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };

    Storage.prototype.setItem = function(tableName, item, callback) {
	this.storage.setItem(this.database, tableName, item, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };

    Storage.prototype.setItems = function(tableName, items, callback) {
	this.storage.setItems(this.database, tableName, items, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    
    return Storage;
});