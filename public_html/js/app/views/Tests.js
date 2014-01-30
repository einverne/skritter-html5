/**
 * @module Skritter
 * @param jasmine
 * @author Joshua McFarland
 */
define([
    'jasmine-html'
], function(jasmine) {
    /**
     * @class Tests
     */
    var Tests = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Tests.jasmineEnv = jasmine.getEnv();
            Tests.htmlReporter = new jasmine.HtmlReporter();
            Tests.specs = [
                'spec/Functions'
            ];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            Tests.jasmineEnv.updateInterval = 1000;
            Tests.jasmineEnv.addReporter(Tests.htmlReporter);
            Tests.jasmineEnv.specFilter = this.filterSpec;
            requirejs(Tests.specs, function() {
                Tests.jasmineEnv.execute();
            });
            return this;
        },
        /**
         * @method filterSpec
         * @param {Object} spec
         * @returns {Boolean}
         */
        filterSpec: function(spec) {
            return Tests.htmlReporter.specFilter(spec);
        }
    });

    return Tests;
});