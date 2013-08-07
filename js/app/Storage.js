/*
 * 
 * Module: Storage
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * A generic set of database functions that are meant to interact with the selected adapter.
 * 
 */
define([
    'storage/IndexedDbAdapter',
    'storage/LocalStorageAdapter',
    'storage/SQLiteAdapter'
], function(IndexedDbAdapter, LocalStorageAdapter, SQLiteAdapter) {
    
    function Storage(type) {
	switch (type)
	{
	    case 'indexeddb':
		this.storage = IndexedDbAdapter;
		break;
	    case 'localstorage':
		this.storage = LocalStorageAdapter;
		break;
	    case 'sqlite':
		this.storage = SQLiteAdapter;
		break;
	}
	this.database = null;
	this.name = null;
	this.type = type;
	this.version = 1;
    }
    
    Storage.prototype.openDatabase = function(databaseName, databaseVersion, callback) {
	self = this;
	this.storage.openDatabase(databaseName, databaseVersion, function(event) {
	    self.database = event;
	    self.name = databaseName;
	    self.version = databaseVersion;
	    callback(event);
	});
    };
    
    Storage.prototype.deleteDatabase = function(databaseName, callback) {
	this.storage.deleteDatabase(databaseName, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.clear = function(tableName, callback) {
	this.storage.clear(this.database, tableName, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    Storage.prototype.getItems = function(tableName, callback) {
	this.storage.getItems(this.database, tableName, function(event) {
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
	if (items === undefined ||items.length === 0) {
	    callback(0);
	    return;
	}
	
	this.storage.setItems(this.database, tableName, items, function(event) {
	    if (typeof callback === 'function')
		callback(event);
	});
    };
    
    return Storage;
});