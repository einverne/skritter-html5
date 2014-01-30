/**
 * These libraries need to be loaded after the vendor libraries are loaded or 
 * need special handling to be loaded into the global window namespace.
 * 
 * @module Skritter
 * @class Libraries
 * @param async
 * @param hammer
 * @param moment
 * @author Joshua McFarland
 */
define([
    'async',
    'hammer',
    'moment',
    'require.text'
], function(async, hammer, moment) {
    window.async = async;
    window.hammer = hammer;
    window.moment = moment;
    return window;
});