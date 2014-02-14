/**
 * @module Skritter
 * @param ContainedTable
 * @param DecompTable
 * @param SimpTradMap
 * @param templateVocabInfo
 * @author Joshua McFarland
 */
define([
    'views/components/ContainedTable',
    'views/components/DecompTable',
    'SimpTradMap',
    'require.text!templates/vocab-info.html'
], function(ContainedTable, DecompTable, SimpTradMap, templateVocabInfo) {
    /**
     * @class VocabInfoView
     * @type @exp;Backbone@pro;View@call;extend
     */
    var VocabInfo = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabInfo.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabInfo);
            return this;
        },
        events: {
            'click.VocabInfo #vocab-info-view .back-button': 'handleBackClicked',
            'click.VocabInfo #vocab-info-view .home-button': 'handleHomeClicked'
        },
        /**
         * @method handleBackClicked
         * @param {Object} event
         */
        handleBackClicked: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method handleHomeClicked
         * @param {Object} event
         */
        handleHomeClicked: function(event) {
            skritter.router.navigate('/', {trigger: true});
            event.preventDefault();
        }
    });
    
    return VocabInfo;
});