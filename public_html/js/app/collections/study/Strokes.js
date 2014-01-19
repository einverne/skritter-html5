/**
 * @module Skritter
 * @submodule Collection
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'models/study/Stroke'
], function(Stroke) {
    /**
     * @class Strokes
     */
    var Strokes = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(stroke) {
                stroke.cache();
            });
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone1',
                strokes: [
                    [383, 0.20, 0.20, 0.6, 0.1, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone2',
                strokes: [
                    [384, 0.25, 0.25, 0.5, 0.5, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone3',
                strokes: [
                    [385, 0.15, 0.20, 0.7, 0.6, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone4',
                strokes: [
                    [386, 0.25, 0.25, 0.5, 0.5, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone5',
                strokes: [
                    [387, 0.40, 0.40, 0.20, 0.20, 0.0]
                ]
            }));
        },
        /**
         * @property {Stroke} model
         */
        model: Stroke,
        /**
         * @method insert
         * @param {Array} strokes
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(strokes, callback) {
            if (strokes) {
                skritter.data.strokes.add(strokes, {merge: true, silent: true});
                skritter.storage.setItems('strokes', strokes, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('strokes', function(strokes) {
                skritter.data.strokes.add(strokes, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Strokes;
});