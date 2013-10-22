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
            userId: Skritter.user.get('user_id'),
            timestamp: Skritter.fn.getUnixTime()
        }
        
    });
    
    
    return LogItem;
});