/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Log
     */
    function Log() {
        Log.key = 'LzHnQTQNkfsT2e4aA4Hlkj6I';
    }
    /**
     * @method access
     */
    Log.prototype.access = function () {
        var promise = $.ajax({
            url: 'log/access.php',
            type: 'POST',
            dataType: 'json',
            data: {
                key: Log.key,
                user_id: skritter.user.getSetting('id'),
                date: skritter.fn.getMySqlDateFormat(),
                version: skritter.settings.get('version'),
                user_agent: navigator.userAgent
            }
        });
        promise.done(function(data) {
            console.log(data);
        });
        promise.fail(function(error) {
            console.error(error);
        });
    };
    /**
     * @method user
     */
    Log.prototype.user = function () {
        var settings = _.clone(skritter.user.get('settings'));
        settings.created = skritter.fn.getMySqlDateFormat(settings.created);
        settings.anonymous = (settings.anonymous) ? 1 : 0;        
        var promise = $.ajax({
            url: 'log/user.php',
            type: 'POST',
            dataType: 'json',
            data: {
                key: Log.key,
                settings: JSON.stringify(settings)
            }
        });
        promise.done(function(data) {
            console.log(data);
        });
        promise.fail(function(error) {
            console.error(error);
        });
    };
    return Log;
});