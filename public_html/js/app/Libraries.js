/**
 * These libraries need to be loaded after the vendor libraries are loaded or 
 * need special handling to be loaded into the global window namespace.
 * 
 * @module Skritter
 * @class Libraries
 * @param async
 * @param moment
 * @author Joshua McFarland
 */
define([
    'async',
    'moment',
    'require.text'
], function(async, moment) {
    window.async = async;
    window.moment = moment;
});