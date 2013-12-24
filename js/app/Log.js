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
    
    Log.prototype.reviewError = function(date, error) {
        $.ajax({
            url: 'log/review_error.php',
            type: 'POST',
            dataType: 'json',
            data: {
                key: this.key,
                user_id: skritter.user.get('user_id'),
                date: date,
                item_id: error.itemId,
                reason: error.reason
            }
        });
    };
    
    Log.prototype.review = function(quantity) {
        $.ajax({
            url: 'log/review.php',
            type: 'POST',
            dataType: 'json',
            data: {
                key: this.key,
                user_id: skritter.user.get('user_id'),
                quantity: quantity
            }
        });
    };
    
    return Log;
});