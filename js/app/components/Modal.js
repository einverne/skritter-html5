/**
 * @module Skritter
 * @submodule Component
 * @param templateModals
 * @author Joshua McFarland
 */
define([
    'require.text!templates/modals.html',
    'backbone'
], function(templateModals) {
    /**
     * @class Modal
     */
    var Modal = Backbone.View.extend({
        /**
         * @method initialze
         */
        initialize: function() {
            var self = this;
            Modal.element = null;
            Modal.id = null;
            Modal.options = null;
            this.$el.on('show.bs.modal', function() {
                if (self.$el.children().hasClass('in')) {
                    self.$el.children('.in').modal('hide').one('hidden.bs.modal', function() {
                        self.$(Modal.element).modal(Modal.options);
                    });
                    return false;
                }
            });
        },
        el: this.$('#modal-container'),
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateModals);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Modal #login #login-button': 'handleLogin'
        },
        /**
         * @method handleLogin
         * @param {Object} event
         */
        handleLogin: function(event) {
            var self = this;
            var username = this.$(event.target.parentNode).children('#login-username').val();
            var password = this.$(event.target.parentNode).children('#login-password').val();
            this.show('default', function() {
                skritter.user.login(username, password, function(result) {
                    if (result.statusCode === 200) {
                        document.location.href = '';
                    } else {
                        self.$('#login #error-message').html(skritter.fn.twbsAlertHTML('warning', result.message));
                        self.show('login');
                    }
                });
            }).setBody('Logging In').noHeader();
            return false;
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        hide: function(callback) {
            this.$(Modal.element).modal('hide').one('hidden.bs.modal', callback);
            return this;
        },
        /**
         * @method noBody
         * @returns {Backbone.View}
         */
        noBody: function() {
            this.$('.modal-body').hide();
            return this;
        },
        /**
         * @method noHeader
         * @returns {Backbone.View}
         */
        noHeader: function() {
            this.$('.modal-header').hide();
            return this;
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.$('#' + Modal.id + '.modal-body').html('');
            this.$('#' + Modal.id + '.modal-header').html('');
            this.$('#' + Modal.id + '.modal-progress-text').html('');
            this.$('#' + Modal.id + '.modal-title').html('');
            return this;
        },
        /**
         * @method setBody
         * @param {String} text
         * @returns {Backbone.View}
         */
        setBody: function(text) {
            this.$('#' + Modal.id + ' .modal-body').html(text);
            return this;
        },
        /**
         * @method setProgress
         * @param {Number} percent
         * @param {String} text
         * @returns {Backbone.View}
         */
        setProgress: function(percent, text) {
            percent = (percent === 0) ? '0' : percent;
            if (percent)
                this.$('#' + Modal.id + ' .progress-bar').width(percent + '%');
            if (text)
                this.$('#' + Modal.id + ' .progress-bar .sr-only').text(percent + '% Complete');
            this.$('#' + Modal.id + ' .modal-progress-text').text(text);
            return this;
        },
        /**
         * @method setTitle
         * @param {String} text
         * @returns {Backbone.View}
         */
        setTitle: function(text) {
            this.$('#' + Modal.id + ' .modal-title').html(text);
            return this;
        },
        /**
         * @method show
         * @param {String} id
         * @param {Function} callback
         * @param {Object} options
         * @returns {Backbone.View}
         */
        show: function(id, callback, options) {
            id = (id) ? id : 'default';
            options = (options) ? options : {};
            options.backdrop = (options.backdrop) ? options.backdrop : 'static';
            options.keyboard = (options.keyboard) ? options.keyboard : false;
            options.show = (options.show) ? options.show : true;
            options.remote = (options.remote) ? options.remote : false;
            Modal.id = id;
            Modal.options = options;
            Modal.element = this.$('#' + id).modal(options).one('shown.bs.modal', callback);
            this.$(Modal.element).children('.modal-content').show();
            this.reset();
            return this;
        }
    });

    return Modal;
});