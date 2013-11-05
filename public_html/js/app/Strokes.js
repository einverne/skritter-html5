/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'createjs.easel'
], function() {
    /**
     * @property {String} defaultColor
     */
    var defaultColor = '#000000';
    /**
     * @property {Object} strokes
     */
    var strokes = {
        0: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EA/mAFUYAAAUAAAUAAAeYgoAygyAKgyAAYgUgKgUAAgUAAYkYgUkYgekYAAYjwAAjmAUjwAUYkiAUkiAUksAoYjIAUjIAojSAeYh4AUh4Aoh4AeYgeAAgeAAgeAAYgygegygKgogeYhkgyhagygyhkYAAgUAAgUAAgKYAUgyAoAAAogKYDmAADwAADmgUYGagoGkgoGagyYFogeFogoFegyYB4gKBugeB4gUYAoAAAoAAAoAAYAUAKAUAKAeAKYCWBQCgBQBuCW").cp().ef());
            stroke.regX = 407 / 2;
            stroke.regY = 71 / 2;
            stroke.setBounds(0, 0, 407, 71);
            return stroke;
        }(),
        1: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFAJEYgeAAgeAAgUAAYgogegogKgegeYgygegogogogeYAAgKAAgKAAgKYAegUAegUAoAAYCWgKCWgKCWgUYEOgUEOgUEEgeYDwgeDwgyDwgyYCqgeCggoCqgeYAeAAAeAAAoAAYAKAAAKAAAKAKYBkAeBuAeA8BuYAAAAAAAKAAAKYgoAKgeAegeAKYkOAUkYAUkYAeYnWA8nWBGnWBGYhuAKhkAehkAU").cp().ef());
            stroke.regX = 297 / 2;
            stroke.regY = 58 / 2;
            stroke.setBounds(0, 0, 297, 58);
            return stroke;
        }(),
        4: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHgGGYg8AAg8AAgyAAYh4gehugohQhQYAAgKAAgKAAgKYAegUAegKAeAAYDSgUDIAADIgUYEOgUEEg8EOg8YAyAAAyAAAyAAYAKAAAKAAAKAKYBQAUBGAeAyBGYAAAKAAAUAAAUYg8AyhGAKhGAAYlAAolAAolAAeYhQAKhQAKhQAU").cp().ef());
            stroke.regX = 188 / 2;
            stroke.regY = 39 / 2;
            stroke.setBounds(0, 0, 188, 39);
            return stroke;
        }(),
        11: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAACCYAAgyAAgoAAgoYAeAAAeAAAoAAYBaAoA8BGA8BQYAyA8AyA8AyBGYAAAKAAAUAAAUYgKAogKAogKAoYAAC0gKC+AKC0YAAFyAKFyAKFyYAAAUAAAeAKAeYAAAUAAAUAAAeYgKAAAAAKAAAKYgUB4gUB4geB4YgKAygoAogUAyYgUAAgKAAgKAAYg8gegegogUgyYhQiggyigAyiqYBGlAAok2AAlAYAAjmAAjwAAjmYAAhGgUg8geg8Ygyhkgyhkgohk").cp().ef());
            stroke.regX = 46 / 2;
            stroke.regY = 288 / 2;
            stroke.setBounds(0, 0, 46, 288);
            return stroke;
        }(),
        37: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATsDwYgUBugeB4AAB4YgeFUgoFUg8FUYhkIIkOGQm4EiYg8Aog8Aeg8AoYgeAAgeAAgeAAYAAgUAAgKAAgKYBuh4CChuBuh4YEOkYCClKBalyYBGkOAUkYAKkiYAAhuAAh4gUh4YgKhagohQgehaYgeg8AAgeBGgUYAAAAAKAAAKAAYAAAAAKAAAKAAYB4AoB4AyBkBQYAAAUAAAUAAAe").cp().ef());
            stroke.regX = 126 / 2;
            stroke.regY = 293 / 2;
            stroke.setBounds(0, 0, 126, 293);
            return stroke;
        }(),
        51: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaaFyYhQBkhaBuhGBkYi0D6igEEi0DwYjSEYjcEOkODSYgyAyg8AegyAoYgeAAgUAAgUAAYAAgUAAgUAAgKYBQhuBahkBahuYEYleEYlyDSmaYA8h4A8iMA8iCYAohQAAhagehaYgKgUAAgUgKgUYgKgyAKgeAygUYAKAAAKAAAUAAYAAAAAKAAAKAAYCqA8CCBaBQCqYAAAKAAAUAAAU").cp().ef());
            stroke.regX = 169 / 2;
            stroke.regY = 231 / 2;
            stroke.setBounds(0, 0, 169, 231);
            return stroke;
        }()/*,
        57: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.regX =  / 2;
            stroke.regY =  / 2;
            stroke.setBounds(0, 0, , );
            return stroke;
        }(),
        66: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.regX =  / 2;
            stroke.regY =  / 2;
            stroke.setBounds(0, 0, , );
            return stroke;
        }(),
        75: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.regX =  / 2;
            stroke.regY =  / 2;
            stroke.setBounds(0, 0, , );
            return stroke;
        }(),
        78: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.regX =  / 2;
            stroke.regY =  / 2;
            stroke.setBounds(0, 0, , );
            return stroke;
        }()*/
    };


    return strokes;
});