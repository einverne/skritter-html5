/**
 * @module Skritter
 * @param async
 * @param hammer
 * @param moment
 * @author Joshua McFarland
 */
define([
    'async',
    'hammer',
    'moment',
    'backbone',
    'base64',
    'bootstrap',
    'bootstrap.switch',
    'createjs.easel',
    'createjs.tween',
    'indexeddb.shim',
    'jquery',
    'jquery.indexeddb',
    'leap',
    'lodash',
    'require.text'
], function(async, hammer, moment) {
    window.async = async;
    window.hammer = hammer;
    window.moment = moment;
    return window;
});