define(["storage/IndexedDbAdapter"],function(e){var t=new e;describe("IndexedDbAdapter",function(){beforeEach(function(){runs(function(){var e=!1;t.openDatabase("test123",function(t){db=t,e=!0}),waitsFor(function(){return e},5e3)})}),describe("openDatabase",function(){it("should create a databased named test123",function(){})}),describe("removeDatabase",function(){it("should delete a database named test123",function(){})}),afterEach(function(){runs(function(){var e=!1;t.deleteDatabase(function(){e=!0}),waitsFor(function(){return e},5e3)})})})});