/**
 * @module Skritter
 * @submodule View
 * @param templateHomeIn
 * @param templateHomeOut
 * @author Joshua McFarland
 */
define([
    'require.text!template/home-in.html',
    'require.text!template/home-out.html',
    'backbone'
], function(templateHomeIn, templateHomeOut) {
    /**
     * @class HomeView
     */
    var Home = Backbone.View.extend({
        initialize: function() {

        },
        /**
         * @method render
         * @return {HomeView}
         */
        render: function() {
            if (Skritter.user.isLoggedIn()) {
                this.$el.html(templateHomeIn);
            } else {
                this.$el.html(templateHomeOut);
            }
            this.$('#application-name').text('Skritter');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
        }
    });


    return Home;
});