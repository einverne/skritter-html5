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
            stroke.setBounds(0, 0, 407, 71);
            return stroke;
        }(),
        1: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFAJEYgeAAgeAAgUAAYgogegogKgegeYgygegogogogeYAAgKAAgKAAgKYAegUAegUAoAAYCWgKCWgKCWgUYEOgUEOgUEEgeYDwgeDwgyDwgyYCqgeCggoCqgeYAeAAAeAAAoAAYAKAAAKAAAKAKYBkAeBuAeA8BuYAAAAAAAKAAAKYgoAKgeAegeAKYkOAUkYAUkYAeYnWA8nWBGnWBGYhuAKhkAehkAU").cp().ef());
            stroke.setBounds(0, 0, 297, 58);
            return stroke;
        }(),
        4: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHgGGYg8AAg8AAgyAAYh4gehugohQhQYAAgKAAgKAAgKYAegUAegKAeAAYDSgUDIAADIgUYEOgUEEg8EOg8YAyAAAyAAAyAAYAKAAAKAAAKAKYBQAUBGAeAyBGYAAAKAAAUAAAUYg8AyhGAKhGAAYlAAolAAolAAeYhQAKhQAKhQAU").cp().ef());
            stroke.setBounds(0, 0, 188, 39);
            return stroke;
        }(),
        11: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAACCYAAgyAAgoAAgoYAeAAAeAAAoAAYBaAoA8BGA8BQYAyA8AyA8AyBGYAAAKAAAUAAAUYgKAogKAogKAoYAAC0gKC+AKC0YAAFyAKFyAKFyYAAAUAAAeAKAeYAAAUAAAUAAAeYgKAAAAAKAAAKYgUB4gUB4geB4YgKAygoAogUAyYgUAAgKAAgKAAYg8gegegogUgyYhQiggyigAyiqYBGlAAok2AAlAYAAjmAAjwAAjmYAAhGgUg8geg8Ygyhkgyhkgohk").cp().ef());
            stroke.setBounds(0, 0, 46, 288);
            return stroke;
        }(),
        37: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATsDwYgUBugeB4AAB4YgeFUgoFUg8FUYhkIIkOGQm4EiYg8Aog8Aeg8AoYgeAAgeAAgeAAYAAgUAAgKAAgKYBuh4CChuBuh4YEOkYCClKBalyYBGkOAUkYAKkiYAAhuAAh4gUh4YgKhagohQgehaYgeg8AAgeBGgUYAAAAAKAAAKAAYAAAAAKAAAKAAYB4AoB4AyBkBQYAAAUAAAUAAAe").cp().ef());
            stroke.setBounds(0, 0, 126, 293);
            return stroke;
        }(),
        51: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaaFyYhQBkhaBuhGBkYi0D6igEEi0DwYjSEYjcEOkODSYgyAyg8AegyAoYgeAAgUAAgUAAYAAgUAAgUAAgKYBQhuBahkBahuYEYleEYlyDSmaYA8h4A8iMA8iCYAohQAAhagehaYgKgUAAgUgKgUYgKgyAKgeAygUYAKAAAKAAAUAAYAAAAAKAAAKAAYCqA8CCBaBQCqYAAAKAAAUAAAU").cp().ef());
            stroke.setBounds(0, 0, 169, 231);
            return stroke;
        }(),
        57: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUKEEYgoAUgeAegoAeYiWB4iMCCigB4Yi0CCjIBkjcAeYgUAAgUAKgKAKYgUAAgUgKgUAKYgUAAAAgUAAgKYDmiMD6iCC+jSYBahaBGh4BQhkYAUgUAKgeAAgeYAAgoAUgeAogUYAKAAAKAAAUAAYBkAeBkAyAyCCYAAAKAAAUAAAU").cp().ef());
            stroke.setBounds(0, 0, 129, 99);
            return stroke;
        }(),
        66: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAL4YAKgUAUgKAUgKYF8h4FyiMFei0YA8geA8geA8goYAegeAUgoAUgeYAUgeAKgeAUgUYAKAAAUAAAUAAYBuA8B4A8B4BGYAoAeAeAyAoAoYAAAUAAAUAAAUYgoAKgeAUgeAAYi0AUi0AeiqA8YlUB4loBGleBGYhGAKhGAKhGAKYgeAAgUAAgUAAYAAgUAAgKAAgK").cp().ef());
            stroke.setBounds(0, 0, 196, 80);
            return stroke;
        }(),
        75: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUoWqYhugehQg8hGhQYk2lek2lelAleYgogygog8gogyYAAgeAAgUAAgUYAUAAAeAAAeAAYEsEYFKD6FeDwYCqCCDIBQDSBGYCMA8CWAoCWAyYAoAUAoAUAyAeYAAAAAAAKAAAKYgoAKgeAegeAAYiCAeiMAUiCAUYhkAUhaAKhaAUYgoAAgoAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 221, 145);
            return stroke;
        }(),
        78: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAABuYAAgoAAgoAAgeYAUAAAeAAAeAAYCCA8CCA8CMBGYCCBGBkBkAeCgYAAAyAAAyAAA8YgUAogUAygoAeYgeAAgUAAgUAAYhGgegogygyg8Yhah4hkh4hkh4Ygyg8gyhGgog8").cp().ef());
            stroke.setBounds(0, 0, 74, 80);
            return stroke;
        }()
    };


    return strokes;
});