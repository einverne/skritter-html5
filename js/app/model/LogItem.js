/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class LogItem
     */
    var LogItem = Backbone.Model.extend({
        
        defaults: {
            userId: null,
            timestamp: new Date().getTime()
        }
        
    });
    
    
    return LogItem;
});