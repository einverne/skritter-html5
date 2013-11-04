/**
 * @module Skritter
 * @submodule View
 * @param templateLogin
 * @author Joshua McFarland
 */
define([
    'require.text!template/login.html',
    'backbone'
], function(templateLogin) {
    /**
     * @class LoginView
     */
    var Login = Backbone.View.extend({
        initialize: function() {

        },
        /**
         * @method render
         * @return {LoginView}
         */
        render: function() {
            this.$el.html(templateLogin);
            this.$('#login-view').show(Skritter.settings.get('transitionSpeed'));
            return this;
        },
        events: {
            'click.Login #back-button': 'goBack',
            'click.Login #login-button': 'login',
            'keyup.Login #password': 'handleEnter' 
        },
        goBack: function() {
            document.location.hash = '';
        },
        handleEnter: function(event) {
            if (event.keyCode === 13)
                this.login();
        },
        login: function() {
            var self = this;
            var username = this.$('#username').val();
            var password = this.$('#password').val();
            
            if (!username || username === '' || !password || password === '') {
                self.showErrorMessage('Username and password cannot be blank');
                return;
            }
            Skritter.facade.show('logging in');
            Skritter.user.login(username, password, function(response) {
                if (response.statusCode !== 200) {
                    Skritter.facade.hide();
                    self.showErrorMessage(response.message);
                } else {
                    Skritter.application.reload(function() {
                        Skritter.facade.hide();
                        document.location.hash = '';
                    });
                }
            });
        },
        /**
         * @method showErrorMessage
         * @param {String} text
         */
        showErrorMessage: function(text) {
            this.$('.error-message').html(
                Skritter.fn.twbsAlertHTML('warning', text));
        }
    });


    return Login;
});