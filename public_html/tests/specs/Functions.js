/**
 * @param Functions
 * @submodule Tests
 * @author Joshua McFarland
 */
define([
    'Functions'
], function(Functions) {
    describe('Functions', function() {
        describe('bytesToSize', function() {
            it('should display KB when more than 1023 bytes', function() {
                expect(Functions.bytesToSize(1024).indexOf('KB')).toBeGreaterThan(-1);
            });
            it('should display MB when more than 1048575 bytes', function() {
                expect(Functions.bytesToSize(1048576).indexOf('MB')).toBeGreaterThan(-1);
            });
        });
        describe('getUnixTime', function() {
            it('should return a number of milliseconds if parameter is set to true', function() {
                expect(Functions.isNumber(Functions.getUnixTime())).toBe(true); 
                expect(Functions.getUnixTime(true)).toBeGreaterThan(Functions.getUnixTime());
            });
        });
        describe('isLocal', function() {
            it('should return true if hostname is html5.skritter.com or html5.skritter.cn', function() {
                expect(Functions.isLocal('html5.skritter.com')).toBe(false);
                expect(Functions.isLocal('html5.skritter.cn')).toBe(false);
            });
            it('should return false is not one of the listed hostnames', function() {
                expect(Functions.isLocal('localhost')).toBe(true);
                expect(Functions.isLocal('192.168.1.1')).toBe(true);
            });
        });
        describe('isNumber', function() {
            it('should return true if a integer is passed', function() {
                expect(Functions.isNumber(1)).toBe(true);
            });
            it('should return true if a float is passed', function() {
                expect(Functions.isNumber(1.11)).toBe(true);
            });
            it('should return false if a string is passed', function() {
                expect(Functions.isNumber('a')).toBe(false);
            });
            it('should return false if an array is passed', function() {
                expect(Functions.isNumber([])).toBe(false);
            });
            it('should return false if an object is passed', function() {
                expect(Functions.isNumber({})).toBe(false);
            });
        });
    });
});