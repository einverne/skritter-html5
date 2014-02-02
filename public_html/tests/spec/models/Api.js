define([
    'models/Api'
], function (Api){
    describe('Api', function() {
        var api;
        beforeEach(function() {
            api = new Api({clientId: 'client', clientSecret: '1234567890abcdef1234567890abcd'});
        });

        it('should get base url', function() {
            expect(api.baseUrl()).toEqual('https://www.skritter.com/api/v0/');
        });
        it('should get credentials', function() {
            expect(api.credentials()).toEqual('basic Y2xpZW50OjEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZA==');
        });
    });
})