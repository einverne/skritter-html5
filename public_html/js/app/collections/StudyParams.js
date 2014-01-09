/**
 * @module Skritter
 * @submodule Collection
 * @param Params
 * @param StudyParam
 * @author Joshua McFarland
 */
define([
    'Params',
    'models/StudyParam',
    'backbone'
], function(Params, StudyParam) {
    /**
     * @class StudyParams
     */
    var StudyParams = Backbone.Collection.extend({
        /**
         * @property {StudyParam} model
         */
        model: StudyParam,
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.data.params.add(Params);
            if (typeof callback === 'function')
                callback(null, Params);
        }
    });

    return StudyParams;
});