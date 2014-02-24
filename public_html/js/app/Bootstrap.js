/**
 * This class contains several functions to help and make interfacing with several
 * of the Bootstrap components more convienient.
 * 
 * @module Skritter
 * @class Bootstrap
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method alert
     * @param {String} html
     * @param {String} context
     * @returns {String}
     */
    var alert = function(html, context) {
        context = context ? context : 'default';
        html = html ? html : '';
        var div = "<div class='alert alert-" + context + "'>";
        div += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
        div += html;
        div += "</div>";
        return div;
    };
    
    return {
        alert: alert
    };
});