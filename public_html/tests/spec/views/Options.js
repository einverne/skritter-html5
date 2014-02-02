define([
    'views/Options'
], function(Options) {
    describe('Options View', function() {
        var view, _parts;

        beforeEach(function() {
            view = new Options();
            _parts = skritter.user.getActiveParts();
        });
        afterEach(function() {
            skritter.user.setActiveParts(_parts);
        })

        it('should show all parts as enabled', function(){
            skritter.user.setActiveParts(["defn", "rdng", "rune", "tone"]);
            view.render();
            _.each(['#parts-reading', '#parts-definition', '#parts-tone', '#parts-writing'], function(part) {
                expect(view.$(part).bootstrapSwitch('state')).toBeTruthy();
            });
        });

        it('should show all parts as disabled', function(){
            skritter.user.setActiveParts([]);
            view.render();
            _.each(['#parts-reading', '#parts-definition', '#parts-tone', '#parts-writing'], function(part) {
                expect(view.$(part).bootstrapSwitch('state')).toBeFalsy();
            });
        });
    });
});
