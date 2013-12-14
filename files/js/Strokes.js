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
    var shapes = {
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
            stroke.setBounds(0, 0, 190, 56);
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
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AAYgKAAgUAUgKAUYgdAoAJAeAoBQYBQB4AAAUAKD6YAKCCAAE2AAEEYAAKAAAAAAUAUYAoAoBkgUAegyYAKgKAKhQAKh4YAKhuAUigAKhkYAKhkAKh4AKgyYAUlyAei+AoiMYAUhGAKgogKgUYgKgohQg8hagyYhagoiMgogeAAYgKAAgKAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 56, 197);
            return stroke;
        }(),
        22: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgUAUAAAeAUBaYBGCCAAAoAKD6YAAE2gUJOgUCMYgKBGAABaAAAoYAABGAAAUAeAyYAoBQAeAUAeAAYAUAAAogUAUgoYAKgeAKgoAAmQYAAmQAAg8AUjSYAymQAAgKA8h4YAUgyAKgeAAgUYgKgeg8g8hagyYh4hGhQgJg8AJ").cp().ef());
            stroke.setBounds(0, 0, 45, 205);
            return stroke;
        }(),
        23: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAUBGYBQCMAyDmAUDcYAAAyAKDmAADmYAAHMAAAKBGCMYAoBGAyA8AeAAYA8AAAeiggei+YgKg8AAgUgUkiYAAhQgKkOAAj6YAAjwgKjIAAgKYgKgUiqhkg8geYhGgegoAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 45, 196);
            return stroke;
        }(),
        24: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAKAAAeAnBGYAUAeAUAeAAAUYAUA8AUD6AKFeYAAG4AUBGAyAAYAyAAAoiWAejwYAynMAUiqAKhGYAUgoAAgyAAgKYgKgogygyhkgyYhQgohQgJg8AT").cp().ef());
            stroke.setBounds(0, 0, 42, 138);
            return stroke;
        }(),
        25: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgKAAgKAUgKAUYAAAUAAAKAUA8IAeBGIAKG4YAKDwAADSAKAUYAAAeAKAKAUAAYAyAeBugoAUgeYAAgKAKhkAAhkYAKj6Aej6AUhaYAKg8AAgKgKgeYgUgeigiggygUYgUgKgyAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 38, 118);
            return stroke;
        }(),
        26: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAeAUBGYBQDIBQEsAyFKYAKBaAUBkAAAeYAUB4BuCgAyAAYAeAAAKgUAUhaYAKhQgUi0gylKYgUiMgUi0gUhQYgKiWgehagegoYgUgUgogUhugeYhugKAAAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 51, 147);
            return stroke;
        }(),
        27: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgdAeAJAeA8BaYBGBQAeBGBQEOYAUBQAoBGAoAKYAyAKAKg8gUi+YgKhQgKh4AAhGYgKigAAgKhugeYhkgehaAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 40, 75);
            return stroke;
        }(),
        28: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAKAAAeAABaYAeDwAKAyAUAyYAeA8BGBGAUgKYAUAAAUhGAAgyYAAg8geiggohQYgUhGhahugUAAYAAAAgKAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 23, 61);
            return stroke;
        }(),
        29: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHWAKYgeAeAKAoAeB4YAoCWgKBaiMJ2YgoCWgyDcgUBkYhuHWiWJsAAAoYAAAoAAAKAUAUYAeAeA8AKA8geYAygUAKgKBGlAYAoiMAyjwAoiWYEYxqBGkYAohGYAehQgKgoiMiMYiCiCgogTg8Ad").cp().ef());
            stroke.setBounds(0, 0, 84, 277);
            return stroke;
        }(),
        30: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AD6AUYgUAUgKAKAKAoYAAAUAKAoAKAeYAoB4geDSiqK8YhaGGgJA8AJAUYAeAeBkAAAogeYAKgKAKgoAUgyYAKgyAyigAyiWYAyiMA8i+AUhaYAyiWBGigA8huYAUgoAKgeAAgKYAAg8hGhGiqh4YhkgygegJgoAd").cp().ef());
            stroke.setBounds(0, 0, 67, 171);
            return stroke;
        }(),
        31: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAAYgeAKgUAeAAAeYAAAAAeAyAeAyYAeAyAeA8AAAUYAKAUAKCgAKC0YAUMqhaJ2jcImYgyB4jIGuhGB4YgnB4AAAoA7geYAogKAyg8BuiMYEOloB4kYCCnqYBumuAekEAUqAYAKm4AKgoAegoYAogygKgKiChaYiChaiWgdg8AJ").cp().ef());
            stroke.setBounds(0, 0, 101, 347);
            return stroke;
        }(),
        32: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMMAKYgeAeAAAUAyBaYBaCgAKBaAUFeYAUG4gUKogoH+YgUDSg8DShQCMYhaCWjICgkYCCYiWBQgTAUAdAUYBGAUDcgyCqhQYEYiCDcjwBQkYYAoigAKhuAKmaYAUtIAUomAKhGYAKgyAehkAehQYAyigAAAAgUgeYgUgyiChGiWgoYhkgUg8AAgUAK").cp().ef());
            stroke.setBounds(0, 0, 129, 351);
            return stroke;
        }(),
        33: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AScAKYgUAUAeAyBQBaYBuB4AKAUAUDSYAeGQgKJOgeHWYgeEEgeCChkDIYgoBageAohGBQYhuB4iCB4iMBQYh4BQkOCMi0BQYiMA8gKAKAAAUYAUAeBkgKDcg8YDIg8BageC0haYDchuCghuBahkYAygyBkiWAohQYA8iCAoh4AUjIYAylUAKjcAAqoIAKowIAUhuYAehkAAgKgKgUYgogyh4g8i+gyYhugUgoAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 172, 352);
            return stroke;
        }(),
        34: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AZyAAYgoAUgeAUAAAeYAAAUAUAoAUAyYBQCWAKAygKFKYAAFAgKCggeDmYgeDIhaFog8CgYiCFejIFojSEEYiMC0kiEOjSCWYjICWhtBkAJAUYAKAUA8gKBQgUYD6haE2jIEikiYC+i+Bkh4BkiWYBGhkBaigAUg8YAAgKAohaAohaYCCksBQkiAokYYAKhaAei+AUiWYAeigAUiqAKg8YAUiWAKhGAyigYAohaAAgeAAgeYgeg8kEiMhuAAYgoAAgoAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 215, 400);
            return stroke;
        }(),
        35: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVuAKYgoAKgeAoAKAeYAAAKAeAoAoAoYAeAoAyBGAUAeIAeBGIAAGuYAAHggUC0gyGQYg8GahuEsjIEsYhkCqjIDIjICgYhuBak2DShkAyYhZA8AAAoBZAAYA8AABGgUC+hQYCgg8BQgyC0huYE2jSCqi0Cqk2YBaiMBkkYAojcYBamQAokYAKlKYAUkiAUkYAUhQYAKgoAUhQAKg8YAohuAAAAgUgeYgeg8jSh4iMgoYg8gKhGAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 197, 388);
            return stroke;
        }(),
        36: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUAAAYgoAKAAAeAeBaYBGCgAUBagUD6YgUFohQIShQEiYhQD6iqF8iMDSYh4C+jIDIi+CWYiWBuhuBkAAAKYAAAeAKAKAyAAYBGAABQgoCChQYEsi+DmjcC+kYYEEmGCqpiCCw4YAAhGAUhGAAgKYAKgKAKgyAKgoYAKhaAAgogogUYhGg8jchkgoAAYAAAAgKAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 169, 346);
            return stroke;
        }(),
        37: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAAYgyAUAAAUAoBaYA8BuAKBGAKCgYAUDmgoHqgoD6YgoDchaEEhkDIYhuDciqDIjmDSYg8AygyAygKAUYgKAUAAAAAKAUYAyAoB4g8DciqYCgh4CMiWBuigYCWjmBakYBGmkYAoksAKhaAUkOYAKiMAUi0AKhGYAeiMAAAAgUgUYgKgKg8gegygeYiMhGhQgTgoAJ").cp().ef());
            stroke.setBounds(0, 0, 126, 293);
            return stroke;
        }(),
        38: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALuAKYgoAeAAAeAyBkIAyBaIAACgYgKFegyH+hGEiYh4HqiWFUl8JYYgeBGgJAeAdAKYAyAKBQhGCqi+YDSj6CMjwCWmGYB4lKBGlABQowYAoksAUhuAUgyYAAgKAKgeAAgUYAAgyhahQiChGYh4gygygJgoAT").cp().ef());
            stroke.setBounds(0, 0, 119, 312);
            return stroke;
        }(),
        39: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeKAKYgeAUAAAyAeA8YA8CCAeCWAAC0YAAFyigH+ksJEYiqFKjIEskYFUYiWC+lAEsksDwYh4BagUAyAAAKYAKAUAKAACCg8YCWhQC0huC+h4YBuhQA8gyCMiWYE2ksCgjmEEngYCgkYB4kOBuksYBuksAyiqAykEYAoi+AKgUAyhuYAehGAeg8AAgKYAAhknCizhaA7").cp().ef());
            stroke.setBounds(0, 0, 248, 393);
            return stroke;
        }(),
        40: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAh6AAKYgUAUAAAyAUBGYAeBuAUCCAAC0YAKDcgUDIgeCqYgeCWhuFAg8CMYh4D6jIDcloEEYigBuhGAyiqBQYjIBknMCqiqAoYgUAKgeAKgKAKYgKAUAAAKAKAKYAUAUAoAAB4gUYJYhkISjSFokiYBahGC+jSBaiCYB4iWBujcBQjIYBGjIBamaAolAYAKhQAUhkAKgyYAKgyAKg8AAgKYAAhQj6iqiCgKYgoAAgKAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 263, 314);
            return stroke;
        }(),
        41: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfaAKYgKAAgUAKAAAKYgKAKAABkAACCYAAC0gKA8gUBaYg8FKiWFejmFyYk2HqmGGarGI6YhaBQgJAeAJAUYAoAUBGgUCChGYEsiWDSiMEsj6YE2j6CgjIDcloYC+lKAeg8C+nWYA8iCBajSA8h4YCCkEAAAAhGhGYgygyiChQhageYg8gUgyAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 248, 326);
            return stroke;
        }(),
        42: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAlMAAAYgeAUgUAogeBQYgyCqjSFojwFAYiMDIgUAUoIJiYkEE2loFemGFKYg8A8gyAyAAAAYAAAeAegKBugyYD6huCgh4FeleYFUlALQtSHMpiYC0jcAAAABahGYB4hQAAgehugyYiChGiMgTgyAJ").cp().ef());
            stroke.setBounds(0, 0, 279, 295);
            return stroke;
        }(),
        43: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAisAAAYgUAAgKAKAKAeYAUBaAABGgUBaYgKBagUAehGCMYiCD6hGBui+DwYkYFUjSDclUEEYiqCWleD6jSCMYhQA8hGAyAAAKYAAAAAKAKAKAAYAeAUBkgoDIhQYIcj6F8kOGanMYBQhaBGhQAKAAYBGg8CqjcFynqYAyhGBGhQAogoYAygyAKgKAAgoYgKhQhGhQh4hQYiWhagoAAg8AA").cp().ef());
            stroke.setBounds(0, 0, 268, 266);
            return stroke;
        }(),
        44: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AccAKYgUAUAAAKAKBGYAUBugyDwhQDSYgoBkhkC+g8BaYhkCqj6EsiCCCYjIC+ksDwlKDcYi0B4gKAUAAAUYAeA8Gai0EYi+YFKjcDIiqC+j6YC0jwBQh4DSmkYCgksBGh4AogeYAUgeAAgogogoYgogyh4hagygUYgygKg8AAgUAK").cp().ef());
            stroke.setBounds(0, 0, 220, 248);
            return stroke;
        }(),
        45: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAKYgUAUAAA8AyBuYAyB4AKA8gUC0YgUDcgoCMhGCgYiqFyjwC+o6D6Yi+BQgJAKAJAUYAUAUBGAKBQgKYBkgUDSgyBageYBugoDchaBGgyYDSiMDclABkkYYAUhGAyiqAeiMYAeiWAoiCAUgeYAohaAAAAjwh4Yhug8hkgogKAAYgKAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 172, 203);
            return stroke;
        }(),
        46: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOYAKYgyAUAAAUAoBaIAeBQIAACqYAADIgUCCgoCqYh4HMjIEYmkEiYh4BagdAeAJAUYAUAUA8gKBugoYCqg8B4hGCqiWYCgiMBGhQBkjSYBai+AyiMAoigYAUh4AyjmAUg8YAAgeAUgyAUgyYAegyAKgogKgKYgKgyjmiMhaAAYgUAAgeAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 134, 208);
            return stroke;
        }(),
        47: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AB4AUYgeAoAKAUAoAyYAoAyAAAKAUCMYAeDSAKC0gKCqYgUE2gUBaiWF8YgoBkAAAeAAAKYAeAUBGhGBaiWYBkigAyiCAyjcYAoi+AKiMAAkOYAKiCAAiCAAgeYAKgoAAgegKgUYgUgUi+hkg8AAYgeAAgKAAgUAU").cp().ef());
            stroke.setBounds(0, 0, 47, 182);
            return stroke;
        }(),
        48: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGQAKYgyAUAAAUAoA8YBkC+AKGahaEEYg8C+hQCCi0C+YhQBQgKAeAAAKYAeAeC0hkB4hkYBQhGB4igAohGYAohaA8iqAUh4YAKgoAKhuAAhQYAKhQAAh4AKhQYAKhuAAgegKgKYgUgeg8gUhQgeYhagKgyAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 75, 161);
            return stroke;
        }(),
        49: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABuAKYgUAKAAAeAeAoYAUAoAKB4AAC0YAADcgKBGiMFKYgTBGA7geBGhQYCgi+A8jIAel8IAUiCIgogeYgegeiCgygoAAYgKAAgUAAAAAK").cp().ef());
            stroke.setBounds(0, 0, 38, 109);
            return stroke;
        }(),
        50: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AP8AAYgUAKAAAeAUAyYAeBQAACqgoCWYg8EOhuEOiqEiYiMDwiWDckYFeYhQBagUAyAAAKYAKAKAygeB4haYFyksEOleDmn0YBajSAehGB4kiYAohkAyhkAKgUYAKgUAUgeAAgKYAAgegygygygeYg8gojIgdgoAJ").cp().ef());
            stroke.setBounds(0, 0, 143, 229);
            return stroke;
        }(),
        51: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAAYgoAKgKAyAeBGYAUBGAKBQgKA8YgUBuigFeigD6Yi0E2lKG4kOEsYgoA8gyA8gKAUYgKAeAAAAAKAUYAoAoBQgyC0igYCMh4CCiMC0jmYEsloCWjIEEmuYAogyAyhQAogyYAogoAogyAAgKYAKg8gUgyhahQYg8hGgogUhGgoYhQgog8AAgoAA").cp().ef());
            stroke.setBounds(0, 0, 169, 231);
            return stroke;
        }(),
        52: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AcmAKYgKAAAAAogKAyYgKBugUBQg8BuYiCDwjIEOjwD6YjwDwkiDcnqFKYhGAyg8AoAAAKYAAAeBGgUC0hGYFUiCEOigEEjcYDci0F8maE2l8YAyhGBGhGAUgUYAogeAKgKAAgeYAAhah4h4iMgyYhGgUgyAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 222, 207);
            return stroke;
        }(),
        53: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Ac6CMYiWEsiWDmi0DSYk2FelUE2muFKYkrDwgKAKAdAUYBGAyEYiCFyjwYBag8CChaA8gyYDwjIEYlAFengYC+j6Aeg8AKgyYAUh4g8hkhageYgUgKgUAAAAAAYgKAAgoA8goBQ").cp().ef());
            stroke.setBounds(0, 0, 212, 216);
            return stroke;
        }(),
        54: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AW0AUYgKAKgKAeAAAeYgeEOigEikOEYYjcDci0CCl8DSYhkA8hkA8AAAAYgJAUATAUAeAAYAyAADcgyBkgoYBkgoEYiCBGgyYBag8BQg8B4h4YCMiWA8hGCgjmYB4iqBuiCAogyYAogogKgohuhuYh4huhGgTgyAn").cp().ef());
            stroke.setBounds(0, 0, 181, 166);
            return stroke;
        }(),
        55: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAKYgKAKAKAKAKAoYAKAyAAAUgKBaYgKCCgoBuhQCqYh4EEjwEEleEOYg8AygyAoAAAKYAAAKAAAKAUAAYAyAKEEiCCqiCYDwi0CgjSC+mGYAyhaAyhuAUgoYAegeAKgoAAgKYAAgeg8gyiChQYhagogKAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 126, 156);
            return stroke;
        }(),
        56: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUeAKYgKAKgKAegKAUYg8DIksFelKD6YhaBGkYDIiCBaYgyAegoAeAAAKYAAAUBQAABQgUYBageCMg8B4g8YBkg8E2jmCgiCYBkhQGumkAUgeYAohQg8g8i0gyYhGgKgeAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 165, 132);
            return stroke;
        }(),
        57: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APKAKYgUAKAAAUgKAoYAAA8gyBGh4CWYiWC+i0CMloDSYgyAegeAeAAAAYAAAyFAhQC0haYBkgyCqhuBkhQYCgiCAogeBGg8YAogoAygoAKgKYAogeAKgegUg8YgUg8g8gyhGgeYhQgegeAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 129, 99);
            return stroke;
        }(),
        58: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAKYgyAUAAAeAyBkYAoBQAAAegeCWYgoCWg8C+hQC+YhGC0igFKhQCCYhFCMgKAoBFgUYAogKCCiCBkiMYDIj6CgkOCql8YAohGAohQAegoYAohGAAgKAAgoYAAgygKgKg8gyYh4hujIg7hGAd").cp().ef());
            stroke.setBounds(0, 0, 101, 176);
            return stroke;
        }(),
        59: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHgAUYgKAKAAAUAAAKYAAAUAKAyAAAoYAUC+iMFUjIDwYh4CWgoA8AAAUYAAAUAAAAAegKYBagKB4haCMiMYB4h4A8haBujIYAyhaBGhuAegoYAUgoAegyAAgKYAAgog8gyhugyYhugyhGgJgoAd").cp().ef());
            stroke.setBounds(0, 0, 87, 119);
            return stroke;
        }(),
        60: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADIAAYgeAUAAAoAUAeYAoAoAUB4AACgYAAB4AAAUgeA8YgeBkgyBGhQBaYhjB4AeAKCLhQYCChQBahkAyiMYAohkAKhQAKi0YAKigAAgKhQgoYg8gehagJgoAJ").cp().ef());
            stroke.setBounds(0, 0, 48, 98);
            return stroke;
        }(),
        61: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AO2AKYgKAAgKAeAAAoYgKBagKAehaBkYh4CMiWCWjmC+YksEEgdAoAJAKYAeAoDwh4GkjwYBuhGCMhaAygeYB4hQBkgyBGgUYCMgoAAhGhuiCYh4iCi+hZgyAn").cp().ef());
            stroke.setBounds(0, 0, 140, 111);
            return stroke;
        }(),
        62: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJOAAYgeAUgKAUAUAyYAUBGgKAohQCgYgyBkhGB4iWDcYhuCqhkCWgKAUYgKAoAAAoAAAAYAKAAAegUAegUYAegeAygyAogeYAogeC0i0CqiqYC0i0C0igAegeYBkg8AKgohGhGYhkhkjwhFhQAT").cp().ef());
            stroke.setBounds(0, 0, 106, 123);
            return stroke;
        }(),
        63: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGQAKYAAAAgKAyAAA8YAABGAAA8gKAoYgeBQhkDSiCDmYg8Bug8BkAAAUYAAAeAKAUAeAAYBGAAAegeE2mGYBQhaBahuAygyYAogoAegoAAgKYAAgogyhQhahaYhuhugygdgoAd").cp().ef());
            stroke.setBounds(0, 0, 75, 110);
            return stroke;
        }(),
        64: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGkAAIgeAKIAKA8YAAAoAAAogKAUYgUBGhkCqiCC+YhGBug8BagKAUYAAAeAAAKAoAAYAogKDSiWCqiMYCqiCBQg8BQgyYAygeAUgogUgeYgKgyhkhGhkgyYhugygoAAg8AA").cp().ef());
            stroke.setBounds(0, 0, 86, 87);
            return stroke;
        }(),
        65: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHCAKYgKAAgKAUAAAKYAABGhQBajcCgYipCMAAAUCVgeYBagUDSg8CCgoYAygKAygUAUAAYBagUAKgyhGhkYhaiChug7goAd").cp().ef());
            stroke.setBounds(0, 0, 74, 51);
            return stroke;
        }(),
        66: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWMAKYgKAUgKAUAAAUYgKAUgKAeAAAKYg8BaomEEowC0YigA8gyAUAAAUYAAAKAAAKAAAAYAKAUEOgeCqgoYHChaCggoDchQYCWgoDwg8B4gKYCMgKAUgKAAgyYAAgegUgygegeYhahGkEiWg8gKYgoAAgKAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 196, 80);
            return stroke;
        }(),
        67: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AY2AKYgKAKgKAKAAAeYAABQgyBQi+DIYh4CCh4B4h4BaYjcCgoSFKiMAyYgyAUgeAUAAAAYAAAKBQAUAyAAYAoAADIg8C0hGYGGiWHgkiGulUYA8gyBQgyAogUYBQgyAygoAAgeYAAhQkOiCi+gKYhGAAgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 217, 138);
            return stroke;
        }(),
        68: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAKAAAKAKAUYAAAUAoAeAoAeYBuBaA8AyCWCqYDSDmCgC+DIEEYF8HqCWC0FeFoYEOEOgUAAHMAUYDSAKBuAAC0gKYE2gUBQgKAegyYAKgKAAgKgUgKYgogeh4gyi+gyYhagejchGiggyYkihkgegKiMhQYlyjIjIigl8mGYjmjci0jSjwkiYiqjShGhGhQgyYhag8iMgJgoAT").cp().ef());
            stroke.setBounds(0, 0, 350, 245);
            return stroke;
        }(),
        69: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAAAKYAAAKBGAoBGAoYC+BaBQAyBGBQYBkBuE2IcDcHMYCWE2BQCWCMDwYCMDwDIE2AeAeYAoAoBaAyBGAUYBaAUHMA8C0AKYAoAABQAKA8AKYBkAKAKAAAogUYAUgKAUgKAAgKYAKgUgygehQgoYiWhGomkYhQgyYjwiCi0i+j6lKYi+kEigkEjSl8Yk2pYhkh4jShuYiCg8jSgTgyAd").cp().ef());
            stroke.setBounds(0, 0, 316, 298);
            return stroke;
        }(),
        70: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACgAKYiMAegnAoATAeYAKAABGAUBQAKYC0AUBQAUBkAyYCMBGGuF8GGF8YDIC+DwDSFUEOYD6C+AUAKFAhGYEYgyGahkAygeYAygeAogogKgUYgKgUgygUhGAAYhaAAqohQh4gUYjwg8jIhalKjcYkEiqi+iglolAYkikEiChaiWgyYhugeiMgJhaAT").cp().ef());
            stroke.setBounds(0, 0, 368, 191);
            return stroke;
        }(),
        71: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgeAAgKAKAAAUYAAAeAAAUBQAoYBaA8B4BkBGBGYAUAoA8BQAyBQYBGBuBkCgDwF8YC0EOFoGaBkAoYBuAyBQAAE2geYEEgeC+gUA8gKYBGgKAegUgegUYgKgKiCgyiMgyYo6jIgogKiWhkYkOi+k2lKl8omYiCjIgogohGgoYhag8iggThaAT").cp().ef());
            stroke.setBounds(0, 0, 264, 198);
            return stroke;
        }(),
        72: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAKAAAUAAAUYAAAUBQA8A8AoYA8AeC+DmDmEsYCqDwB4CCDwDmYE2FAAAAAGQgoYGkgyAoAAAAgyYAAgKgUgKgUgUYgKgKi+hGjShGYkshkhagehGgoYi+huh4hajwjwYigiWgyhGjwkYYg8hGg8g8gegUYhGgyhugTgyAJ").cp().ef());
            stroke.setBounds(0, 0, 233, 164);
            return stroke;
        }(),
        73: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAeAAAKBFCMYFeI6NSRMDwC0YBaBGAoAKCqgUYBGAABugKAyAAYHqgeBagKAegKYAUgKAUgKAAgKYAAgUg8gohGgeYg8gUnCighageYiqg8i0hQhuhaYkijcrar4kYlyYhuiCAAgJgyAT").cp().ef());
            stroke.setBounds(0, 0, 269, 212);
            return stroke;
        }(),
        74: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgeAKAAAoAAAeYAAAKAyAoBQAyYAUAUA8AyAyAoYEsD6H+FyEYCgYBGAoCMBQBuBGYDmCCAeAKBkAKYBQAKCMgeFehaYD6g8BQgeAygyYAegegKgegygKYhQgKjwgeiqgKYmGgUhagUjwhGYjIhGighGiWhaYhGgohagygogUYhagymQkEjSiWYjSiMgegJg8AT").cp().ef());
            stroke.setBounds(0, 0, 301, 143);
            return stroke;
        }(),
        75: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgdAUAJAeAyBaYCWDSG4HqGGGaYCMCWAyAeBkAKYBaAKI6hQCCgoYAegKAegUAKgKYAUgUAAAAgegeYgUgKg8gehugeYnMiMksiMj6iqYkOjIm4leiCh4Yg8gygKAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 221, 145);
            return stroke;
        }(),
        76: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMWAAYgUAAgoAKgoAAYgoAKhaAUhGAUYiMAogyAKiWAKYh4AKgeAKAAAoYAAAyBGBaBkA8YBaAyAegKBug8YBkg8B4g8BugUYBageDIAABkAeYDmA8FUCCGaC+YGkC+JsC+DIAAYBkAAC0g8DShkYCChGC+iCgKgKYAAgKgoAAhagKYkiAAn+gUhugKYlegelKhGnWigYiqg8j6haiCgyYiqhGhugei0AAYhGAAhGAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 415, 99);
            return stroke;
        }(),
        77: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAoAAAoAoAoYBGBGAoAKCggeYB4gKCMAABaAUYBaAUKUDwKoEOYEOBuAKAABQAAYBkAAAKAAEEhuYEih4DIhaAUgUYAogegKgegogUYgogKlKAKlAAKYleAUi+gKjwg8YhQgUkYhQkOhQYq8i+AoAAjmAAYhuAKhugKgeAAYg8AAgKAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 336, 84);
            return stroke;
        }(),
        78: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgnAyATBQBkB4YA8A8CqDSCMC0YAoAyA8AeAyAAYAeAAAKgKAegUYAogoAKhGgKh4YgUi+hkhkmGi0Yh4g8hGgJgKAT").cp().ef());
            stroke.setBounds(0, 0, 74, 80);
            return stroke;
        }(),
        79: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAAYAAAAAAAUAAAUYAAAUAKAUBQBQYBaBkAyAUA8gKYA8gKgKhug8g8YgogyjSgxgeAJ").cp().ef());
            stroke.setBounds(0, 0, 34, 28);
            return stroke;
        }(),
        80: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAKAAAKAAAeYAKAeAeAoBkBaYDmDSDwDwEOEiYEEEOAyAyAoAAYAAAAAUgUAUgUYAegeAAgKAAgoYAAhGgeiMgegyYgogyiCiChQhGYjci0q8nWgoAAYgKAAgKAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 131, 128);
            return stroke;
        }(),
        81: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgdAoATAeBkA8YBkAyHCEiDICWYD6C0AoAUAygeYAUgKAUgeAKgeYAKgeAAgKgUg8Ygyi+hah4iWhGYiqhQkihakig8YiMgUgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 125, 82);
            return stroke;
        }(),
        82: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAUYgTAyAJAoBuCqYCCDIBuC0CCDmYCgEYAyAyBQgyYAygeAUgyAAiCYAKjIgehaiWigYh4h4ngmGgeAAYgKAAgKAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 85, 119);
            return stroke;
        }(),
        83: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFeAKYgUAUgUAegUBaYg8CghQDShQCqYhGCMAAAKAABQYAABkAKBaAoA8YAoBGAoAKA8goYBugyBujIA8kOYAehQAAgoAAi+YAAjwgKhGgygyYgogUgKAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 51, 124);
            return stroke;
        }(),
        84: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJiAAYgKAKhGA8hGBQYhQBQhuBkg8AyYiCBugoAogUBaYgUBkAAA8AUAeYAUAUAKAKAygKYBQgKBGgoBuhuYA8g8BGhQAegyYBGhkBQi0AUhaYAKg8AAgKgUgUYgUgUgeAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 70, 84);
            return stroke;
        }(),
        85: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABuAUYgeAUAAAyAeA8YAUAeAAAeAKCCYAADIAAAUhuE2YgeBkAABaAKCCYAeCMAoAyAoAAYAeAABahaAegyYAohGAeiCAeiqYAeiWBQjSA8hQYAegyAAgKAAgoYgKg8AAAAhGg8YhQhQiChkgygUYgogKgoAAgoAU").cp().ef());
            stroke.setBounds(0, 0, 58, 139);
            return stroke;
        }(),
        86: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AE2AKYAAAKgKAygKA8YAAA8gKA8AAAKYgUAygyA8hkBuYhuB4gJAKAJCCYAeCgAyBuA8AAYA8AABQhkBGiqYBQjSBajwAAgUYAAhQg8iCg8goYgygUgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 53, 102);
            return stroke;
        }(),
        87: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AZ8BGYleBklABQh4AUYgyAUiWAeiCAeYjIAygoAKh4AAYiMAKgKAAgUAUYgKAeAAAyAKAoYAKAUCgCCBuA8YBGAyAUgKCghaYC0huBugyFyiMYC+hGDShQA8gUYCMg8CqhkAUgeYAUgeAAAAgUgUYgUgKgUAAgKAAYgUAAh4AeiMAo").cp().ef());
            stroke.setBounds(0, 0, 201, 81);
            return stroke;
        }(),
        88: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYiAUYgeAUg8Ayg8AeYgyAoi0B4igBuYiqBuj6CqiMBkYiMBkiWBkgyAeYiCBGgTAeAnA8YAoAyBQAoBQAeYBuAogeAUFUleYEYkYBQhGC0iWYC+i0EEjwAUgUYAegygegJhQAd").cp().ef());
            stroke.setBounds(0, 0, 167, 131);
            return stroke;
        }(),
        89: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVQA8YlACgsMFohGAUYgUAAgoAKgeAAYhGAUgeAUAAAyYAAA8AeAeCqBGYC0BGAAAAB4huYCCiCAygoGGj6YDmiWCChQAogoYBGhGAUgegKgUYgKgTg8AJh4A8").cp().ef());
            stroke.setBounds(0, 0, 156, 92);
            return stroke;
        }(),
        90: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALaB4Yh4BGigBahGAyYiMBQgeAUhkAAYg8AAgKAAgUAUYgUAeAAAoAKAoYAeAeCCBkBGAUYAoAUAKAAAUgUYAKgKAUgUAKgUYAUgeCCiMC0i0YCqigCMiMAAgKYAAgJg8ATjIBu").cp().ef());
            stroke.setBounds(0, 0, 100, 73);
            return stroke;
        }(),
        91: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMAKYgKAAhGBGg8BGYkOEsiMCgiCCgYhQBahQBQgKAAYgoAUgUAAhQgeYhQgegUAKgKAoYAAAoAUBaAyBuYAeBGAUAeAyAyYBaBQAyAUA8geYAUgKAegoA8h4YAohaA8iCAohGYBaigFAocBQhuYAegoAUgyAAgKYAAgogUgJgoAT").cp().ef());
            stroke.setBounds(0, 0, 117, 143);
            return stroke;
        }(),
        92: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAKYgyAegoA8lAHMYigDwigDcgUAeYgeAUgyAogoAeYgoAegeAUAAAUYgJA8AxDmA8BuYAeBGBkBkAyAKYA8AKAUgeAUigYAUiWAehGGGuEYC0maAUhQgoAAYAAAAgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 101, 180);
            return stroke;
        }(),
        93: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHCAUYgeAUhGA8hQA8YhQBGhQA8goAUYgoAUgUAKgKAUYAAAeAACqAeA8YAKAyBGBGAUAAYAeAAAKgKAUhQYAUg8CqlKBaiqYA8hagKgThGAn").cp().ef());
            stroke.setBounds(0, 0, 52, 75);
            return stroke;
        }(),
        94: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAnsAAKYg8AKmQBGjSAoYgyAKh4AKhaAUYjcAemaBGleA8YiMAUjIAehaAUYi+AUgKAKAAA8YAABGBaAyCCAKYA8AAAUAAB4goYC0gyEOhGDSgoYCWgeH+haB4gKYAKAABagUBkgKYC0geC0gKAoAKYAKAAAeAUAUAKYAeAeAKAKAAAeYAAAUgoBkgoBuYgoBugeBaAAAKYAUAoAogKB4haYCChkCMhGCMg8YCCgyBGgoAAgUYAAgomGkihageYg8gKgeAAhaAK").cp().ef());
            stroke.setBounds(0, 0, 320, 80);
            return stroke;
        }(),
        95: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Af4AKYkEAel8Ayi0AeYjwAenMA8hQAKYgeAKhuAKhaAKYi0AKgeAUAAAyYAAA8BkBGBuAKYA8AAAeAABGgUYDmhGC+geG4g8YJEhQCqgKBGAeYBGAoAAAAiWD6YhkCggKAUAKAoYAAAeAogKCqhQYCghQBagoD6hGYBugeAegUgKgoYgKgUi+i+huhaYh4hkgygJi+AT").cp().ef());
            stroke.setBounds(0, 0, 272, 77);
            return stroke;
        }(),
        96: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AS6AeYh4AojwBGjmA8IiqAyIjSAAYiCAAhaAKgKAKYgdAUAdBQBGA8YA8AyAoAUBQAAYBGAKAAAACghGYAygKCqg8C0g8YEYhaAogKAeAKYAUAKAUAKAKAKYAoAogKAUjSEEYjmE2gyBGAAAUYAAAUAKAADSiWYHClKA8goCWgyYAegKAogUAKgUYAygegUhGhQhGYhGg8i+iCgogKYg8AAg8AAhuAe").cp().ef());
            stroke.setBounds(0, 0, 182, 99);
            return stroke;
        }(),
        97: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWMAUYmkCgqoCqjcAAYhkAAgJAAATA8YAyBGAyAyA8AUYAeAKAeAKAKAAYAKAABkgeBugoYFeh4E2hGCMgKYBQgKAAAAAyAeYA8AyAAAUiCDwYgyB4gyBaAAAKYAAAKAKAKAAAKYAUAKAAAAAUgUYAKAAA8gyA8gyYC+iMDIiCB4g8YAygeA8geAKgKYAUgogegyhag8YjwigiMg8g8AAYgKAAgeAKgeAK").cp().ef());
            stroke.setBounds(0, 0, 205, 89);
            return stroke;
        }(),
        98: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUoAeYhGAUh4AohaAUYiqA8iqAoleBGYkYA8gyAUgUAeYAAAUAABGAeAoYAUAUAKAKAogKYAeAABageBageYCqgyGQhuDmg8YC+goBkAAAKAyYAKAegeB4geBaYgUBQAeAUA8goYCqh4DmiCA8gKYAogKAogeAAgUYAAgohuhQi+hQYiCg7g8AAigAn").cp().ef());
            stroke.setBounds(0, 0, 198, 60);
            return stroke;
        }(),
        99: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATiAyYleCCjIAomaA8YkiAoAAAAAABkYAAAeAAAeAKAKYAUAeBGgKBkgeYC+gyH0huD6gyYC0geBGAAAeAeYAoAoAAAyAAF8YAAHCgKNcgUKKYgKEOAADwAAAKYAKAoAyAKBaAAYBQgKAegeAKhGYAKgeAAi+AAjSYAAmkAKoSAen+YAUp2AKgoB4jSYAegoAAgogegyYgUgog8gyi0huYiMhPAAAAjwBF").cp().ef());
            stroke.setBounds(0, 0, 192, 328);
            return stroke;
        }(),
        100: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APUAAYgKAKg8AUgyAeYjIBajIA8jwAyYigAegoAKgKAoYgKAyAAAeAUAeYAoAoA8AABQgeYBQgeFehuC+goYCqgyAUAKAUA8YAeA8AAHWgUPKYgUR0AAg8AeAeYAeAKAKAKA8gKYBagKAegKAUgoYAAgUAKjmAKnWYAKuOAUoSAeh4YAUg8AehGAohQYA8hkg8hQk2igYhGgegoAAg8AA").cp().ef());
            stroke.setBounds(0, 0, 149, 293);
            return stroke;
        }(),
        101: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJsAKYigA8leBkgyAAYgUAAgoAoAAAeYAAAeAKAKBGAUYAyAKAUgKCWgeYBagKBkgeAogKYBGgUAeAKAUAyYAAAKAKBaAKBQYAKCCAAA8gUCqYgKDSgoDwgoCqYgeCMAKBGA8BuYA8BuA8BGAeAAYAoAAAog8AKhGYAUhGAKk2AUo6YAKloAKhGA8huYBQiWAKgKgegeYgegUiCg8hGgUYhQgKgyAAg8AK").cp().ef());
            stroke.setBounds(0, 0, 106, 193);
            return stroke;
        }(),
        102: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaaAUYjwBQmkBui+AeYigAUj6AUjIAAYjmAAgTAKAdBGYAUAeBaBQAyAUYAoAUCCAAAygUYAygKGuhaDcgoYC+geDmgeB4gKYCWgKAoAegKB4YAABaiqPKiWLuYgeCqgoDmgUBaYgoDIAKAUA8AUYAyAUBQgKAygUYAKgKAUgUAKgeYAUgUAei0AojIYBQnMBQmaBGk2YCCpEAehkBkiCYAegeAegoAAgKYAKgygUgygygyYgyg8jciqgygeYgygKg8AAhuAU").cp().ef());
            stroke.setBounds(0, 0, 230, 298);
            return stroke;
        }(),
        103: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARWAoYjcAylUBGk2A8Yj5AogKAKAnAyYAoAoA8AeBQAUYA8AKAUAAA8gUYD6hQH0huBuAAYA8AAAKAKAeAUYAyA8AKBkgUCgYg8HMhQHqhaH+YgeCCgUB4AAAUYgKA8BGAoBugeYBagKAKgKAKiCYAymQA8l8AojwYBQloBul8BQiCYAog8gKgegygyYhGhGkEhuhQAAYgUAAhkAUhkAU").cp().ef());
            stroke.setBounds(0, 0, 179, 238);
            return stroke;
        }(),
        104: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJYAKYjSA8i+Aeh4AAYhtAAAKBQB3BGYAyAeAeAAC+gUYB4gKAKAAAeAUYAoAUAUAygKBGYAAAUgKAyAAAeYAAAegKBGgKAoYgKAogKBkgKBGYgeDIhQHqg8EEYgeCWgKBuAAAKYAKAoAeAeAeAKYAoAKBQgUAUgeYAKgKAUhkAUhuYBamkBGkOB4mQYBQkEAUg8BQhQYA8g8AKgegUgyYgUgyhahQhkhGYh4hGgygJhkAT").cp().ef());
            stroke.setBounds(0, 0, 110, 217);
            return stroke;
        }(),
        105: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJEAAYAAAKmaA8haAKYgyAKgUAKgKAKYgTAoCVBkBQAAYAUAABQgUBagUYCqgeAAAAAUBGYAKAeAAAegKAyYgKBQiWJOg8DmYgeBagUBQgKAUYAAAoAUAKBaAAYBQAAAogKAegyYAAgKAohuAehuYBkmQB4k2BaiWYBGhaAAgehGgyYgyg8iWhag8gUYgegKhGAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 101, 151);
            return stroke;
        }(),
        106: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWWAKYgUAKgoAKgUAKYgoAUjwBQh4AeYjIA8jwAeksAUYg8AAg8AKgKAKYgoAKgoAeAAAoYAAAeAAAKAUAKYAyAyCCgUI6huYHMhaCWgUBQAeYAeAKAKAAAUA8YAoCMAKBuAKGkYAAG4gKFegUB4YgeBkAKBQAyBaYAyBaAoAyAogKYAogKAyg8AyhkYBGiWAKgegUi0YgUjIgUkiAAlKYAAleAKgeBQigYA8iCAAgegegoYgygoiWhahug8YhugogogJhkAT").cp().ef());
            stroke.setBounds(0, 0, 202, 233);
            return stroke;
        }(),
        107: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVGAUYgoAKiMAeiCAeYleBGqKCggUAUYgdAoAJBkAyAUYAUAKB4gUB4geYDmhQJih4CMAAYBuAAAUAUAUBQYAKBaiMNmg8CqYgoBuAKBaA8BGYAoAoAeAAAogeYBkhGA8iqBkngYA8kiA8h4CWigYBahkAUgUgKgoYgKg8iChajmhuYiMg8gogJh4Ad").cp().ef());
            stroke.setBounds(0, 0, 203, 180);
            return stroke;
        }(),
        108: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASIAAYgUAAgUAKgKAKYgUAAhkAehuAeYhuAejIAyh4AeYjwBGhuAegoAAYgUAAgUAKgKAKYgTAUAJAeA8AeYCCBGBaAACMgoYCgg8GuhaBaAAYBuAAAUBagoGGYgoGkgoEigyDcYgeBkAUBaAyAeYAUAKA8gKAegKYAegUAohGAUhQYAoiCAyloAoleYAKgyAKhGAKgoYAUhaBGiMBGhQYCCiWgKgejchuYh4g8iMg8goAAYgUAAgeAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 172, 192);
            return stroke;
        }(),
        109: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQQAKYgUAAg8AUgoAUYjSBajcA8kYAeYigAKgoAKgKAeYAAAeAABGAeAeIAUAeIEEg8YCMgeC+goBQgKYC0goCCgUAoAKYAyAKAKAUAUCMYAKBkAABQAAEOYAAC0gKCgAAAUYAAAKgKAogKAoYgKAyAAAUAUAoYAUBGAyBkAoAUYAUAUAAAAAogKYAogeBQiCAehQYAeg8AAAKgKmGYgKlyAKhGA8h4YAUgyAUg8AAgKYAAgoh4hki0hQYhkgyg8gJhQAT").cp().ef());
            stroke.setBounds(0, 0, 159, 165);
            return stroke;
        }(),
        110: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AE2AeYgoAKhQAegyAUYh4AogUAUAAAoYAAAUAKAKAoAKYBGAUAUAABkgoYAygUAygUAKAAYA8gKAAAAAAFyYAKEsAAAoAUAKYAUAKB4gUAUgUYAKgKAAgyAKgyYAKjSAyjwAohQYAegyAAgUgegUYgogojIhQg8AAYgUAAgyAKgoAU").cp().ef());
            stroke.setBounds(0, 0, 75, 89);
            return stroke;
        }(),
        111: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMAKYgeAKg8Aeg8AUYiqBQkiBalUBGYiWAeAAAKAAAoYAAAyAeAUAyAUYBGAUAeAACCgoYBGgUBkgUAygUYA8gKCMgeB4geYB4gUBkgeAUAAYAyAAAyBaAABQYAABGhGGkgyDSYgUB4AAAyAeAUYAyAoB4AAAegoYAUgUAUg8AyjSYBGksBQjIBuiCYBQhaAKg8gyhGYgegeighQiWg8YhkgegygJhQAT").cp().ef());
            stroke.setBounds(0, 0, 171, 138);
            return stroke;
        }(),
        112: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AM+AAYgUAKgyAegoAUYhuBGi+BGkOBGYiMAegdAoAdA8YAUAUAKAAA8AAYAeAAA8gKAogKYFehkBugUAygKYAyAAAKAAAUAUYAeAeAAAAgKBQYAAAogUBugUBaYgoCqAAAyAUAUYAeAoCWAAAogoYAKgKAUg8AUhQYAyjIAohQBQhkYAUgUAUgeAKgUYAUg8gUgehagyYgogehGgogogUYhagygygJg8AJ").cp().ef());
            stroke.setBounds(0, 0, 128, 93);
            return stroke;
        }(),
        113: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFKAoYgoAUhQAehGAeYhGAUg8AUgKAAYAAAAAAAKAKAUYAoAoAoAKCCgeYBGgKBGgKAKAKYAeAAAKAAgKAoYAAAUgUBagoBaYgeBQgeBQAAAKYAKAoBuAUAogeYAKgKAUgoAUgoYAyh4AyhaAyg8YBQhkAAgUh4hQYiWhZgUgKhkA7").cp().ef());
            stroke.setBounds(0, 0, 71, 66);
            return stroke;
        }(),
        114: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAgWAAKYmGBujwA8jwAyYiMAUleAoigAUYgyAAg8AAgUAKYgeAAhaAKhaAAYi0AKgeAKAAAoYAAAeAoAoBQAeYBaAoBkAKB4gUYAogKC+geC+geYC+geDcgeBagKYI6haAKAAAyAKYBkAKBQBuAACCYAAB4iMKKh4G4YgoB4AKBGAyAeYA8AUBugKAogoYAegeAUhGAyjmYBQmGA8jcBujIYA8iCAegyCCigYAogyAAgKAAgoYAAgogKgegKgUYgegohuhGi0haYiMhGgegKgyAAYgoAAgyAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 275, 200);
            return stroke;
        }(),
        115: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAg0AAAYg8AUkYAoh4AKYjIAUlyAykEAoYjwAok2AoiWAUYgoAAgoAKgKAAYgdAUAJCCAoAyYAeAeAoAACCgeYFohaCCgUGQg8YHqg8FAgeBuAeYBGAUAKAeAABkYgKBki0KKg8CMYhQC+AoCgCCgoYAogKAyg8A8hkYAehQBajcAoiMYBGjcBQiCCWiMYAygyAygyAAgKYAKgogUgyhGg8Ygygyiqhuhkg8YgygehQAAgyAA").cp().ef());
            stroke.setBounds(0, 0, 270, 163);
            return stroke;
        }(),
        116: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAnOAAAYgUAKgyAKgyAUYiCAoi0AekiAoYiWAUiqAUgyAKYg8AAhQAUgyAAYgyAKiCAUh4AUYhuAUiCAUgyAAYigAUkiAohQAKYg8AKgKAKgUAeYgUAeAAAoAUAyYAeAyCWgKDwg8YFUhQDIgeGGgoYCCgUCCgKAogKYBkgKImgyA8AAYBaAAAoAyAABkYAABQgyDIhaFUYhGDcAAAeAoAeYAyAoCWAAAogyYAKgKAoh4AyiCYBuleAohGCMiWYBQhaAKgegUg8YgegyksjchageYgogKgUAAgyAA").cp().ef());
            stroke.setBounds(0, 0, 306, 137);
            return stroke;
        }(),
        117: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWMAKYgeAUhQAUhGAeYkOBklKBQm4AyYi+AUgKAKAAAoYAAAKAeAeAoAUYBQAoBaAKCMgeYAygKCWgeBugUYB4geDIgoB4gUYEOgyAKAAAyAoYAyAoAKA8gUCMYgUCMgoDSgeBkYgUBkAAA8AeAUYAoAeBkgUAygoYAUgKAUg8AoiWYBQkEA8h4BahkYAegoAogyAAgUYAUgygKgygegeYgegUh4hGiWhGYhugog8gJhQAT").cp().ef());
            stroke.setBounds(0, 0, 201, 119);
            return stroke;
        }(),
        118: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARgAeYkEBalKBQlyAoYgyAKgyAKgUAKYgoAKgJBQATAeYAUAKAUAKAygKYAoAAA8gKAegKYAegKCggeCqgeYCggeDIgoBGgKYCggeAyAAAUAyYAKAegKAUg8DcYgUBuAAAUAyAeYAoAUAoAAAygUYAegKAKgUAeg8YAyhkAyg8BGgyYCWhugohQkYiMYiCg7geAAiMAn").cp().ef());
            stroke.setBounds(0, 0, 168, 70);
            return stroke;
        }(),
        119: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXwAoYl8B4n+Bkm4AeYhaAKhQAKgKAAYgKAKAAAKAAAUYAAAUAKAKA8AeYA8AeAKAABQAAYAoAABGAAAogKYAogKCggeCMgUYCWgeDmgoCMgUYEOg8BaAAAyAUYA8AoAAAohQDwYgeBkgeBaAAAUYAAAeAeAUBaAAYBaAAAKgKAohQYBGiWA8hGCMiCYAygoAKgogUgyYgKgegKgUhQgyYiMhahug8gyAAYgoAAgoAAiCAo").cp().ef());
            stroke.setBounds(0, 0, 215, 83);
            return stroke;
        }(),
        120: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANIAUYkiBajcAojIAKYhGAAg8AKAAAAYAAAKAAAKAAAUYAeBGBkA8BQAAYA8AAFAg8AygUYAogKB4AAAoAUYAyAUAKAygUCCYgoDwjSLkiMHCYhuFAAAAKCCAKYAoAAAUAAAogKYAygUAAgKAyiqYAoiqBulKBQjwYBuksCWl8Aeg8YAKgUAyg8AogoYA8gyAUgeAAgUYAAgegyhGgyg8Yg8gyiChagygUYgygKhGAAhuAU").cp().ef());
            stroke.setBounds(0, 0, 142, 225);
            return stroke;
        }(),
        121: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAwIAAAYgUAAgeAUgUAKYhGAoiMAoh4AeYiMAUkYAyh4AKYhaAAgUAKAAAeYAAAUAoAoAyAeYA8AeC0gKEYgoYD6gyAeAKAKAoYAAAyjIFAjSEYYocLQpsI6xCMCYkOC+gJAUAJAUYAUAUAogKCCgyYF8iWHglAH+muYIInCIIomIcqyYBah4B4h4BkhGYCMhkgUgokEiCYh4g8g8gJgyAJ").cp().ef());
            stroke.setBounds(0, 0, 355, 329);
            return stroke;
        }(),
        122: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAl+AAeYiCA8iCAyi0AeYi+Aoi0AohaAKYgeAAgeAKAAAKYgKAKAoAoA8AeYAyAUAUAKBGAAYBaAKAUAAEihGYCqgeAUgKAUAUYAKAKAKAKAAAKYAAAojcE2jSD6YhuB4lUFKiWCCYkEDSmaEimQEEYjvCgAAAAAJAUYAUAUAUAACMgyYCWgoCMhGDShuYJYlUJYn+LQsqYAogyBQhGA8gyYC0iMAAAAhGg8YgygykEiCgoAAYgUAAgyAKgoAU").cp().ef());
            stroke.setBounds(0, 0, 294, 248);
            return stroke;
        }(),
        123: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAlMAAKYhuAykiBGmQBQIlAA8IgKAeYAAAoAeAUBkAUYCqAeDIgeFKhkYCCgoBGAAAAAyYAABki+FejSEYYhkCCmQGQiWB4YlKD6lyDImaCWYh4AogJAKAJAeYAUAUBaAACWgeYDwgoDchGD6iMYGGjIEijwFemaYBahaCWjSC0kEYCWjIBGhQBQgyYBkhGAKgUgyg8YgegoiChahQgyYhGgUgoAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 282, 237);
            return stroke;
        }(),
        124: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAiiAAUYhkAohuAei0AeYjIAegeAKgKAoYgUBGAoAUCCAAYBkAAAAAACWg8YEYh4AeAoi0EOYkYGanCFeowDmYiqBGhGAek2BaYiWAyh4AoAAAKYAAAUA8AUBGAAYDSAAG4hQDwhaYDmhaEEigDwi0YB4huDIjICqjcYCqjSBGhGBkhQYAegUAKgeAAgKYAAgeg8g8hugyYh4gygegJhaAd").cp().ef());
            stroke.setBounds(0, 0, 263, 175);
            return stroke;
        }(),
        125: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAjoAAUYlACMiqA8kEA8YigAejwAyhuAKYhQAKhkAUgoAUYgyAUAAAeAoAeYBGAoB4AUBkgeYBQgUQ4j6AUAAYAeAAAeAoAKAoYAKBagyEsg8EYYhaFeh4EYi+EsYjmFojSC0nqDwYjwB4iqBGksBkYigA8geAUAAAKYAAAUAeAUAoAAYBQAAGQhGC0goYGQhkDmh4D6jcYEYj6Eim4C+nWYBkjmB4mGAyj6YAehaAehGA8hGYAegoAUgoAAgKYAAg8hQg8iqhQYh4gohQgJhQAd").cp().ef());
            stroke.setBounds(0, 0, 282, 315);
            return stroke;
        }(),
        126: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAjoAAUYi0BGmaB4iCAeYiqAomQAyjwAeYhGAAhGAKgKAKYg8AeBuCCCMAeYBuAeAygKH+iWYFUhaDwg8BugKYBugKAUAegoC0YhQFehaEYiCD6YigFAiqDmkOEYYjmDcnCEioSEYYhGAeg8AeAAAKYAAAeAUAUAygKYBagKGaiMDwhuYI6j6EOjwGapYYC0kECMksCMmGYBQjwBGh4BkhaYBahQAKgyg8gyYhGhGj6hahuAAYgUAAgyAKgeAK").cp().ef());
            stroke.setBounds(0, 0, 285, 310);
            return stroke;
        }(),
        127: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AakAUYh4BGiqAykYAoYhaAKhGAUgKAAYgUAUBkBGBQAUYBQAUCCAABagoYBQgeBQAAAeAUYAoAUgKAyhQCWYh4D6iqEshaCCYgoAyg8Bag8BQYi0DwkEEsloFKYiCB4haBkAAAKYAAAUAogKBagoYCCg8Cqh4CgiMYGQlKFemkHCrGYCCjIA8hQCMh4YBkhkAAgeh4g8Yhagoi+hGgoAAYgKAAgoAKgeAK").cp().ef());
            stroke.setBounds(0, 0, 220, 253);
            return stroke;
        }(),
        128: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkGAAAYgKAKgeAKgKAKYg8AojSBQjwBGYiqAogoAKhkAKYhGAAg8AKAAAAYgKAUBGBGA8AeYAyAeBkAUA8AAYA8AABkgeCMhGYCqhQBkAAAABQYAABGh4FohQCqYiWFKksG4kYE2YkYE2m4FKmGDSYiCBGgoAeAAAUYAAAeAUAKBQgUYC+geFyiWDmiWYJsmGGuoIHgvAYCMkYAyhGCMhkYCChkgohGkiiMYiChGg8gJgyAJ").cp().ef());
            stroke.setBounds(0, 0, 283, 305);
            return stroke;
        }(),
        129: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeyAUYiCA8kEAomGAUYgoAAgeAAAAAKYgeAUBuBkBQAUYBGAUBkAACggeYC+geA8AUgUBGYgKAeiMDIh4CCYhaBuj6D6h4BuYjICqmaEiloDcYiMBQgJAUAJAUYA8AeF8iMEEiWYGkjwFAj6HMnMYEikiBkhaBagyYAegKAUgUAKgKYAegygogyi0hkYiqhagegJhQAd").cp().ef());
            stroke.setBounds(0, 0, 246, 198);
            return stroke;
        }(),
        130: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbgAAYgeAKgyAUgoAUYh4AyjSBGiMAeYiCAoksAyigAUYgoAAgoAKgKAKYgUAUAUAoA8AeYA8AeAAAACWAAICgAAIC+g8YEOhQCWgoAoAAYAyAKAeAeAKAoYAKA8haFehQDSYhGC0h4DchQBkYh4CWi0CqiCBQYi+CCjcBuj6BaYg8AUhGAegKAAYAAAUAAAAAKAUYAeAeBQAKCWgKYDmgUDmhQEEiqYGQkED6loEYrkYBQjmAog8BahkYAogoAegoAAgUYAKgyg8g8iMg8YhkgehGAAhQAA").cp().ef());
            stroke.setBounds(0, 0, 221, 234);
            return stroke;
        }(),
        131: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbqAKYgyAekiA8iCAKYiqAUiWAKhaAAYiCgUgeAUBGBGYAoAoBaAyBQAUYBQAUB4gKDSg8YCqgoAUAAAyAUYAoAKAAAegoBuYhGDwh4DciMDIYk2G4lKEOngD6YhuAyhkAyAAAAYAAAKAAAKAAAKYAUAUBkgKCggoYD6g8CMhGDmiWYFejmEilKE2ocYBQiMAegoBGhGYAogyA8gyAogUYA8geAUgeAAgeYAAgehkhahkhGYiMhag8gJhQAT").cp().ef());
            stroke.setBounds(0, 0, 226, 217);
            return stroke;
        }(),
        132: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUeAeYgyAUhGAeg8AKYhQAegyAKjSAeYhQAUgUAKAKAeYAAAKAeAUAeAKYBGAoBGgKDcgyYBugeBkgUAKAAYA8AAgKBQgyCqYgoB4gyBQhaB4YigDckOCCo6CCYhQAUhGAUgKAAYgJAUATAUA8AUYBGAKCWgKDmgoYFAgyCqhGC+i0YCgiCBaiCB4jwYA8iCAUgeAygyYAogeAKgeAAgKYAAgohuhuhagoYhagngyAAhkAn").cp().ef());
            stroke.setBounds(0, 0, 176, 135);
            return stroke;
        }(),
        133: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASmAeYhaAoiqAyhuAUYhaAUkiAeigAKYhQAKgUAAgKAUYgKAUAAAAAKAUYAeAyDIBaBaAAYAeAACMgeCggoYCggoCMgeAUAAYBGAAAAAyhQDIYkYKyj6FynWGaYhaBGgoAyAAAKYAKBGEEiCD6jIYBuhQC+i+BahuYCgi+C0ksDSmuYBai+AohGAogoYAUgeAUgeAAgKYAAgUgogygygeYhQgoiWgygoAAYgUAAg8AKgoAU").cp().ef());
            stroke.setBounds(0, 0, 168, 215);
            return stroke;
        }(),
        134: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASwAAYgKAAg8Aog8AoYiMBahQAoi0AyYiWAoiCAUi0AKYi+AUAAAAgKAeYgKAyAyAyCMBGYB4A8AeAADmhaYDwhaDShQAeAAYAoAAAKAeAAAyYgUBaiMEEiMDSYi0EOloHMjcDmYgoAoAAAUAAAAYAoAyFAjcC+jIYDcjwCCigDwl8YDSlUAog8CCiCYCMiMAKgUiChQYh4hGiggdg8AJ").cp().ef());
            stroke.setBounds(0, 0, 164, 203);
            return stroke;
        }(),
        135: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVQAKYgUAAgyAegyAUYiqBaj6BGm4BGYiCAUhkAegKAAYgUAUAeAoAyAeYAeAUAoAKAyAAYBQAKCWgeF8haYDIgoAygKAUAKYAeAUAAAeg8BkYjcF8k2FKoIGQYhGAygyAyAAAKYAAAUA8gKBugoYDchaCghaCqiMYDwi0DmjmDwkiYCMiqB4h4BGgyYAygoAUgegKgeYgKgohugyiWhGYhugegeAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 183, 170);
            return stroke;
        }(),
        136: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARqAKYgeAKg8Aeg8AUYjIBQjwA8j6AoYigAUgoAKAAAUYAAAyBkAoB4AKYBuAKBkgUCggyYBQgeBageAegKYBGgKAAAAAoAKYAUAKAUAKAKAKYAyBGhkGkiCEOYhaC0iqC+i0B4YhQA8iWBQhaAyYhkAoAAAKAAAUYAKAoA8AKBugKYCWgUCCgyCMhaYCghuCgiWBkiMYBaiMBkjcBuk2YBGjIAegyBahuYBGhQAAgohagyYg8goiWgyg8AAYgUAAgoAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 157, 186);
            return stroke;
        }(),
        137: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQaAAYgKAKgoAKgoAUYhQAejwBGhuAUYgyAKhaAKhGAKYhuAKgeAKgKAKIgUAUIAeAeYAoAoBkAUBkgKYBQAAAygUBugeYBQgeBagUAeAAYA8gKAAAAAeAeYAeAeAAAAgyCqYg8DmhQCWhuCCYiCCMjSCCjwBQYhaAegKAKAAAeYAKAUAeAKB4gKYC0gKC+hGCqhuYBkhGCWiMAyhQYA8hQBQiWAyh4YBGiWAog8BQhQYBGhGAKgegogyYgUgKgygog8gUYhGgogegKgyAAYgoAAgeAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 145, 140);
            return stroke;
        }(),
        138: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaGAUYhkAynCCCjmAoYiWAekYAyhuAKYgeAAhQAKhQAAYh4AKgUAAgKAUYgKAeAAAoAUAeYAoAyCWBkA8AUYBGAUBQgKCghGYDchaHCiMDcgyYB4gUAeAKAoAoYAyAygKAUi0FyYjIGGhGCMhkBuYhaBageBGAAB4YAAC0A8BkBGgUYAogKBuhaAohGYBQiCBujSC+nCYCqmGAyhQB4hQYBGgyAog8gKgoYgUhQlAjShkAAYgKAAgeAAgUAU").cp().ef());
            stroke.setBounds(0, 0, 218, 196);
            return stroke;
        }(),
        139: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AR0AKYgUAKgoAKgeAUYgoAKhQAeg8AUYhkAegoAAhGAAYhGAAgKAKAAAKYAAAUA8A8AoAUYAeAUBGAACCgoYB4geA8AAAAAUYAUAehGDIhaCgYgyBkhQBkiqDIYiqDSjSC+jICMYgoAegeAeAAAKYAAAKBkAAA8gUYBkgeC+hkBkhGYBuhaEYkYBuiWYBkh4BkiWBuiqYAeg8AyhGAogeYBkhugKgejIhkYiMg8gegJg8AT").cp().ef());
            stroke.setBounds(0, 0, 155, 165);
            return stroke;
        }(),
        140: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAj8AAUYiCBQhaAeiCAoYpOCqruCCmaAUYiWAKgKAAgUAUYgnAoATA8BkBaYBaBQAyAeBaAAYA8AAAUgKAygUYCghaFyhkKKiWYCWgeCMgeAUAAYAKAKAUAKAKAAYAKAegUAUiqCCYmkE2oIFemQDwYiCBQh4BQgUAKYgeAeAAAKAUAKYAKAKAKAABugUYCggoBugyDmhuYG4jmIIk2GQkiYB4hQCCg8C+hQYBageBGgoAKAAYAyg8iCiWi+h4Yhkg7goAAhQAd").cp().ef());
            stroke.setBounds(0, 0, 281, 173);
            return stroke;
        }(),
        141: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Aa4AUYh4AyjmAymkBQYnWBQjSAeiCgeYg8AAgKAAgeAKYgoAUgJAeATAoYAUAyCgCMBaAyYAyAUBGAABGgyYCqhuCqgyISiMYE2hGBGgKAUAeYAUAegUAygyBGYgUAehGBQgyA8YgyBGhaB4hGBQYjmEiAAAAAKAKYAKAKAUgKA8geYCChGCMhkEOjSYCgiMAogUBQgeYAogKAogUAUAAYAogeAygyAAgUYAAhGkOkshageYgyAAAAAAhaAU").cp().ef());
            stroke.setBounds(0, 0, 223, 115);
            return stroke;
        }(),
        142: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWCAUYhkAoiMAok2BQYleBah4AUjSAKYhkAKg8AAgKAKYgnAoBFBkBuAeYB4AoA8gKDchGYFyh4E2hGA8AKYAoAKAKAKgKAeYgUBGi+EYhGBGYg8A8goCMAKBuYAKBQAoAUBQgoYBagoB4iWDSksYBuiqBQhaBQgoYBug8AKgehGhQYgegegygehGgoYh4gyg8gJhaAd").cp().ef());
            stroke.setBounds(0, 0, 188, 114);
            return stroke;
        }(),
        143: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APeAUYgyAUiWAyiWAyYkiBkg8AKiqAKYhuAAgKAKAAAoYAAAoBGA8BGAeYAyAUAKAKA8gKYAoAAAogKAUgKYBGgyHqi+AeAAYAyAAAyAeAAAoYAAAUgUAyhGB4YjIE2g8B4AeAAYAKAAA8g8A8g8YBuhaB4huCMh4YAygoBGgyBGgeYBQgyAKgegyg8Yg8hGjmh4hGAAYgUAAgyAKgoAK").cp().ef());
            stroke.setBounds(0, 0, 150, 90);
            return stroke;
        }(),
        144: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AM+AAYgKAAgeAKgKAKYgUAKhuAohuAyYjcBGiWAyhuAKYgeAAgeAKAAAAYAAAKBGA8AoAKYA8AUBugKDIgyYBkgeBagUAKAAYAKAAAAAKAKAKYAKAUhkDmhaC0YhGCggUAyAeAKYAeAABuhkCgi+YCgi+BQhQBkhaYAogeAegeAKAAYAKgygegeiqhaYhGgogyAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 119, 93);
            return stroke;
        }(),
        145: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALQAAYgKAAgUAKgKAKYgoAUleBkiMAeYhQAUhGAKAAAKYgJAUAnAoAyAUYAyAeAyAAC+goYCqgeAeAAAAAeYAAAei+GahaCWYgyBQg8CCAAAKYAAAKAKAAAAAKYAUAKDIjSC0jIYCqi+CWiWBkhGYBuhagKgUjSiCYhag8gyAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 109, 112);
            return stroke;
        }(),
        146: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMgAKYgUAAgeAUgeAeYhQA8g8AUj6BaYkYBkgeAUgUAeYAAAUAABGAUAUYAUAeCWgoCgg8YBGgeBkgoA8gUYBageAKAAAoAKYAyAUAKAeAAAyYgKAyiqHMgyB4YgUAygUAoAAAUYAAAKAUAUAKAUYAeAUAKAKAegKYA8gKAogeAUg8YAUhaEOmkBkhaYAUgeAygoAegUYBkg8Aegygyg8YgegojSiWhQgoYhGgeg8AAgyAK").cp().ef());
            stroke.setBounds(0, 0, 133, 123);
            return stroke;
        }(),
        147: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALkAAYgKAKgeAUgUAKYgyAygoAKkiBaYksBkAAAKAAA8YAAAyAoAUAoAAYAKAAAygKAygeYB4gyEihkAyAAYAyAAAoAogKAyYgKAohuE2geBQYgeA8AAAoAoAKYAoAUAUgKAogoYAegeAUgUAAgeYAKhQEilUA8AAYAUAAAyg8AAgUYAAgegygyhuhQYiChkhGgJhGAJ").cp().ef());
            stroke.setBounds(0, 0, 118, 89);
            return stroke;
        }(),
        148: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANwAUYgKAKgyAogoAeYiCBQhQAoiWAoYhGAUhuAUg8AKYigAUgUAUAAA8YAAAyAUAeAyAAYCggKFAhGCqhQYAegUAygKAKAAYAeAAAoAeAAAUYAAAKgeA8gUA8YgeBGgoBugeA8YgoCWAAAoAoAUYAoAeAegeAyhQYBQiqDSkYBag8YAegeAegeAKgKYAUgygog8iMhaYiChGg8gJhGAd").cp().ef());
            stroke.setBounds(0, 0, 131, 95);
            return stroke;
        }(),
        149: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJiAKYg8AeAAAoBQBuYA8BaAUBQAKCqcAAUADcAAAAmwgAUAAyYAAAUgUAegUAUYgeAegKAAgyAAYgeAAiCgUiCgeYkOgygeAAAAAUYAAAUAoAyCCBQYDwCWB4BkBkCCYB4CMBQAoA8gyYBGg8AyiMAUi+YAUhugKjcgUmuYgenWgKoSAKm4YAAoSAej6AyjIYAeiCAKgUgUgoYgegohGgyh4g8YiCgyhQgJgyAT").cp().ef());
            stroke.setBounds(0, 0, 111, 399);
            return stroke;
        }(),
        150: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AImAKYgUAKgKAKAAAKYAAAKAeA8AeA8YAoBGAUA8AKAyYAUBkAKMWgKFoYgUFKAAA8gUAoYgUAogyAegeAAYgUAAhkgehugeYkshkAUAKgUAKYgJAUATAoCCB4YCqCgC+C0BGBkYBGBaAoAUAogKYA8gUBuigAoh4YAUhQAAgKAAmuYAAjwgKl8AAjSYgKmuAKhuAohuYAohkAAgygogeYgogyhkhGhagoYhkgohGgJgeAT").cp().ef());
            stroke.setBounds(0, 0, 102, 269);
            return stroke;
        }(),
        151: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAAYgUAKgKAeAUA8YAoBkAKB4AKEEYAKEEgUC+gUAyYgKAUgoAUgeAAYgUAAg8gKg8gKYiWgog8AAgUAUYgJAUAJAeBuBkYB4BkB4CCBGBQYAoAoA8AoAeAAYAeAAAogoAohaYBQi0AKgyAAngYAAjcAAjSAKgoYAAhagegyhGhGYhahQhQgdg8AJ").cp().ef());
            stroke.setBounds(0, 0, 77, 163);
            return stroke;
        }(),
        152: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFAAKYAAAKAKAoAKAoYAeA8AAAeAADIIAADmIgeAKYgeAKgKAAhkgUYiWgygyAAAAAUYAAAUAKAUB4BuYA8AyBQBQAeAoYBkB4AoAKA8iCYBGiMAAgeAKkYYAAlAAAAAiMhkYhGgogygJAAAT").cp().ef());
            stroke.setBounds(0, 0, 59, 101);
            return stroke;
        }(),
        153: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABaAAYgoAKgeAeAAAUYAAAeAAAUAoAyYBQBQAUBGAeDSYAeD6AAEsAAKUYgKKogKDSgeFKYgoFegUBkg8BkYg7BaAAAyAnBaYAeAyAyAoA8AeYAoAUAAAAAUgKYAUgKAyg8Aog8YB4iWDmkOCgigYCCiCAUgogUgUYgegoAKAAlKDmYh4BahkBGgKAAYgKAAgKgKAAgUYgKgKAAiMAKigYAKigAKk2AKjcYAAjcAUksAAiWYAKiWAKkiAAjSYAKmuAKiMAehkYAUhGgKgegegoYhGhajmhPhaAT").cp().ef());
            stroke.setBounds(0, 0, 100, 388);
            return stroke;
        }(),
        154: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC+AKYgKAKgUAUgKAKYgKAoAKAoAoAoYAoAeAeBGAUBaYAeCWgKMggoIIYgyI6gyEihQCCYgKAUgeAegKAeYgUAUgKAoAAAeYAABGAoBkBaA8YBQAyAAAAC+jcYBkhuE2ksDwjSYCgiWAUgegegeYgegUgyAeleDmYi0B4iWBkgKAAYgKAAgKgKAAgKYgKgUAUi0AUjSYA8qUA8qyAUjIYAKjIAUiCAeg8YAehGgUgyhGg8YiChui0gnhQAd").cp().ef());
            stroke.setBounds(0, 0, 122, 325);
            return stroke;
        }(),
        155: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADwAKYgUAUAAAeAeBGYA8BuAeAyAKBGYAyCMAAAUAAG4YAAGGAABkgeDmYgUCqhQFAgyBkYgoBGhkCMgeAeYgoAegKAoAAAoYAAA8AoCCAoA8YAyA8AeAUAogKYAKAABkhaBuhuYDcjcH0muDwi0YAegUAogyAAgeYAAgoh4A8m4D6YiCBQiCA8AAAAYgeAAgUgKAAgeYgKgoAKjSAUmQYAKiMAKigAAg8YAKiMAoocAAg8YAAgeAKg8AKgyYAKhGAAgKgUgeYgeg8hQgyiggyYhagUgyAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 145, 295);
            return stroke;
        }(),
        156: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACMAAYgoAUAAAeAeA8YCMEEAKAoAUEOYAKFKgKDShGEEYgoCqgoBahkCMYgyBaAAAAAAAyYAAAyAyB4AyBGYAUAUAeAeAUAKYAeAKAKAAAegKYAUgKAegeAegoYC+kiFUmQImpOYCqi0AegogUgeYgegUi0CWn0HWYiMCCiCBugKAKYgUAKgUAAgKAAYgUAAAAgKAAgyYgKgoAUlAAUn+YAAg8AKhuAKhQYAKjIAAgKgogyYgogogogUh4goYhagehQAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 159, 234);
            return stroke;
        }(),
        157: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAAYgoAUAAAoAeBQYAUAeAUBQAUAyYAUBaAAAoAKDIYAADcgKCCgeD6YgUDIgyBaiWDcYgeAoAAAKAAAyYAABkBQCgA8AKYAUAKAogUAegoYA8hQFKksEijmYA8gyBGg8AUgKYAygoAUgogUgUYgUgegyAUl8C+YhaAohQAogKAAYgUAAAAgUAUhuYAUigAel8AKjcYAKhuAKh4AAgoYAehkgKgKgogyYh4h4iWhFg8AT").cp().ef());
            stroke.setBounds(0, 0, 113, 213);
            return stroke;
        }(),
        158: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACWAAYgUAKgKAKAKAoYAAAUAUAyAUAoYA8BaAoBuAUBaYAAAoAKBagKCMYAAC0gKAogUBaYgeCCgyBkhGBaYh3C+AAgKAdB4YAeBaAoA8AoAoYAyAoAUgKBQhQYC0jSGGloEOjmYCMhuAUgeAKgeYAKgeAAAAgoAKYgeAAiqBakYCqYhkA8haAogKAAYgeAAgKgeAKleYAAi+AKjcAKhQYAAh4AAgegKgKYgUgeiMhGhagUYhagUgoAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 130, 188);
            return stroke;
        }(),
        159: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACgAUYgKAKgUAKAAAKYAAAKAUAoAUAyYBaDSAoDwgeEOYAABagKBkgKAeYgeBag8B4hQBkYhQBugJAeAJBQYAUA8AoBQAeAeYAoAoAegKA8gyYBkhkC+huHCjwYFUi0AUgKgKgeYAAgKgKgKgUAAYgogKjcBGk2BkYhaAUhQAegUAAYgyAAAAgUAKjSYAKhuAKi+AAiCYAAiCAKiMAAgyYAKgyAAgyAAgKYgKgyjmiWhGAAYgKAAgeAAgKAU").cp().ef());
            stroke.setBounds(0, 0, 132, 182);
            return stroke;
        }(),
        160: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgeAUAAAoAUAKYAUAUAyCCAKBGYAKAyAKCCAADIYAAGkgUB4hQCgYgeBagJAoAdBaYAoBuBGBQAogKYAKAAAogoAegoYAegoCgigCWigYEikiBuhugKgKYgKAAgKgKAAAAYgUAAj6CMigBkYhkA8hGAegegUYgUgKgKg8AKlKYAKi0AKi+AAgyYAekEAAAKhkhQYhahQhagJgoAT").cp().ef());
            stroke.setBounds(0, 0, 99, 179);
            return stroke;
        }(),
        161: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAAYgKAKgUAKgKAKYgUAeAAAeAoAyYBGBkAKBkAeImYAUKUgUKUhGH+Yg8HCgeBahaBkYgyA8gKAUAAAeYAAAoAyBkAoAyYBQBQA8AABag8YAygoDchaBQgUYBagUEigoDIgUYHCgoBQAAJEAAYIIAABaAACWAUYC+AUAyAAAogyYAegeAAgegegyYgogyiChahagoYhkgygyAAjwAUYkiAeAKAAjIAUYhkAUhkAKgUAAYgeAAhkAKhaAKYn+A8i0AeiCAKYhQAUh4AKhQAAYjmAKgKAAAAi+YAAg8AKh4AAhaYAKhaAKjSAKiqYAAiqAUlKAKjcYAKjmAUlKAKi0YAUmkAKiMAehuYAUhGAAgUgKgKYgUgUjIhkhGgeYhGgKgyAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 343, 373);
            return stroke;
        }(),
        162: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAyAAYgKAKgUAKgKAKYgKAUAAAKAAAUYAKAUAKAUAKAKYBGA8AoCgAyHWYA8JOAKF8gUGkYgKEsgoCMhGBGYgKAKgUAegKAUYgKAeAAAKAUAoYAeA8BGBQAoAUYAyAUAeAAA8gyYAegUBagyBGgeYCghQBugUHCg8YAogKEsgUCWgKYDSgUHMAACgAKYBkAABkAAAUAAYAygKAygoAAgoYAAgyiMhkiMg8YhkgogyAAmaBGYg8AKi+Aei0AUYi0AekOAoiWAeYkYAyiWAKgygKYgygKgKgogKleYAAiqgKjcgKhuYgKkEgUvKAKiWYAAhGAAhGAKgUYAAgeAAgKgUgUYgegeh4g8hkgUYhGgKgyAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 293, 304);
            return stroke;
        }(),
        163: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AB4AAYgUAUAAAyAoBkYA8CWAKBGAAGaYAKFygKHWgeGuYgUEigeGGgUA8YgKA8goBkgeBGYgUAegKAoAAAUYAAAoA8CCAoAoYAyAyAegKB4haYEEjIGQhuLQhQYBQgKBGgKAKgKYBGgeg8hkiMg8Yg8gegeAAhaAUYjcA8lyBah4AeYhQAUh4AehGAUYh4AogKAAgUgUIgegKIAKjIYAAhuAKkYAUj6YAKjwAKloAKi+YAUsMAAhuAeiMYAUhGAAAAgegUYgUgehuhQhQgoYhGgegyAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 188, 338);
            return stroke;
        }(),
        164: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAKYgKAUAAAUAeBQYAoBkAKBQAAEEYgKDwgKCggUEOYgUCMgUBQgyBGYgUAoAAAyAUA8YAeBGAeAoAeAAYAKAAAygeAygeYDwiMEOg8JYgUYCqgKAogKAAgeYAAgegegegygoYgogegKAAgyAAYgoAAhGAAg8AUYhuAKkiAyhuAKYgeAAhQAUhGAKYhGAUhGAKgKAAYgyAKgKgKAAh4YAAi0AotmAKhuIAAhGIgygoYhkhQhkgdgKAd").cp().ef());
            stroke.setBounds(0, 0, 155, 179);
            return stroke;
        }(),
        165: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAeAAAUAeBGYAUAoAUBGAUAyYAyC0AeGaAAJsYAAH0AAAKhGCWYgoBagKAyAoBGYAoBGAUAeAeAKYAoAUAegKBGgyYBGgyB4g8BkgeYBageD6gyC0gUYBQgKBQgKAKgKYAegUAAgegygyYhQhahGgUh4AeYgoAKiMAeiMAeYjcAogeAAgKgKYgKgUgKiCgKleYgKhugKk2gKkOYgKkigKjmAKhQYAAiCAAAAgUgeYgUgUgogehQgoYh4gygogJgeAT").cp().ef());
            stroke.setBounds(0, 0, 133, 250);
            return stroke;
        }(),
        166: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJsAUYgeAoAAAyAeBGYAoBuAUBkgKCWYgUFehQGuiMHMYiCG4haC0igC0YgyA8AAAKAAAeYAAA8AyBuA8A8YA8BGAUAABugyYC0hGEEgyG4geYDIgKHgAKD6AUYEEAUGQBaFABuYCgA8AyAAAegeYAogegehahQhQYg8hGi0iWgygeYg8gehaAAiqAKYhaAKkiAKqKAAYocAAmkAKhQAAYiMAKgUAAAAgoYAAgKAeiCAyigYAyiWA8jSAehkYCCmaBum4BGlKYAUhkAeiCAKgoYAUg8AAgoAAgKYgUgoi+ighagoYg8gUgeAAgUAU").cp().ef());
            stroke.setBounds(0, 0, 335, 308);
            return stroke;
        }(),
        167: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKeAKYgoAoAAAKAeBGYBQCWAKBkgoDSYgoDIhaF8gyCCYgUAygeBagUA8Yg8CqiCC0igCMYhuB4gTA8AnBaYAUAeAoAoAeAeYAyAyAKAAAoAAYAoAAAUAAAogeYBQgyA8geBkgUYB4geDwgeD6gUYHMgeL4BaHWCMYBkAeAyAAAygUYBagogyh4iWiCYgogegygegUgKYgogKiMgKksgUYlegUiMAAleAKYloAAmaAUiCAUYgyAKgegUgKgeYgKgeAAAAB4lAYCWlyCqowBamaIAUg8IgygyYiMiMiqhZgeAn").cp().ef());
            stroke.setBounds(0, 0, 310, 243);
            return stroke;
        }(),
        168: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABkAKYgoAUAKAeAyB4YBuEEAUC+geEiYgUDIgyCChaBkYhPBuAAAoBjBkYA8A8A8AeAoAAYAKAAAogUAogeYBQhGCCgyDchGYHWiWHChuG4hQYHqhaEOgUB4AeYAeAKA8AKAeAAYAyAKAKAAAegeYAegeAAgKgKg8YAAgygKgegKgUIgUgeIiCAKYk2AUoSBGpiBuYnMBQiMAokEA8YjSA8goAAgegUYgUgUAAgUAUjwYAKiMAKi0AAhQYAekigKgyhkhQYgegUgygogegUYhkgyg8gJgoAT").cp().ef());
            stroke.setBounds(0, 0, 324, 170);
            return stroke;
        }(),
        169: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACCAKYgUAUAAAUAyCCYAyCgAKBugKCMYgKA8gKBQgKAeYgUBQgyBugoAeYgoAygeA8AAAeYAAAyCWCMBGAKYAeAKAKgKAogoYBGgyBagyCggyYH0igJsiWHCg8YCCgUEOgKBuAUYA8AKAAAAAegeYAegeAKgKAAgyYAAgogKgUgUgUIgUgeIh4AKYjwAKmGAynCBQYoSBahkAUkYBQYhkAUg8AKgUAAYgygKAAgeAojmYAokOAAhageg8YgegyhQhQhQgyYhGgehGgJgeAT").cp().ef());
            stroke.setBounds(0, 0, 283, 133);
            return stroke;
        }(),
        170: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADIAUIgeAUIAUBGYAeBQAABagUCCYgeB4gKAUhGBQYhQBQgKAUAAAyYAAAeAAAKAyAyYA8BGAeAABQgyYCMhGCqg8EOgyYDSgoG4g8D6gUYC0gKHMAAEiAAYCCAKAeAAAUgUYAogUAKgegUgeYgUgeiWhkhQgeYhagogyAAiWAeYi0AojwAokEAeYmaA8kYAojmAyYiCAeh4AUgeAAIgyAAIAAgoYgKgyBkjmAyg8YAUgeAAgogKgeYgKgKgogegogUYiMhagygTgoAn").cp().ef());
            stroke.setBounds(0, 0, 286, 93);
            return stroke;
        }(),
        171: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAUYgUAeAAAUAoBGYAUAeAUAeAKAUYAoBaAKDIgeDSYgUCMgUAohQBkYgeAegUAoAAAUYAAAyAKA8AyAoYBGA8AyAKAygoYBuhaFohkHChGYEigoBQgKF8AAYFegKAUAAAegUYAUgKAUgUAKgUYAUgUAAgKgUgUYgegoiChQh4gyYiCg8goAAjmA8YhaAeigAehuAeYkEAyjSAyjSAyYi+AygeAAgKgoYgKgeAylAAeh4YAKgyAUhGAKgUYAegyAAgogegeYgogyksiCgyAAYgKAAgUAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 237, 130);
            return stroke;
        }(),
        172: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADmAKYgKAKgKAUAKAeYAAAeAKAyAKAoYAKBagKBkgoBkYgeBugeAyhGBGYhZBaAAAeBPBkYA8A8AyAUAogeYBQgoAygeBkgeYE2hkGuhkE2gyYBugUBQAAC0AAIDmAAIAUgeYAUgeAAhGgogeYgUgUgKAAhuAKYlUAKsgB4kiBQYhaAUgeAAAAgeYAAgKAUhQAehQYAehaAehaAAgUYgKgygeg8g8hGYhQhQhQgdgUAd").cp().ef());
            stroke.setBounds(0, 0, 213, 100);
            return stroke;
        }(),
        173: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABaAKYAAAKAKAyAKAyYAeBuAABGgUB4YgUBagKAeg8BGYgUAegKAeAAAKYAAAUAyA8AoAUYAoAUAUAAAogeYBahQGaigD6gyYCggeAegUAAgeYAAgogegUgeAAYg8AAowCMhkAoYgUAKgUAKgUAAYgUAAAAgKAKgyYAAgeAKg8AKg8YAUigAAgegogoYhGhQhugngKAd").cp().ef());
            stroke.setBounds(0, 0, 113, 80);
            return stroke;
        }(),
        174: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABuAUYgeAeAAAeAoBaYBGCgAoC0AAC0YAACWgKBugeB4YgeB4goBGhGBaYgyBQgJAoATAoYAUAoBGBGBGAeYAyAeAKAAAegKYAUgKAUgKAAAAYAAgUB4hQA8goYCghQGaiCCggeYA8gKBkgUA8gKYA8gKA8gKAKgKYAygUAUh4gygoYgegUgeAAiMAUYjmAekOA8jwBQYiWAogoAKgKgoYAAgKgKgUAKgKYAAgeAypEAKiWYAKiMgKgog8g8Yg8hGighag8AAYgUAAgUAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 162, 168);
            return stroke;
        }(),
        175: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABkAUYgKAoAAAKAeA8YA8BaAKBGAAC0YAAE2g8DchkCWYgeA8AAAeAKAyYAeAyBGA8AeAAYAKAAAogKAegUYDShuGagoEiAyYC0AeAUAAgKgyYgUg8jSighkgUYgogKi0AoleBQYiMAegeAAAAgUYAAgKAeiCAUiMYAykEAKg8AUkEYAUiMAAAKhkhGYh4hGg8gTgUAn").cp().ef());
            stroke.setBounds(0, 0, 133, 141);
            return stroke;
        }(),
        176: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgnAeAAAeBFBaYAeAeAoAyAKAeYAeA8AAAKAADIYAABuAAD6gKCqYgUIIAKBuA8CMYBaC+CCAoF8goYCqgUA8gUAygoYAygyAKgogUgeYgegeg8gKjcAKYjwAKgUAAgygUYh4g8goh4AAmQYAAkOAokEBQlAYAoiqAAgKiWhGYiWg8hugogeAAYgKAAgUAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 115, 204);
            return stroke;
        }(),
        177: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgnAUAJAyA8BGYA8BQAeA8AKBuYAKAoAKDIAAC+YAKFKAAAeAUAyYAUBGAyAyA8AeYA8AeBQAKCqAKYC+AKCWgUAygUYAygeAyg8gKgeYgKgygogKkYgKYj6gKgKAAgygeYgygUgUgUgKgeYg8huAUlKBQk2YAehuAAg8gegUYgKgKhGgohGgoYiWhGhQgJgoAJ").cp().ef());
            stroke.setBounds(0, 0, 114, 144);
            return stroke;
        }(),
        178: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAAYgKAUAAAoAUCCYAUBQAeCCAKBQYAKBaAKBQAKAKYAKAeBQBQAyAeYB4AyD6AeEigeYIIgoEigyBuhGYBQgogKhGhQgoYgygeiWgehagKYg8AAgKAKhkAoYhuA8hGAUkYAoYjcAUjSAKhQgeYgegKgegUgKgKYgUgUAAgKAAhQYAKgoAKhaAUg8YAUhaAAgUgKgUYgUgeigh4gygKYgygKgoAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 190, 87);
            return stroke;
        }(),
        179: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AISAKYgUAKgKAUAAAUYgKAeAKAKAeAoYA8BGAeBaAAA8YAACqh4JihuF8YgyCqigH0geBGYgeBQgeAogyA8YgoAygJBQATA8YAUAyAUAKB4AAYCgAAB4AyDcCCYHMEOGuFKFyFUYDcDSAoAeAoAKYAoAKAogUAKgoYAyh4h4k2iqiWYgogogogehQgoYg8gUhug8hQgyYkEigjmiCqAlKYjIhugUgKAKgyYAAgUA8i0BQi+YCgmGCWmkB4lyYAoiMA8iMAeg8YA8iCAAgUgyhQYhGhujwiMh4gKYgyAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 234, 407);
            return stroke;
        }(),
        180: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AG4AeYgUAUgKAKAKAeYAAAKAKAeAUAUYAyBaAKCWgoEEYgyGuhGFeh4HgYhGEigeBGhkCqYgeBQAAAoAKAyYAKAyAeAUBaAyYEOCMFoEYF8FeYCMCCAyAAAohQYAUgoAKgUgKhGYgKiWgyhQh4hQYhuhGjwiMksiMYiWhQiChQgUgKYgogyAAgUA8i+YCMmGCqocCMoSYA8i+Ayh4AyhaYAog8AKgeAAgyYAAgyAAAAg8g8YhGg8iWhuhGgeYg8gUg8AAgoAe").cp().ef());
            stroke.setBounds(0, 0, 141, 361);
            return stroke;
        }(),
        181: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAUYgeAeAAAKAeBGYAeBaAAB4gUB4Yg8DwigHChGCCYgeAegeAygeAeYgoA8gUAyAAAoYAAAoAyAyBGAeYCMBGC0DSEOGQYBuCgAUAKA8geYAogUAeg8AAhkYAKhkgKgyhGhQYhGhkksjwi+h4YgogUgegegKgUYgegyAKgeCCj6YBGh4BujcBGiMYBGiMBGiMAUgeYAyhaAAgog8hGYhQhkigh4gyAAYgKAAgeAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 98, 250);
            return stroke;
        }(),
        182: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEiAAYgoAUAAAKAUAyYAeBGAABageBkYg8C0huDmg8BQYg7BQAKAKBtCCYA8A8BaBuAyA8YCCC0AeAUAoAAYBGAABGh4gKhkYgUhahGg8jShuYiMg8gUgUAKg8YAUhGFAmQBGgoYAygeAKgogUgyYgKgegUgegygyYhuhuhQgThGAJ").cp().ef());
            stroke.setBounds(0, 0, 65, 149);
            return stroke;
        }(),
        183: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAKYgUAUAAAKAUA8YAeBaAAAegyC0YgyC+geBkg8BuYgyBagJBGATAeYAKAKAyAeAyAKYCqA8EOCWCWB4YDmC0CqCMC+CqYAyAyBGA8AeAKYBkAyBQgeAAhaYAAhQhuj6g8g8Ygygoh4hGkYiWYjShklyighkgeYhQgegegUAAgeYAAgUEYpEAUgeYAKAAAAgUAAgUYAAgohQhQhag8YhQgogogJgeAT").cp().ef());
            stroke.setBounds(0, 0, 164, 201);
            return stroke;
        }(),
        184: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APKAKYgKAKAAAUAKAeYAKCgAABQgKBkYgoDIhGEEiMFoYiCFegyBuhQCqYiCEEhkCWiMCMYhaBkgJAeAJBaYAeCMAoBQAyAAYAKAAAogKAogKYCqg8G4hkEOgoYGag8GGgoEigUYBugKBagUAegeYAUgegKgehGhGYhQhQgygUh4gKYhuAAhaAKj6A8YhuAUigAohaAKYj6Ayn+BGgeAAYgeAAAAgKAAgUYAAgKAohuAyh4YCMk2CCkiCClKYEEp2AohaCMiMYBQhaAAgUhahQYhQhGiChkg8geYgygUhQAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 243, 286);
            return stroke;
        }(),
        185: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfuAAYgUAKgeAyAAAoYAAA8gUBQhGCCYiqFKjIEilAFUYjSDcqUKehGA8YgeAUg8AogyAUYh4BGgTA8AnBuYAUAoBuB4AeAUYAeAUAeAACWg8YH+jIHMhuPKiMYDcgeAogKAegoYAAgKAAgKAAgKYAAgKgKgKgyAKYgeAAhQAKhQAAYmuAUqABGo6BaYhaAUhQAAgKAAYgKAAgKgKAAgKYAAgyHCnWKAqUYHMnWCMiCCWh4YAogeAegeAKgUYAUg8hkiMiWhuYhahGg8gJgoAJ").cp().ef());
            stroke.setBounds(0, 0, 263, 280);
            return stroke;
        }(),
        186: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWqAKYgUAUAAAUAUA8YAUAeAKAeAAA8YAABQAAAAgyBQYiWEEtwPei0BaYiWBagKAKgeAyYgnBQAACWAxBaYAoAoAUAACWhGYDShkGuiCHMhuYH0iCIShQHCgoYBkgKBkgKAUAAYBGgeAUgogogoYgUgUgKAAigAKYn+AUw4CgrQCgYgeAAgeAKAAgKYgUgUAygyD6kEYG4m4HCmkCghuYBuhQAKgUgUg8YgUg8h4h4hag8Yh4hQhugTg8Ad").cp().ef());
            stroke.setBounds(0, 0, 313, 224);
            return stroke;
        }(),
        187: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAAYgoAUgUAeAKA8YAUC+AAAegeBkYhGC0h4DwigDwYhaCMiqCqiMBuYiCBagTAyAdBQYAoBQCMB4AyAAYAUAAAegKAUgUYDciWG4iCMgigYEYgyDShGAegyYAAgUAAAAgKgKYgegUAAAAjcAUYmkAyk2AolyBQYlKBGAAAAgUgKYgegKAUgyA8haYD6leFUnMBuiMYBQhkAKgegog8YgogohuhGh4gyYhkgogeAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 230, 194);
            return stroke;
        }(),
        188: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQGAKYgKAKAAAUAKBGYAKAoAAA8AAAUYAACqj6Guj6D6YhuBuiMBkiWBQYgyAeg8AegKAUYgUAeAAAKAAAyYAKCWBkCWBaAAYAUAAA8geA8geYCghQCghGDShGYDchGH0iWC0goYHgh4AKAAAUgUYAegeAAgUgegUYgKgKoIBGtcCCYh4AUhuAKgKAAYgKAAgKgKAAgKYAAgeFUmuDIjwYAygyBahkA8hGYBkhkAUgUAAgeYAAgegygyhGgUYgUgKhQgehGgeYhQgeg8gUAAAAYgKAAgKAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 231, 184);
            return stroke;
        }(),
        189: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOiAAYgUAUAAAUAUBGYAUBGgUA8goBkYhkDSj6EiiqBuYhGAoiCBGhGAUYgeAUgoAUgKAUYgUAeAAAAAAA8YAKCgBQBuBaAAYAUAAAygKAogeYB4gyCCgyCCgoYEOhQLaigEigoYCWgUC+goBGgUYAogUAKgegKgUYgUgUAKAAsgBQYiMAKjIAUhuAKYomA8gKAAAAgUYAAgoIwpOCChkYB4hageg8kEhuYh4gogeAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 242, 151);
            return stroke;
        }(),
        190: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATYAAYgUAUAAAeAKBGYAeB4geB4iCD6YgoBGg8BugoA8YhkCqkOGahQBaYhQBkh4B4huBaYiMBkg8A8AAAeYAABQBGCWAyAyYAoAeAKAABkgoYC0g8E2gyIIgoYBkgKCCgKBGgKYBGAAA8gKAKgKYAegKAUgogKgUYgKgogoAApYgKYpiAAgUAAAAgoYAAgUAyhQCCiqYE2maE2l8EEkYYBGhGA8hQAKgKYAUgygKgogyhGYgyhQiCiCgygeYgygehagJgeAJ").cp().ef());
            stroke.setBounds(0, 0, 177, 233);
            return stroke;
        }(),
        191: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKyAKYgKAKAAAoAKAeYAAAoAKBGAAAoYgKE2j6MWjcF8YgyBkgeAohuCMYgUAUgKAoAAAUYgJBGBjCWAyAAYAUAAAygUAygUYDwh4IIiWEigoYCWgKAegeg8hGYgegehagygeAAYgKAAgeAKgeAKYleBkm4BkgegKYgKAAgKgUAAgKYAAgoC0ngCWlUYDInWBQiWBGhaYA8hGgUgyhuhkYhkhahag8gyAAYgoAAgKAAAAAK").cp().ef());
            stroke.setBounds(0, 0, 147, 231);
            return stroke;
        }(),
        192: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKKAKYgUAUAAAKAUAoYAUBQAAAegKBGYgUCMhaDci0EsYhuDIgyA8huBuYhkBagJAeAJA8YAUBaBaBkAoAAYAKAAAygKAogeYCqhQEYhaC0gUYBGgKA8gKAKgKYAygUAKhGgogKYgUgKhaAKlAAUYjIAUgegKAAgeYAAgoFeoIC+j6YBGhQA8hQAKgKYAKgogog8hkhkYhkhagogehGAAYgoAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 107, 167);
            return stroke;
        }(),
        193: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAKYgKAKAKAUAoBaYBGCMAKAogyC0Yg8EOh4EihaCCYgeAog8BQgyAyYgyAygoAyAAAKYgJAyAnA8BkBGYA8AoAoAAAegeYAegeB4hQBQgoYBagoCqhQDchQYFAh4B4hQhQgUYgygKmkBakYBQYiMAogUAAAAgeYAAgyFKqoB4jIYAegyAUgyAAgKYAAgogygoiCgoYgygUhGgUg8gUYhkgegKAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 136, 168);
            return stroke;
        }(),
        194: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAKYgUAUAAAKAKAoYAeBugUBuhaC+YiMEihkCqh4BkYg8A8geAoAAAeYAAAeA8BuAeAeYAeAeAAAACCgyYBageEOgyC0geYDcgeBGgUAUgUYAUgUAKgKgKgKYgKAAhugKj6AAYi+AAi0AAgKAAYgygKAKgeBuiqYCMjSBkiMBkh4YBuiCAKgUgUgoYgKgoigiWgygeYgygKgyAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 113, 138);
            return stroke;
        }(),
        195: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJ2AKYgKAKAAAUAUBGYAKAoAKA8AAAeYAABuhuEYiCDIYhQBuh4B4hkA8YgeAUgyAegKAUYgeAeAAAAAAAyYAABGAyBkAyAoYAyAyAUgKCMhGYCqhaCCg8EYhaYEYhaC+g8DwhGYDSgyAUgKAKgUYAUgUAAAAgUgKYgKgUgeAAkEAoYx0CqBugUAAgUYAAgoFAocB4iqYAog8AogyAAgKYAKgyg8gojcg8YhagKgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 186, 152);
            return stroke;
        }(),
        196: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AZoAKYgKAKgKAegKAUYgKBQgoAyhaB4YjSEEiCCCmaEsYmuFAi+CCgoAAYgKAAgUAUgKAKYgdA8AJA8BGBuYAeAoAeAeAKAAYAUAAAeAAAygeYCqhGDIhGCWgoYEEhGImh4DcgUYC0gUBGgUAegUYAUgUAAgKgKgUYgKgKgeAAhkAKYleAUnWA8nCBGYi0AogUAAAAgUYAAgUHClKHglUYEOjIDIiCAUAAYAeAAAogyAAgeYAAg8iCi+hQg8Yg8gUgeAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 209, 180);
            return stroke;
        }(),
        197: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVGAKYAAAAgKAUAAAUYgUBQhuCMigCqYiCCChaBQocF8YhQA8hQAogeAUYhGAUgeAUAAAoYAAAoAUA8AyBGYAyA8AKAKBQgoYCWg8E2hkDcgoYDcgyGGg8D6geYBkgKAUgUgegeYgKgUh4AAigAUYhGAAhaAKgoAAYh4AKlyAojmAoYhuAKhkAKAAAAYgUgKDcigHWlAYC+h4DIiCAygeYBkgyAKgKgKg8YgUhQigi0g8AAYgKAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 186, 146);
            return stroke;
        }(),
        198: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APyAKYgUAKAAAUgKA8YgKBagKAog8CWYg8CMhaCWhaB4YjmE2kiFogoAeYgUAKgoAegKAUYgeAeAAAKAAAeYAAAeAKAeAKAKYAeAoBuBaAeAAYAKAAA8geBGgyYCqhuDmhuEihuYAygUAygUAKgKYAegUAAgogUAAYgegUkiBGkEBGYiWAygUAAAAgUYAAgeE2mQDmkOYAygyA8hQAogyYBGhaBGhQBahQYAegeAUgeAAgKYAAgegyhGhGg8YhkhQhagTgoAT").cp().ef());
            stroke.setBounds(0, 0, 137, 183);
            return stroke;
        }(),
        199: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMqAAYgeAUAAAeAeA8YAoBGAABGgoBaYg8CMiqDwjIEOYhuCMhkBuhaA8YhGAygKAyAABaYAABkAyBGAyAAYAAAAAygUAogeYC+huF8igEYhaYCMgyBagUDcgyYBugUAogeAAgeYAAgyhGAAkOAyYiWAUnqB4iCAoYg8AUhGAKAAgUYAAgoHqowDmjmYB4iCAKgKAAgeYgKgogogohGgyYiChaiCgng8AT").cp().ef());
            stroke.setBounds(0, 0, 165, 167);
            return stroke;
        }(),
        200: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKAAKYgUAKAAAoAeBGYA8Cgg8DIjIEYYhkCChkBkhuBQYiCBkgTAeAJA8YAUBGCCCCAyAAYAUAAAogUAygeYCMhaCqhGEOhaYCMgyCqgyBQgUYBGgUBageAogKYBugyBQhahQAAYiCAKn0BklKBkYg8AUg8AKgKAAYgeAAAKgUAyg8YBahuEileBkhuYBkhuAKgKgKgeYgKgygogoiChQYjSh4gogJgoAT").cp().ef());
            stroke.setBounds(0, 0, 163, 148);
            return stroke;
        }(),
        201: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANmAUYgUAKgKAoAAAoYAAAegUAygKAeYgyBuiWCgiWBkYgoAeg8AogeAUYgoAegeAKhGAKYgoAKgyAKgKAKYgoAegyBaAAA8YAAAoAAAUAKAKYAUAeAeAAA8geYAygUAKAAEEAAYCWAADcAAB4AAYDmAKAegKAUgeYAKgogUgKjcgeYkOgejSgogUAAYgygUAogUEEigYCWhQCMhQAUgKYBGgeAegogKgyYgKhQhGh4g8hGYg8gygegJgeAd").cp().ef());
            stroke.setBounds(0, 0, 122, 104);
            return stroke;
        }(),
        202: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgUAUAAAUAUAoYAoAyAoBkAUBGYAKAyAKBGAACWYAADmgKAUg8BuYgoA8gKBQAeBQYAoBkBGBaAyAAYAKAAAygyBGg8YB4h4DIiqEsjwYDmi+B4hkAAgUYAAgUgoAAhGAyYhGAoigBQmuDcYhaAygoAAgegeYgegegKg8AKkOYAKkYAAAAhQg8YhuhahkgTgyAd").cp().ef());
            stroke.setBounds(0, 0, 132, 136);
            return stroke;
        }(),
        203: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgKAUAKAeAUAoYA8BGAUA8AKCWYAKBuAAAegUBaYgUBkgUAygyBQYgUAUgKAeAAAKYAAAeAoBaAUAeYAyAoAegKAyhQYAyhQCqjIBuiCYBahkAKgUgUgKYgKAAg8AohQA8YhQA8g8AogKAAYgUAAAAhkgKjwYAAkEAAAAhkgeYhQgUgyAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 62, 107);
            return stroke;
        }(),
        204: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAUYgeAeAAAAAKA8YAKAeAUBGAKAoYAKAoAUBGAAAoYAKBugoDSgyA8YgeAogUBGAAAoYAABuBkC+A8AAYAKAABGg8BGhQYCWiMDSi0DIigYA8gyA8g8AKgKYAUgegKgUgUAAYgKAAlyCgh4A8YhaAogygKgKhGYgKgeAAgoAUiCYAejmAAAKhQhQYhQhGhQgygUAAYgKAAgUAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 102, 123);
            return stroke;
        }(),
        205: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAKAAAyAAAoYAAAUAUAyAUAeYBGCMAUBkAeD6YAKCgAyFoAeCMYBuJYBkFyCWF8YDcIcDSFUFUFUYCgCgAKAKBuA8YDcB4B4AUBGgyYBGgyAKhQgei0YgUh4gUjwgKi+YAAhagKhQAAgKYgKhQgeAegoBuYhaEihaC0gyAAYgKAAgogKgegUYiqhQk2lAi0kYYj6l8jmrGhaqKYgKhugKhkAAigYAAjwAKhaAoiqYAUhGAAgyAAgUYgUh4lUizhkAd").cp().ef());
            stroke.setBounds(0, 0, 215, 428);
            return stroke;
        }(),
        206: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAAYgTAUAJAeAoBuYBGCCAoB4AKBaYAoEEAKAyBQFAYAoCqBaEOAyB4YBkEYC0EsCgC0YB4CMCWCMBuAyYB4A8B4AoAyAAYAyAAAygUAUgeYAUgoAAhGgUiqYAAhagKiMAAkEYAKlKAAgegUAAYgKgKgKAUgKAoYhaE2huEig8AoYgeAegegKhQgyYhQgojIjIhQh4Yi+kOi0nWg8mGYgeiWAAj6AUiCYAKgyAAgyAAgKYgUhGiqhuiMgoYhagKgKAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 173, 289);
            return stroke;
        }(),
        207: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AKYgoAKgKAUgKAUYAAAoAAAeBGAoYB4BQCMCWB4DIYB4DSDmEsCqC+YFUFoFeD6FUB4YDmBQDIAUAUgoYAUgUgKhGgyhaYgehGgehQhQkOYgUhGgyhGgeAAYgUAAAAAUgKCWYgKCMgUBQgeAUYhkA8lyigj6jmYi0igi0jcigkEYigjwhGiqgUi0YgKhQgegohGgeYhkgyjcgJhkAT").cp().ef());
            stroke.setBounds(0, 0, 247, 212);
            return stroke;
        }(),
        208: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAUYAAAeAABkAeAyYAUAeA8A8AUAAYA8AACMB4BQB4YBQB4AUAoAyEEYBGFeAKCWAAGGYAAFeAABkgoDcYgUCMgyDSgUAoYgoA8g8AAi+gyYhQgUhGgKAAAAYgKAKgKAKAAAUYAAAUAUAeBQBQYAyAyBaBuAyBGYCCC0AeAKBahaYB4huBajmAylAYAeigAUleAAi+YAAlygynChGksYhQlUhQi0iCh4YhkhakiiqhGAAYgKAAgKAAgKAU").cp().ef());
            stroke.setBounds(0, 0, 91, 344);
            return stroke;
        }(),
        209: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHCAAYgUAUAKAUAyAyYBkCMAyCWA8GaYA8HMAeGugKIIYgKFUAABGgUBuYgeDIgoBug8B4Yg8B4goAAkihQYjSg8gKAAgKAKYAAAUAKAeB4BuYBGA8BkBaAyA8YA8A8BGBGAeAeYA8A8AUAKA8goYA8geCWiWAohGYB4jIA8kEAAkiYAAkshaxCg8l8YAAgegKgyAAgUYgKgegKhGgKg8YgUiMgejSAAhGYAAhQgUgehQgoYhGgoi0g8gUAAYgKAAgKAAAAAA").cp().ef());
            stroke.setBounds(0, 0, 109, 373);
            return stroke;
        }(),
        210: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAAAKYAKAKBGA8BaA8YBaA8BuBQAyAoYCWCMB4C0A8CqYBaD6gKFehaFoYgyC0goBQhQAUYgyAUgoAAi+goYhagUhkgUgUAAYhQAAAeA8CCBuYCWBuCMB4BQBaYBaBkAeAKBGgoYAygUBahkAegyYBGiCA8j6AejwYAymkgekih4ksYhQjSgegyh4h4Yigiqiqh4jmhaYhkgegUAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 108, 262);
            return stroke;
        }(),
        211: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAKYgKAUAAAKAoBuYBkD6AoCgAUFAYAKC0AKBGgKB4YgUEOgyC+gyAyYgUAUgKAKgogKYgUAAiCgoh4goYiCgehugoAAAAYgKAAgUAKgKAKYgJAKAJAKB4BuYB4BkCMCWCqC0YAyAyAUAKAeAKYCMAUCMjmAylKYAylegeqUhak2YgoiqhkiMh4hQYhGgegKAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 102, 229);
            return stroke;
        }(),
        212: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFeAAYgUAegKAyAUAeYAKAUAeAyAyAoYBQBGAoBGAeBaYAoC+AKIcgoDIYgeC+AKAAlUgyYhkgUhagKgKAAYgxgKATAoCMCCYDcC+BQBQAyBGYAeAoAeAeAUAKYAyAKA8g8BkigYAyhGAohuAKhkYAUh4gKocgUkEYgKhagojmgKgoYgUgygogyh4hGYiqhuhagdgUAJ").cp().ef());
            stroke.setBounds(0, 0, 90, 208);
            return stroke;
        }(),
        213: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAKYgeAeAKAeA8AyYBkBGAyBaAoCgYBQFKgeFohuA8YgoAegeAAiWgeYiggegKAAAAAKYAAAKAoAyA8A8YA8BGBGBGAeA8YBGBuAeAKA8gKYBQgeCCiCAyhuYA8huAKhGAAjcYAAjSgUiCgyjIYgoiggehGg8gyYhuhaiggng8Ad").cp().ef());
            stroke.setBounds(0, 0, 76, 161);
            return stroke;
        }(),
        214: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACCAKYgUAegUAyAAAyYAAAoAeAoA8AUYAyAUCqCqBGB4YBuCgBGCgAeBuYAoC0geCChQAyYgyAehaAKhQgUYhkgKjIgegyAAYhZAAAxBQC0BkYC0BkCCBkAeAyYA8BaAeAUAyAAYAyAAA8geA8hQYCWi+BQkYgojcYgyjwiMjmkYkYYg8g8g8g8gUgKYgUgKgegUgKgUYg8hQgegUgegUYg8gKgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 104, 187);
            return stroke;
        }(),
        215: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC0AeYgoBQAKAyBaAoYBkAyCgCgA8BuYA8B4AKBugyAoYgeAeiCAAjSg8YhkgUhagUgKAKYgdAKAdAyCMBQYDSB4BaBGBaB4YAyA8BagKBGhGYBuiCAejmgyigYgyiMiCigiqiCYhkhagogogKgeYgUgegegKgygKYgoAAAAAAgUAe").cp().ef());
            stroke.setBounds(0, 0, 87, 123);
            return stroke;
        }(),
        216: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEiAUYgUAKgKAUAKAoYAAAyAKAeA8BaYBQCMA8B4AAAyYAAAogUAogeAKYgKAKhkAAhuAAYiCAKhQAAAAAKYAAAKAeAeCCA8YBkAyCMBQBGAoYBGAoBGAoAKAAYAoAABQhkAUhGYAyighkkYi+jcYgegegog8gKgeYgyhag8gTgoAn").cp().ef());
            stroke.setBounds(0, 0, 79, 104);
            return stroke;
        }(),
        217: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgTAKAJAoA8C+YAeBaA8CgAoBkYBkE2BGCMBkCMYB4CMCgBkDwBaYHMCWKUgoF8i+YCChGCChQAKgeYAUgogohGhkhGYiChuh4hujmjmYiCiChuhkgKAAYgeAAAKAyA8B4YAeA8A8CCAeBaYBGCWAAAUAAAyYAABQgoAehQAeYhkAehQAKi+AKYloAKk2g8i+h4YjSh4igkYh4maYgeiMgogyhGgyYg8gogygJgeAT").cp().ef());
            stroke.setBounds(0, 0, 277, 162);
            return stroke;
        }(),
        218: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYgTAeA7EOBGCqYA8B4AoA8BkBkYCgCqDIBkE2BQYCCAeD6AyB4AKYF8AoCqgKDchQYCMgoBQhGgKg8YgKgUgogygogoYigiqiqjShui0YhQiCgegegUAKYgUAUAABGAKBQYAUBuAoEYAAAoYAAAygUAegoAUYiWBQocgok2h4Yiqg8hagyhuhuYhuhugohGgoiWYgyiWgUgyhGgUYgogKgeAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 247, 123);
            return stroke;
        }(),
        219: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYgTAoBPFABQC0YCMEODwC+FUBuYCCAoE2BGCgAUYF8AyD6gKEEhGYCqgyA8goAUhGYAKgeAAgKgUgeYgUgegogogogoYiMh4jmkYiCi0Yhah4gUgegUAKYgeAKAAAyAeBkYA8DIAoCqAKA8YAeCqhQAologKYm4gUlAhQjmigYi0h4hkiMhGjmYgUhGgeg8gUgUYgogyhQgJgeAT").cp().ef());
            stroke.setBounds(0, 0, 262, 129);
            return stroke;
        }(),
        220: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYgJAoBFC0BaCMYBaCCDcDICCA8YF8CqH+A8DchaYAygeA8gyAAgeYAAgegUgehQhaYiCiCigjSiWjcYgyhGgUgKgKAUYgKAKAUBaAeBkYAyDcAUCMgeAeYgKAUgUAAhaAAYjIAAjmg8iWhGYiMhGiqiWiWjIYhGhQgegJgKAT").cp().ef());
            stroke.setBounds(0, 0, 182, 95);
            return stroke;
        }(),
        221: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAhwAAUYi+A8muBukOAyYkOAyksAomGAyYh4AKhuAUgUAAYg8AegTBuAnA8YAoAoBQgKFehQYJiiMNciWC+AAYBaAAAAAAAoAeYBkBQAUBaA8PUYAUDwAKX6gUBkYgKBugeAygyAeYgyAUiWAAi+geYhagKhGgKgKAAYgeAUAKAoAoAUYAKAUBGAeAyAoYCqBkCqB4BuBkYDSC0A8AABGiMYAohQAehkAUiWYAUiqAAhagUj6YgelUgenCgKkYYgoqegKiMAAk2YgKloAKhGAohkYAKgoAUgyAKgUYAKgogKgKgKgeYgegyhkhQiMhGYhug8gUAAhGAAYg8AAgeAAhQAU").cp().ef());
            stroke.setBounds(0, 0, 287, 412);
            return stroke;
        }(),
        222: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAlCAAKYhkAojSAei+AUYkOAep2Bal8BGYiMAUhuAKhuAKYiqAAgoAKgUAoYgJA8AJBQAyAUYAeAUBagKBQgUYAoAAA8gUAogKYAoAACWgeCMgeYJEhaHWg8GQgeYCqgKAKAAAoAUYBGAeAUA8AeEOYAyGGAUFoAUJYYAKCqAKFAAKDmYAeHMAABQgoBQIgeAyIg8AAYgogKgoAAgKgKYgUAAgKAAAAAUYAAAUBQCMBQBuYAeAyAyBQAeAyYAoBQAoAoAoAAYBaAABQi0AekiYAUhkgKjSgUiqYAAgUgUhagKhQYgekEg8x+gKngYgKjmAAhaAKgUYAKgUAeg8AegoYAegyAUgyAAgKYAAgyhQhQiqhuYi0hkg8gJh4AT").cp().ef());
            stroke.setBounds(0, 0, 302, 395);
            return stroke;
        }(),
        223: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeyAeYmaBun0BaqKA8YlyAoAKAAgeAeYgUAUAAAKAAAyYAAAoAKAUAKAKYAoAeBkAAC+goYFyhQKUhuHCgyYDSgeAeAKA8AyYBGBGAUBuAeHMYAeIIAKD6gKKKYgKNIAABkhGBGIgUAeIhkAAYgygKhkgKhQgKYhGgUhGgKgKAKYgKAAgKAKAAAUYAAAeAKAKAyAeYBaA8DcCqCCCMYCqCgAoAUA8gyYBQhGA8i+AUkEYAKhkAAhagKjSYgUkigUnWgUlKYgKl8gUq8AKiCYAAiWAUg8AohkYAyhuAAgehGg8Ygyg8i0huhQgeYhGgKgyAAiqAe").cp().ef());
            stroke.setBounds(0, 0, 263, 397);
            return stroke;
        }(),
        224: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAj8AAAYh4Aon0B4kOAyYiMAUn+A8nqA8YkOAUAAAKAABQYAAAoAAAUAUAUYA8AyBkAAEig8YGkhaKyh4ISg8YCWgUAeAAA8AoYBGA8AUCCAoKUYAUEEAASIgUDmYgKCqgKA8gyAoYgeAUhuAKiMgUYiggegUAAgUAKYgeAUAeAoBkBGYCCBaCWB4B4BkYCMCMA8AUA8g8YBuiCAyksgemkYAAhkgKiCAAg8YgKg8gKiqAAiWYgeocgKjmAAloYAAmGAAgeAyh4YAohGAAgogegyYgegohkhGh4hGYhagogegKgyAAYgoAAgoAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 284, 362);
            return stroke;
        }(),
        225: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Ac6AAYgyAUkEBGjmA8YjwAyjmAomuBGYlyA8AAAAgUAeYgUAeAABaAKAeYAKAeBGAACWgoYGahkGGhQHWhQYFAgyAKgKAyAeYBQAoAKBQAKHCYAUHggeNIgeBuYgKAygoAegyAKYgyAKiWgKhugUYhkgUgeAKAAAeYAAAUAUAKBGAoYCCBQDcCWBuBkYB4BaAoAUAogeYA8goAyiCAUi+YAUhuAAgogUmQYgUpYgUpYAKhaYAKh4AKg8AohQYAKgoAUgyAAgKYAAgyhahQiMhGYhugygegKgyAAYgeAAgoAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 235, 284);
            return stroke;
        }(),
        226: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AU8AoYjcBGlKBQlAAyYmGBGgeAKgeAUYgdAoAJBQAyAeYAeAUCMgeEYhGYGkhkEsgyCCAAYAyAKAUAAAoAeYBGAyAKAUAKDwYAKDwgKMCgUEEYgKDmgeEEgoD6YgoDSgKAohQEOYhGEEgoBGhGBQYg8A8goAAjShaYiCgygogKgKAUYgKAeAeAoBuBuYA8A8BQBaAyA8YBuCgAKAKA8AeYA8AeAeAAAogeYA8goBujcBQj6YCqpEBkqoAes0YAesgAAgKAUhaYAKgyAehQAKgeYAUgoAKgyAAgKYAAgehkhaiChaYjIiBAKAAjIA7").cp().ef());
            stroke.setBounds(0, 0, 197, 410);
            return stroke;
        }(),
        227: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATEAeYksBanCBalyAeYhkAKgJAKATAyYAUAoAoAeBQAoYBQAoAygKDmgyYDSg8EEg8CWgUYBugUAoAKAyAoYBQBGAUBQAeHWYAUF8AUJOgKHWYgKH0gKGagUBQYgeC0hGAKmGh4YiWgogUAAAAAyYAAAKAUAeBQAyYCqCCDICqB4BkYBuBuBGAoAogKYBGgeBGiWAojmYAUiMAAj6geoSYgowGgUwQAeiCYAKgeAUgyAKgeYAohaAKgUgegyYgohkkYiWh4AAYgKAAg8AKhGAU").cp().ef());
            stroke.setBounds(0, 0, 183, 406);
            return stroke;
        }(),
        228: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYOAKYj6B4piCCn0AyYiCAUgoAKgKAeYgdBQAnA8BuAAYAyAAC0gUBugUYAogKC0geC0geYCqgeDSgoBQgKYDSgoBaAKAoBaYBQC0AyIIAAKoYgKIIgeKygeA8YAAAUgUAKgUAKYgeAUg8gUiCg8YhQgogUAAAAAKYgKAUAyBaBQBkYBuCCCMDIAoBGYAUAeAeAoAKAKYBaBQBuh4BGjmYAoiMAKhugKi0YgKhagKhuAAgoYgemkgKkYgKkEYAAhQgKiqAAiCYgKiCgKjcAAigYgKlAAKgeBGh4YAohQAKgUgogyYgygyiWhaiChGYiCgygygJhGAT").cp().ef());
            stroke.setBounds(0, 0, 216, 370);
            return stroke;
        }(),
        229: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAKYj6BGksA8jIAUYh3AKgKAKA7BGYBkBkBkAUCMgoYDmhGCWgoAyAAYBaAKAyBGAeCMYAyEsAUP8goNmYgKEsgKAygyAyYgeAUAAAKhkAAYhQgKhGAAhugUYiWgegeAAAAAeYgKAeAeAeAeAKYA8AUEsDIC0CMYCMBuAoAUAogUYA8gUAyhkAeigYAeh4AAlKgenqYgepsgKjwAAnCYgKngAKgyAyh4YA8hugKgeg8g8YhQhQi+huhQAAYgUAAgyAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 138, 359);
            return stroke;
        }(),
        230: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQuAAYgKAAg8AehGAeYiWBQhQAehuAUYiCAeksAohGAAYgoAAgUAKgKAKYgUAeAAA8AKAoYAUAUAAAKA8gKYAeAAA8gKAegKYAogKCggeC0goYCqgoCqgeAogKYBagUAAAAAeAeYAoAoAKBaAeF8YAyN6AAJigyB4YgUAoAAAAgyAAYgUAAhkgKhQgeYiggog8AAgKAUYAAAKAoAoA8AyYBkBaCqCqBkBkYAyAyAUAUAeAKYBGAUAUgKA8hkYCWjcAKg8gomGYgUlegKh4gUm4YgoqyAKhuA8iCYAohQgKgehQg8YgygoighQg8gUYgoAAgoAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 155, 293);
            return stroke;
        }(),
        231: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAsiAAUYh4AekiAyl8AoYm4AomGA8lKBQYigAeiqAoj6AoYjcAegeAKgoAeYgeAegJBGATAyYAeBQBGAADchQYA8gUBageA8gKYEEg8OYiWEEgUYD6gUFUgeCggKYDSgKAUAAAeBGYAUAyAKC0gUFAYgUKAhGHqhaFKYgeCChGA8hkgKYgUAAhagUhkgUYjmgoAUAAAAAeYgKAoAeAUCWCMYCgCCBaBkBQBkYBGBuAeAKBGgoYBagyCMkEBGkEYAyjSAejmAooIYAKhQAKjcAKjIYAenqAKhkA8hkYBGh4AAAAgKgUYgegeiChah4g8YiqhPgeAAiWAd").cp().ef());
            stroke.setBounds(0, 0, 349, 314);
            return stroke;
        }(),
        232: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAtKAAUYhQAUhaAUleAoYqKBQkOAoksA8YiCAUksA8jwAoYmuBGAAAAgeAeYgdAyAJBaAoBGYAUAeA8gKBagoYBugoDShGCWgeYIShuDSgoImg8YG4g8BGAAC+gKYDIgKAeAKA8BGYAyA8AKA8AKCgYAKDcgKC+hGHgYhGISgUBkgeAoYgeAUgyAAgygoYgygegeAAAAAUYAAAKAeA8AUA8YAeBGAeBGAAAUYAyCCBQBaBGAAYAyAABah4AyiWYAyiWAyjmAej6YAKhuAek2AKhGYAenCAoi+BGhuYA8hagUg8iMiMYiWiMighahQAAYgKAAgeAAgeAU").cp().ef());
            stroke.setBounds(0, 0, 349, 267);
            return stroke;
        }(),
        233: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAoeAAAYgKAAhGAUg8AUYlKBun+B4kEAoYiCAKjmAehuAKYgyAAhQAKhGAAYiMAKjcAUigAKYg8AAg8AKgKAAYgeAUgJCMAdAyYAKAUAUAKAUAAYAUAACggUCqgoYFog8DcgoFogyYCMgUCqgeBQgKYIwhkCggKBaAoYBQAoAoBugKDSYgUGkgoF8haGuYgoDSgKAogeAUYgeAKgUgKhag8Yhag8gogKgKAUYgKAoDmImA8BQYAeAoAeAKAogUYAygeAUgeA8h4YB4j6BGkYAelAYAAgeAUiMAKiCYAUiMAUi0AKhaYAekiAeiMBaiCYBQh4AKgogygyYgyg8h4hGiMhGYhkgygegKgyAAYgoAAgeAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 320, 279);
            return stroke;
        }(),
        234: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAvWAAUYhuAej6AokOAUYqoBGksAomkBQYhuAekEAojIAeYjIAeiqAogUAAYgoAegJBaAnA8YAUAeAKAAAoAAYA8AAC0geBQgeYBageCCgUFyg8YMqiCEYgeJigoYFKgUAoAAAeAUYAoAeAKAUgKCMYAAIchaIShkBkYgyA8geAKi0geYhQgKhagKgKgKYgogKgUAKAKAeYAAAoAeAoBkBuYBaBuB4CgAeA8YAeA8AoAoAeAAYAyAABGhQBaiMYBui+BQkiCCraYAeiqAeiqAUgoYAKgeAeg8AUgoYAegoAUgoAAgKYAAgoiMhui+hkYhugyg8gJiCAd").cp().ef());
            stroke.setBounds(0, 0, 367, 234);
            return stroke;
        }(),
        235: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAqgAAKYhuAeh4AUl8AoYpiAyk2Ayl8BGYjSAojSAojIAeYg8AAg8AUgUAAYgeAUgUAoAAAyYAABQA8AUCWgoYEEhGA8gKGQg8YGGg8FygoCggKYBQAADcgUC+gKYC+gKCqgKAKAKYAyAKAeAoAKBGYAeCCAUFygKEsYAAG4geB4huAyIgyAUIiqgUYlKgogKAAAeA8YAUAeAeAeB4BkYCqCCCCB4BGBQYBGBaAUAKAygUYBQgoBujmAojmYAoi0AomuAKl8YAKj6AKigAUg8YAKgeAUgyAUgeYAUgeAUgeAAgKYAAgoh4hQiMhQYigg8gygJhuAT").cp().ef());
            stroke.setBounds(0, 0, 330, 242);
            return stroke;
        }(),
        236: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAmmAAKYhkAejSAei0AKYpEAyjwAemGBGYkYAykOAoh4AKYhaAKgTAKAJAeYAKAKAoAeAyAeYBkBQAUAACWgeYCggyBQgKE2gyYJOhQDSgUImgeYEOgKAUAAAKA8YAeBQhGHgg8DwYhGEshGAyjchQYjIhGh4gegKAAYgKAKAAAKAUAoYAKAeAoA8BGBQYCMCqBQBuA8B4YAoBaAKAKAeAAYAeAKAygeA8hGYCqjIBGi0DSrkYBGj6AehaBGhQYAUgeAUgeAAgKYAAgUgUgegogeYhGhGjciMgygUYgyAAg8AAhaAK").cp().ef());
            stroke.setBounds(0, 0, 308, 202);
            return stroke;
        }(),
        237: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Af4AKYgoAKjIAohuAKYm4A8ngBGigAoYhkAUkOA8huAKYhGAKg8AUAAAeYAAAeAUAeBaAoYBkAyBGAAB4goYFUiCMCiMGGgKYCCAAAAAAAeAeYAUAUAKAKAAAeYgKA8gyDwgoB4YgeBagUAegeAAYgUAAjmhQhugyYg8gegyAAAAAUYAAAKA8BGA8BQYCMCMB4CgAyBaYAUAoAeAeAKAAYAyAKBkhaAohkYAUgoA8igAyiWYBakYAKgeBkhuYAUgeAKgeAAgKYAAgohGhGiChkYiMhkgegJhGAT").cp().ef());
            stroke.setBounds(0, 0, 249, 134);
            return stroke;
        }(),
        238: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAj8AAKYgUAAgyAegoAUYh4Ayi+A8l8BQYl8BQhGAUhGAKYiqAeksAojcAKYjIAUgoAAgUAUYgUAKgKAUAAAKYAAAeAyAyBuAyYCCBGAeAADcg8YImigNci0DwgKYBkgKAKAAAUAUYA8AyAKBug8EEYhGFohGD6hkC+YhaC+hGBGhkAAYgoAAiqgyiChGYgygUgygUgKAAYhGAAAoBGCMCCYBuBaBQBkB4CCYA8BQAoAeAygKYBkgKDmjwBai0YBQigBaleBaoIYAojwAohuBQhuYAegeAKgeAAgUYAAgohahGjIhkYhkgyhQgJg8AT").cp().ef());
            stroke.setBounds(0, 0, 284, 227);
            return stroke;
        }(),
        239: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAhmAAAYgKAKjwAyjIAoYhaAKiMAehGAKYhGAKiMAehkAUYhkAKi0AoiCAUYh4AUi+AohuAUYhkAUhkAUgUAKYgoAUgJA8AJAyYAeBQBaAADIhGYDIg8Eig8ImhaYF8hGB4gKBaAAYBkAAAyAUAyBGYA8BkAAAUhaGuYhaHMg8DSgyBGIgeAyIgogUYgygegoAAgKAeYAAAUBQCqA8BGYAyA8BaBGAeAAYAoAABQhaAehaYAyh4Bal8BGloYA8kYAKgeAohaYAeg8Aog8AegeYBQhaAKgegegyYgeg8kijIhQgeYgygKhQAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 271, 206);
            return stroke;
        }(),
        240: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdiAUYiCAen0BujwAoYhuAUiCAUgoAKYgyAKigAoiqAeYigAeiMAegUAAYgoAUgJBuAdAyYAoAeAoAACWgyYC+g8DcgyF8hQYGahQEYgyBQAAYBkAABQBQAABkYAAAyhGFAhGDmYgyCggoBagUAKYgKAAgegKgegUYhGgegeAAAAAoYAAAeBkDIA8A8YCWDIBQg8CMmuYAohkAyiqAeh4YBQj6Aeg8B4iCYAygyAKgogogyYgog8jSighkgoYg8gUgoAAiCAU").cp().ef());
            stroke.setBounds(0, 0, 250, 166);
            return stroke;
        }(),
        241: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AcwAUYp2C+kYAyq8AyYi+AUgUAAgUAeYgJAoAJAyAyAyYAoAeAKAAAyAAYAeAAAoAAAUAAYAegKB4gUCCgeYB4gUCMgUAogKYBQgUJOhaC+geYDIgeA8AeAUCWYAKCWhGK8goA8YgUAehGgUgygoYgogegUgKgUAKYgyAAAAAoAyBuYAeAyAyBuAoBaYBGCgAeA8AoAAYAyAAAogoAyhuYBai0AehkAyl8YAUiqAei+AKgyYAUhkAyhuA8hQYA8hQAAgeg8g8Yg8gyiChQhkg8YhkgegygJh4Ad").cp().ef());
            stroke.setBounds(0, 0, 245, 191);
            return stroke;
        }(),
        242: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AccAUYi+BamGBknCBQYj6AogoAKjSAUYhkAKhuAKgUAKYg8AKgTA8AnAoYAKAKAeAKBuAAYCCAAAKAAFohGYDSgyEsg8CggeYFehGBkgKBaAoYA8AUAKAeAUCCYAoDwAAHggeH+YAACWgKAygKAeYgeAogoAAiCg8YhkgygeAAAAAUYAAAKAyBGAyBGYA8BQBQB4AoBGYCCC+AAAKAeAKYBkAyCCjSAokEYAAhGAAhGgKj6YgemkgepOAKhkYAAhaAehQAog8YAogogKgehGhGYgygygygehugyYiqhGgogJhGAd").cp().ef());
            stroke.setBounds(0, 0, 238, 251);
            return stroke;
        }(),
        243: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AcwAKYgeAKhkAehkAeYm4CCkiA8qAAyYiWAUg8AAgKAUYgUAUAAA8AAA8YAUBGAKAKBagUYAoAABQgUA8gKYBGgKCMgUB4geYD6goEigyFUg8YDSgeA8AAAeAAYA8AUAeAUAUBGYAKAoAAAoAADcYAACMgKCMAAAeYgUCqgoD6gUB4YgKAKgKAUgKAKYgUAKgKAAgogKYgegUgogUgegeYgygogegKgKAUYgKAUB4EiBQC0YBaCqAUAeAygKYAogKAogyAohQYBai+Aoi0AejcYAKhQAKhkAAgoYAKgoAAgyAKgeYAomQAKgyA8iCYAUgyAogyAUgeYAyhGAAgog8gyYg8g8huhGh4gyYhugyhGgJhaAT").cp().ef());
            stroke.setBounds(0, 0, 245, 218);
            return stroke;
        }(),
        244: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Ad2AeYiMBQomBunMAyYmaAyksAegKAUYgoAUAAAyAAAoYAKAeAoAKCCAAYBkAAA8gKC0geYBugeDSgeCMgeYCMgUCMgUAegKYBQgKGQgyBGAAYAoAAAeAKAUAKYBGAeAAAAAAHWIAAGkIgUAyYgUAogUAKgeAUYgyAUgeAAiWgeYiMgUgyAAgKAUYgUAeAeAUCqB4YBaA8CCBQAyAyYA8AoA8AoAKAAYAyAKA8gyA8huYA8h4AAgUAAoSYAAmuAAg8AUhQYAUiCAAgUhahQYhahQhuhGgeAAYgUAAgoAKgoAU").cp().ef());
            stroke.setBounds(0, 0, 233, 178);
            return stroke;
        }(),
        245: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfQAAYgKAKleA8jSAUYjSAUjmAoocBQYhuAKiCAUg8AKYiCAKgUAUAABGYAAAoAAAKAeAUYAUAeAKAAA8gKYAoAAB4gUBugUYFehGNShuC0AAYBuAAA8AUAeBGYAeA8AAAKhGEsYgyDwgeBkgoAoYgUAegKAAgogUYgeAAgKAAgKAAYgKAKAyCgAeAyYA8BaBaA8AogKYBagUAyiCCWnqYAyi+AohQBQhaYAegeAegoAKgKYAUgogUgogygyYg8hGiWhuhGgeYgogUhkgKgKAA").cp().ef());
            stroke.setBounds(0, 0, 250, 146);
            return stroke;
        }(),
        246: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYsAAYhGAUnMBGkYAeYhGAKh4AKhGAKYiCAUiqAeh4AKYhaAKAAAAAAAyYAAAeAKAUAUAUYAeAeAyAACqgeYFAhGKyhkCqAAYBuAAAyAUAKAoYAKAehGDmgeAeYgUAegeAKgeAAYgeAAAAAAAKAeYAKBQAUAeAeAyYAoA8AKAKAogKYAygKAegyCqkiYAUgeAogyAegeYBGhGAAgegyg8Ygyg8iChugygKYgogKgyAAgyAA").cp().ef());
            stroke.setBounds(0, 0, 199, 82);
            return stroke;
        }(),
        247: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUAAeYjmBuoIB4muAoYhQAKgdAUAJAeYAKAeB4A8A8AUYAoAKAKAABGgUYE2hkImiCBaAAYBQAAAKA8geDIYgoFAhGC0haBGYg8Aog8AAiMgoYh4gogUAAgKAKYgKAUAUAoBaBaYAyAyA8BGAeAoYBaB4AKAKAoAAYAyAAB4haBQhuYAegeA8h4AehQYAUhQBGkOAeiCYAeiWAehGA8hGYBGhagegei+hkYiMg7geAAhkAn").cp().ef());
            stroke.setBounds(0, 0, 174, 148);
            return stroke;
        }(),
        248: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbqAAYgUAKloBGvKCgYm3BQATgKAABQYAAAeAAAoAKAKYAUAeAAAABGgKYAyAAB4gUB4geYD6gyC+geEYgoYFygyBugKAyAUYAoAUA8BGAeBGYAoBQAAAohGH0YhQKUhGFAg8BGIgeAoIhGgUYgegKgoAAAAAAYgKAAAUAyAoBGYBQCMCgCWA8AAYAeAAA8hGAegyYA8iMBkowBGqeYAUiMAUiCAKgeYAUhaAyhaBGhkYAogyAegyAAgKYAAgegegogygoYgygyi+iChGgeYgygUhkgKgKAA").cp().ef());
            stroke.setBounds(0, 0, 233, 253);
            return stroke;
        }(),
        249: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbCAKYhaAejIAykYAyYj6AyowCCjmBGYgyAUg8AUAAAKYgKAeAAA8AUAUYAKAUAKAAAyAAYAegKBGgUBGgUYBkgeFyhkDwgoYAogKDIgeC0geYGGgyAAAAAUA8YAeBGAKDSAAF8YAAF8gKCMgeDwYgeCWgUA8g8AUIgoAeIi+geYhugUhQAAgKAAYgUAUAeAyCgCMYBkBQBaBkAeAeYCCCgAUAKBGhGYAygyBQigAehuYA8jcAUjmAUq8YAKo6AAgoA8haYAKgeAUgeAAgKYAAgUiChah4gyYh4gog8gJhGAT").cp().ef());
            stroke.setBounds(0, 0, 223, 249);
            return stroke;
        }(),
        250: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAiiAA8Yo6C+rkB4psAKYjmAAgeAKgKAKYgTAoATA8BaBGYCMBuAyAAEihGYJsiWPeiqCCAUYBQAUAUAyAACMYAACMgyGGgyEsYhQG4iqHMhuBuYhGBGgeAAkEhaYjchGgygKAAAeYAAAUAUAeBuCCYBkBuCWDIAeA8YAoA8AeAUBGgKYBQgKA8geBGhGYBkhaBQh4BGiMYCglKBQloBaqyYAUiWAUigAKgeYAUhuAyhuA8haYAog8AUgoAAgeYAKgoAAAAhGg8YgygygogehkgyYi0hPgKAAkEBP").cp().ef());
            stroke.setBounds(0, 0, 292, 292);
            return stroke;
        }(),
        251: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeAAKYhkAemGBQjcAyYloBGnWBGjmAKYiMAKgKAKAAAyYAAAUAUAKA8AeYCqBQBkAADSgyYEYhGMWiMCqAAYCggKA8AeAoCCYAoBuAKBugUFKYgKEYAABugUD6YgUDwgoEEgoDIYhGE2hkE2g8BkYhaB4gyAAlohuYkihagygKAAAoYAAAUAoAoCgB4YCMB4C+C0A8BaYB4CgBGAACCiCYCgigCWkYBGksYA8jIBGowAyoIYAelKAKjcAKhaYAKjwAoiCBaiMYAog8AAgegegyYgeg8iChGi0hGYgygUg8gegUgKYgygKgyAAhGAK").cp().ef());
            stroke.setBounds(0, 0, 259, 368);
            return stroke;
        }(),
        252: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXcAKYhkAoqUCWksAoYiCAUi0AUhaAKYgUAAgUAAAAAKYAAAUBkA8BGAKYBuAUCMgKJEhaYCWgUC0gUBGAAYCCgKAKAAAUAUYAoAoAKBGAAFyYAAI6gyE2iMEOYg8CCgUAUhkgKYgoAAhagUhGgUYhGgUg8gUgKAAYgKgKgKAKAAAKYgKAKAUAeAyAoYBaBkBQB4A8BkYBQCMAyAeBQgyYA8geBuhkAog8YBah4BkjcAojIYAoiWA8nqAomQYAKhkAKhaAKgeYAKgeAegyAegoYAegoAegoAAgKYAKgogegehag8Yi0iCjmhFhkAn").cp().ef());
            stroke.setBounds(0, 0, 213, 253);
            return stroke;
        }(),
        253: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AS6AKYgUAKiWAoigAoYigAokEA8iWAoYiqAoh4AogKAKYgTAUAJBaAeAyYAeAoAyAeAeAAYAKAABGgeBGgeYBQgeB4gyBQgUYCWgyFohkAeAAYAeAAA8AoAeAoYAUAoAAAUAACCYAACMgeDmgeDSYgoDSgoDcgKAoYgeBGgoAAjwgoYiqgegeAAAKAoYAKAoAeAoBaBGYBuBaCCCMA8BaYBuCqBQgoCMkYYBujmAKgyAUlyYAKigAKjIAAhGYAKhGAKh4AAg8YAUiMAKg8Ayg8YAyhGAAgUhQhQYgegehGgygygeYhGgygUgKgyAAYgeAAgeAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 166, 219);
            return stroke;
        }(),
        254: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXwAKYgUAAhGAeg8AeYiqBGjwBQiqAoYj6A8kEAoiCAKYhkAKgeAAgKAUYgTAUAJAoA8AoYBuBQBaAKBkgoYCgg8JOigC+geYDcgoAKAKgKEYYgKC+AAAKgeEEYgoEsgyDchQDcYhGDchGBahGAUYgyAKgogKjchQYkYhagKAKC0C+YBkB4CqDIAeAyYAUA8AoAUA8gKYBGgKAygeBQhGYDmjcCWnCBasgYAymQAUhQBuiqYAUgeAKgoAAgUYAAgohahQh4g8YhugyhGgJhGAT").cp().ef());
            stroke.setBounds(0, 0, 199, 256);
            return stroke;
        }(),
        255: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AV4A8YmaCCmGBGmaAUYiqAKgUAKAAAeYAAAeA8A8BGAeYBGAoA8AACCgeYF8hkJEhuCMAAYBGAAAKAKAACCYAKDIg8GuhGDSYgyC0gyBugyAoIgeAyIhGgKYgoAAg8gUhagoYiqhGgegKgUAKYgUAAAKAUBuCWYAyA8BGBuAoA8YBkCgAAAAAoAKYBuAUCWh4BujmYBujSBQkiBGngYAejIAohuBGhkYAUgUAUgoAAgUYAKgogKAAgogyYgygoiChQg8gUYhGgTgoAJjSA8").cp().ef());
            stroke.setBounds(0, 0, 201, 205);
            return stroke;
        }(),
        256: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQQAyYiqA8jSA8iCAUYhuAek2AygyAAYhFAAgKAUAxA8YAoAoA8AeA8AKYA8AKCMgUCqg8YISiWAygKBQAeYBGAeAUBkgKEEYgUISgeGagoDwYgeC0g8EEgeBkYgyCggUAyhGAAYgyAAkYg8gogUYgegUgeAAgKAUYgKAUHMHCAeAKYAoAKAegKA8gyYBQg8BahkAohaYBGiWAyj6AelAYAKh4AKhuAAgeYAAgeAKi+AAi+YAUnCAKkEAUhQYAKgoAUgyAUgeYA8hkAAgyhQg8YhahGi+hGhQAAYgUAAhaAUhQAe").cp().ef());
            stroke.setBounds(0, 0, 166, 296);
            return stroke;
        }(),
        257: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APyAKYh4A8i+A8lKBQYi+AyigAygKAAYgKAUAAAyAUAUYAUAUAKAKAygKYAeAABkgUBageYFUhQEOgyBaAUYAoAAAeAUAKAyYAeBGAUH+AAG4YAAHCgKCqgeAyYgeA8gyAKiggoYiggegKAAAAAUYAAAUAoAoBaBaYA8A8BaBkAoAoYB4CgBGAKBQiCYBah4BGi0AUiCYAUhugKkihGtIYAAhQgKhkAKgoYAKhQAehuAegyYAKgeAKgeAAgKYAAg8h4hQi0hGYhkgUgeAAg8AK").cp().ef());
            stroke.setBounds(0, 0, 151, 253);
            return stroke;
        }(),
        258: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALQA8YigBahGAejwA8Yh4AUhuAogKAAYgKAUAABGAKAUYAeAUBugUGkiCYEEhaAAAKAUAKYAoAeAUEEAKJYYAKF8gKCqgeA8IgUAoIh4AAYhGAAhagKgeAAYgygKgeAAAAAUYAAAAAoAoA8AyYAyAoBkBaBGBGYCqCqAoAKA8hkYCCi+AUhagKjIYgKgygKhaAAgoYgenCgKjIAAjIIAAjwIAeg8YAohuAAgUgogoYhGg8i0hQhGAAYgUAAgyAUhGAo").cp().ef());
            stroke.setBounds(0, 0, 122, 219);
            return stroke;
        }(),
        259: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUKAUYiMBGlKBajmAeYg8AKhaAUgyAKYgoAKhkAKhGAAYh4AKgKAKgeAKYgUAeAAAyAAAeYAUAeAKAAAoAKYAyAKAygKEEgyYBGgKCqgeCggeYCggUCggeAogKYBagUBGAKAoAoYAUAUAUBQAUCWYAUCgAAMMgUDmYgUDcgKAKhQgKYgoAAgegKgygeYhGgygygKgKAUYAAAUAyBaCCCqYA8BQBGBuAeAyYA8BaAoAoAeAAYBuAAB4jwAUjwYAAgogKi0gKiqYgoo6gKnWAKhGYAKgyAehGAohGYAegogKgegogoYhQhQkiiWg8AAYgUAAgoAKgeAK").cp().ef());
            stroke.setBounds(0, 0, 186, 252);
            return stroke;
        }(),
        260: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AScAAYgKAAg8AegyAUYjwBki0AylyAyYjSAegeAAgUAUYgKAoAAAoAUAUYAoAeBagKGkhkYGGhQBGgUBaAKYBkAAAKAAAUBkYAUB4AKCWAAEOYAAEOgKDSgUAyYgKAeAAAAgUAAYgogKAAAAAAAUYgKAoC0EEAeAKYAoAKAegeAyhGYBaiMAUhGgUiCYAAgogKi0AAigYgKl8AKhGA8h4YAUgyAUgyAAgKYAAgyhkhQi0haYhkgogoAAhQAA").cp().ef());
            stroke.setBounds(0, 0, 169, 176);
            return stroke;
        }(),
        261: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AN6AKYgeAKhaAohQAeYiWBGiqAojIAoYiMAegUAKgKAyYAAAUAAAUAKAUYAKAeAKAAAyAAYA8AAAoAAF8huYEOhGAygKAeAKYAKAKAKAeAUAeYAUAyAKAUAAC+YAKDIgKGGgUDIYAAAygKBkgKBGYAAA8gUBGAAAUYgUAoAAAAgogKYgeAAgegUgUgKYgygUgUAAAAAeYAAAoAeBQAUAyYAoBQB4DSAeAUYAyA8A8gyA8igYBakEAUiWAKqAYAKowAAAoBujcYAKgUAKgUAAgKYAAg8hkhGighGYhugegygJhGAT").cp().ef());
            stroke.setBounds(0, 0, 139, 225);
            return stroke;
        }(),
        262: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AI6AyYiMA8h4AoiWAoYiMAogUAKAAA8YAAAoAUAeAyAAYAUAABGgUA8gKYGkh4AegKAyAyYA8BGAKBaAAJiYAAJ2geJEgeAyYgKAUgUAAgUgKYgKgKgUgKgUAAYgegKgKAAAAAKYgUAoDcF8A8AoYAUAKAKAAAUgUYA8geA8iCAeiMYAUhQAAgegKlAYgKi+gKmQAAksYgKpsAKg8A8iCYAUgoAUgyAAgKYAAgegogog8geYhQgojIg8gyAAYgKAAhGAUg8Ae").cp().ef());
            stroke.setBounds(0, 0, 114, 275);
            return stroke;
        }(),
        263: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKyAAYgeAKgyAUgeAKYhuAohaAeiqAyYi+AogUAUAAAyYAAAeAeAoAoAAYAUAAA8gKAygUYDchGDwgoA8AUYAoAUAKAoAAH0YAAGkgKAygKAeYgUAegKAKgUAAYgUAAgegKgKAAYgygoAAAeA8B4YBkCqAyBaAUAoYAUAoA8A8AUAAYAAAAAUgKAUgUYAogoAohuAUh4YAKhGAAjIgKiqYAAhGgKigAAiMYgUkOAKg8AehuYAKgeAAgeAAgUYgKgog8g8hagyYhagogyAAhaAA").cp().ef());
            stroke.setBounds(0, 0, 109, 183);
            return stroke;
        }(),
        264: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASwAUYgyAKhaAUg8AKYi+AopiCChkAeYhaAUgKAUAAAyYAABGAyAKCCgoYAogKBQgUBGgUYDIgyH+hkBQAAYA8AAAeAUAeAyYAUAyAAAUgoDcYgoDcgoCWgeAoYgUAegKAAgyAAIgyAAIAKAoYAUBQCWCgA8AAYBQAAAyh4BumuYAyjSAehGBQhkYAegeAUgoAAgKYAAgog8g8h4hQYiWhZgeAAiWAd").cp().ef());
            stroke.setBounds(0, 0, 171, 128);
            return stroke;
        }(),
        265: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIwAUYhkAyiqBGiCAoYhGAUhGAegKAKYgKAUAAAeAKAUYAeAeBQgUC0g8YDwhkAyAAAeAyYAUAeAABugUGaYgUFeAAAKgygUYgUgKgKAAgKAKYgKAUA8BuAyAoYBGA8AygUA8iCYAegyAAgKAKi0YAKmQAUiMA8iCYAUgeAKgoAAgUYAAgogogohug8YhugogogJhaAd").cp().ef());
            stroke.setBounds(0, 0, 96, 131);
            return stroke;
        }(),
        266: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMAKYgyAUi0AolKBaYmaBuhQAUgeAoYgKAKgKAeAAAKYAAAoAUAoAeAAYAUAAB4geDchGYDcg8FKhQBGAAYAyAAAKAAAUAeYAKAKAUAeAKAeYAKAegKAegoDwYg8EYgyC+gUAoYgeAogoAUgogKYgegUgKAKAUAyYAeBaCMCgA8AAYAeAAAyg8AohaYAehaBGjwA8kOYAojIAUgyBQhkYAegyAegoAAgKYAAgyhGg8iWhkYhkg8hQgJg8AT").cp().ef());
            stroke.setBounds(0, 0, 156, 147);
            return stroke;
        }(),
        267: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIIAUYhaAei0AoiCAKYg8AKgyAKAAAKYgTAKAJAeAoAoYA8A8BQAADSgoYB4gUAyAUAABGYAAAogoEYgoEEYgUB4geAogogUYhGgeAAAUAyBuYAUA8AUAoAeAeYA8BGAygKBahkYBGhQAUgoAeiqYAoj6AohuBQhuYBaiCAKgUgeg8Ygegyi+igg8geYgoAAg8AAhaAU").cp().ef());
            stroke.setBounds(0, 0, 101, 130);
            return stroke;
        }(),
        268: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARCAAYgUAKhkAUhuAeYh4AUiMAohGAKYg8AUiMAehuAeYhuAUhkAeAAAKYgTAUAJBQAeAUYAyAoCWgKCMgyYBQgeDwhGCqgoYB4gUAUgKAoAKYAyAUAKAUAABuYAACghGHCgoAoYgeAogeAAiggoYhagUg8gKgKAAYgUAUAoAyBaBaYA8AyBGBQAeAyYBkCCAAAAAeAAYAeAAA8gyA8hkYBGhuAehkAUjIYAKhaAUhuAKg8YAKgyAKhQAKgyYAKhkAUgoAogyYAKgKAKgeAAgKYAAgUgyg8hQgyYhuhQg8gJgyAJ").cp().ef());
            stroke.setBounds(0, 0, 145, 146);
            return stroke;
        }(),
        269: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APKAeYhkAylyBkkiAyYigAegoAKgKAoYAAAoAKBGAeAUYAUAUAKAABQgKYAogKBagUA8gUYEEhQFohQAoAUYAeAKAKAogKCMYgeE2g8CWhuAyYg8AogygKiWhGYhug8gegKgKAKYgUAUAKAeBaBuYBaBkBGBaAoBQYAoBGAeAeAeAAYAoAABuhGA8hGYBkhuA8iWBklUYAyjIAehaAyg8YBahkgKgUjwiCYiMg7geAAhkAn").cp().ef());
            stroke.setBounds(0, 0, 146, 140);
            return stroke;
        }(),
        270: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMMAKYgUAKgUAKgKAKYgoAojcBakYBaYhQAUhGAegUAKYgKAKgKAUAAAUYAAAeAAAKAUAUYAUAUAKAAA8AAYAyAAAoAAA8gUYDwhaDwhQAUAKYAKAAAUAUAKAeYAKAoAKAoAACgYgKGGg8DmhuAyYgyAUgUAAh4goYiWgygKAeCMCgYAyA8A8BQAeAyYBGBaAoAeAygKYAogKB4iCAyhaYBaigAojmAenMYAKigAUhaAohQYAUgoAKgoAAgKYAAgehGgoiWgyYhugegoAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 121, 166);
            return stroke;
        }(),
        271: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAKYgUAUgKAeAUAeYAeAyCqA8CgAeYBuAUF8AUBGgKYCMgUA8BQgoCqYgKAogoCMgeCCYigJsiMFKiWCMYh4BugeAAmkiqYhGgUhGgegUAAYgnAAATAoBQBaYCWCWCgC+BGBuYAKAUAUAUAUAKYAyAeBGAABkgyYCCg8CCiWBujIYBai+CCloB4mkYBuloAeg8Buh4YBQhGAKgegegyYgUgygygoiChkYi0iCgeAAiCAUYhkAUigAUiCAAYiCAAhugKjIgeYiggUAAAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 177, 244);
            return stroke;
        }(),
        272: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFUAAYgUAAAAA8AUAeYAeAoBaBQA8AeYBGAoBkAUCqAoYCgAeAoAUAoAUYBGAyAKAogoDSYhGFUhuFoh4DcYg8B4goAyhQAeYhaAegyAAiqhGYiqhQhagegyAAYhFAAAUAyBtBQYC0CCCqC0A8B4YAeA8AoAeAoAAYAyAAB4hGBGg8YBahQAyhQA8iCYBai+A8igCWo6YAoiMBQiqAygyYAKgKAegeAUgKYAKgUAKgUAAgKYAAhGiqi0hug8Yg8gegKAAhQAAYigAUk2hGjIhaYhugygeAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 162, 234);
            return stroke;
        }(),
        273: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AH+AUYgKAKAAAeAAAeIAAAoIAyAKYBkAKB4AoAeAKYBGAyAKAogeCqYgKAygKBagKA8YgyEsiCGahQBkYgeAohaAogoAAYgKAAhGgUhGgeYi+hag8gKAAAoYAAAKAeAeAoAeYB4BuBkB4AyBaYAyB4AeAKBugyYBug8B4iMA8iWYAoiMA8jcA8kYYAeiWAoiqAUgoYAehkAyhQAegKYAegKAUgogKgeYgKgoiWiWg8geYgogegUAAhkAAYhQAAgygKgygKYhkgUgeAAgUAU").cp().ef());
            stroke.setBounds(0, 0, 123, 195);
            return stroke;
        }(),
        274: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AD6AKYgoAyAABaAoAUYAUAKB4AUCCAKYCCAKB4AUAUAKYA8AKAyAoAKAoYAyCMjcI6iWCWYgUAKgeAUgUAKYhGAegygKi0g8Yi0g8geAAgKAeYAAAUAKAeAyAeYBaBGCWC+AoBkYAeBkAoAeA8gKYBGgKB4g8BQhQYCCiCBQiMCCmGYBakYA8huBQhQYAygyAAgKAAgeYgKg8iMiWhkg8IgygeIjSAAYi0AAgoAAiggeYhkgUhagKAAAAYgKAAgKAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 137, 174);
            return stroke;
        }(),
        275: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAtUAAKYgUAKgyAegeAeYiWCCkOCWm4DcYnMDmuEFynCCMYhkAegUAKgKAUYAAAUAAAKAUAUYAKAKAyAeAyAKYBQAeAUAKBQAAIBkAAIBkg8YCChQMgmaE2iMYBugyD6h4C0hQYImkOAAAAAoAyYAoAygeBuiMHMYgeBagoB4gUA8YgeB4goAog8AAYgUAAhGgKhGgeYh4gog8AAAAAUYgKAUBaBkCqC0YCgCqAUAKA8gKYAygKB4iWBGiMYAyhaAUhQBkmGYB4nMAUgyCWigYAygyAKgegUgyYgUgoh4gyiggyYh4gUgyAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 344, 183);
            return stroke;
        }(),
        276: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAg+AAKYgUAAgeAegKAKYh4Buh4BQjcCCYj6CWhGAekYCMYmkDIhkAojwBkYjmBagTAUAdAeYAUAUBuAoBQAKYBGAUBGgUA8goYA8gyFojIEiigYCMhQC+hkBQgoYDciCDwh4AegKYBGgUAoAoAABkYAAAygyD6haGuYgyDcgKAKi+goYhGgUg8gUgKAAYgyAAAKAeA8BGYBuBkDmDIAUAKYA8AKAygyBQiMYAyhaAoiCAUigYAykYAyksAKg8YAKhGAyhuBGhQYAegyAegoAAgKYAAhGhagojIgoYiCgKgUAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 259, 173);
            return stroke;
        }(),
        277: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APUBQYksCWjwBajmAoYgyAUg8AAgUAAYgyAAgeAeAAAeYAAAyCMBQBuAKYAyAKAUgKC0hQYBkgoCMg8BGgoYCqhGAygKAUAyYAUAegeKygUC0YgeDmgyD6g8CqYgUBQAAAyA8BuYAyBuBGBGAeAAYAeAAAygoAehGYAohQCWi0E2k2YBuh4AogoAAgUYAAgegegKgeAUYgoAelUDcg8AoYg8AogoAAgUgeYgKgeAKkiAekEYAUjmAymQAKgoYAUgyAeg8Ayg8YAegeAegoAAgKYAAgegygyhGgyYhGgyhkgogeAAYgKAAhQAehaAy").cp().ef());
            stroke.setBounds(0, 0, 183, 231);
            return stroke;
        }(),
        278: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHqAyYg8Aeh4A8haAoYi+BGgeAeAAAyYAABQA8AACghaYCghaA8gUAoAUYAUAKAKAKAKAUYAAAUAABuAAB4YAKDmgUDSgeB4YgKAogKAyAAAUYAAAoAoBGAyBGYBGBaAygKAohkYAehQCWjcCWi+YBuiWAUgogegKYgKAAiWCCiWCCYhGBGgeAKgUgoYgUgoAAhaAUj6YAKjmAKgoBGhQYAyg8AAgUg8gyYgygyhkgygoAAYgKAAgyAUgyAe").cp().ef());
            stroke.setBounds(0, 0, 116, 144);
            return stroke;
        }(),
        279: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQaAKYgUAKgyAUgyAUYiqBGjSBGiCAUYloBGgeAAgUAeYgKAKAAAUAAAUYAKBQAyAeBugUYBGAAFKhaDchGYBGgUA8gKAKAAYAUAAAKAKAKAUYAKAUAAAygUDwYgUCWgKC0AAAyYAADwBQCWCWBGYDwBuHWAAD6huYA8gUAKgUgUgoYAAgegegeg8g8YhuhkAAAAj6BGYg8AUgyAKhkAAYjIAKg8gUgyhuYgeg8AAgKAAhkYAAg8AKhkAKhGYAeiWAohkBuh4YBQhkAKgUgogyYgyg8jciCgoAAYgKAAgeAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 219, 154);
            return stroke;
        }(),
        280: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgxAUAAAoA7BkYA8BaAeA8AeBaYAUBQAAAKAAK8YAAH+gKFAgKEOYgeLaAeEiCMD6YCgEYDwBkIcAUYCWAKFUgUCWgKYC+gUC0gyC0hGYCCgyA8goAAgoYAAgKgKgygUgyYgeh4gyjcgUi+Ygej6AAgegUgUYgog8gUAegyDIYg8DShGDcgeA8YgoAyhuBag8AeYhkA8jcAokiAKYjwAUjIgUiqgyYg8gUgUgKgygyYhkhkgohugojwYgUiMAAgUAAqUYAAtwAUnqA8leYAKgyAKhGAKgoYAKgyAAgUgKgeYgKg8hGg8hkg8YjSh4gegJhGAT").cp().ef());
            stroke.setBounds(0, 0, 264, 398);
            return stroke;
        }(),
        281: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYg7AeAKAoBFB4YAyBQAyBaAUBaYAoCqgKJEg8R+YgUFAAUEOA8CgYBaEECqCME2AyYDmAoG4AKDwgeYC+gUEYhaAygyYAygyAAgegyiCYg8iWgyjcgojwYgojSgUgygeAAYgeAAgKAUgoCqYgoCqhQEOgeAyYgyBahuBahuAeYjcAymGgKjIhGYhagehGhagoiCYgeiCgKi+AAmGYAUq8A8sCBGkYYAeiCAAgKgegoYgohQiMhui0haYhQgegeAAg8AK").cp().ef());
            stroke.setBounds(0, 0, 226, 361);
            return stroke;
        }(),
        282: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgTAoAJAeBGB4YBkCWAoBkAKCqYAKBkAATigKCCYgKCMAUEEAeB4YBGEECMCgEEBuYBaAeBQAUCqAUYCgAUJOAKDmgUYEsgeEEg8DShQYA8geBGgUAUgKYAygUAogyAAgoYAAgKgKg8gUg8Yg8i+g8j6gokYYgUiqgUhGgoAAYgegKgKAUgoC0YgyD6hGEigeA8YgeAyhuBkhGAoYiWBalKA8maAKYlUAKjwgeiChGYhGgohahkgohQYg8iCgKhGAAn+YAAj6AKkYAAhkYAUkYAom4AUhGYAeiCAAgogUgoYgog8g8gyh4g8YjSh4hagTgyAd").cp().ef());
            stroke.setBounds(0, 0, 307, 325);
            return stroke;
        }(),
        283: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgUAUAAAUAUB4YAeCMAKA8gUDmYgKB4gKB4AAAeYgKCqgKHCAKCCYAUCgAeCWAoBQYAUAeAoA8AyAoYBGBGAUAUBkAyYC+BaDcA8D6AoYEYAoHMAAEYgeYDmgUEsg8Cqg8YEOhaFeiqAyhGYAegyAAgegehkYgohkgeiqgojwYgejSgKgegeAKYgKAAgeBQgoBuYhGDmhQDcgyBGYgoBGg8AoiCBGYi+Baj6BGksAyYjSAen+AAi0geYk2gojShQigh4YhuhQgyhQgyiqYgUhQAAgeAAjwYAAiqAKiCAKhaYAejwAKhuAeiWYAUhaAAhGAAgUYgUhQg8hGhugoYg8gKgeAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 348, 251);
            return stroke;
        }(),
        284: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAeAAAeBPCgYA8BuAKA8AKGQYAKDSAAEYAKCMYAAEEAKBaAeBuYA8DwCqCgFABuYFoB4FoAyJsAAYF8AADwgUD6goYC0geD6hGA8geYAogUAogyAAgeYAAgegUhQgohQYgohkg8jSgojcYgUhkgUhugKgUYgKgygegygeAAYgUAAgKAegeC+YgoDIgyD6geA8YgUBGgoAygoAoYgeAegUAKg8AKYhaAekEAejIAKYiqAUnMAAi+gUYkOgUkYgyigg8YiCgyhuhagoh4Ygoh4gKhaAAmGYgKngAUjIBGjSYAohuAAgog8gyYgogoi0hahQgUYhQgKgeAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 355, 258);
            return stroke;
        }(),
        285: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAUB4YAeCgAKA8gUD6YgKCMgKDIAAC0YAAEOAAAoAUBaYAeB4AeA8BGBGYCMCWEYBuFeAoYC+AUFeAACMgKYFKgyDwhGDwiMYCghaAUgog8igYgoh4hQlKgUiqYAAgUgUgegKgKYgKgUgKAAgKAeYgKAKgUA8gUBGYgoCWhQEEgoBQYgoBahQBGiMAyYo6DIsqhui+kiYg8hugeigAKi+YAKj6BGnqAehkYAUg8gKgUhGg8Yh4hQhugdgoAd").cp().ef());
            stroke.setBounds(0, 0, 259, 213);
            return stroke;
        }(),
        286: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAUYgUAeAAAUAUBGYA8CgAAAUgKJ2YgKGuAKBQAyBuYBkDcCqBaGaAyYCMAKJEAACqgKYHMgyC0huhGi+Yg8iMhGksgykYYgUiWgUgygeAAYgogKgKAygKDIYgUEEgUCggoB4YgoBkiCBGjSAoYmGA8n0gUiChQYgygeg8g8gUgeYgehGgKhuAAi+YAAkOAokEBGigYAehQAAhagegyYgog8jwiWg8AAYgUAAgUAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 228, 195);
            return stroke;
        }(),
        287: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaaAKYAAAKgeBkgUBuYhkGagyCMhGAoYgyAehuAoh4AeYhaAUgyAAi0AAYi+AAgeAAhQgUYhkgehagogegeYhGhQAAi+A8kEYAUg8AAgegKgUYgKgegygyhGgoYgygegUgKgoAKYg8AAgJAKATCMYAUBkAAAoAACCYgKFyAKA8BQBkYAeAyAUAUBGAeYC+BkC+AoFUAAYC+AAA8gKBkgKYCWgeCWgyCChGYDIhuAUgUg8iqYgyh4geiggej6YgUhkgKhagKgKYgKgUgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 193, 123);
            return stroke;
        }(),
        288: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAAAeCWYAUBaAKAeAAEEYAKC+AKBkAKAoYAeBuA8BGB4A8YCWBQCgAeDcgKYDwgKCMgoCWh4YBuhQAAgeg8iMYgohahGi0AAgeYAAgKAAgUgKgKYgUgegUAKgUAyYgKAyhkC+goBQYhGBkhkAojmAAYiCAAgegKgygKYi+hGgehGAAkEYAAhQAKhkAKg8YAei0gKgeiCg8YhQgegygJgUAT").cp().ef());
            stroke.setBounds(0, 0, 146, 124);
            return stroke;
        }(),
        289: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAUAKBaYAeBuAKB4gKBuYgoHqAAH0AUCgYAeCWAoA8B4A8YCgBQB4AUEYAAYEiAAB4geDIhaYBug8AogeAKgyYAKgogKgKgyiMYgehahalKAAgeYAAgogUgogUAAYgKAAgKAegeBQYg8CMhaDSgoBGYgyBQgoAehaAUYhkAehGAKh4AAYjIAAh4gogohQYgKgUgUg8gKgoYgyjIAonMBangYAKg8AKg8AAgeYAAgoAAAAgogyYhkhQiCgngoAd").cp().ef());
            stroke.setBounds(0, 0, 155, 201);
            return stroke;
        }(),
        290: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgeAKAKAoAoAyYAyBGAKAoAAEYYAAC0gKBugUCgYgUDmgKBGgoBQYgUAyAAAUAAAeYAAAyAoBQAoAeYAeAeAUAABkg8YBGgyCCgoBQAAYBaAAAAAogyGGYg8GagUCCgyA8YgyBQAKB4BGCMYAoBGAKAUAUAAYAeAABGhaAehaYAUg8AojmAUigYAej6AoksAUhQYAUg8AUgyAUgoYAyhQAAgUgygyYg8gyh4g8g8AAYgogKgUAKhkAoYh4AyhGAKgUgUYAAgKAAgeAAgeYAUiqBan0AoigYAKgeAUg8AKgoYAohaAAgUgyg8YhkhajwhPhGAn").cp().ef());
            stroke.setBounds(0, 0, 93, 293);
            return stroke;
        }(),
        291: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAyAAYgUAUAAAUAoBQYAoBGAAAKAAB4YAKCWgeHqgUBQYgKAogUAygKAoYgUAogKAeAAAKYAAAeAyBQAeAUYA8AoAUAABGgoYBkhGB4gyDcg8YAygKA8gUAKAAYAeAAAoAUAKAUYAUAUgUBQgyCMYgyCgAAAeAoAeYAeAUBaAAAogUYAogKAKgeAoh4YAoh4AohGBahQYAygyAegeAAgKYAAgehQhGhug8YhuhGgyAAiCAyYigBGk2BugeAAYgoAAgUgUAAgeYAAhaB4piAohuYAKgeAKgyAAgUYAAgogKgKgegoYhGg8jmg7g8AT").cp().ef());
            stroke.setBounds(0, 0, 131, 170);
            return stroke;
        }(),
        292: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgUAKgKAUAAAKYAAAAAKAeAeAeYBGBaAyCCAKCqYAUBkgKBQgUA8YgeAyAeBaA8AeYAoAeAUAABQgyYBQg8DShaBGgKYBGAAAeAUAKAoYAAAUAKBuAACCYAKCCAKBuAAAKYAKAeAoAKBQgUYAyAAAegKAKgUYAUgUAKgKAAiMYAAjwAUhkAygyYAegUgKgegogoYgogogygehkgeYhkgogKAAhGAoYhGAojwBQgeAAYgUAAgUAAAAgKYgUgUgekiAKh4IAAhQIgogoYhQhaiggdg8Ad").cp().ef());
            stroke.setBounds(0, 0, 120, 134);
            return stroke;
        }(),
        293: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGQAUYgUAUAAAeAoBGYBaCgAAD6haKUYgeEEgyDmg8D6YgUBageB4gKAyYgeBugyBkg8BQYhQBkgJA8ATBuYAoBuAeAKCWhQYC0hkC+gyFygoYB4gKAyAAAAAUYAAAAgoBkgyBuYksKyhQDIAKAUYAeAUD6ksEil8YCWi+BahkBGgoYBQgoAogoAAgeYAAg8hGhGighkYhGgygUAAhGAAYg8gKgUAKgyAUYjSBGksBGiWAKIhkAKIgKgeYAAgUAAgeAAgoYAeiWFK5UAUhaYAehuAehGAohGYAyg8gKgegygyYhGg8kEh4hQAAYgKAAgeAAgKAU").cp().ef());
            stroke.setBounds(0, 0, 169, 376);
            return stroke;
        }(),
        294: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMgAUYi0CChuA8jIBQYiCAyhaAegyAAYg7AAATAyA8AUYBQAeA8AABagUYBagUCqgyB4gyYA8gUAUAAAUAKYAeAKAyAyAKAoYAUA8geBag8BQYgoAygoBaAABGYgKBkAUBQBQCMYBkCqAoBaAUBaYAUBagKBkgeBQYgUA8AKAKAygUYB4gyA8hQAKhuYAeh4goh4h4i+YhGhugKgogKhQYgKhQAUhGBGiWYBGiWA8huA8hGYBahkgUgoi+haYjchjgUAAg8Ad").cp().ef());
            stroke.setBounds(0, 0, 128, 187);
            return stroke;
        }(),
        295: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeoAUYh4AyhaAeruCgYtIC+hQAUgoAKYgxAeAABkAnAeYAUAKAUAAAUAAYAeAADIgoAogUYB4goKeiWFeg8YE2gyA8AAAoAKYA8AUAKAegUCCYgyHCgKC+AAFAYAAN6CMHqGGG4YDIDwD6CqDwBQYBkAoAUAAAogUYAygeAKgegUiCYgKi+AAg8gUmaYgKmGAAgogoAAYgUAAgKAUhGDwYg8DmgyB4goA8YgeAeAAAKgogKYhugKiqiChkiMYi+kOiCl8gonMYgKhuAAl8AKiWYAUjSAokOAehGYAehaAyhQA8g8YAygyAAgegegoYg8haigiCg8geYgygKgyAAhaAU").cp().ef());
            stroke.setBounds(0, 0, 334, 379);
            return stroke;
        }(),
        296: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAAYgKAAgoAegeAUYgeAehGAegyAeYiMA8l8Buk2BGYizAogKAKAnAoYAoAoA8AUBaAAYBaAAAogKHqiMIFKhaIAoAUYA8AeAKAogKDwYgoLQA8KyCCG4YBaFADIEYDwCWYCgBuCWAyBagoYAygUAKgegKh4YgUiqAAgUgKlKYAAi0gKigAAgKYgKgogeAKgKAeYgKAUgeBGgUBQYhGC0hGCCgeAoYg8Ayg8gUhahaYi0jIiClegym4YgekYAUqUAoigYAehQAyhaBQhkYAog8AegyAAgKYAAgyhuhQi0haYiCg8hGgJgoAJ").cp().ef());
            stroke.setBounds(0, 0, 240, 336);
            return stroke;
        }(),
        297: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASIAKYgUAAgyAeg8AoYkECqjSBGm4A8YhuAUgKAUAAAyYAAAyAeAeAyAUYA8AKBugUGuiCYE2hQBQgeAUAKYAoAUAAAAg8MqYgUCqgUEigUC0YgoH+gKDIAKDIYAUC0AUBkA8B4YBaDIDSCMEsBQYEEBGF8gKE2haYDIgyDmhkAogoYAUgUAAgygUgyYgoiCgejwgUjSYgUi0gUhQgoAAYgUAAAAAKhGDSYhGD6huDIhkBkYhQBQigAokiAKYjcAKhQgKiMgoYi+g8hkhkgyjSYg8jSBGvAB4pYYAoi+AyjSAeg8YAehQAyg8BGhGYAegeAogoAAgKYAohGg8hGi0haYi+hahagJhGAT").cp().ef());
            stroke.setBounds(0, 0, 311, 358);
            return stroke;
        }(),
        298: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMCAKYgUAAgyAegyAoYhuBGhaAyjwBkYhkAyhaAogKAKYgKAUAAAoAKAUYAAAKAUAAAKAAYAoAACggoDmhQYBugoBugeAKAAYAyAAAABkhGI6YgoGGgKC0AKDcYAKBkAKBuAKAoYAeCWBaDSBaCCYBaCWDwCgDSA8YD6BGDwgUEihuYBQgeAegeAKgyYAKgUgKgUgyi+YgoiMgUh4gUjcYgKi+gUgygeAAYgUAAgKAegoCWYgoC+g8DmgeA8YgeA8geAogoAUYiCBGk2gUiWhQYhuhGiCiWg8iCYhGi0geiqAAk2YAAkOAUiqAyjmYAyjmBai0B4h4YBGhQAKgUAAgeYAAgygygUjIg8Yh4geg8AAgyAK").cp().ef());
            stroke.setBounds(0, 0, 233, 292);
            return stroke;
        }(),
        299: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAg+AAAYgKAKg8AUgyAeYi+BajSBQkEBGYkOBGn0BQlKAeYjvAUgeAUBPBQYBGBGBkAoBaAKYA8AAAUAACMgyYC+g8C0gyE2hQYGQhkFUhQAoAAYAyAKAKAegeCMYhGGagKIIA8FeYAoDwBGDmBGCWYC0FUF8EsGQBaYBaAUDmAABkgUYBQgUBQgoAKgeYAUgegKgygyh4YgyiMgyiWgyi+YgoiCgUgogUAUYAAAAgUBGgUBQYgoC+goCggKAyYgoBGg8AKiggyYlyh4kYkOh4leYhulUgemkBQmQYA8k2AehQDciqYAKgUAUgeAKgKYAAgeAAgKgogeYgUgehQgohQgoYiChGg8gJg8AJ").cp().ef());
            stroke.setBounds(0, 0, 374, 314);
            return stroke;
        }(),
        300: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkkAAKYgKAAgoAegoAUYjSCMlUBupiCWYhGAKiMAohkAeYjIAyiWAUjwAKYhaAKhQAAgKAKYgKAKAAAoAKAoYAeAyCCBQBGAUYA8AKBQgKBageYGGiMLGjcEEhGYDcgyCMgUAUAeYAUAUAAAUgyDIYiCImhGHqAKEYYAUI6C0EEG4BuYCqAyBkAKDSAAYDcAABagKDIgyYDIgyDchkAog8YAUgoAAgKgoiMYgoiggejcgUjmYgUiWgKgygKgKYgegogUAohGEsYhQFAgeBGhaBaYhQBahQAejwAeYjmAei+gKi0g8Yiqg8hahGgyh4Yg8hugKhGAAjSYAAiqAAgyAeiMYAejSA8jcBQjmYBakYA8hkCCiWYBGhGAKgUAAgeYAAgeAAgKgogeYg8gokOiCgeAAYgUAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 410, 295);
            return stroke;
        }(),
        301: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfQA8YjSBukiBQnMBuYmaBajSAekEAUYhGAAhGAKgKAAYgKAKAAAoAUAoYAKAUAeAeAyAUYA8AeAUAABGAKYBaAAAKAALajIYMWjSB4geAoAUYAeAKAAAKAAAoYAAAegKA8AAAoYgyEEgUGaAUC0YAeEiA8C+CWDcYCMDwCqCCEEBaYE2BuHCAUCChaYAogUAKgogUhGYgojSgokOgUkiYAAhagKhagKgUYgKgogegUgUAUYgUAKAAAKg8DmYhGEihQDSg8A8YgyAyhQAKiMgeYiqgojIh4hkh4Yhahkhkj6goi+YgojSgKj6AojSYAeigBQi0BkhuYAUgeAegeAAgKYAKgyg8gyi0hQYiggxAAAAigBF").cp().ef());
            stroke.setBounds(0, 0, 376, 260);
            return stroke;
        }(),
        302: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYEAKYiMBaiCAyjmBQYlKBkk2BQjmAeYhGAKhGAKgKAAYgUAUAAAeAKAoYAoAyB4AyBkAAYA8AAA8gUMqkYYDchGAygKAeAeYAUAeAAAAgoD6YhQHWgKFABQEYYAeBuBkDcBGBkYA8BaCMCCBaA8YDSB4EsBQEYAAYDSAABQgoAAhQYAAgUgKhGgUg8YgeiMgei+gUjSYgKhQgKhGgKgUYgKgegeAAgKAUYgKAAgeBagoBkYhaEYhGCChGAeYhkAojwhGiqiCYiMhkg8hkhGi+Yg8i0gUhuAAi+YgUmQBakODIjcYAUgUAUgoAAgKYAAgyh4hQiqg8YhQgUgeAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 305, 257);
            return stroke;
        }(),
        303: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbWAKYgyAKn0B4i0AoYmGBQkYAyi0AUYh4AKgKAKgUAUYgKAKgKAUAAAKYAAAUAyAoBGAeYBQAoBuAKBkgoYDwhaBkgeDSgyYD6g8EigyBQAAYAeAAAoAKAUAKYBGAeAAAog8DIYgyCggUBQAACWYAABuAKAeAUBGYAyCWBQBkCqBQYCWBGCqAeE2AAYDSAACMgUB4goYB4goAygUAAgyYAAgKgUg8gUgyYg8h4gyi+geigYgeiWAAgKgegeYgUgegUAAgKAKYAAAKgUBQgKBaYgoEOgeBQhGBQYhGBGiWAej6gKYi+gKgygKhQgoYgogUgKgUgegyYhGiWAUi+Buj6YAyhaAyhGBag8YAogeAKgogKgeYgUgejmiqgogUYgeAAgyAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 321, 156);
            return stroke;
        }(),
        304: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALaAoYhuA8i+BGjcAyYi0AygeAUAAAyYAAAoAUAKCMgKYBuAAAUgKCMgoYEshkAogKAeAoYAUAeAAAUgeDSYgeDmgUEEAUB4YAUEiCqEEDSBaYCCAyEEAoDSgKYEYgKDSg8DShkYB4hGAUgygyhuYhGiWg8i+gUigYgUhagKgegeAAYgUAAgUAygoCCYhGDwgoBkg8A8YhQBGhQAei+AKYiMAUjSAAhGgUYjIgoh4i0gKkiYgKiCAKhaAoiqYAeiCAyhkBQhQYBGhQAAgUg8g8Ygygyh4hGhQgUYhQgTgeAJhuAo").cp().ef());
            stroke.setBounds(0, 0, 258, 186);
            return stroke;
        }(),
        305: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AM+AUYhkA8igA8k2BQYi0AygoAUgUAUYgUAeAAAKAAAeYAKAUAUAAAyAAYBkAADcgoCCgyYCWgyA8gKAeAeYAUAUAKAKgKAoYgKBQgKGQAKC+YAeFoA8EEB4CqYAyBQBuBuBaBGYBQA8CqBaBQAUYBGAUB4AAAogUYBGgUAAgegeiMYgUhGgUhQAAgUYgKhGgej6AAg8YAAhGgKg8gUAAYgUAKgeBQgoCgYgyDIgeAyg8AAYhaAKiMhahah4YhQhkgyhkgei+YgUhkAKksAUigYAej6AohuBahaYBQhQgUgyjIhaYiCgygogJgyAd").cp().ef());
            stroke.setBounds(0, 0, 187, 226);
            return stroke;
        }(),
        306: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASwAAYgKAKgoAUgUAUYhGAojcBuh4AyYh4AynWB4g8AAYgKAAgeAKgKAUYgUAUAAAAAAAUYAUAoAoAUA8AKYBaAKFAhaEih4YC+haAygKAoAUYAeAeAAAegUCCYhQFygKAyAKCWYAACqAUA8AyB4YBQCgCCBuEOCgYEYCgCWAyB4gKYBGgKAygUAUgoYAUgogKhugoiWYgUiCgojcgeiqYgKhkgegygegKYgeAAAAAKgeC0YgyEOgeCMgoAeYgoAegoAAhkgeYkYhQjcj6AAjwYAAg8AeiMAohuYAoiMAyhQB4iCYBQhaAKAAgKgoYgKg8hGhGiWhQYgygehGAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 229, 203);
            return stroke;
        }(),
        307: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYOAeYiMA8lKBuhQAUYi+AojwAUlUAUYhuAKhQAKgKAAYgKAKgKAUAAAKYAAAeBuBuA8AeYBGAeCCAABkgeYAygKCWgeCMgoYCMgeC0goBageYCqgoAegKAeAeYAUAeAAAAi0DcYocJshkBui+EsYjcFKhuDShGDcYhZEsAAEYBZDIYAeA8B4B4BkAyYCWBaDcBQC+AeYCWAeAKAAEYAKYC+AKBaAAC0gKYB4AAB4gKAUAAYEsgoB4gUC0gyYB4goCqg8CMg8YC0hQAUg8g8jmYgyiggojSgei+YgUiWgKgogegeYgUgUgeA8gUCCYgoDmhGEOgoBGYgeA8g8BGgyAeYhkA8k2BajSAeYkEAolAAAmugeYlAgeiCgeiMhQYiChQg8hQgeh4YgojIAoi0CCkOYDmnCEslyJso6YEOkEBag8C0hkYB4hGAUg8hGhGYhQhQj6huhagKYgoAAgeAAhQAe").cp().ef());
            stroke.setBounds(0, 0, 325, 364);
            return stroke;
        }(),
        308: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AR0AUYloCCl8BkkEAUYgoAAgyAKgKAKYg7AKAKBGA7AKYBGAUCMAKAyAAYBugKE2g8B4gUYC0goAUAAAABGYAAAygKAUigDSYl8H0h4C+iCD6YiWE2hQEYAeCqYAUBuAoBGBaBaYBaBQCCBGCqA8YD6BQDcAeFUAAYE2AAC0geEihQYDmhGCCg8AygoYA8g8AAgUgoiMYg8jIgei0gokOYgKhugUgogeAAYgoAAgUA8goDmYgUB4geB4gKAoYhGDIiWBkkiAyYkiA8nMAAkOg8YlehGiWj6BuloYAyi+C+lUC+jwYBkiMD6kOBQhQYBkhaBuhQBkgyYCChGAKgohQhQYg8gyiWhugygUYgygKgyAAhGAU").cp().ef());
            stroke.setBounds(0, 0, 265, 293);
            return stroke;
        }(),
        309: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAKYgUAAhGAegyAeYjSBujmBaiqAyYhGAKgoAeAAAUYAAAKAAAKAKAKYAUAUAUAKBGAAYBuAUB4gUBGgoYBkgyBugeA8AAIA8AAIAAAoYAAAegKAegeAyYlUHWiCDwhQDwYiWGuB4DmHCCWYHWCWIwAAIIiqYBQgeCCgoBGgeYDShaAKAAgojSYgoiggUiggUjmYgKhkgKhGgKgUYgKgegoAKgUAeYgKAKgoBugeCCYgoB4gyCCgKAoYiCD6leB4psAAYjIAAiCgKhkgUYiCgohuhQg8huYgUgoAAgUAAhQYAAhuAKhGBGiMYBQiWBuiqCMiqYC0jcCChuB4g8YC0hkgUhQkiigYhkgyg8gJhGAT").cp().ef());
            stroke.setBounds(0, 0, 262, 235);
            return stroke;
        }(),
        310: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAUYgdAeAJAoAeA8YBQBuAKBaAAFyYAAHWgoH+g8CWYgUBQAUA8BuBQIAyAoIA8gUYAogKBGgUAygKYDmhQJihuGGgeYAoAAAogKAUAAYBugKE2gUBGAKYBaAABQAeAeAyYAoA8gKBkhQHMYhGGQhaEOhkA8YgyAogygKjIgyYjmhGAAAAgUAUYgKAKAUAUBuBuYCgC0B4CCAoBaYAyBkAeAUBagyYBkgyB4h4BGh4YAyhQAehaAojSYB4pOBkmaAyhuYAUgUAUgeAUgUYAUgUAKgUAAgUYAAgyhkhaiqhkYhug8gUgKiWAeYhkAUhQAKj6AKYhQAAiCAKhaAUYhkAKhkAKgeAAYjcAelKAoiWAeYhaAKh4AUgoAAYhGAKgKAAgegeYgogoAAgoAKl8YAAm4AomQA8iCYAehkAAAAgygyYhuhuiqhahGAAYgUAAgUAKgKAK").cp().ef());
            stroke.setBounds(0, 0, 295, 380);
            return stroke;
        }(),
        311: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEiAKYgUAeAAAUAUA8YAeA8AABGgKCMYgKC+goEsgeCWYgeCWgKAUhuCCYhtCMAAAeCpCMYBGAyAUAABugyYCChGCWgoEsg8YEigyE2goC+gKYCqgKAUAKAyBQYAoBGAABQgeDSYgyEOhkHqgoBaYgyBug8AyhGgKYg8gKjIg8hagoYhugogUAAgKAoYAAAeAKAKA8BGYAoAoA8BQAoAyYA8BQAeAoBaCgYAeAyAoAeAyAAYAyAADSiWBQhaYAog8AUgoAohuYAyiMAKhGBkn0YAokEAyjwAUgeYAUhGAUgeBGhQYAog8AAgegogoYg8g8jciChQgUYhGgUhkAAhkAUYgyAUhQAKg8AKYg8AKiMAUhkAKYjSAej6AojIAyYiWAehGAAgUgUYAAgKgKgUAKgoYAKgeAUhuAKhkYAUhkAeiqAehuYAoi0AKg8A8iWYAUg8gKgohGgyYg8g8hugyg8AAYgeAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 247, 335);
            return stroke;
        }(),
        312: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgUAUAAAeAUBGYA8CCAAAyAAIIYAAHqgKCMgeCqYgUBuAAAyAeAoYA8BGBQAUBQgyYBQgoBugeC0goYDwgyCCgKEYgUYD6gUBaAUA8A8YAUAeAAAKAAA8YAAAogUA8gKAoYgKAegUCCgKBuYgoDwgeCqgUBGYgUBGg8BugUAKYgoAehQgKjSg8YjmhGgeAAAAAoYAAAUAeAeBGBGYCqC0BaB4BaCWYAyBaAyAAB4hQYCMhQBGhaAyiCYAohkA8lAA8mQYAejwAyiMBaiMYAeg8gKgohGhGYhGhGiMhahGgeYhGgeg8AKhaAeYh4AyhuAUjwAeYiCAKjIAUhuAUYkOAogeAAgegoIgUgUIgKmaYAAmkAKj6Aeh4YAUiMAKgKgKgoYgehajmhthQAd").cp().ef());
            stroke.setBounds(0, 0, 215, 349);
            return stroke;
        }(),
        313: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAyAAYgeAKgUAUAAAUYAAAKAKAeAKAUYAKAUAUA8AKAoYAKBQAAAyAAFKYgKGQgKBagoC+YgKCCAAAeAeA8YBGBGA8AKB4g8YBug8A8gUCqgoYFUhaFAgoDwAAYBkAABQAUAUAeYAeAegKBugUBGYgKAogKBGgKA8YgKCggyFUgeCqYgUCqgoBugyBuYhQCMgeAKkOhaYhkgehkgegUAAYgegKgUAKAAAeYAKAKBQBaBaBaYCWCWBkB4AeA8YAyBkAeAKBagyYB4g8BQhGAyhGYAohQAeg8AehGYAehaBapOAymuYAejcAehkBki0YAeg8AAgUhQhQYg8g8hkhGhagyYhGgohQAKiCAyYiqBGgyAKnqBGYhGAKiMAehaAUYhkAKhaAUgUgKYgygKAAgUAAjmYAUoIAKhaAehkYAoi+AAgUhahGYhahGiCgngoAJ").cp().ef());
            stroke.setBounds(0, 0, 218, 350);
            return stroke;
        }(),
        314: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABGAKYgeAKAAAUAeBQYAUA8AKAUgKCWYAACqgUG4gUB4YAAAogUBQgUAyYgTCMAJA8BGAyYAyAeAygKBGgoYB4hGF8h4CMAAYCCAAAoAogKCMYgKDIhQIwgeB4YgUBQhGCqgeAUYgoAegoAAiqg8YjIg8gKAAgUAKYgeAKAUAeCCCCYB4CCBQBaAoBQYAyBQAeAABuhGYB4hQBQhkAoiWYAehkA8lAAym4YAejwAeh4A8hkYAUgeAKgeAAgUYAAgehuhkhkg8Yhkg8g8gKhQAoYhkAonqCMgeAAYgKAAgUgKgKgKYgegUAAAAAAhQYAAhkAonWAKhkYAKgoAUhGAKg8YAUgyAKgyAAgKYgKgohkhQhGgoYhGgUgUAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 141, 308);
            return stroke;
        }(),
        315: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHMAKYgUAKAAAUAoBkYAoBaAAAAgKBaYgKCMhuFKhQCCYgKAehGBQhGBGYh4B4goA8AAAyYAAAoAoBQAyAoYAyAyAeAABGgyYB4hQDIhQDcg8YFehaCWAAA8BaYAeAoAeBQAAA8YgKCMgyE2g8DIYhkE2igFKhkBGYgoAehGAUgygKYgygKj6hGgegUYgKgKgUAAgUAAYgoAAAKAoA8BGYBQBkBQBkBQCCYBaCMAeAUBQgKYBkgKAygeBkhuYCqi+B4jcBQjwYBQjSBamkAolAYAUiMAUhQAyg8YAohQgKgehahGYgegUhQgygygeYiWhGgyAAigAyYiMAyiWAejcAoYiWAUgeAAgKgeYgKgyEYpOBkiMYA8hageg8hug8Yh4g8iWg8gUAAYAAAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 180, 334);
            return stroke;
        }(),
        316: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAKYgUAeAAAUAeAyYAeA8AACMgeB4YgoCggyBuhaBaYg7BQAAAyA7BGYAyA8AoAAA8goYCqiCAygeCqgoYCMgeBQgKBkAAYCqAAAeAeAAC0YAACqgeFKgyDwYgyD6haFAhGBkYgyBagUAAjwhGYiqgyAAAAAAAeYgKAoAeAyBuBuYA8AyA8BQAeAyYA8BaAUAUAyAAYAeAKAUgKAogUYBQg8DmkEAyhuYAohGAUhkAUiWYAUjIAomQAUjwYAekEAKgoAohaYAUgoAKgoAAgUYAAgohQhQhkgyYhkgog8gKg8AUYgyAUowCMgeAAYgKAAgKgKgKgKYgUgUAAgKBGjIYBQkOAAgehQhGYgygyhuhGgeAAYgKAAgUAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 148, 289);
            return stroke;
        }(),
        317: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAKYgoAUAAAeAeA8YA8B4AUCCgoC0YgoC0g8CMhQBaYg8BGgJAyAJAoYAUAoBGBGAeAKYAeAAAygUA8gyYBQhGA8geCMgyYC+g8CggUBGAoYA8AoAACggoEiYgyFehuFAhuB4YgeAogKAAgyAAYgeAAhQgUiCgyYjIhGgygKAAAeYAAAoAoAyBkBuYBuBuBaBuBGBaYA8BaA8AKBkg8YA8goDIjSAog8YA8hkAAgeBuowYAei+AojIAAgoYAKgyAehGAehGYAohQAKgeAAgUYgUgyhuhahagyYh4g8goAAk2BQYj6BGgyAKgKgoYAAgKAUiMAoiqYBQlUAAAehGhQYgygoiMhkgoAAYgKAAgeAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 143, 278);
            return stroke;
        }(),
        318: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEYAAYgKAUAKAyAUAeYBQCCgKBkhkDSYgoBagUAUhQBGYhkBkgeAyAAAyYAABGBaBuAyAAYAUAAAogKAogeYCWhkDIhQEihQYFAhQBaAKA8B4YBQC0jSKKjIC+YhkBag8gKj6h4YhagyhQgegKAAYgeAKAUAoA8BQYBuCgAyBaBGBuYAeA8AoA8AKAKYAoAeBGAABGgUYBGgUAKgKBahaYCCiWBaiMBajIYBGi0Bak2Aoj6YAUhaAUhGAogoYAKgUAKgUAAgKYAAg8ighuiggyYhagegeAAigAyYiCAonMBkgygKYgoAAAAAAAAgeYAAgeCMjwA8hQYAogyAKgygUgoYgKgKjIh4hagoYgygUgyAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 175, 240);
            return stroke;
        }(),
        319: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACCAKYgUAKAAAKAKA8YAUBGAAAogoDSYgeC0gUBageBGYgKAogKAoAAAUYAAAoAeBGAoAUYA8AoAeAABQgoYBagyBageCggeYEshGE2gyFAgUYDcgKBGAKAyAoYAeAeAAAKAAA8YAAAegKA8gKAeYgKAegUB4gUB4Yg8EYgoB4hGA8YgoAogoAAiqg8YiqgygegKAAAeYAAAKAeAyAoAyYBkCMBQB4AyBkYAeBQAeAUAeAAYAeAAC+haAygoYBahaAoiCBun0YAUiMAeiMAKgeYAUg8A8huAohQYAegyAAgUgUgoYgohGjcighGgUYhGgKgeAAiWAyYigA8haAUiqAKYiWAUnqBGiWAUYi0AoAKAAgUgeYgUgeAAAAAKg8YAoiqAoh4AUgoYAyhagUgohahaYhahQhGgJgoAT").cp().ef());
            stroke.setBounds(0, 0, 230, 225);
            return stroke;
        }(),
        320: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADIAKYgKAKAAAUAKAoYAUBGgKBagKBkYgUBkgUAehaBkYhZBuAAAeBZBkYBQBQAeAABkgyYDchuHMh4GkgyYCMgUAUAAAoAKYA8AUAKBGgoB4YgyC0i+GagyAoYgyAygoAKh4gKYiMgKg8AAhQgUYhkgKgUAUBQBGYB4BaB4CCAUA8YAyBaAoAKCWhQYC+haAyhGDcoIYCgl8AAAABQhQYAygoAUgeAAgUYAAgogygyighaYiWhQg8gKi+AyYg8AKiMAehkAUYjSAolKBQiMAyYhkAegeAAgKgeYAAgUBGi+AyhaYAyhQgKgUhGhGYhahahkgdgeAd").cp().ef());
            stroke.setBounds(0, 0, 207, 185);
            return stroke;
        }(),
        321: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC0AKYgeAKAAAeAUBQYAUAyAKAeAABQYAABkgKAUgeBQYgoB4geA8gyBQYgxBQAAAUAxB4YBGCgAyAKCMhkYCMhkFKh4D6geYAogKCggUCWgeYJEhQGkgyBuAKYBQAKAeAUAUAyYAUAygKBQhGEEYg8D6gKAUg8AAYgKAAhagKhkgUYjSgegeAAAAAUYgKAUAUAoB4BkYBuBQBGBGB4CMYAeAoAKAAAeAAYBaAABuhaBGiWYAog8AKgyAeigYAykEAyhuBuiWYAyhGAAgygegeYgog8i+iChug8YgygUg8AAiMAoYh4AekEAyjwAeYhuAKiqAehuAUYhuAUiWAUhQAKYiWAei+AehuAoYgyAKg8AKhGAAIhkAAIgKgoYAAg8BGj6AohGYAegoAAgygUgeYgeg8jIiCgyAAYgKAAgKAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 309, 181);
            return stroke;
        }(),
        322: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC0AAYgeAKAAAoAUBGYAyCMgoCWiMDIYgeAogKAoAAAUYAAAyAoBkAoAoYAeAeAKAAAeAAYAeAAAegUAogUYCChaC0hGDwg8YCCgeFeg8DSgeYBagKC0gUCCgUYCCgKCMgUA8AAYAygKBaAAA8gKYDIgeCMAKAoAyYAyAogUCChQCqYgeBGgUAegUAAYgUAKgygKhugKYhQgUhQgKAAAKYgKAKAUAoBGBaYBaBkAoA8AeBGYAeA8AUAKA8AAYAyAAAygeBGg8YA8g8AKgUBGi+YBGiqAyhuAyg8YBahkAAgehQhQYhQhGi0h4gygKYgUgKgoAKgyAKYiWAok2AyleAoYjSAengBGhkAUYgyAKhuAUhkAKYhkAUiCAUgyAUYg8AKhQAUgoAAYhaAKgKgKAKhaYAUhQAyh4AegoYAKgUAUgeAAgKYAAgohahahkg8YgygegUAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 324, 134);
            return stroke;
        }(),
        323: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdEAKYgUAAgyAUgeAUYhQAohuAejIAyYnWBkmGA8lKAUYiWAAgeAUAAAeYAAAeAoAoBQAeYBGAoAAAACMAAYCCAAAUgKCMgeYDmg8NIigBGAAYAoAAAeAeAAAyYAAAoh4FehQDSYgyCCgoAyhkB4YhQBagKAUAAAyYAABaBaBuBGAUYAoAAAKAACCgyYCCg8CWAUA8A8YAoAyAAA8g8DSYg8C0g8C0g8BaYiWEYksEOmGDmYjwCWmGC0iMAeYhGAUgUAKAKAeYA8A8I6iMFoigYFeigEsjcDmkiYCMi0Bai+BGkEYAoiMA8h4BQhaYBGhGAKgUgeg8YgehGi0iChageYhGgUhaAKhGAoYhGAoiCAogoAAYgoAAgKgKAAgyYAKgyAKgeDSmGYC+loAog8BuhGYBGgyAygoAAgeYAAgyi0iMigg8YhQgehQAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 256, 360);
            return stroke;
        }(),
        324: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUeA8YhGAoh4AohQAeYkEBQlyBajIAUYiCAUgUAyBaAyYCMA8CWAAD6hQYDmhQFohuAyAAYAoAAAUAKAAAyYAAAoh4FohQC+YgyCMgeA8hQBaYhGBagUAoAAAeYAAAyAoA8AoAoYBGAyAeAABagoYBug8A8gUBaAAYA8AAAUAKAUAUYAeAUAAAKAABGYAAAygKBGgeBuYhQFAhkDcigC+YjmEinCFAmGCqYiWA8gJAKAJAKYAeAUA8AAB4goYHqh4F8jID6kOYB4iCC+jwAyh4YBGh4AohuAyjcYAyi+AehQBGhGYA8hGAAgehGhGYgegeg8gogygeYiMhGg8AKiCBQYg8AehQAogyAKYgoAKgUgeAKgoYAAgUBGiMBQigYEOocAKgKB4hQYBag8AKgyhag8YhGg8h4g8hGgUYhkgdgeAJiMA8").cp().ef());
            stroke.setBounds(0, 0, 205, 342);
            return stroke;
        }(),
        325: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHqAKYgUAKgyAogoAoYgyAohQBGgyAeYgyAogyAeAAAKYAAAKAKAKAUAKYA8AeA8gUC0g8YBGgeAKAKAABkYAAA8gKBGgeBuYhGEigoCChQBuYgyBGgKBGAoAeYAKAUAUAABQAAYBugKBQAUAUAoYA8BQhuGuiMEYYhaCqhQCCiWDcYgoA8geAyAAAAYAAAoAegUBkhQYCChkCWiWA8hkYBkiWB4kYB4leYAUhQAohkAegoYAUgyAUgoAAgKYAAgyiChGhkgKYgegKgoAKgeAKYgeAKgyAKgUAAIgoAKIAKgoYAAgyDSomAyhkYAegyAohQAogyYAogyAeg8AAgKYAAg8hGgoiggyYhugUgyAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 94, 284);
            return stroke;
        }(),
        326: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMgAKYgUAKgoAUgUAUYhGA8g8AUjcBQYlyCCAAAKAABGYAAAeAKAUAKAKYAUAeCCgeC+hGYE2h4AygKAoAyYAUAKAAAUAAAeYAAA8iqHCg8CMYhQCWAKAyBaAyYC0BaD6FoBQEEYAeB4AACCgeBGYgoBahQAeiggUYiqgejIgUgKAKYgeAKAKAeAoAoYAUAUBQAyBGAoYDSCCBQA8AyBGYBQCMBkgUB4igYCCigA8iqAAjIYAAiggyiWhaigYhki0kOksiChQYhuhQAKgUD6mGYCMjSAogoBkhGYBagyAUgygUgoYgKgehahGh4haYiWhkhQgJhGAT").cp().ef());
            stroke.setBounds(0, 0, 145, 294);
            return stroke;
        }(),
        327: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALuAAYgUAKgUAUgUAKYg8AygyAUkEBQYiMAyh4AogUAAYgoAUgJA8AdAyYAUAeAyAABkgoYBugyE2huAoAAYAoAAAoAoAAAoYAAAUhuFUgeA8YgoBGAAAeAeAeYAKAKAUAUAUAKYBkAoC0C0A8B4YAoBQAUBagKAoYgKAygeAUhGAAYg8AAgoAAiMgoYhkgUhkgUgUAAYgogKgKAAAAAUYAAAeA8AoBaA8YDSBuBkBQBaB4YBGBaB4gyBQigYCMkshukYl8ksYhkhQgegeAAgeYAAgeA8haBkhuYBahuAygoA8geYAygeAUgeAAgeYAAgehGhGhkhGYh4hahGgJg8AJ").cp().ef());
            stroke.setBounds(0, 0, 128, 195);
            return stroke;
        }(),
        328: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOYAAYgUAKgoAUgoAeYjICWiMA8lKAyYhQAKgeAKgUAKYgUAeAAAyAKAeYAUAUAAAABuAAYCMgKDwg8CMg8YCMg8AKAAAeAUYAyAUAAAUgyB4YgoBQgyCMg8CqYgUAyAKAoBGB4YBaCgA8BuAABGYAKAogKAKgUAUYgUAUgKAKgeAAYi+AAi+AKgKAKYgKAUAKAKCWBGYCgBQB4A8BkBGYAeAUAoAUAKAAYAoAAA8g8Aog8YAehGAAAAgKhaYAAhGgKgygUgyYgohuhGiCg8hGYhuiWgUgegKgoYgKgyAUgoBQh4YCCjIBGhQB4huYAUgKAUgeAAgKYAKgegKgKgegoYhGhQiWhahQAAYgUAAgeAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 132, 189);
            return stroke;
        }(),
        329: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQaAKYgUAAhaAehQAUYkOBQjcAojIAKYhGAAg8AKgUAAYg7AKA7B4B4A8YBQAoAoAADmg8YB4geCggoBQgUYBGgKBQgUAUgKYAogUAUAKAAAUYAAAej6FejwEsYigDIhkBuhkBaYgyAog8AygKAKYgeAeAAAKgKAyYAAAeAAAyAKAUYAUBGAeAADIg8YAogUCMgeB4geYC+goB4gUGkhQYCggeEEgUAyAKYBQAKAKAKAKCMYAUFAhkIIiqHCYhGDIgyBahQBuYhaB4goAegoAAYgUAAhugehugoYhugohagogKAAYgoAAAUAeBQBaYB4B4BQBuBGB4YAoBQAyAyAeAAYAeAABagyBQhQYCCiMCCiqBQiqYBkjICCnqBuqeYAykEAKgoAyg8YAUgeAUgUAAgKYAAgogogohQg8YiqiCgygKiMAoYiWAelKBGmkA8YjIAojIAegoAKYgyAKgoAAAAgKYgegUBQh4C+jmYGun0CgiWCghQYBQgoAUgKAAgeYAAgyiWiCiCgyYgygUhGAAhGAK").cp().ef());
            stroke.setBounds(0, 0, 235, 383);
            return stroke;
        }(),
        330: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AL4AAYgUAKg8AUhGAUYiWAyiWAUiqAUYiCAKgKAAAAAUYAAAeAeA8BGAoYA8AoAKAAAyAAYAoAAAygKA8gUYBagUD6hGAegKYAeAAgKAehQBuYi+EEiqC+iWBuYgoAegeAogKAKYAAAKgKAoAAAoYAAA8AUAeAoAAYAKAABkgUBugUYG4huJ2hQA8AeYAoAeAUCMgeBkYgoCMhaDShGBkYgoA8haBGgoAKYgUAAg8gKhQgKYhGgUgygUgKAAYgKAAAAAeAUAUYAoAeA8BkAyBkYAyBkAoAyAUAAYA8AADSiqBuiWYB4igAyiCBGlUYAeiCAKgeAogyYAUgUAKgeAAgKYAAgohGhGhkgyYhuhGgoAAi0AyYhQAUigAehuAKYh4AUiqAehuAUYhuAKhGAKgKAAYgegeAogyDwjmYDmjwB4hkBGgKYAogKAUgUAAgeYAAgoh4huhagyYhGgegyAAg8AA").cp().ef());
            stroke.setBounds(0, 0, 187, 221);
            return stroke;
        }(),
        331: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXIAKYgeAKhGAegyAUYhuAyjwBGlABaYkiBQg8AKiMAKYiCAKgoAKAAAeYAAAoBkA8BkAeYBQAKBQgKD6hQYGkiMFAhQAyAKYAeAKAoAoAAAeYAAAygoCCgyCWYhQD6hQCqhuB4YhGBaAAAoA8BGYAyAoAUAABagoYBQgeCqgyA8AAYA8AAAyAoAUA8YAoBkgUEshGEOYhQFoiCEYhuBQYhQAygoAAjchQYiWgogygKgKAAYgeAUAKAUBkBuYBkB4B4CWAyBaYA8BaAeAKBagoYBug8B4huBah4YCMi+BakYBkqAYAoj6AKgyA8haYAyhaAAgeg8gyYg8g8iWhQhQgeYg8gUgeAAiWAoYi0AygUgeBai+YBGiMC+lABkh4YAegeAogoAegeYA8goAegygKgoYgKgohahGiChGYiCgygegJhaAT").cp().ef());
            stroke.setBounds(0, 0, 211, 335);
            return stroke;
        }(),
        332: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AT2AeYgoAehGAUgeAUYiMAyl8BalyBGYhkAUhkAUgUAAYgKAAgKAKAAAKYAAAUBGBQA8AUYBGAeBGgUEYhaYD6hQDIg8CggeYCCgeAKAehQCWYg8CCgyBGg8BGYgyAyAAAKAAAeYAAAeAKAeAKAeYAeAyAoAKBGgoYBug8DwgoBQAUYAoAKAUAyAAA8YAAC+h4FohGAyYg8AohagKjchGYh4goAAAAB4CgYAoAyA8BQAeAoYBGBuAoAeAoAAYAoAAB4g8A8gyYBQhGAyhkBQksYBGjIAohuA8hGYAUgeAUgeAAgKYAAgegygyhahGYhuhGgogKigAeYjIAehGAAAAgyYAAgeB4iqBQhaYAogoAogoAegKYAUgUAegUAKgKYAUgUAAgKgKgUYgKgegygohkgyYhugxgeAAhkAn").cp().ef());
            stroke.setBounds(0, 0, 202, 190);
            return stroke;
        }(),
        333: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMA8YjwBuhuAeowBGYhGAKg8AKgUAAYgeAUgKAyAAA8YAUA8AKAAD6gyYI6h4DmgyAUAAYAUAAAUAUAUAKIAUAeIgKB4YAABGgKDmgUDcYgyMMAKgogyCMYgeBGAAAKAKAoYAUAyAoA8AoAKYAKAAAeAAAUAAYCMgyCqgoB4gUYC0goDmAAA8AeYBQAoAUBGgUCqYgyIIgeDSgyCWYgeBugoBQgUAKYgUAUg8geg8goYgUgUgUgUAAAAYgUAAAUA8A8CMYAeBQAyBkAKAyYA8CWAoAKBuh4YBahQAohQAUhaYAoiqBuo6AokEYAUiWAehGBGhaYBuiCgKgUjIiMYhQgyhagygUgUYg8geg8AAh4AeYgoAKigAUiWAeYkiAygUAAgUgyYgUgyAopsA8m4YAei+AKgUBahuYBQhkgKgoiMhkYhQgyighGgeAAYgKAAhGAUhGAo").cp().ef());
            stroke.setBounds(0, 0, 267, 379);
            return stroke;
        }(),
        334: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AakAeYiCAolUBQnqBQYksA8jIAKh4gUYhagUgxAyAdBGYAUAoCMCCBGAoYBaAyAyAABQgyYCChQAegKC0g8YDchGImiMBagKYBGAAAAAAAKAUYAUAogeAyg8BQYgeAogyA8goAyYiCCqiqDcgeAUIgeAeIgygUYhkg8h4gegeAeYgKAUAAAABGBaYA8BaAeBkAeDIYBGHWAUEigKGkYgKGQgUCWhQCqYgeBGgKAKgeAKYg8AUiCgKiqgoYj6g8gUgKgUAUYgKAKAAAKAAAKYAAAAA8AyBGA8YCqB4BuBkCCCCYA8AyA8AyAUAKYAeAAAygUBGgyYBQhGAyg8AyhuYBkjIAUi+gKm4YgKk2genMgokOYAAgogUiggKigYgUiWgKiMgKgKYgKgUAKgKBGgyYBkhGEEi+BkhQYBQhQAygeBkgeYCMgyAygygKgyYgUgyi0jchahGYhQgxgeAAh4An").cp().ef());
            stroke.setBounds(0, 0, 223, 394);
            return stroke;
        }(),
        335: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQkAUYgyAUigA8igAyYk2BuhGAKi0AAYhQAAgUAKgUAKYg7A8CpCWCMAAYAyAAAUAABQgoYBugyFoiWBageYA8gUAyAAAoAoYAUAUAKAegUAeYgUAokYHCAAAKYAAAAgegKgUgKYgUgKgUgKgUAKYgyAKAAAeAyBuYBuD6AyDcAUFeYAeGkgyG4haBkYgeAUAAAAgyAAYgeAAiCgoh4goYjwhGg8gUgeAUYgUAKAUAUB4BkYCWCCC0C0BaBuYBQBkAyAoAoAKYBkAUBuhuBQjIYAohuAKhGAeigYAej6gKqeg8ksYgUiWgUhGgyhkYgohkgKgUg8g8YgegegUgeAAgKYAAgKA8g8B4haYAogoA8g8AygoYAygoAygyAegUYAygoBuhGAogKYAegKAegoAAgeYAAgyhahGi0huYhugxgyAAh4Ad").cp().ef());
            stroke.setBounds(0, 0, 162, 331);
            return stroke;
        }(),
        336: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAUYgoAUiWAyiCAoIjwBQIiMAKYhQAAhGAKAAAAYgxAyCVCCBuAAYAUAAAogKAogUYAogUCCgyB4gyYC0hGAygUAUAKYAyAAAUAeAAAeYAAAKjIFogUAUYAAAAgUgKgegUYgygogygegUAAYgKAAgKAKgKAKYgKAKAKAUAoBQYBaDSAeCCAAEsYAADIAAAogUBGYgeB4geAygeAKYgUAAhQgUiMgeYh4gehkgUgKAAYgeAKAUAUAyAoYBkBGBuBaBuBuYBaBGAeAeAeAKYBGAKAygeAyhaYBuigAekEgel8YgKjSgoi0gohQIgehGIAogoYAogoCqiWBahGYAegeA8goAygUYBQgoAUgegegyYgKgehuhGhkgyYhagegogJhkAd").cp().ef());
            stroke.setBounds(0, 0, 133, 215);
            return stroke;
        }(),
        337: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAKYiWBugyAehaAoYjIBkjIBGhaAAYhQAAAoBGBkAUYB4AeC0goEEhaYB4gyAKAAAyBGYAeAeAAAUAAAyYAABGAAAKgoAyYgeAegeA8gUAeYgUA8gKAUAABQYgKBkAUAyBGCCYBQCMA8B4AUBGYAUBGAACMgKAyIgUAeIiMAKYiCAAgoAKhkAUYi+A8iMAUhuAKYhuAKgeAKAAAoYAAA8BkBkBkAyYBGAoAUAAB4hGYBkg8BagyBugeYBGgUAeAAB4AAYB4AAAUAABuAoYDcA8FUCCFoCqYFACMEiBuFABGYDcA8BQAKBagUYCMgUEYh4C+iCYBuhGAUgUgUgKYAAgKiqgKkOAAYjwAAjSgKgUAAYgUAAg8gKgoAAYkYgUlehQlohuYj6hQleh4iCg8YgegUhQgUg8gUIhkgUIAUgUYAogeAohaAKhGYAKh4goh4hui0YhaiMgUhkAeh4YAoiMCgkOBQhkYBQhag8hGkYhuYhkgegeAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 416, 278);
            return stroke;
        }(),
        338: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJsAKYgKAKgoAegUAKYhuBQkYB4hkAKYgyAKgKAAAAAUYAAAyCCAUCCgeYAogKBageBGgUYCCgyAKAAAoAyYAyA8gKBGhGBQYhQBugKCCA8BuYCWEEAeBagKBuYgKAeAAAegKAAYAAAKgeAAhQgUYhugoiMgKhkAKYgyAKgyAAg8gKYhagKAAAAgUAUYgTAoAnBaBQAoIAyAeICggUYDmgUBGAKDcBaYA8AUB4AyBaAoYBaAoBuAoAeAUYAoAKBuAyBaAoYC+BGFoCgBGAeYBkAoBugKC0hQYEYiCD6h4AegUYAUgUAKgKAAgUYAAgygegKloAUYiqAAiMAKgKAAYAAAAhkAKhuAAYk2AAgegKsqkEYiMgoh4gogKAAYgUgKAKAAAegoYAygyAUg8gKhaYgKhGgUg8haiWYgyhaAAAAAAhQYAAhaAAAAA8iCYA8iCAog8Ayg8YAyg8gKgehGgyYg8goiWg8goAAYgKAAgeAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 318, 218);
            return stroke;
        }(),
        339: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAsYAAAYgKAKgeAUgeAKYhaA8hGAoiWAyYhQAUhaAegeAKYhQAUk2BQiWAeYnqBukOAokEAKYiWAAgKAKgKAUYgeAeAAAoAeAyYAoA8BuBkA8AeYBQAoAogKCMg8YA8geBagoAygUYBkgeCqg8AygKYAUAABageBugeYEYhQGGhaAoAAYAoAAAUAUgKAeYgKAUhuBkkYDcYl8EslKD6loDwYiMBkiCBQgUAKYgUAUgyAUg8AKYgyAUhQAUgoAKYhGAUj6Aog8AAYgoAAgUAeAAAoYAAAyBaBuBkAyYBGAyAogKBag8YBkhGBkgoBugoYBGgeAoAABkgKYBkAAAUAABaAUYCqAyEiBuDmBuYA8AeAyAUAAAAYAAAABQAoBaAoYFUCqDcBQE2BkYCMAoDwAyAyAAYCWAAEEhuEEiqYB4haAogUgKgUYAAgKhugKksAAYmkgKlAgUjcgoYhugUj6g8gygUYgUAAg8gUhGgUYiWgyloiCi0hGYhGgohkgogygUYhagoiWgog8AAYgoAAgKgKAegKYAogUC+hkCChGYG4kEG4ksFAj6YA8gyBGgyAogeYBGgyDchuB4goYBkgoAUgKAAgyYAAhGhuiCighuYhGgygUgKgoAAYgeAAgeAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 422, 290);
            return stroke;
        }(),
        340: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbCAKYhGAUAAAUAyBuYAUAoAUAogKAAYAAAAgeAKgeAKYhGAKhuAejSAyYi+AohkAUj6AyYhuAUiMAUg8AUYhQAUhQAKhuAAYiCAAgUAKgKAUYgTAeAJAyAeAeYBGAyDmCCAoAAYAUAABGgeBagoYC0haB4gyDSg8YAogKAogKAUgKYAKAABageBageYBageB4goBGgUYA8gUA8gUAAAAYAKAAgKEYgKBQYgKAegKA8AAAeYgUBkg8C+goBuYiWGQjmEOnCEsYigBkgeAUAKAeYAUAoDwg8C+hkYCCg8BGgyCgh4YDIiqBGhQCMj6YBujcA8igAyj6YAUhGAUhaAKgoYAKgoAKg8AKgoYAUhaAUg8AohQYAog8AAgogKgeYgKgeiChQhkgyYhugohQgJg8AT").cp().ef());
            stroke.setBounds(0, 0, 223, 240);
            return stroke;
        }(),
        341: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAm6AAKYgKAUgKAUAAAUYgKAUgKAegKAUYhGBaoIDwoIC0YhGAUhGAUgKAAYgKAAgogKgygeYiMhGhQgKgeAeYgeAeAKAUAoBGYAUAoAUBGAKAoYAyCWgUJsg8FUYgeC+hQD6haDIYhuEEigDSkODwYhGA8g8A8AAAKYgJAyBPAKBagyYBagoDci0B4h4YB4huCCi0A8h4YAyhaAyiWAoiWYAyjcBGnMAelyYAAhuAUiqAKhQIAeiMIBugUYCCgUIIh4CCgeYAygUBkgeBGgUYCWgyCggoCqgUYCMgUAogKAAgoYAKhGhkhaj6iCYh4gygogJgeAT").cp().ef());
            stroke.setBounds(0, 0, 303, 351);
            return stroke;
        }(),
        342: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXcAKYAAAAgKAUAAAKYAAAUgKAeAAAeYgeBGi0C0jmCqIi0CCIh4gyYiChGg8gKgoAoYgeAeAKAeAyBaYAeAoAeA8AAAUYAUA8AAKKgUC+YgoImhaFojcHgYgoBahQCWgyBkYgyBugeBQAAAKYAKAeA8gUAyg8YA8g8CgjcA8haYDclUCWn0BGo6YAejwAAgUAUlKYAKigAKigAAgeYAKgeAKgyAAgUYAAgeAKgKAogKYBQgeEYh4CghQYBkgyBageA8gUYBugeAogegKgyYgKgygyhGhQhQYhuhkhkgngoAd").cp().ef());
            stroke.setBounds(0, 0, 190, 370);
            return stroke;
        }(),
        343: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASmAKYgKAKgKAUAAAyYgKBkgKAoiCCWYh4Cgn0H0gegKYgKAAgogUgogUYg8gUgUgKgUAKYgoAKAAAoAoBaYA8CMAKBQAKC+YAKC+gKIIgUCMYgoFUgyC0hkCMYgoAygKAeAAAeYAAAyAKBkAeA8YAyBkAeAABGhaYCWi+Cgi0EOkYYC+i+AegygoAAYgUAAiCBQi+CMYi+CMAAAAgUgUYgUgKAAgeAKjSYAAiCAKiMAAgeYAAhGAKiWAUnWYAKjcAUjmAKAAYAeAAH0lADIiMYCWhuBQgoB4gyYB4gogKhkiCiMYg8g8huhQgygeYgygKgyAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 164, 343);
            return stroke;
        }(),
        344: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOEAAYgKAKgKAUAAAoYAABQgKAehQBuYhuCMhGBQi+C+Ii0CqIgogUYg8gehGgKgeAUYgeAUAAAeAUAUYAUAUAyCCAKA8YAUBkAKF8gUC+YgKDSgUBagyBuYgoBkgJAoATBQYAyB4BGBQAogKYAKAAAogoAogyYAogoCWiqCWiWYFAk2BGhQgUgKYgUgKiMBGjwCMYhuBGg8AegeAAYgoAKgKgKAAgeYgKgoAKp2AKh4YAejIAAgegUgeYgUgUAAAABQgyYBug8DmigCqh4YCChkB4hGAeAAYAKAAAUgKAKgKYA8gygUhGhuhuYhkhuhugxgyAT").cp().ef());
            stroke.setBounds(0, 0, 127, 261);
            return stroke;
        }(),
        345: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAUYgKAKgKAeAAAKYAAAygyBGhkBQYhQBGi+CCh4BGIhuBGIgygeYhGgog8gUgyAKYgoAKgJAeAJAeYA8BkAUAeAUAyYAeBaAUCWgKC0YAACMgKAog8BaYgoA8gKBQAeBQYAoBkBGBkAyAAYAKAAAygyA8g8YB4h4C+igEYjmYEOjSBuhkAAgeYAAgUgUAAhGAoYgoAeigBQiWBQYigBQiWBQgeAUYhGAegyAAgegoYgUgegKgoAKloIAKi+IBQgeYDShGCWg8Bkg8YAogeCggyA8gKYBGgKAKgKAAgyYAAgeAAgegUgUYgohGi0iggoAAYgKAAgKAKAAAK").cp().ef());
            stroke.setBounds(0, 0, 131, 189);
            return stroke;
        }(),
        346: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAKYgUAUAAAKAUA8YAUCMgeCCiCDwYhuDckEGai0DmYhaCCiMCMiWBuYiMBkgUAeAAAoYAABGBGCqAoAoYAoAUAUAABkgoYCqgyEsgyGagoYCCgKB4gKAeAAIAygKIgUAeYhkCCuYOihuBQYgUAUg8AegoAUYhuA8geA8AyBkYAoBQB4B4AoAAYAKAABGgUBQgeYHCi0H+iCKehaYJOhQgeAAAogeYAKgKAKgUAAgKYAAgKgKgKhaAAYloAAtmBkpOBaYiqAegeAAAegyYAohQIwpYJspsYFKlUCWiMB4haYAogeAogoAKgKYAUg8hGh4iChuYhkhQg8gegoAAYgyAAgUAegKBGYgKBagUBGhGB4YhuDchkCgiCCqIg8BQIoSgKYn0AAgoAAgegUYgKgKgKgKAAgKYAAgKDSksCqjcYDSkOD6kiDcjwYBGhQA8hGAKgUYAUgeAAgKgUgoYgohkjIjShGgUYg8gKgyAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 273, 378);
            return stroke;
        }(),
        347: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANmAUYgUAKgKAeAAAyYAAAogKAogKAUYgoBkiqC0iWBkYgoAeg8AogeAUYgoAegeAKhGAKYhkAUgUAKgoBGYg7CMAdBkBkgyYA8geBugKFAAKYFeAKgUAAAAAAYAAAKjwCqloDwYgUAUgoAUgeAKYiCAoAABGB4CMYAUAUAUAUAKAAYAKAAA8gUBGgUYEYhuCWgoH0hkYBugUDmgoCWgUYCMgKAygUgKgoYgKgUhGAAjcAUYlyAejIAemGA8YiMAUgyAKAAgKYAAgeQ4rkCghGYBkg8AUgKgUg8Ygoh4iqiWg8AUYgKAAgKAUgKAeYgoBkgUAUhGBaYhaBuhkBuhuBaIhaBQIiWgUYmug8goAAAAgUYAAgUBagyC+huYCWhaCMhQAegKYAogUAKgKAKgeYAehGgyiMh4h4YgygogegJgeAd").cp().ef());
            stroke.setBounds(0, 0, 202, 177);
            return stroke;
        }(),
        348: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKKAKYgUAUAAAKAUAyYAyCWhGDSjSGGYiMEEgeAoiCB4YiBCMAAAKAdBkYAUBGBQBQAeAAYAKAAAygUAygUYCChGGkiCAUAUYAKAAgoAykiFyYj6E2g8A8g8AoYiCBQAUBQCWB4YBGA8AUAAB4hQYC0h4DmhuFAh4YCWgyAUgKAUgeYAAgKAAgKgKgKYgKgUgUAAhaAUYhuAUjwAyjIA8YiMAogUAAAUgyYAKgUEElKBGhQYAUgUB4iMB4iWYDwkOA8hGBahQYA8gyAKgUgog8Yg8hQighuhQgKYg8gKgeAUAABaYAABagoCChuDIIgoBaIhuAKYgyAAh4AKhQAAYhQAKhQAAgKAAYgKAAgKgUAAgKYAAgKAyhQA8haYCgkEB4igDwlAYAyhGAKgegyg8Ygog8iCh4g8geYgygKhGAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 154, 260);
            return stroke;
        }(),
        349: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALQAKYgUAKAAAKAUB4YAUBQgKBagoB4Yg8CgkOIIhaCCYgeAeg8A8g8A8Yh4BuAAAUAAA8YAKBaBkCMA8AAYAKAAAygUA8geYCMg8G4iWAUAUYAKAAmuImg8A8YgUAUgoAogUAKYhQAygKA8AyBGYAeAoBkBQAeAAYAKAAA8geBGgoYDIiMBugyE2h4YC0hGAUgKAAgeYAAgUAAgKgeAAYg8AAksBGjmBGYiMAogKAAAUgyYAyhkLQtwB4hkYBQhGAAgUgUgyYgohGiqh4hGgKYhGgKgKAUgKBkYAABGgKAogyBkYgoBkhuDmgUAUYgKAKAAAAksAKYiCAKh4AAgKAAYgKAAgKgKAAgUYAAgyHWqyDmkYYAygyAAgegeg8YgUgoigigg8geYg8gehagJgeAT").cp().ef());
            stroke.setBounds(0, 0, 163, 257);
            return stroke;
        }(),
        350: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGkAKYgKAKAAAKAKAUYAeBQgyCCiCDmYhGBugeAohQBQYg8A8geAoAAAUYAAAeAoBGAoAUYAUAKAKAAA8geYBugyE2hQAKAUYAKAAgoAokOE2YiCCWg8AygoAeYhPAogKAoAxA8YAoAoBGAyAUAAYAKAAA8gUA8goYCWhQB4gyDwhQYDIhGAegUgUgeYgUgKiqAej6A8YhaAUhaAUgUAAYhGAUAyhGHqn+YBuh4CCiCAogeYAygoAegeAAgKYAAgohahGhagyYhGgegUgKgeAKYgeAKAAAAgKA8YAAAogKAoAAAUYgeAyg8B4goBQYgoBGgKAAgeAAYgUAAhaAKhaAAYh4AKg8AAgKgKYgKgKCgjwC0jSYA8hGAogyAAgUYAAgUhkhkg8geYgogKgyAAgKAK").cp().ef());
            stroke.setBounds(0, 0, 120, 165);
            return stroke;
        }(),
        351: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHqAKYgKAKAAAUAKAoYAoCCgyCgigFKYh4DwgKAehuBuYgoAygoAyAAAKYgJA8BFCWAyAAYAKAAA8gUA8geYB4g8DchQAoAKYAUAAAAAKigDcYkYGGgeAogyAeYhaA8AKA8BaBaYAeAeAeAUAUAAYAKAAAygeAygoYBuhGDIhuC+hGYCCg8AegKgKgeYgKgUAAAAgoAKYhGAAjIA8iMAoYh4AogeAAAAgKYAAgoJYsWBuhuYAogoAUgeAAgKYAAgyiCiChageYg8gKgKAKgKBkYAABGgoCChGCCYgKAegKAAjcAKYiMAKgeAAgKgKYgKgKAKgUA8h4YBui+B4jIB4iqYAyhGAohGAAgKYAAgyiMigg8geYgogKgyAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 114, 218);
            return stroke;
        }(),
        352: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgdAUAJAUAeBaYA8BuAAAUAUMCYAUMCAAAUAKAKYAUAUBGgKAogKIAogKIAAs0YAKpsgKjIgKgUYgKgehuhkgygeYgygKgUAAgoAK").cp().ef());
            stroke.setBounds(0, 0, 33, 186);
            return stroke;
        }(),
        353: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAAYAAAKAKC+AKBkYAKAoAKDIAADSYAAEsAKBkAKAoYAeCMBkCCAogKYAegKAehGAKhGYAUhkgUlUgejmYgUiWhQlogKgUYgUgegegogegKYgogUgoAAAAAA").cp().ef());
            stroke.setBounds(0, 0, 32, 146);
            return stroke;
        }(),
        354: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANSAAYiCAoloA8jIAKYiCAKgeAKAAAoYAAAoA8A8BGAUYBaAoA8AABagUYBugeEig8AoAAYBkAAAUAygeDIYgoFehaHWgoAoYgeAegygKhQgyYhQgygegKAAAyYgKAeAyBkAyBaYAUAoAoBQAeBGYAyCCAeAoAoAAYAeAAA8geAegoYBQhkBGi0AykOYAojIBamaAUgyYAKgeAehGAegyYA8h4AAgUhahQYhGhGh4hQhQgyYg8gUgoAAgyAA").cp().ef());
            stroke.setBounds(0, 0, 135, 188);
            return stroke;
        }(),
        355: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAgqAAKYgUAAhkAehaAeYk2Bkj6AylKAyYjIAel8AojIAUYiMAKgKAKgoAoYgUAoAAAoAKAyYAeA8AyAKDmgyYBagKDSgoCggUYCqgeFKgyDmgeYDmgoDIgeAKAAYA8AAAyAUAoAyYA8A8AUBGAABkYAACgiCKohaFKIgUAyIi0AoYm4BQj6Aom4AyYiqAKiMAUgKAKYhGAoAeBaBaAoYA8AeCCAADmgoYBugKBugUAeAAYAegKBQgKBGAAYBugUEYgUFUgUYAygKBuAABkgKYCqgKAUAAAUgUYAKgKAKgUAAgKYAAgUhQhag8gyIgegUIAeiMYBupYB4lKDmkEYBGhQAKgogKg8YgKhQhag8kiiMYiMhGgUgKg8AAYgoAAgyAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 283, 230);
            return stroke;
        }(),
        356: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMMAUYigBkhkAejcBGYiCAeh4AogKAKYgoAKAAAoAAAoYAKAeAAAAAyAAYAUAAA8AAAogKYI6iWAeAAAeAeYAyAygKBGhGFoIgyEOIhaAeYgyAKiCAohkAeYjSA8geAUAKAyYAUBQA8AKCggoYCWgoCWgeDmgoYBugUBugUAKgKYAogUgegyhkg8YgogUgKgKAKgUYAAgKAKg8AKgyYAeiCA8i+AohGYAKgeAog8AUgoYAogyAKgUAAgeYAAgygUgehQgoYgegKhGgogogeYhug7g8AAhQAd").cp().ef());
            stroke.setBounds(0, 0, 128, 136);
            return stroke;
        }(),
        357: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdYAAYgKAAgyAeg8AUYh4A8j6A8l8BGYlKA8i+Aej6AKYjSAUgeAKAAAeYAAAeAoAoBQAoYBGAeAAAACMAAYB4AAAogKBkgUYEEg8NIiqA8AAYAyAAAeAeAAAyYAAAohuFKhaDcYgyCCgyBQhuB4Yg8BQgKAKAAAyYAABaBaB4BQAKYAUAAAeAAAogUYBQgoAUgoAKiWYAAgeAKgyAKgeYAKgUBai0Bui+YC+loA8hQBagyYA8geA8gyAAgeYAAg8i0iCighGYhGgehaAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 241, 165);
            return stroke;
        }(),
        358: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeAAKYgUAKgeAKgKAKYhGAyjcA8hkAAYg8AAgeAKAAAyYAABQA8AeBageYBQgeBagKA8AKYA8AKA8AUAUAeYAeAygUCMhkEiYhuFUi0DwleEOYkiDmnMDwlKBkYhaAegJAKAJAUYAeAeCWgUDwgyYGkhuGGi0EsjwYBkhQC+jIBGhaYB4igBQigBGkEYAyiqA8h4BGhGYA8hGAKgKAAgoYAAg8huhuiWhQYhQgehGgJhQAT").cp().ef());
            stroke.setBounds(0, 0, 242, 230);
            return stroke;
        }(),
        359: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGGAKYgKAKg8AogoAoYgoAohQA8g8AoYg8AogoAeAAAKYAAAKAKAKAKAKYAyAUBagKBugoYBQgeAUgKAUAKYAUAKAKAKgKBQYAAAygUBugeBaYhGEigoCChGBkYgeAegKAegKAeYAAAyAAAAAeAUYAUAUAKAKBGgKYBagKAKgKAKhkYAAg8AUgoA8igYAohuAyiCAUg8YA8igA8huBaiCYBah4gygyjmhGYhkgUgoAAgyAK").cp().ef());
            stroke.setBounds(0, 0, 82, 135);
            return stroke;
        }(),
        360: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJYAKYgeAKhGAKhGAAYg8AKg8AKAAAAYgUAUAAAyAUAUYAeAUAAAABGAAYA8AABaAeAUAeYAKAUAKAUgKBGYgUD6h4FKi0E2Yg8BkgoA8iCC+YgoBGAAAKAKAKYAUAKC0iWB4h4YAygyA8hQAegoYBkigB4kOB4leYAUhaAohkAUgoYAegoAKgoAAgKYAAgegygyg8geYhGgUhaAAg8AK").cp().ef());
            stroke.setBounds(0, 0, 94, 167);
            return stroke;
        }(),
        361: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APeAUYhQA8hGAygoAUYhQAojmBGi0AyYjwA8gyAUgUAeYgJAeAJAoAoAUYAUAUAeAABuAAYCWAAAogKCMhGYBugyCWg8BagUYAygUAUAAAoAKYBQAeAAgKAAHMYAAEOAADIgKBuIgKCgIAeBGYAoBGAoBGAoAUYAoAUAegKBQhGYBGg8CWhQBkgeYAeAABugKCWAAYDwgKAAAAAAgUYAKg8huhug8AAYg8AAk2AyhkAUYiMAegeAAgegeYgygyAAhkAKn0YAUk2AAhGAohQYAohQAAgegegeYgKgKhGgog8geYighFgyAAg8Ad").cp().ef());
            stroke.setBounds(0, 0, 221, 178);
            return stroke;
        }(),
        362: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAegJBQAdAeYAUAUAyBuAeBGYAUAyAAAoAAGaYAAG4gKCCgoFUYgUDIgKBGgeBGYgeBQAUA8B4BQIA8AoIBkgUYA8gUA8gKAKgKYBGgoAAi+hQhGYgegUAAgKgKhaYgUiMAepsAeksYAUkYAUhaAohQYAohkgKgeh4hQYh4hQiMhGgyAAYgeAAgUAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 53, 236);
            return stroke;
        }(),
        363: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkuAAKYgyAKh4AUhuAAYhkAKhkAAgUAKYgUAAgyAAgeAKYhkAKqeBajmAoYigAUksBGiqAoYhkAegKAKgKBGYAAAoAAAAAUAeYAUAUAUAAA8AAYAyAAA8AAAogUYC+g8HghkFAgyYFogyISgyBQAUYBQAUAyAeAUAoYAeAygUCMg8FeYhGHMhQEYhaCWYhQCMgoAKkOhGYi0gygyAAAAAUYAAAKAoAoAyAyYCqC+CMC+AeBQYAKAoAyAoAoAAYAyAABag8BkhaYCWiWAohaA8kiYCCpYB4oIA8igYAUgeAegyAUgeYA8hGAAgUhahQYgogohQg8g8goYiCg8gegJiWAT").cp().ef());
            stroke.setBounds(0, 0, 292, 245);
            return stroke;
        }(),
        364: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAegJgUAxCCYAyCCAKBagKJYYAAI6gKAygoDcYgeCMAKAyBaAoYA8AUAUAAA8geYAegeAUgKAKgoYAUg8AAhQgUgoYgUgoAAgeAAo6YAAqAAAgKAyjIYAehuAAAAgUgUYgyhGighQhGAAYgUAAgUAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 37, 206);
            return stroke;
        }(),
        365: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANwAUYgyAUi+Ayi+AoYmGBagoAKgUAUYAAAeAAAyAKAeYAoAoAoAAB4goYCCgyCMgeCggeYC0gUBQAAAyAUYBGAeAKAogoDmYgKBGgUCWgUCCYgeDmgKBQgoBkYg8CCgUAKiqgyYhGgKhQgUgUAAYgyAAAAAeBGBQYBaBkBGBuAoBGYAeBGAeAeAeAAYAoAABagyBGg8YBGgyA8huAehkYAUhGAejmAolUYAokOAUhQBQiWYAohQAAgUgUgoYgegoh4hkhagoYhQgngoAAh4Ad").cp().ef());
            stroke.setBounds(0, 0, 138, 187);
            return stroke;
        }(),
        366: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AB4AKYgKAKAAAUAUBGYAUBkAKDwgKDIYgUCqAAAUhQBuYgyBGAAAUAAAoYAKAoCCBaAoAAYAeAABQgyAUgoYAegyAAhGgUgyYgUgoAAgKAAiMYAUkOAKgeAei+YAeiqAAAAhug8YhagogygJgUAT").cp().ef());
            stroke.setBounds(0, 0, 39, 122);
            return stroke;
        }(),
        367: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYOAAYgyAUiMAUiWAUYhQAKi0AUiWAeYjwAoiCAUk2BGIh4AeIAAAeYAABGAyA8BQAAYAUAAAogKAegKYDIhaGuhQG4goYDIgUAeAAAyAUYBGAUAUAyAABkYgKBageDcgyDcYgoC0gKAegyAyIgeAeIhQAAYgyAAhQgUg8gKYi0gogoAKBaBQYBkBaBuB4AoA8YBQB4AeAKBuhQYCMhkAog8AyiWYAUgoBGlKA8k2YAeiWAUgoAyg8YAygyAAgUAAgUYAAgog8gyiMhGYhkgygKAAhGAAYgyAAgoAAgUAA").cp().ef());
            stroke.setBounds(0, 0, 205, 160);
            return stroke;
        }(),
        368: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYEAeYlyBunWBQn0AeYiqAKgeAKAAAeYAAAUAUAUBGAeYBQAeBGAACqgeYBQgUC0gUCMgUYCMgUB4gUAKAAYAAgKBugKCCgUYCWgeBkgKAUAKYA8AKAoAeAAAoYAAAehGDIgUAeYgKAKjmBGi0AyYgoAKgyAKgeAKYiCAekOAokiAeYk2AeAAAAAKA8YAKAeBkBuAeAKYAKAABkgUBkgUYD6g8J2h4CWgUYCCgUDIgUA8gKYBagKAUg8g8g8IgogoIAog8YAyhGAygyBGgoYBQg8AUgegeg8YgKgehkg8iMhGYiCg7goAAiqAn").cp().ef());
            stroke.setBounds(0, 0, 215, 105);
            return stroke;
        }(),
        369: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUUAKYgKAKhQAUg8AeYiqA8iqAyiMAeYjwAohuAUiWAKYhQAUhGAKgKAKYgTAUAJAeA8AeYA8AeAUAKBGAAYAoAABQgKAogKYAygKCCgeBkgUYBugUCqgeBugeYDmgoAUAAAoAeYAyAoAKAygUBkYgKB4geC0gUBQIgUA8Ig8AUYgoAKh4AehuAUYi0Ayi+AojIAoYiCAUgeAoBGA8YAUAUAeAUAoAKYA8AKAUAACMgeYDwgoFygyDIgUYBkgKBagUAKAAYAegegKgog8gyIg8gyIAUhGYAyi0A8igA8hQYAKgUAegeAegeYAyg8AKgogUg8YgKgogogei+haYhug8geAAgoAAYgoAAgoAAgUAK").cp().ef());
            stroke.setBounds(0, 0, 184, 129);
            return stroke;
        }(),
        370: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AP8AAYgUAAh4AeiMAoYiMAejSAyh4AeYiCAUhuAegKAKYgxAeAxBQBkAUYA8AKAUAACMgUYDwgoFog8DSgUYCggKAegKAUgUYAegegUgehGg8YhahGhGgKh4AA").cp().ef());
            stroke.setBounds(0, 0, 138, 39);
            return stroke;
        }(),
        371: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUAAUYjmBQjwBQi0AeYi0AehGAKkEAoYhkAKgUAKAAAeYAAAUBGAoAyAUYBQAegeAAMqigYCWgeCCgUAUAAYAyAKAoA8AABGYAAA8geCWgeCgYgKBGgKA8AAAAYAAAAgeAKgUAAYgeAAhuAehuAUYjmA8leBQiCAUYiWAUhaAUgUAUYgxAoAxBQBaAeYA8AKB4AAB4gUYEEgoBagUDcgeYCCgKDIgUBugUYDmgUAUAAAAg8YAAgegygohGgyYgegUgKgKAAgKYAAgKAUg8AUhGYA8jIA8huBGhQYBGg8AUhGgegyYgUgogogUiqhaYiMg8g8gJhaAd").cp().ef());
            stroke.setBounds(0, 0, 182, 133);
            return stroke;
        }(),
        372: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAKAAAeAKAUYAKAoAAAyAACCYAADSAKAyBGA8YA8A8A8AUCqAAYCMAABQgUAKgeYAUgegKgogUgeYgog8g8gKi0AUYhQAKgUAAgKgUYgegeAKigAohQYAUgeAAgKgKgeYgKgyg8gyhGgUYhGgUgoAAAAAK").cp().ef());
            stroke.setBounds(0, 0, 64, 70);
            return stroke;
        }(),
        373: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AKYgKAKAKAyAeB4YAUBkAKDSgeBQYgKAygoA8goA8YgJAUATAyAyAyYAyA8AUAACWg8YEOhkFohGH0goYCCgKAUAegeC+YgUC+gKA8geA8YgUA8AABGAUAUYAUAUAKAAAyAAYBkgKAogoAeiMYAoiCAehGBuhkYA8hGAegeAAgUYAAgoh4hki+haYg8gegKAAhQAKYgoAAi+Aei0AoYm4BakOAohQAAYhaAAAAAKAeh4YAUhuAyiCAegoYAUgUAKgeAAgKYAAgehuhuhQgyYhQgygygJgUAT").cp().ef());
            stroke.setBounds(0, 0, 200, 136);
            return stroke;
        }(),
        374: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAUYgoAoAKAeAyAoYA8AyAeA8AUBQYAUBGAAE2gUCqYgKCMgoDwgUAeYgUAogoAogyAoYgeAeAAAAAAAeYAKAoCMCWAoAUYAeAKAKgKAogUYAygeCgg8B4geYCggoEEgoH0gyYEigeCggKGuAAYG4AACCAKEiAoYB4AUAogKAegoYAegeAAgygegyYgegyhkhQhagoYgygegKAAhaAAYg8AAhkAKg8AKYmGBG6QCqkiAKYgyAAAAAAgUgyYgehQAAhkAyn+YAUjSAKhuAUgUYAKgogKgygegeYgegehug8hGgUYhagKg8AAgeAU").cp().ef());
            stroke.setBounds(0, 0, 348, 168);
            return stroke;
        }(),
        375: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AR+AUYhGA8geAUi+AyYlABukEA8iqAKYgyAAgyAKAAAAYgxAyCfBuB4AAYAyAKAegKBGgoYA8gUCWgyCMgyYE2hkAogKAKAKYAAAAgKBGgKBGYgeC0gKDIAKBuYAUCMAKAoBQBGYAyAyAUAKAyAKYAeAKBaAKBGAAYCCAAAKgKAygUYBQgeBah4AAg8YAAgKgKgogUgeYgyhGgehGgUhaYgKg8gKgegKAKYAAAKgUAygUA8YgeCCgeBGgeAeYgUAUgUAKg8AAYiMgKhGg8AAhuYAAhQA8jIA8h4YAohQAKgUA8goYAegUAUgeAAAAYAAgehuhahGgeYhugxgUAAgyAd").cp().ef());
            stroke.setBounds(0, 0, 184, 122);
            return stroke;
        }(),
        376: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAUAAAyAABQYAKBQAKDcAKJiYAKHCAKAeAyBkYA8BkBkBQBuAyYCWA8EiAeGuAKYEiAKCMgKD6geYC+geDcgeAUgUYAegKAKgoAAgyYAAiCiChGkOgKYh4gKgUAAgeAUYhaA8goAKi+AeYhuAUh4AUgyAAYi+AelUgUiMgoYjShGgyhaAUmGYAKk2AejSBQigYAohaAAgogUgyYgegyiqigg8geYgygUhGAAgoAA").cp().ef());
            stroke.setBounds(0, 0, 240, 198);
            return stroke;
        }(),
        377: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAgMAAKYjwBQhaAeiWAoYlABQlAAynWAyYmaAoAAAAgeAUYgnAyAABkAxAoYAeAUBugKDIgoYBagKCCgeBQgKYDcgeJ2hkDIgeYBkgUBkgKAUAAYA8AAAyAUAoAyYA8A8AUA8AABuYAACWhaH+hkFoYhkGQAUBGCqgKYBGAAAUgKAUgUYAegoAUhGAyjmYAoj6BQksAyiCYBGjSBkiqBkh4YBahkAUg8gohGYgeg8hag8jchuYiqhQgUgKg8AAYg8AAgeAAg8AK").cp().ef());
            stroke.setBounds(0, 0, 283, 211);
            return stroke;
        }(),
        378: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbqAAYgUAAhaAUhkAUYmuBQl8A8m4AyYi0AUhQAUgUAKYgxAoATBQBQAoYBGAoBkgKD6goYFKgyFygeISgoYC+gKCggKAUAAYAegKAegeAAgUYAAgoiqiWhGgeYgegKgyAAhGAA").cp().ef());
            stroke.setBounds(0, 0, 217, 48);
            return stroke;
        }(),
        379: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHWAKYhkA8haAejcBGYg8AKgJAeAJAeYAUAUBGgKCCgeYC+g8AoAAAeAKYAeAKAAAogeCMIgUBkIgeAKYg8AKkOBagKAKYgUAUAAAeAeAKYAUAKgKAKFKgyYB4gUB4gUAKgKYAKAAAAgUAAgKYAAgUgogogUAAYgUAAAAgKAehGYAUhaAUgeAog8YA8hGgKgUiChQYhkgogegJgyAT").cp().ef());
            stroke.setBounds(0, 0, 77, 66);
            return stroke;
        }(),
        380: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfGAUYh4AoiMAeiMAKYgyAKhkAKhQAKYhGAKiWAUhkAUYhuAKjmAeiqAeYi0AUi0AUgeAKYhkAKgeAKgKAyYAAAyAAAeAeAUYAoAUAUAABagUYA8gUE2g8CWgUYBGgKDmgoDSgUYEOgoH0goAoAKYAeAAAeAeAKAeYAAAogUB4geBaIgUBGIiWAeYi0AomGBQhkAUYgyAAhkAUhQAKYhaAKhGAAgKAKYgKAAiWAKi0AUYi0AKigAUgKAAYgeAUAKAeA8A8YBkBQAAAADSgoYD6goCMgUEOgoYCCgUCWgUA8gKYBkgUGQgoCggKYBagKAoAAAKgKYAUAAAegoAAgKYAAgKgKgUgUgUIgegeIAohaYAog8AegoA8hGYBahQAKgegUgyYgKgehuhah4hQYhag7goAAiMAd").cp().ef());
            stroke.setBounds(0, 0, 252, 108);
            return stroke;
        }(),
        381: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfaAUYiWAohuAUjIAeYhuAKiCAUgyAKYg8AKiCAKhuAUYhuAKi0AehuAKYhuAUiWAUhGAKYjSAUgKAKgKA8YAAAoAAAKAKAUYAUAoAeAAB4gUYE2hGIShQHCgyYAeAAAogKAUAAYAeAABugKBugKYDcgUAUAAAeA8YAUAegUBagyCWYgoCCAAA8AeAoYAeAUAKAKAyAAYA8AAAAgKAegUYAKgKAUgoAKgeYAoh4A8haBQhQYBahQAKgegUgyYgKgeigiChkg8YhQgegUgJh4Ad").cp().ef());
            stroke.setBounds(0, 0, 252, 82);
            return stroke;
        }(),
        382: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQuAKYgyAKh4AohkAeYjmBQh4AehuAAYhQAAgUAAhageYhugogogKAAAoYAAAoAoA8A8AeYBGAeCCAoBkAKYBkAUBQgKCMgoYBugoBugUAoAAYAoAAAKAKAUAUYAeAeAAAKAAAoYAACWiWEikiFyYiCCgiCCWiMB4YhGBGg8AyAAAKYgKAKAKAKAUAUYAyAoCqhGCqiMYFAkOCqiqC0jwYB4iqCWi0AygyYAUgUAogeAegUYAygoAygyAAgUYAAg8hGhaiChaYiqiChQgTi0Ad").cp().ef());
            stroke.setBounds(0, 0, 171, 182);
            return stroke;
        }(),
        383: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATEAAYgKAAiWAKigAAYmGAUiqAKiCAUYgyAUgyAKAAAAYgKAAAKAKAKAKYAUAUAAAAgUAAYgeAAAAAUAUAUYAAAKAAAAgUAKYgeAAAAAKAAAKYAAAUgKAKgUAAYgUAAgKAKAAAAYAAAeBQAyAoAAYAUAAAKAKAAAAYAAAKAKAAAUAAYAKAAAeAKAUAUYBQAoAeAKAUAAYAKgKAKAKAKAAYAKAKAUAAAygKYCCgeBkgKHWgUYM0geJiAUGuBaYAyAKAyAKAKAAYAAAAAAgUAAgKYgKgKAKgKAUgKYAUgKAUgUAAgKYAKgKAUgUAKgKYAUgKAAgKAAgUYAAgKAAgKAAAAYAUAAAAgUgUgKYgKgKgogKgegKYgeAAgogUgUgKYgUgUjmg8iMgUYjcgojmgUlAgUYjSAAngAAgeAA").cp().ef());
            stroke.setBounds(0, 0, 332, 48);
            return stroke;
        }(),
        384: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAnYAAKYgUAKgeAegoAeYgeAogeAUgKAAYgUAAmaGuiqC+YhQBahaBkgeAeYgyA8hGBQhkB4YgeAygoAygKAKYgKAKgyA8goAyYgyA8goAyAAAAYgKAKgUAUgKAUYgUAegUAUAAAAYgKAKgUAUgKAeYgUAegUAUAAAAYgKAKgKAKgKAKYgKAeiMC0gyA8YgUAUgoA8goA8YgoAyg8BageAoYigDIkiHWAAAyYAAAUAAAAAoAAYAoAAAKAKAAAUYAAAKAAAUAUAAYAKAKAKAUAAAUYAAAUAAAAAyAAYAoAAAKAKAKAKYAAAKAKAAAKAAYAyAAAUAAAAAUYAAAUAAAAAUAAYAoAAAUgUAUgyYAKgUAUgoAKgUYAKgUA8haBGhkYCCjSAogyBah4YAogyA8hQAUgoYAyg8BQhuAyg8YAUgUA8haBkiMYAegeAyhGAogoYAegyBkh4BahuYBahuBkh4AegeYC0jcDSjcDSjSYDmjwAogygyAAYgoAAAKgKA8g8YAygoAUgogUAAYgKAAAAgKgKgKYAAgKgKgKgKAAYgUgKAAAAAAgUYAAgKgKgKgUAAYgUAAgKAAAAgKYAAAAgKgKgUAAYgoAKAAgKAAgUYAAgUgKgKgKAAYgUAAAAAAAAgUYAAgKgeAAgeAK").cp().ef());
            stroke.setBounds(0, 0, 282, 336);
            return stroke;
        }(),
        385: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAAYAAAAAAAKAAAKYAAAKgUAKgKAAYgUAAgeAKgKAKYgUAKAAAAgKgKYgKgKgKAAgeAKYgUAKgUAKAAgKYgKgKgKAKgeAKYgUAKgUAAgKAAYAAAAgUAAgKAKYgKAKAAAAgKgKYAAgKgKAAgUAAYgUAAgKAAgKAyYAAAyAAAAAKAeYAUAUAAAAgKAUYgKAKgKAUAAAKYAAAKA8BuBQCCYBQCCE2H0E2HqYEsHqEEGaAUAeYA8A8A8AKCgAAYB4gKAKAAAogUYAegUAegeAUgUcAA8gBaAUyghwAAKgAKYAAgKgKgUgUgKYgKAAgUgKAAAAYgKAUg8goAAgUYAKgKgKgKgegKYgegUgKgKAAgKYAKgKgKgKgegKYgUgKgUgUgKgKYAAAAgKgKgKgKYgKAAgKgKAAgUYAAgeAAAAg8AAYgoAKgUAKgUAUYgUAUgUAKgKAAYAAAAjcFykOHCYrQTOAyhQgUgKYAAgKhui+iCjcYiCjcj6maigkiYiqkiigkOgegoYgUgogegogUgKYgKAAgKAAAAAA").cp().ef());
            stroke.setBounds(0, 0, 336, 268);
            return stroke;
        }(),
        386: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABaAUYgKAUgKAUAAAUYAAAegKAAgeAKYgUAAgKAKAAAAYAAAeAoDwAeBQYA8DwAeBkBuDcYAeBGAeA8AAAAYAAAAAeA8AeA8YCCDcDmEsDcDSYFUFKGuEYHCC+YAyAeBuAoBGAeYCqBGBkAoB4AeYB4AoAUAAAAgeYAAgUAUgeAegKYAKAAAKgKAAgKYAAgKAAgKAKAAYAAAAAKgKAAgKYAAgKAAgUAKAAYAUgUgygegygUYhGgKi0hGh4gyYqekOommumGomYhGhah4jSAAgKYAAAAgegygeg8Ygyh4g8iCgehkYgoh4hGkEgKh4YgUhagUgogUAeYgKAUhGgUgKgKYgKgKgKgKgUAAYgKAAgKAAgKgKYAAgKgUgKgeAAYgUAAgegKgKgUYgUgKgKAAgeAU").cp().ef());
            stroke.setBounds(0, 0, 306, 310);
            return stroke;
        }(),
        387: function() {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEYAAYgKAKAAAUAAAUYgKAoAAAKgeAKYgeAAgKAUgKAUYAAAUgKAKAAgKYgKgKAAAAgoAKYgeAKAAAAAAAeYAKAKgKAKAAAAYgKAAAAAKAAAKYAAAKgKAUgUAKYgKAKgKAUAKAKYAAAAgKAKgKAAYgdAAAJBGAeAeYAoAeAAAAgUAKYgKAKAAAKAAAUYAKAUBGAoAoAAYAKAAAKAAAAAKYAKAKAAAAAKgKYAKAAAUAKAUAKYAoAeBGAeAeAKYAeAABGAUAKAUYAKAAAKAKAKAAYAKAAAKAAAAAKYAKAKAygKAegeYAKgKAKgKAKAAYAKAAAKgKAAgKYAKgUAKgUAUgKYAUgUAKgKAAgKYgKAAAAgKAKgKYAKgKAAgKgKgKYgUgeAeg8AegeYAUgKAKgKgKgKYAAAAAAgKAKAAYAAAAAKgKAAgKYAAgUgogUgKAUYgUAUAAgeAKgeYAegygKgUg8gKYgegKAAAAAKgoYAAgUAAgKgUgUYgUgKgKAAAAAUYgKAKAAAAgUgUYgKgKgUgKgKAAYgUAAgygeAAgKYAAAAgegKgeAAYgogKgegKgKAAYAAgKgeAAgKAAYgUAAgUgKgKAAYAAAAgKAAgKAA").cp().ef());
            stroke.setBounds(0, 0, 89, 77);
            return stroke;
        }()
    };
    
    /**
     * @property {Array} spriteSheets
     */
    var spriteSheets = [
        {
            "images": ["images/strokes/strokes-0.png"],
            "frames": [
                [1633, 1035, 407, 71],
                [557, 816, 297, 58],
                [1751, 1778, 294, 248],
                [1628, 1686, 150, 90],
                [219, 446, 111, 399],
                [879, 1271, 100, 388],
                [573, 1673, 343, 373],
                [209, 1704, 188, 338],
                [2011, 1108, 35, 246],
                [856, 781, 286, 93],
                [1674, 606, 113, 80],
                [2, 1295, 234, 407],
                [58, 2, 52, 425],
                [1564, 1135, 65, 149],
                [1674, 373, 147, 231],
                [1448, 2, 224, 53],
                [1448, 57, 132, 136],
                [1564, 1358, 62, 107],
                [2, 453, 215, 428],
                [1145, 2, 109, 373],
                [1242, 1523, 76, 161],
                [112, 2, 287, 412],
                [401, 2, 302, 395],
                [386, 878, 263, 397],
                [1388, 374, 284, 362],
                [2, 883, 197, 410],
                [201, 883, 183, 406],
                [1170, 377, 216, 370],
                [1242, 1242, 320, 279],
                [2004, 1544, 42, 138],
                [1823, 195, 223, 249],
                [981, 1257, 259, 368],
                [1413, 1523, 213, 253],
                [1652, 195, 169, 176],
                [2004, 1684, 40, 75],
                [332, 816, 23, 61],
                [332, 416, 264, 398],
                [1286, 749, 146, 124],
                [974, 2, 169, 376],
                [901, 876, 334, 379],
                [1628, 1370, 374, 314],
                [1564, 962, 67, 171],
                [1636, 738, 410, 295],
                [1633, 1108, 376, 260],
                [1237, 876, 325, 364],
                [598, 399, 295, 380],
                [1155, 1686, 256, 360],
                [2, 1704, 205, 342],
                [918, 1661, 235, 383],
                [399, 1693, 172, 352],
                [705, 2, 267, 379],
                [455, 1277, 223, 394],
                [238, 1291, 215, 400],
                [1823, 446, 223, 240],
                [1256, 2, 190, 370],
                [895, 383, 273, 378],
                [1448, 195, 202, 177],
                [680, 1271, 197, 388],
                [2011, 1356, 33, 186],
                [1582, 57, 82, 135],
                [1564, 1286, 64, 70],
                [1434, 738, 200, 136],
                [1674, 688, 332, 48],
                [1413, 1778, 336, 268],
                [651, 876, 248, 393],
                [1320, 1523, 75, 161],
                [1144, 763, 140, 111],
                [1155, 1627, 74, 51],
                [1674, 2, 368, 191],
                [202, 416, 34, 28],
                [112, 416, 88, 28],
                [1564, 876, 70, 84],
                [2, 2, 54, 449],
                [1780, 1686, 205, 89],
                [357, 816, 198, 60]
            ],
            "animations": {
                "s0": [0],
                "s1": [1],
                "s122": [2],
                "s143": [3],
                "s149": [4],
                "s153": [5],
                "s161": [6],
                "s163": [7],
                "s17": [8],
                "s170": [9],
                "s173": [10],
                "s179": [11],
                "s18": [12],
                "s182": [13],
                "s191": [14],
                "s2": [15],
                "s202": [16],
                "s203": [17],
                "s205": [18],
                "s209": [19],
                "s213": [20],
                "s221": [21],
                "s222": [22],
                "s223": [23],
                "s224": [24],
                "s226": [25],
                "s227": [26],
                "s228": [27],
                "s233": [28],
                "s24": [29],
                "s249": [30],
                "s251": [31],
                "s252": [32],
                "s260": [33],
                "s27": [34],
                "s28": [35],
                "s280": [36],
                "s288": [37],
                "s293": [38],
                "s295": [39],
                "s299": [40],
                "s30": [41],
                "s300": [42],
                "s301": [43],
                "s307": [44],
                "s310": [45],
                "s323": [46],
                "s324": [47],
                "s329": [48],
                "s33": [49],
                "s333": [50],
                "s334": [51],
                "s34": [52],
                "s340": [53],
                "s342": [54],
                "s346": [55],
                "s347": [56],
                "s35": [57],
                "s352": [58],
                "s359": [59],
                "s372": [60],
                "s373": [61],
                "s383": [62],
                "s385": [63],
                "s39": [64],
                "s48": [65],
                "s61": [66],
                "s65": [67],
                "s70": [68],
                "s79": [69],
                "s8": [70],
                "s84": [71],
                "s9": [72],
                "s97": [73],
                "s98": [74]
            },
            "texturepacker": [
                "SmartUpdateHash: $TexturePacker:SmartUpdate:d0158853b1645e208c48443b6738fe2a:d9532969c80bac4bfbf537950fe6b98a:fed0832bfe3652164039b99744bf4d04$",
                "Created with TexturePacker (http://www.texturepacker.com) for EaselJS"
            ]
        },
        {
            "images": ["images/strokes/strokes-1.png"],
            "frames": [
                [1192, 730, 53, 323],
                [1936, 733, 110, 217],
                [1532, 758, 172, 192],
                [416, 1409, 71, 66],
                [312, 1479, 275, 200],
                [1437, 1970, 168, 70],
                [1201, 103, 58, 285],
                [844, 103, 355, 329],
                [1460, 1770, 246, 198],
                [1709, 1276, 221, 234],
                [1545, 1289, 145, 140],
                [1708, 1849, 218, 196],
                [1345, 1849, 43, 197],
                [1709, 950, 223, 115],
                [1928, 1849, 118, 89],
                [783, 385, 58, 241],
                [736, 1163, 102, 269],
                [339, 415, 77, 163],
                [783, 282, 59, 101],
                [589, 1409, 145, 295],
                [1933, 1137, 113, 213],
                [2, 294, 335, 308],
                [416, 1164, 310, 243],
                [2, 604, 324, 170],
                [373, 1681, 213, 100],
                [1262, 1289, 133, 141],
                [230, 1681, 141, 361],
                [843, 703, 313, 224],
                [1982, 2, 60, 344],
                [1460, 1431, 247, 212],
                [750, 628, 91, 344],
                [1194, 531, 56, 197],
                [373, 1783, 108, 262],
                [324, 983, 90, 208],
                [736, 974, 104, 187],
                [328, 648, 87, 123],
                [1962, 627, 79, 104],
                [1460, 1645, 247, 123],
                [1390, 1847, 45, 196],
                [1261, 238, 349, 314],
                [843, 434, 349, 267],
                [1261, 2, 367, 234],
                [418, 542, 330, 242],
                [2, 1477, 308, 202],
                [1156, 1134, 51, 147],
                [1932, 1352, 114, 275],
                [1934, 952, 109, 183],
                [1397, 1289, 146, 140],
                [1252, 554, 344, 183],
                [2, 1681, 226, 361],
                [1612, 249, 348, 251],
                [426, 282, 355, 258],
                [1962, 348, 84, 277],
                [843, 929, 311, 358],
                [768, 1783, 305, 257],
                [417, 786, 321, 156],
                [736, 1434, 101, 347],
                [1247, 952, 247, 335],
                [2, 1294, 309, 181],
                [2, 776, 324, 134],
                [320, 1193, 94, 284],
                [1496, 952, 211, 335],
                [1706, 758, 202, 190],
                [426, 2, 416, 278],
                [416, 944, 318, 218],
                [2, 2, 422, 290],
                [1010, 1434, 164, 343],
                [483, 1783, 127, 261],
                [612, 1783, 154, 260],
                [1932, 1629, 114, 218],
                [1158, 703, 32, 146],
                [839, 1434, 169, 346],
                [1709, 1512, 221, 178],
                [1612, 502, 348, 168],
                [1247, 739, 283, 211],
                [339, 580, 77, 66],
                [1176, 1434, 282, 336],
                [1156, 1055, 89, 77],
                [1075, 1779, 268, 266],
                [1709, 1067, 222, 207],
                [328, 773, 87, 119],
                [1983, 1940, 48, 98],
                [328, 894, 86, 87],
                [1630, 2, 350, 245],
                [2, 994, 316, 298],
                [840, 1289, 301, 143],
                [1709, 1692, 221, 145],
                [844, 2, 415, 99],
                [1598, 672, 336, 84],
                [339, 294, 85, 119],
                [1201, 390, 58, 139],
                [1928, 1940, 53, 102],
                [1345, 1772, 100, 73],
                [1143, 1289, 117, 143],
                [588, 1706, 52, 75],
                [2, 912, 320, 80]
            ],
            "animations": {
                "s10": [0],
                "s104": [1],
                "s108": [2],
                "s113": [3],
                "s114": [4],
                "s118": [5],
                "s12": [6],
                "s121": [7],
                "s129": [8],
                "s130": [9],
                "s137": [10],
                "s138": [11],
                "s14": [12],
                "s141": [13],
                "s147": [14],
                "s15": [15],
                "s150": [16],
                "s151": [17],
                "s152": [18],
                "s155": [19],
                "s157": [20],
                "s166": [21],
                "s167": [22],
                "s168": [23],
                "s172": [24],
                "s175": [25],
                "s180": [26],
                "s186": [27],
                "s19": [28],
                "s207": [29],
                "s208": [30],
                "s21": [31],
                "s210": [32],
                "s212": [33],
                "s214": [34],
                "s215": [35],
                "s216": [36],
                "s218": [37],
                "s23": [38],
                "s231": [39],
                "s232": [40],
                "s234": [41],
                "s235": [42],
                "s236": [43],
                "s26": [44],
                "s262": [45],
                "s263": [46],
                "s269": [47],
                "s275": [48],
                "s281": [49],
                "s283": [50],
                "s284": [51],
                "s29": [52],
                "s297": [53],
                "s302": [54],
                "s303": [55],
                "s31": [56],
                "s311": [57],
                "s321": [58],
                "s322": [59],
                "s325": [60],
                "s331": [61],
                "s332": [62],
                "s337": [63],
                "s338": [64],
                "s339": [65],
                "s343": [66],
                "s344": [67],
                "s348": [68],
                "s351": [69],
                "s353": [70],
                "s36": [71],
                "s361": [72],
                "s374": [73],
                "s377": [74],
                "s379": [75],
                "s384": [76],
                "s387": [77],
                "s43": [78],
                "s52": [79],
                "s59": [80],
                "s60": [81],
                "s64": [82],
                "s68": [83],
                "s69": [84],
                "s74": [85],
                "s75": [86],
                "s76": [87],
                "s77": [88],
                "s82": [89],
                "s85": [90],
                "s86": [91],
                "s90": [92],
                "s91": [93],
                "s93": [94],
                "s94": [95]
            },
            "texturepacker": [
                "SmartUpdateHash: $TexturePacker:SmartUpdate:d0158853b1645e208c48443b6738fe2a:d9532969c80bac4bfbf537950fe6b98a:fed0832bfe3652164039b99744bf4d04$",
                "Created with TexturePacker (http://www.texturepacker.com) for EaselJS"
            ]
        },
        {
            "images": ["images/strokes/strokes-2.png"],
            "frames": [
                [718, 1733, 149, 293],
                [736, 308, 230, 298],
                [1115, 426, 202, 233],
                [1833, 751, 203, 180],
                [1104, 1728, 46, 288],
                [1507, 1215, 75, 89],
                [1833, 933, 128, 93],
                [1776, 1029, 270, 163],
                [401, 687, 282, 315],
                [431, 1733, 285, 310],
                [685, 670, 283, 305],
                [1540, 182, 39, 231],
                [1655, 393, 176, 135],
                [1011, 1612, 188, 114],
                [1237, 199, 119, 93],
                [1201, 1612, 109, 112],
                [446, 1379, 122, 325],
                [1417, 842, 132, 182],
                [1207, 661, 99, 179],
                [493, 2, 293, 304],
                [1584, 1215, 190, 87],
                [1152, 1728, 243, 286],
                [1242, 1026, 263, 280],
                [1600, 2, 231, 184],
                [1833, 220, 209, 180],
                [1880, 1629, 165, 167],
                [1833, 1932, 122, 104],
                [1776, 1408, 102, 123],
                [965, 1321, 173, 289],
                [1319, 424, 277, 162],
                [1833, 1722, 45, 205],
                [970, 661, 235, 284],
                [2, 2, 138, 359],
                [696, 1045, 155, 293],
                [1363, 2, 233, 178],
                [1600, 1304, 174, 148],
                [1598, 1725, 233, 253],
                [971, 1612, 38, 118],
                [948, 1027, 292, 292],
                [1880, 1408, 166, 219],
                [1397, 1728, 199, 256],
                [788, 2, 166, 296],
                [1319, 588, 186, 252],
                [1507, 610, 139, 225],
                [1237, 2, 123, 195],
                [1648, 665, 183, 231],
                [1659, 1566, 219, 154],
                [244, 1052, 307, 325],
                [1168, 299, 193, 123],
                [853, 1027, 93, 293],
                [2, 1067, 240, 336],
                [869, 1732, 233, 292],
                [736, 608, 190, 56],
                [570, 1355, 265, 293],
                [2, 716, 215, 349],
                [273, 2, 218, 350],
                [553, 1045, 141, 308],
                [219, 716, 180, 334],
                [1140, 1321, 148, 289],
                [1290, 1308, 143, 278],
                [1363, 182, 175, 240],
                [142, 2, 129, 351],
                [1833, 402, 207, 185],
                [968, 299, 145, 294],
                [307, 354, 162, 331],
                [2, 363, 303, 351],
                [1435, 1308, 163, 257],
                [1551, 837, 94, 167],
                [1600, 188, 53, 236],
                [1507, 1026, 138, 187],
                [1833, 589, 205, 160],
                [1647, 898, 184, 129],
                [837, 1340, 126, 293],
                [591, 1004, 138, 39],
                [1649, 530, 182, 133],
                [731, 977, 217, 48],
                [310, 1733, 119, 312],
                [1244, 842, 171, 182],
                [2, 1735, 306, 310],
                [401, 1004, 188, 39],
                [471, 354, 263, 314],
                [196, 1405, 248, 326],
                [956, 2, 279, 295],
                [1659, 188, 172, 203],
                [1600, 426, 47, 182],
                [1677, 1454, 38, 109],
                [928, 608, 181, 51],
                [1833, 2, 212, 216],
                [1531, 1567, 126, 156],
                [1880, 1798, 165, 132],
                [493, 308, 128, 39],
                [1600, 1454, 75, 110],
                [773, 1650, 196, 80],
                [1312, 1588, 217, 138],
                [623, 308, 102, 36],
                [1776, 1194, 269, 212],
                [1963, 933, 74, 80],
                [1647, 1029, 125, 82],
                [1115, 299, 51, 124],
                [570, 1650, 201, 81],
                [970, 947, 272, 77],
                [2, 1405, 192, 328]
            ],
            "animations": {
                "s100": [0],
                "s102": [1],
                "s106": [2],
                "s107": [3],
                "s11": [4],
                "s110": [5],
                "s112": [6],
                "s115": [7],
                "s125": [8],
                "s126": [9],
                "s128": [10],
                "s13": [11],
                "s132": [12],
                "s142": [13],
                "s144": [14],
                "s145": [15],
                "s154": [16],
                "s159": [17],
                "s160": [18],
                "s162": [19],
                "s178": [20],
                "s184": [21],
                "s185": [22],
                "s188": [23],
                "s196": [24],
                "s199": [25],
                "s201": [26],
                "s204": [27],
                "s206": [28],
                "s217": [29],
                "s22": [30],
                "s225": [31],
                "s229": [32],
                "s230": [33],
                "s244": [34],
                "s247": [35],
                "s248": [36],
                "s25": [37],
                "s250": [38],
                "s253": [39],
                "s254": [40],
                "s256": [41],
                "s259": [42],
                "s261": [43],
                "s273": [44],
                "s277": [45],
                "s279": [46],
                "s282": [47],
                "s287": [48],
                "s290": [49],
                "s296": [50],
                "s298": [51],
                "s3": [52],
                "s308": [53],
                "s312": [54],
                "s313": [55],
                "s314": [56],
                "s315": [57],
                "s316": [58],
                "s317": [59],
                "s318": [60],
                "s32": [61],
                "s320": [62],
                "s326": [63],
                "s335": [64],
                "s341": [65],
                "s349": [66],
                "s360": [67],
                "s362": [68],
                "s365": [69],
                "s367": [70],
                "s369": [71],
                "s37": [72],
                "s370": [73],
                "s371": [74],
                "s378": [75],
                "s38": [76],
                "s382": [77],
                "s386": [78],
                "s4": [79],
                "s40": [80],
                "s41": [81],
                "s42": [82],
                "s45": [83],
                "s47": [84],
                "s49": [85],
                "s5": [86],
                "s53": [87],
                "s55": [88],
                "s56": [89],
                "s6": [90],
                "s63": [91],
                "s66": [92],
                "s67": [93],
                "s7": [94],
                "s73": [95],
                "s78": [96],
                "s81": [97],
                "s83": [98],
                "s87": [99],
                "s95": [100],
                "s99": [101]
            },
            "texturepacker": [
                "SmartUpdateHash: $TexturePacker:SmartUpdate:d0158853b1645e208c48443b6738fe2a:d9532969c80bac4bfbf537950fe6b98a:fed0832bfe3652164039b99744bf4d04$",
                "Created with TexturePacker (http://www.texturepacker.com) for EaselJS"
            ]
        },
        {
            "images": ["images/strokes/strokes-3.png"],
            "frames": [
                [1934, 743, 106, 193],
                [1308, 1296, 179, 238],
                [1209, 965, 101, 151],
                [448, 1368, 159, 165],
                [1538, 836, 171, 138],
                [2, 2, 306, 137],
                [1312, 868, 201, 119],
                [1321, 783, 215, 83],
                [2, 1821, 142, 225],
                [1174, 2, 282, 237],
                [2, 370, 263, 175],
                [1712, 574, 220, 253],
                [2, 1090, 226, 217],
                [126, 1598, 168, 215],
                [564, 1162, 164, 203],
                [737, 912, 183, 170],
                [426, 1536, 157, 186],
                [1305, 1536, 155, 165],
                [889, 137, 281, 173],
                [585, 1598, 133, 123],
                [454, 1724, 131, 95],
                [730, 1360, 159, 234],
                [1164, 1821, 130, 188],
                [1964, 334, 37, 138],
                [290, 1188, 155, 179],
                [892, 1795, 133, 250],
                [889, 2, 283, 133],
                [1712, 442, 237, 130],
                [1141, 1370, 162, 168],
                [447, 1162, 115, 204],
                [1556, 1821, 114, 144],
                [1208, 1118, 98, 250],
                [562, 1821, 164, 201],
                [505, 802, 230, 194],
                [842, 532, 242, 151],
                [1668, 1357, 177, 233],
                [1934, 574, 107, 167],
                [1296, 1821, 136, 168],
                [1933, 938, 113, 138],
                [1704, 1079, 186, 152],
                [1501, 1204, 186, 146],
                [996, 1259, 137, 183],
                [554, 249, 39, 245],
                [2, 1370, 163, 148],
                [1608, 423, 102, 229],
                [2, 547, 262, 129],
                [230, 1091, 182, 95],
                [1424, 287, 249, 134],
                [2, 141, 284, 227],
                [604, 234, 271, 206],
                [1712, 274, 250, 166],
                [595, 442, 245, 191],
                [1368, 423, 238, 251],
                [877, 312, 245, 218],
                [1172, 241, 250, 146],
                [1312, 989, 199, 82],
                [1006, 787, 201, 205],
                [1892, 1203, 151, 253],
                [2, 1598, 122, 219],
                [1847, 1458, 171, 128],
                [1105, 1126, 96, 131],
                [290, 1370, 156, 147],
                [1105, 994, 101, 130],
                [891, 1444, 145, 146],
                [167, 1309, 121, 166],
                [1489, 1352, 177, 244],
                [728, 1801, 162, 234],
                [1141, 1540, 137, 174],
                [1458, 2, 259, 173],
                [609, 1367, 116, 144],
                [2, 678, 259, 213],
                [2, 893, 228, 195],
                [720, 1598, 155, 201],
                [730, 1084, 131, 170],
                [1672, 1863, 120, 134],
                [296, 1536, 128, 187],
                [1719, 2, 258, 186],
                [1515, 976, 187, 226],
                [263, 886, 229, 203],
                [267, 449, 262, 235],
                [774, 685, 230, 225],
                [877, 1598, 128, 195],
                [1007, 1598, 132, 189],
                [1312, 1073, 187, 221],
                [291, 1821, 133, 215],
                [863, 1162, 131, 189],
                [1434, 1821, 120, 165],
                [1027, 1821, 135, 188],
                [604, 2, 283, 230],
                [1672, 1725, 128, 136],
                [531, 635, 241, 165],
                [1124, 389, 242, 230],
                [310, 2, 292, 245],
                [1979, 126, 37, 206],
                [1979, 2, 39, 122],
                [1321, 676, 215, 105],
                [1689, 1233, 184, 122],
                [263, 686, 240, 198],
                [1458, 177, 252, 108],
                [1712, 190, 252, 82],
                [1711, 829, 220, 248],
                [426, 1821, 134, 208],
                [146, 1815, 143, 229],
                [1847, 1588, 169, 231],
                [922, 994, 181, 166],
                [730, 1259, 129, 99],
                [1209, 787, 101, 176],
                [1933, 1078, 106, 123],
                [288, 249, 264, 198],
                [1086, 621, 233, 164],
                [1462, 1598, 131, 128],
                [1668, 1592, 167, 131],
                [296, 1725, 156, 92],
                [1608, 654, 101, 180],
                [494, 998, 182, 99]
            ],
            "animations": {
                "s101": [0],
                "s103": [1],
                "s105": [2],
                "s109": [3],
                "s111": [4],
                "s116": [5],
                "s117": [6],
                "s119": [7],
                "s120": [8],
                "s123": [9],
                "s124": [10],
                "s127": [11],
                "s131": [12],
                "s133": [13],
                "s134": [14],
                "s135": [15],
                "s136": [16],
                "s139": [17],
                "s140": [18],
                "s146": [19],
                "s148": [20],
                "s156": [21],
                "s158": [22],
                "s16": [23],
                "s164": [24],
                "s165": [25],
                "s169": [26],
                "s171": [27],
                "s174": [28],
                "s176": [29],
                "s177": [30],
                "s181": [31],
                "s183": [32],
                "s187": [33],
                "s189": [34],
                "s190": [35],
                "s192": [36],
                "s193": [37],
                "s194": [38],
                "s195": [39],
                "s197": [40],
                "s198": [41],
                "s20": [42],
                "s200": [43],
                "s211": [44],
                "s219": [45],
                "s220": [46],
                "s237": [47],
                "s238": [48],
                "s239": [49],
                "s240": [50],
                "s241": [51],
                "s242": [52],
                "s243": [53],
                "s245": [54],
                "s246": [55],
                "s255": [56],
                "s257": [57],
                "s258": [58],
                "s264": [59],
                "s265": [60],
                "s266": [61],
                "s267": [62],
                "s268": [63],
                "s270": [64],
                "s271": [65],
                "s272": [66],
                "s274": [67],
                "s276": [68],
                "s278": [69],
                "s285": [70],
                "s286": [71],
                "s289": [72],
                "s291": [73],
                "s292": [74],
                "s294": [75],
                "s304": [76],
                "s305": [77],
                "s306": [78],
                "s309": [79],
                "s319": [80],
                "s327": [81],
                "s328": [82],
                "s330": [83],
                "s336": [84],
                "s345": [85],
                "s350": [86],
                "s354": [87],
                "s355": [88],
                "s356": [89],
                "s357": [90],
                "s358": [91],
                "s363": [92],
                "s364": [93],
                "s366": [94],
                "s368": [95],
                "s375": [96],
                "s376": [97],
                "s380": [98],
                "s381": [99],
                "s44": [100],
                "s46": [101],
                "s50": [102],
                "s51": [103],
                "s54": [104],
                "s57": [105],
                "s58": [106],
                "s62": [107],
                "s71": [108],
                "s72": [109],
                "s80": [110],
                "s88": [111],
                "s89": [112],
                "s92": [113],
                "s96": [114]
            },
            "texturepacker": [
                "SmartUpdateHash: $TexturePacker:SmartUpdate:d0158853b1645e208c48443b6738fe2a:d9532969c80bac4bfbf537950fe6b98a:fed0832bfe3652164039b99744bf4d04$",
                "Created with TexturePacker (http://www.texturepacker.com) for EaselJS"
            ]
        }
    ];
    
    /**
     * @method getStrokeShapes
     * @return {Object}
     */
    var getStrokeShapes = function() {
        return shapes;
    };

    /**
     * @method getSpriteSheets
     * @param {Function} callback
     */
    var getSpriteSheets = function(callback) {
        var sheets = [];
        var sheetLoaded = function(sheet) {
            if (sheet.currentTarget) {
                sheets.push(sheet.currentTarget);
            } else {
                sheets.push(sheet);
            }
            if (sheets.length >= spriteSheets.length)
                callback(sheets);
        };
        for (var i in spriteSheets) {
            var sheet = new createjs.SpriteSheet(spriteSheets[i]);
            if (sheet.complete) {
                sheetLoaded(sheet);
            } else {
                sheet.addEventListener('complete', sheetLoaded);
            }
        }
    };


    return {
        getSpriteSheets: getSpriteSheets,
        getStrokeShapes: getStrokeShapes
    };
});