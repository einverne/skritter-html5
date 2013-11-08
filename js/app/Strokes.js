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
    var w = 0;
    var h = 0;
    /**
     * @property {Object} strokes
     */
    var strokes = {
        0: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EA1IAAKYg8AKloA8iqAeYhkAKi+AUjmAUYgeAAhuAKhuAKYhkAKjmAUi+AUYi+AUjSAUhGAKYkYAeiWAKkYAKIksAAIgUAeYgUAUAAAKAAAeYAKBGBQBQCgBGYCCA8AoAKBageYBkgeAoAAC0geYBagUCggUBagUYEigyFKgoF8gUYBaAAC0gUB4gKYFUgUGGAAE2AeYCMAKCWAUAyAAYBGAAAKgKAUgUYAegoAAgogegoYgeg8igh4iqhaYhGgogUAAg8AAYgoAAg8AAgeAK").cp().ef());
            stroke.setBounds(0, 0, 407, 71);
            return stroke;
        }(),
        1: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkQAAyYiMAejIAohkAUYhuAKh4AegoAKYiqAengAynWAoYjIAKi0AKgUAKYgyAAgoAUAAAUYAAAoC0CMAyAKYAeAABQgKB4gUYEEgyCqgUG4g8YBugUDIgUB4gUYDwgeDcgUGugoYD6gUAKAAAegeYAegUAAgKgUgUYgehGiqhahuAAYg8AAg8AAjIAy").cp().ef());
            stroke.setBounds(0, 0, 297, 58);
            return stroke;
        }(),
        2: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdiAAYgKAAhaAUhQAeYkEBGmaBkiqAeYigAelyAoigAKYiqAKgdAUAdAyYA8A8CMAoCCAAYAoAACCgKBugUYBugUFAgyEOgyYKohuCggeAygyYAegeAAgUgogoYgUgUgegUgogUYg8gUiCAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 224, 53);
            return stroke;
        }(),
        3: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWgAeYo6CWloBGl8A8YhuAKgUAKAAAyYAAAeA8A8BQAoYBGAeAUAKBQAAYBQAAAUgKDchGYFyiCCqgyHWhQYDcgoAogUAAgeYAAg8hkg8iCAAYg8AAgoAAiCAe").cp().ef());
            stroke.setBounds(0, 0, 109, 56);
            return stroke;
        }(),
        4: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUyAeYlyBakiAomaAKYh4AAhkAKgUAAYgxAeAnA8B4A8YBuAyBaAKCqgUYBGAABkgKAygKYCggKDSgeCqgUYBQgKBugKAoAAYC0gUCWgeAegeYAygyg8hGhugyYhkgdhkAJjIAe").cp().ef());
            stroke.setBounds(0, 0, 188, 39);
            return stroke;
        }(),
        5: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWCAAYgKAAgyAUgyAKYiqA8j6A8kiBGYiWAojIAyhQAUYhkAUg8AUAAAKYgJAoBtBQBkAAYAyAAAeAABQgeYFAhuGkhGHMgoYBkgKBagKAUgKYA8gegeg8hag8Yh4g8hkgThQAJ").cp().ef());
            stroke.setBounds(0, 0, 181, 51);
            return stroke;
        }(),
        6: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANSAyYjwBGjwA8iqAeYjbAogKAKBFA8YBaBGAyAKBageYBageIIiCCqgeYCMgUAogKAUgUYAKgKAKgKAAgKYAAgoiMg8hQAAYgUAAhQAUhkAe").cp().ef());
            stroke.setBounds(0, 0, 128, 39);
            return stroke;
        }(),
        7: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AK8AKYgeAAhGAeg8AUYiCA8hGAUigAoYigAogdAUAJAoYAKAoC+AoBkgKYAogKCggoCqgyYDwhQA8gUAUgUYAegogKgegogUYg8gohkgJhuAT").cp().ef());
            stroke.setBounds(0, 0, 102, 36);
            return stroke;
        }(),
        8: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJYAAYhkAKhGAUi+A8YiCAohaAogKAKYgTAeAJAoAeAKYAeAKBkgKDSgeYBQgUCCgUBQgKYCqgUAegKAKgeYAKgeg8g8g8gKYgygUhGAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 88, 28);
            return stroke;
        }(),
        9: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgeAUAAAAAAAoYAAAoAKAeAoA8YAyBaAeBGAeBuYAUBGAAA8AKFKYAADcAKDSAAAoYAAAyAAD6gKD6YAAD6gKFeAAC0YAAH0geEOhkFKYgoCWAABkAyCCYBQDSAoA8AyAAYAyAABaigAKhaYAKgoAAqoAAsqYAKsgAAraAAhaYAKkYAyk2Ayh4YAKgeAKgoAAgUYAAgegKgKgygoYhQg8i+h4gogKYgygKgoAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 54, 449);
            return stroke;
        }(),
        10: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgdAUAJA8AoBQYBaCMAKAoAKD6YAKDmAAMCgUG4YgKEOgKBGg8DmYgoC0AAAeAyCgYAyCMAeBGAoAUYAeAUAAAAAegUYAKgKAegoAUgeYA8hkAAgUAKlAYAKxgAUsCAeigYAKhuAehkAUgyYAehQAAgegygoYgegUgygogygeYgygUgogegKgKYgegUiCg8gUAAYgKAAgeAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 53, 323);
            return stroke;
        }(),
        11: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAAYgeAUgKA8AAAoYAAAUAoBkAyBkIBaC0IAAFeYAKF8AADSgUDmYgUCqgoDmgeCMYgoCqAUCWBQCqYAyB4BGAyAygeYAygUA8jSAUi+YAAg8AAiMAAiMYgUmGAAyIAUhaYAKhQAAAAgUgyYgehGjcjcg8geYgogKAAAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 46, 288);
            return stroke;
        }(),
        12: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgKAKgKAUgKAUYAAAeAAAABGC+YBkDmA8DSAUDwYAeC+AeJOAUJYYAABkAKCCAABGYAKA8AABGAAAUYAAAyBkAeBGgeYAKAAAUgUAKgKYAUgeAAgKgKiqYgopOgUjcgKjcYAAiMgKi+gKhaYgKi0AKnqAKhkYAKhGgKhGgegoYgog8jch4hkgKYgUAAgeAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 58, 285);
            return stroke;
        }(),
        13: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAAYgoAUgJAyAdBuYBGC0AKBaAKEOYAKF8gUEihGG4YgUCCAKAoAoB4YAyCWBGBGAygyYAUgeAohaAehuIAehkIAAr4YAAmkAAloAKgUYAei0AAgogogoYgUgUhQg8hQgoYg8gUgeAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 39, 231);
            return stroke;
        }(),
        14: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAUYgTAeAJAyAoBuYAUAyAoBaAKAyIAeBkIAAFUYAADwgKCMgKB4YgoFeAKAeBGBkYAyBGBQBGAeAAYAoAAAehGAUhaYAUhkAAiggeloYAAhagKj6AAjSYAAmkAAAAgygyYhGg8huhGgygUYhQgKAAAAgUAU").cp().ef());
            stroke.setBounds(0, 0, 43, 197);
            return stroke;
        }(),
        15: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAKYgeAeAAAeAUBQYBGDSAKCCgKEOYgUHMhaGkh4D6YgyBkAAAKAABGYAAAyAAA8AKAeYAUBGA8BuAeAKYAoAKBGhGAyh4YBGiqAojmAUkiYAKi0AeloAUi0YAAgyAUh4AAhkYAUi+AUiMAUgeYAKgUAKgKAAgKYAAgohkgyiggoYhGgKgKAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 58, 241);
            return stroke;
        }(),
        16: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKIgUAUIAUBGYAyBkAKBGAKCWYAACqgUDcgoBuYgeB4AAAKAKBQYAUBuBGCMAoAAYAeAAAyhGAUhGYAyh4AKhQAKl8YAKmGAAgeAehGYAKgoAAgKgUgKYgegojIhGg8AAYAAAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 37, 138);
            return stroke;
        }(),
        17: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgUAUAAAUAKAeYAKAUAUAoAKAeYAUAyAAAyAAH+YAAEsAAEsgKAyYgKCMgUDwgUBkYgKBGAAAUAKA8YAeCMBGCWBGBQYAyAyA8goAehuYAUhQAAgegKnqYgUnqAAs+AKiCYAKgyAAgyAAgKYgKgUhuhahQgyYgegKgoAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 35, 246);
            return stroke;
        }(),
        18: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AKYgoAKgUAeAAAUYAAAKAUA8AeAyYA8BuAeBQAUB4YAKBagKSwgUIcYgKIIgKMMAKDSYAKDSAUBQAyBGYAUAoAoAKAegUYAygoAeh4AekYYAekiAAiWAA08YAA2gAABGA8kiYAUhuAAAAgUgoYgKgegegUg8goYighuhagJhaAT").cp().ef());
            stroke.setBounds(0, 0, 52, 425);
            return stroke;
        }(),
        19: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgoAUAAAoAAAeYAAAUAeA8AoAyYA8BuAoBaAUBaYAoB4AAcSgeJsYgUF8gKgUBuAAYBQAAAogUAKgoYAKgUAAhQAAhaYAAhQAKjIAAiWYAKj6AKmuAUsCYAKmGAUkYAoiWYAKgoAUhGAKgoYAKhQAAgKgKgUYgUgygygohugyYi0hQh4gTg8Ad").cp().ef());
            stroke.setBounds(0, 0, 60, 344);
            return stroke;
        }(),
        20: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAKAAAoAnBaYAUAoAUAyAKAKYAAAKAKHMAAIcYAKOEAABkAUA8YAeB4AyAoAog8YAog8AAgUAoksYAAgeAKlUAAmGYAAqyAKjIAeiCYAKgoAAgoAAAAYAAgeg8gyhGgoYhag8hGgJg8AT").cp().ef());
            stroke.setBounds(0, 0, 39, 245);
            return stroke;
        }(),
        21: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        22: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        23: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        24: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        25: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        26: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        27: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        28: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        29: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        30: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        31: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        32: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        33: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        34: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        35: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        36: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        37: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        38: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        39: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        40: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        41: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        42: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        43: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        44: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        45: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        46: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        47: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        48: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        49: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),
        50: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }()/*,
        0: function() {
            var stroke = new createjs.Shape(new createjs.Graphics());
            stroke.setBounds(0, 0, w, h);
            return stroke;
        }(),*/
    };


    return strokes;
});