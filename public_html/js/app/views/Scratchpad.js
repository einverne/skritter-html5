/**
 * @module Skritter
 * @param SimpTradMap
 * @param StudyItems
 * @param StudyVocabs
 * @param Defn
 * @param Rdng
 * @param Rune
 * @param Tone
 * @param templateScratchpad
 * @author Joshua McFarland
 */
define([
    'SimpTradMap',
    'collections/StudyItems',
    'collections/StudyVocabs',
    'prompts/Defn',
    'prompts/Rdng',
    'prompts/Rune',
    'prompts/Tone',
    'require.text!templates/scratchpad.html',
    'backbone'
], function(SimpTradMap, StudyItems, StudyVocabs, Defn, Rdng, Rune, Tone, templateScratchpad) {
    /**
     * @class Scratchpad
     */
    var Scratchpad = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Scratchpad.current = {item: null, prompt: null, vocabs: null};
            Scratchpad.ids = [];
            Scratchpad.items = new StudyItems();
            Scratchpad.lang = null;
            Scratchpad.vocabs = new StudyVocabs();
            Scratchpad.words = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            var self = this;
            this.$el.html(templateScratchpad);
            skritter.timer.setElement(this.$('#timer')).render();
            skritter.modal.show('progress').setTitle('Fetching Vocabs').setProgress(100);
            skritter.async.series([
                function(callback) {
                    if (!skritter.user.isLoggedIn()) {
                        skritter.api.authenticateClient(callback);
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    skritter.api.getVocabs(Scratchpad.ids, function(result) {
                        console.log(skritter.data.params);
                        skritter.data.decomps.add(result.Decomps, {merge: true, silent: true, sort: false});
                        skritter.data.params.loadAll();
                        skritter.data.sentences.add(result.Sentences, {merge: true, silent: true, sort: false});
                        skritter.data.strokes.add(result.Strokes, {merge: true, silent: true, sort: false});
                        var vocabs = skritter.data.vocabs.add(result.Vocabs, {merge: true, silent: true, sort: false});
                        for (var i in vocabs)
                            Scratchpad.items.add(vocabs[i].spawnVirtualItems(['rune']), {merge: true, silent: true, sort: false});
                        callback();
                    });
                }
            ], function() {
                skritter.modal.hide();
                self.nextPrompt();
            });
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Scratchpad #scratchpad-view #audio-button': 'playAudio'
        },
        /**
         * @method addItem
         */
        addItems: function() {
        },
        /**
         * @method clearPrompt
         * @returns {Backbone.View}
         */
        clearPrompt: function() {
            Scratchpad.current = {prompt: null, vocabs: null};
            return this;
        },
        /**
         * @method handlePromptComplete
         * @param {Object} results
         */
        handlePromptComplete: function(results) { 
            console.log('prompt complete');
        },
        /**
         * @method loadPrompt
         * @returns {Boolean}
         */
        navigateInfo: function() {
            skritter.router.navigate('info/' + Scratchpad.current.vocabs[0].get('id'), {trigger: true});
            return false;
        },
        /**
         * @method nextItem
         * @returns {Backbone.View}
         */
        nextPrompt: function() {
            Scratchpad.current.item = Scratchpad.items.at(0);
            Scratchpad.current.vocabs = Scratchpad.current.item.getVocabs();
            Scratchpad.current.prompt = new Rune();
            Scratchpad.current.prompt.set(Scratchpad.current.vocabs, Scratchpad.current.item);
            Scratchpad.current.prompt.setElement(this.$('#prompt-container')).render();
            Scratchpad.current.prompt.show();
            this.listenToOnce(Scratchpad.current.prompt, 'complete', this.handlePromptComplete);
            return this;
        },
        /**
         * @method playAudio
         */
        playAudio: function() {
            Scratchpad.current.vocabs[0].play();
            return false;
        },
        /**
         * @method set
         * @param {String} lang
         * @param {String} words
         */
        set: function(lang, words) {
            Scratchpad.ids = [];
            Scratchpad.lang = lang;
            words = words.split('_');
            for (var a in words) {
                var word = words[a];
                var split = word.split('');
                if (split.length > 1) {
                    words = words.concat(split);
                }
            }
            words = _.uniq(words);
            for (var b in words) {
                if (lang === 'zh') {
                    var map = SimpTradMap.getSimplifiedBase(words[b]);
                    Scratchpad.ids.push(lang + '-' + map.rune + '-' + map.variation);
                } else {
                    if (!skritter.fn.isKana(words[b]))
                        Scratchpad.ids.push('ja-' + words[b] + '-0');
                }
            }
            Scratchpad.words = words;
        },
        /**
         * @method toggleAudioButton
         */
        toggleAudioButton: function() {
            if (Scratchpad.current.vocabs[0].has('audio')) {
                this.$('#audio-button').removeClass('fa fa-volume-off');
                this.$('#audio-button').addClass('fa fa-volume-up');
            } else {
                this.$('#audio-button').removeClass('fa fa-volume-up');
                this.$('#audio-button').addClass('fa fa-volume-off');
            }
        }
    });

    return Scratchpad;
});