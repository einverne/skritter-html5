/**
 * @module Skritter
 * @submodule Collection
 * @param StudyStroke
 * @author Joshua McFarland
 */
define([
    'models/StudyStroke',
    'backbone'
], function(StudyStroke) {
    /**
     * @class StudyStrokes
     */
    var StudyStrokes = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.loadTones();
            this.on('change', function(item) {
                item.cache();
            });
        },
        /**
         * @property {StudyStroke} model
         */
        model: StudyStroke,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('strokes', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method insert
         * @param {Array} strokes
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(strokes, callback) {
            if (strokes) {
                this.add(strokes, {merge: true});
                skritter.storage.setItems('strokes', strokes, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('strokes', function(strokes) {
                skritter.data.strokes.add(strokes, {silent: true});
                callback(null, strokes);
            });
        },
        /**
         * @method loadTones
         */
        loadTones: function() {
            this.add(new StudyStroke().set({
                lang: 'zh',
                rune: 'tone1',
                strokes: [
                    [383, 0.20, 0.20, 0.6, 0.1, 0.0]
                ]
            }));
            this.add(new StudyStroke().set({
                lang: 'zh',
                rune: 'tone2',
                strokes: [
                    [384, 0.25, 0.25, 0.5, 0.5, 0.0]
                ]
            }));
            this.add(new StudyStroke().set({
                lang: 'zh',
                rune: 'tone3',
                strokes: [
                    [385, 0.15, 0.20, 0.7, 0.6, 0.0]
                ]
            }));
            this.add(new StudyStroke().set({
                lang: 'zh',
                rune: 'tone4',
                strokes: [
                    [386, 0.25, 0.25, 0.5, 0.5, 0.0]
                ]
            }));
            this.add(new StudyStroke().set({
                lang: 'zh',
                rune: 'tone5',
                strokes: [
                    [387, 0.40, 0.40, 0.20, 0.20, 0.0]
                ]
            }));
        }
    });

    return StudyStrokes;
});