/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class UserSettings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Settings.this = this;
            //stores user settings to localStorage as they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            audio: true,
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune']
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(event.id + '-settings', JSON.stringify(event.toJSON()));
        },
        /**
         * Returns an array of active parts based on the current language being studied.
         * 
         * @method activeParts
         * @returns {Array}
         */
        activeParts: function() {
            if (this.isChinese())
                return this.get('filterChineseParts');
            return this.get('filterJapaneseParts');
        },
        /**
         * Returns the users current avatar and returns it as an image tag using base64 data.
         * 
         * @method avatar
         * @param {String} classes
         * @returns {Image} Returns a base64 image tag
         */
        avatar: function(classes) {
            if (classes)
                return "<img src='data:image/png;base64," + this.get('avatar') + "' + class='" + classes + "' />";
            return "<img src='data:image/png;base64," + this.get('avatar') + "' />";
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            skritter.api.getUser(this.get('id'), function(result) {
                Settings.this.set(result);
                callback();
            });
        },
        /**
         * Returns true if the target language is set to Chinese.
         * 
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            if (this.get('targetLang') === 'zh')
                return true;
            return false;
        },
        /**
         * Returns true if the target language is set to Japanese.
         * 
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            if (this.get('targetLang') === 'ja')
                return true;
            return false;
        },
        /**
         * Returns the current style which really only applies to Chinese as both,
         * simplified or traditional.
         * 
         * @method style
         * @returns {Array}
         */
        style: function() {
            if (this.isJapanese()) {
                return [];
            } else if (this.isChinese() && this.get('reviewSimplified') && this.get('reviewTraditional')) {
                return ['both', 'simp', 'trad'];
            } else if (this.isChinese() && this.get('reviewSimplified') && !this.get('reviewTraditional')) {
                return ['both', 'simp'];
            } else {
                return ['both', 'trad'];
            }
        }
    });
    
    return Settings;
});