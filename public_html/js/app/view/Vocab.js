/**
 * @module Skritter
 * @submodule View
 * @param PinyinConverter
 * @param VocabWords
 * @param templateVocab
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'component/Words',
    'require.text!template/vocab.html',
    'backbone'
], function(PinyinConverter, VocabWords, templateVocab) {
    /**
     * @class VocabView
     */
    var Vocab = Backbone.View.extend({
        /**
         * @method render
         * @returns {Vocab}
         */
        render: function() {
            this.$el.html(templateVocab);
            new VocabWords().setElement(this.$('#vocab-display')).render();
            this.loadEntries();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Vocab .entry': 'toInfo'
        },
        /**
         * @method loadEntries
         */
        loadEntries: function() {
            this.$('#entries').html('');
            var lang = Skritter.user.getSetting('sourceLang');
            var items = Skritter.study.items.filterActive(true);
            var vocabs = items.getContainedVocabs();
            for (var i in vocabs) {
                var vocab = vocabs[i];
                
                var div = "<div id='" + vocab.get('id') + "' class='entry'>" + 
                        "<div id='writing'>" + vocab.get('writing') + "</div>" +
                        "<div id='reading'>" + PinyinConverter.toTone(vocab.get('reading')) + "</div>" +
                        "<div id='definition'>" + vocab.get('definitions')[lang] + "</div>" +
                        "</div>";
                
                this.$('#entries').append(div);
            }
        },
        /**
         * @method toInfo
         * @param {Object} event
         */
        toInfo: function(event) {
            window.location.hash = 'info/' + event.currentTarget.id;
        }
    });
    
    
    return Vocab;
});