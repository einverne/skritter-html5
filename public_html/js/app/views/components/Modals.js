/**
 * @module Skritter
 * @submodule Views
 * @param templateModals
 * @author Joshua McFarland
 */
define([
    'require.text!templates/modals.html'
], function(templateModals) {
    /**
     * @class Modals
     */
    var Modals = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Modals.this = this;
            Modals.element = null;
            Modals.id = null;
            Modals.options = null;
            this.$el.on('show.bs.modal', function(event) {
                if (Modals.this.$el.children().hasClass('in')) {
                    Modals.this.$el.children('.in').modal('hide').one('hidden.bs.modal', function() {
                        Modals.this.$(Modals.element).modal(Modals.options);
                    });
                    event.preventDefault();
                }
            });
        },
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
            'click.Modals #login.modal #login-button': 'handleLoginButtonClicked'
        },
        /**
         * Handles the events when the login button is clicked from the login modal.
         * 
         * @method handleLoginButtonClicked
         * @param {Object} event
         */
        handleLoginButtonClicked: function(event) {
            var content = this.$(event.target).parents('.modal-content');
            var form = content.find('.form-signin');
            var username = form.find('#login-username').val();
            var password = form.find('#login-password').val(); 
            content.find(':input').prop('disabled', true);
            skritter.modals.set('#login-message', "<img src='images/ajax-loader.gif' /> LOGGING IN", 'text-center');
            skritter.user.login(username, password, function(result) {
                if (result.statusCode === 200) {
                    document.location.href = '';
                } else {
                    skritter.modals.set('#login-message', skritter.fn.bootstrap.alert(result.message, 'danger'), 'text-center');
                    content.find(':input').prop('disabled', false);
                }
            });
            event.preventDefault();
        },
        /**
         * Hides the modal and calls back when it has finished hiding.
         * 
         * @method hide
         * @param {Function} callback
         */
        hide: function(callback) {
            this.$(Modals.element).modal('hide').one('hidden.bs.modal', function() {
                Modals.this.render();
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * Returns the element of the current active modal.
         * 
         * @method element
         * @returns {DOMElement}
         */
        element: function() {
            return Modals.element;
        },
        /**
         * @method progress
         * @param {Number} percent
         * @returns {Backbone.View}
         */
        progress: function(percent) {
            percent = percent ? Math.round(percent) : 0;
            this.$('#' + Modals.id + ' .progress-bar').width(percent + '%');
            this.$('#' + Modals.id + ' .progress-bar .sr-only').text(percent + '% Complete');
            return this;
        },
        /**
         * Resets the active modals display and classes to the defaults.
         * 
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            this.$('#' + Modals.id + ' .modal-footer').attr('classes', 'modal-footer');
            this.$('#' + Modals.id + ' .modal-header').attr('classes', 'modal-header');
            this.$('#' + Modals.id + ' .modal-title').attr('classes', 'modal-title');
            this.$('#' + Modals.id).find('*').show();
            return this;
        },
        /**
         * Finds and sets the active modal html and attribute values.
         * 
         * @method set
         * @param {String} findBy
         * @param {String} html
         * @param {Array|String} atrribute
         * @returns {Backbone.View}
         */
        set: function(findBy, html, atrribute) {
            var atributes = Array.isArray(atrribute) ? atrribute : [atrribute];
            var element = this.$('#' + Modals.id).find(findBy);
            if (html === false) {
                element.hide();
            } else {
                element.addClass(atributes.join(' '));
                element.html(html);
            }
            return this;
        },
        /**
         * Displays a popup modal dialog based on one of the template ids. It also takes options
         * for how to handle the backdrop, keyboard, show and remote options specificed by Boostrap.
         * 
         * @method show
         * @param {String} id
         * @param {Function} callback
         * @param {Object} options
         * @returns {Backbone.View}
         */
        show: function(id, callback, options) {
            id = id ? id : 'default';
            Modals.id = id;
            options = (options) ? options : {};
            options.backdrop = (options.backdrop) ? options.backdrop : 'static';
            options.keyboard = (options.keyboard) ? options.keyboard : false;
            options.show = (options.show) ? options.show : true;
            options.remote = (options.remote) ? options.remote : false;
            Modals.options = options;
            Modals.element = this.$('#' + id).modal(options).one('shown.bs.modal', function() {
                if (typeof callback === 'function')
                    callback();
            });
            this.reset();
            return this;
        }
    });
    
    return Modals;
});