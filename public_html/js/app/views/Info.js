/**
 * @module Skritter
 * @submodule Views
 * @param PinyinConverter
 * @param templateInfo
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'require.text!templates/info.html',
    'backbone'
], function(PinyinConverter, templateInfo) {
    /**
     * @class Info
     */
    var Info = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Info.vocab = null;
            Info.sentence = null;
        },
        /**
         * @method render
         * @return {Backbone.View}
         */
        render: function() {
            this.$el.html(templateInfo);
            this.$('.writing').text(Info.vocab.get('writing'));
            this.$('.writing').addClass(skritter.user.getTextStyle());
            this.$('#reading').text(PinyinConverter.toTone(Info.vocab.get('reading')));
            this.$('#definition').text(Info.vocab.get('definitions')[skritter.user.getSetting('sourceLang')]);
            this.$('#mnemonic').text(Info.vocab.get('mnemonic'));
            this.$('#sentence').text(Info.sentence.get('writing').replace(/\s+/g, ''));
            this.$('#sentence').addClass(skritter.user.getTextStyle());

            //contained characters
            var contained = _.uniq(Info.vocab.get('containedVocabIds'));
            if (contained.length > 0) {
                this.$('#contained-characters tbody').html('');
                for (var a in contained) {
                    var containedVocab = skritter.data.vocabs.findWhere({id: contained[a]});
                    var divA = "<tr id='" + containedVocab.get('id') + "' class='contained-row'>";
                    divA += "<td class='writing'>" + containedVocab.get('writing') + "</td>";
                    divA += "<td class='reading'>" + PinyinConverter.toTone(containedVocab.get('reading')) + ": </td>";
                    divA += "<td class='definition'>" + containedVocab.get('definitions')[skritter.user.getSetting('sourceLang')] + "</td>";
                    divA += "</tr>";
                    this.$('#contained-characters tbody').append(divA);
                }
            } else {
                this.$('#contained-characters').hide();
            }

            //decompositions
            var decomps = Info.vocab.getDecomps();
            if (decomps) {
                this.$('#decompositions tbody').html('');
                for (var c in decomps) {
                    var decomp = decomps[c];
                    var divB = "<tr class='decomp-item'>";
                    divB += "<td class='writing'>" + decomp.writing + "</td>";
                    divB += "<td class='reading'>" + PinyinConverter.toTone(decomp.reading) + "</td>";
                    divB += "<td class='definition'>" + decomp.definitions[skritter.user.getSetting('sourceLang')] + "</td>";
                    divB += "</tr>";
                    this.$('#decompositions tbody').append(divB);
                }
            } else {
                this.$('#decompositions').hide();
            }

            if (Info.vocab.has('audio')) {
                this.$('#audio-button').show();
            } else {
                this.$('#audio-button').hide();
            }
            if (Info.vocab.has('bannedParts'))
                this.$('#ban-button span').text('Banned');
            if (Info.vocab.get('starred')) {
                this.$('#star-button span').removeClass('fa-star-o');
                this.$('#star-button span').addClass('fa-star');
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Info #info-view #audio-button': 'playAudio',
            'click.Info #info-view .contained-row': 'navigateInfo',
            'click.Info #info-view #ban-button': 'toggleBanned',
            'click.Info #info-view #star-button': 'toggleStarred',
        },
        /**
         * @method navigateInfo
         * @returns {Boolean}
         */
        navigateInfo: function(event) {
            console.log(event);
            skritter.router.navigate('info/' + event.currentTarget.id, {trigger: true});
            return false;
        },
        /**
         * @method playAudio
         */
        playAudio: function() {
            Info.vocab.play();
        },
        /**
         * @method set
         * @param {String} vocabId
         */
        set: function(vocabId) {
            Info.vocab = skritter.data.vocabs.findWhere({id: vocabId});
            if (Info.vocab.has('sentenceId'))
                Info.sentence = skritter.data.sentences.findWhere({id: Info.vocab.get('sentenceId')});
        },
        /**
         * @method toggleBanned
         */
        toggleBanned: function() {
            if (Info.vocab.has('bannedParts')) {
                this.$('#ban-button span').text('Ban');
                Info.vocab.unset('bannedParts');
            } else {
                this.$('#ban-button span').text('Banned');
                Info.vocab.set('bannedParts', ['defn', 'rdng', 'rune', 'tone']);
            }
        },
        /**
         * @method toggleStarred
         */
        toggleStarred: function() {
            if (Info.vocab.get('starred')) {
                this.$('#star-button span').removeClass('fa-star');
                this.$('#star-button span').addClass('fa-star-o');
                Info.vocab.set('starred', false);
            } else {
                this.$('#star-button span').removeClass('fa-star-o');
                this.$('#star-button span').addClass('fa-star');
                Info.vocab.set('starred', true);
            }
        }
    });

    return Info;
});