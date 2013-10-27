/**
 * @param IndexedDbAdapter
 * @author Joshua McFarland
 */
define([
    'storage/IndexedDbAdapter'
], function(IndexedDbAdapter) {
    var adapter = new IndexedDbAdapter();
    describe('IndexedDbAdapter', function() {
        beforeEach(function() {
	    runs(function() {
		var done = false;
		adapter.openDatabase('test123', function(event) {
		    db = event;
		    done = true; 
		});
		waitsFor(function() {
		    return done;
		}, 5000);
	    });
	});
        describe('openDatabase', function() {
            it('should create a databased named test123', function() {

            });
        });
        describe('removeDatabase', function() {
            it('should delete a database named test123', function() {

            });
        });
        afterEach(function() {
	    runs(function() {
		var done = false;
		adapter.deleteDatabase(function() {
		    done = true; 
		});
		waitsFor(function() {
		    return done;
		}, 5000);
	    });
	});
    });
});