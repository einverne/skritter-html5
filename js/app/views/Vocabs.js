/**
 * @module Skritter
 * @submodule Views
 * @param PinyinConverter
 * @param templateVocabs
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'require.text!templates/vocabs.html',
    'backbone'
], function(PinyinConverter, templateVocabs) {
    /**
     * @class Vocabs
     */
    var Vocabs = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {

        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabs);
            this.load();
            return this;
        },
        events: {
            'click.Vocabs #vocabs-table tr': 'navigateInfo'
        },
        /**
         * @method load
         */
        load: function() {
            var vocabs = skritter.data.vocabs;
            for (var i in vocabs.models) {
                var vocab = vocabs.at(i);
                var div = '';
                div += "<tr id='" + vocab.get('id') + "'>";
                div += "<td>" + vocab.get('writing') + "</td>";
                div += "<td>" + PinyinConverter.toTone(vocab.get('reading')) + "</td>";
                div += "<td>" + vocab.get('definitions')[skritter.user.getSetting('sourceLang')] + "</td>";
                div += "</tr>";
                this.$('#vocabs-table tbody').append(div);
            }
        },
        /**
         * @method navigateInfo
         * @param {Object} event
         */
        navigateInfo: function(event) {
            skritter.router.navigate('info/' + event.currentTarget.id, {trigger: true});
        }
    });

    return Vocabs;
});