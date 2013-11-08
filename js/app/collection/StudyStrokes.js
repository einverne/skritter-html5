/**
 * @module Skritter
 * @submodule Collection
 * @param StudyStroke
 * @author Joshua McFarland
 */
define([
    'model/StudyStroke',
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
        },
        /**
         * @property {StudyStroke} model
         */
        model: StudyStroke,
        /**
         * @method cache
         * @param {Function} callback
         * @returns {undefined}
         */
        cache: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            Skritter.storage.setItems('strokes', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('strokes', function(strokes) {
                Skritter.data.strokes.add(strokes);
                callback(null, strokes);
            });
        },
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