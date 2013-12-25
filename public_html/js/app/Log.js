/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'jquery'
], function() {

    function Log() {
        this.key = 'LzHnQTQNkfsT2e4aA4Hlkj6I';
    }

    Log.prototype.sync = function(started, completed, received, sent) {
        if (received > 0 || sent > 0)
            $.ajax({
                url: 'log/sync.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    key: this.key,
                    user_id: skritter.user.get('user_id'),
                    started: started,
                    completed: completed,
                    received: received,
                    sent: sent
                }
            });
    };

    return Log;
});