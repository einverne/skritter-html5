/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 * 
 * Properties
 * writing
 * atomic
 * Children
 * 
 */
define([
    'backbone'
], function() {
    /**
     * @class StudyDecomp
     */
    var StudyDecomp = Backbone.Model.extend({    
	/**
         * @property {String} idAttribute
         */
        idAttribute: 'writing'
    });
    
    
    return StudyDecomp;
});