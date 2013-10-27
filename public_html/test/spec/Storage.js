/**
 * @param Storage
 * @author Joshua McFarland
 */
define([
    'storage/Storage'
], function(Storage) {
    describe('Storage', function() {
        var storage = new Storage();
        it('should have proper values for version and schema', function() {
            expect(storage.version).toEqual(jasmine.any(Number));
            expect(storage.version).toBeGreaterThan(0);
            expect(storage.schema).toEqual(jasmine.any(Object));
        });
        describe('getTable', function() {
            var table = storage.getTable('vocabs');
            it('should return an object containing keys and fields', function() {
                expect(table.keys).toBeDefined();
                expect(table.fields).toBeDefined();
            });
        });
        describe('getTableFieldNames', function() {
            var tableKeys = storage.getTableKeys('vocabs');
            var namesWithKeys = storage.getTableFieldNames('vocabs');
            var namesNoKeys = storage.getTableFieldNames('vocabs', true);
            it('should return an array', function() {
                expect(namesWithKeys).toEqual(jasmine.any(Array));
                expect(namesNoKeys).toEqual(jasmine.any(Array));
            });
            it('should not return keys if they are excluded', function() {
                expect(namesNoKeys).not.toContain(tableKeys[0]);
            });
        });
        describe('getTableKeys', function() {
            var tableKeys = storage.getTableKeys('vocabs');
            it('should return an array', function() {
                expect(tableKeys).toEqual(jasmine.any(Array));
            });
        });
        describe('getTableNames', function() {
            var tableNames = storage.getTableNames();
            it('should return an array', function() {
                expect(tableNames).toEqual(jasmine.any(Array));
            });
        });
    });
});