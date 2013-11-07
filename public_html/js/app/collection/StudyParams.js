/**
 * @module Skritter
 * @submodule Collection
 * @param Params
 * @param StudyParam
 * @author Joshua McFarland
 */
define([
    'Params',
    'model/StudyParam',
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
         * @async
         * @method loadAll
         * @param {Callback} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            var params = Params;
            Skritter.data.params.add(params);
            callback(null, params);
        }

    });


    return StudyParams;
});