/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 * 
 * Properties
 * rune
 * lang
 * strokes
 * 
 */
define([
    'backbone'
], function() {
    /**
     * @class StudyStroke
     */
    var StudyStroke = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'rune'

    });


    return StudyStroke;
});