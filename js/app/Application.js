
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/Api',[],function() {
    /**
     * @method Api
     */
    var Api = Backbone.Model.extend({
        defaults: {
            clientId: 'mcfarljwapiclient',
            clientSecret: 'e3872517fed90a820e441531548b8c',
            domain: (document.location.host.indexOf('cn') > -1) ? 'cn' : 'com',
            root: 'https://www.skritter',
            token: null,
            version: 0
        },
        /**
         * @method authenticateGuest
         */
        authenticateGuest: function() {
            var self = this;
            var guest = JSON.parse(localStorage.getItem('guest'));
            if (guest) {
                this.token = guest.access_token;
                callback();
            } else {
                var promise = $.ajax({
                    url: self.baseUrl() + 'oauth2/token',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'POST',
                    data: {
                        suppress_response_codes: true,
                        grant_type: 'client_credentials',
                        client_id: this.get('clientId')
                    }
                });
                promise.done(function(data) {
                    self.token = data.access_token;
                    localStorage.setItem('guest', JSON.stringify(data));
                    callback();
                });
                promise.fail(function(error) {
                    console.error(error);
                    callback(error);
                });
            }
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + 'oauth2/token',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'POST',
                data: {
                    suppress_response_codes: true,
                    grant_type: 'password',
                    client_id: self.get('clientId'),
                    username: username,
                    password: password
                }
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        baseUrl: function() {
            return this.get('root') + '.' + this.get('domain') + '/api/v' + this.get('version') + '/';
        },
        credentials: function() {
            return 'basic ' + Base64.encode(this.get('clientId') + ':' + this.get('clientSecret'));
        },
        /**
         * Using repeated calls it returns the data from a batch request of a given batch id. It works
         * best if the data is stored to the database before getting the next batch otherwise it could
         * cause mobile browsers to crash.
         * 
         * @method getBatch
         * @param {Number} batchId
         * @param {Function} callback
         */
        getBatch: function(batchId, callback) {
            var self = this;
            var retryCount = 0;
            var getBatch = function() {
                var promise = $.ajax({
                    url: self.baseUrl() + 'batch/' + batchId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token')
                    }
                });
                promise.done(function(data) {
                    try {
                        var batch = data.Batch;
                        var requests = batch.Requests;
                        var responseSize = 0;
                        var result = {};
                        for (var i in requests) {
                            if (requests[i].response) {
                                _.merge(result, requests[i].response, skritter.fn.concatObjectArray);
                                responseSize += requests[i].responseSize;
                            }
                        }
                        result.responseSize = responseSize;
                        if (batch && (batch.runningRequests > 0 || requests.length > 0)) {
                            callback(result);
                        } else {
                            callback();
                        }
                    } catch (error) {
                        console.error(error);
                        window.setTimeout(function() {
                            getBatch();
                        }, 2000);
                    }
                });
                promise.fail(function(error) {
                    retryCount++;
                    if (retryCount > 3) {
                        console.error(error);
                        callback(error);
                    } else {
                        window.setTimeout(function() {
                            getBatch();
                        }, 2000);
                    }
                });
            };
            getBatch();
        },
        /**
         * Returns a single vocablist with section ids for further querying.
         * 
         * @method getVocabList
         * @param {Number} id
         * @param {Function} callback
         */
        getVocabList: function(id, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + '/vocablists/' + id,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'GET',
                data: {
                    bearer_token: self.get('token')
                }
            });
            promise.done(function(data) {
                callback(data.VocabList);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * @method getVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         * @param {Function} callback
         */
        getVocabListSection: function(listId, sectionId, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + '/vocablists/' + listId + '/sections/' + sectionId,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'GET',
                data: {
                    bearer_token: self.get('token')
                }
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * Returns a high level list of lists available sorted by type. For longer sort groups
         * it might be necessary to use pagination. Sort values include: published, custom,
         * official and studying.
         * 
         * @method getVocabLists
         * @param {String} sort
         * @param {String} fields
         * @param {Function} callback
         */
        getVocabLists: function(sort, fields, callback) {
            var self = this;
            var lists = [];
            fields = (fields) ? fields : undefined;
            var getNext = function(cursor) {
                var promise = $.ajax({
                    url: self.baseUrl() + 'vocablists',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        sort: sort,
                        cursor: cursor,
                        fields: fields
                    }
                });
                promise.done(function(data) {
                    lists = lists.concat(data.VocabLists);
                    if (data.cursor) {
                        setTimeout(function() {
                            getNext(data.cursor);
                        }, 500);
                    } else {
                        callback(lists, data.cursor);
                    }
                });
                promise.fail(function(error) {
                    console.error(error);
                    callback(error);
                });
            };
            getNext();
        },
        /**
         * @method getVocabs
         * @param {Array} ids
         * @param {Function} callback
         */
        getVocabs: function(ids, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + '/vocabs',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'GET',
                data: {
                    bearer_token: self.get('token'),
                    ids: ids.join('|'),
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
                }
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * @method getUser
         * @param {String} userId
         * @param {Function} callback
         */
        getUser: function(userId, callback) {
            var self = this;
            var tryCount = 0;
            request();
            function request() {
                var promise = $.ajax({
                    url: self.baseUrl() + 'users/' + userId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        detailed: true
                    }
                });
                promise.done(function(data) {
                    callback(data.User);
                });
                promise.fail(function(error) {
                    console.error(error);
                    if (tryCount > 2) {
                        callback(error);
                    } else {
                        tryCount++;
                        console.log('retrying to get user');
                        setTimeout(function() {
                            request();
                        }, 1000);
                    }
                });
            }
        },
        /**
         * Posts batches of reviews in groups of 500 and then returns an array of the posted objects.
         * 
         * @method postReviews
         * @param {Array} reviews
         * @param {Function} callback
         */
        postReviews: function(reviews, callback) {
            var self = this;
            var postedReviews = [];
            var postBatch = function(batch) {
                var promise = $.ajax({
                    url: self.baseUrl() + 'reviews?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'POST',
                    data: JSON.stringify(batch)
                });
                promise.done(function() {
                    postedReviews = postedReviews.concat(batch);
                    if (reviews.length > 0) {
                        postBatch(reviews.splice(0, 499));
                    } else {
                        callback(postedReviews);
                    }
                });
                promise.fail(function(error) {
                    console.error(error);
                    callback(postedReviews);
                });
            };
            postBatch(reviews.splice(0, 499));
        },
        /**
         * Requests a specific batch from the server and returns the request id. Use the
         * getBatch function to get the requested data from the server.
         * 
         * @method requestBatch
         * @param {Array} requests
         * @param {Function} callback
         */
        requestBatch: function(requests, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + 'batch?bearer_token=' + this.get('token'),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'POST',
                data: JSON.stringify(requests)
            });
            promise.done(function(data) {
                callback(data.Batch);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * @method updateVocabList
         * @param {Object} list
         * @param {Function} callback
         */
        updateVocabList: function(list, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + 'vocablists/' + list.id + '?bearer_token=' + self.get('token'),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'PUT',
                data: JSON.stringify(list)
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        }
    });

    return Api;
});
/**
 * @module Skritter
 * @class Strokes
 * @author Joshua McFarland
 */
define('Strokes',[
], function() {
    /**
     * @property {Object} strokes
     */
    var strokes = {
        0: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EA1IAAKYg8AKloA8iqAeYhkAKi+AUjmAUYgeAAhuAKhuAKYhkAKjmAUi+AUYi+AUjSAUhGAKYkYAeiWAKkYAKIksAAIgUAeYgUAUAAAKAAAeYAKBGBQBQCgBGYCCA8AoAKBageYBkgeAoAAC0geYBagUCggUBagUYEigyFKgoF8gUYBaAAC0gUB4gKYFUgUGGAAE2AeYCMAKCWAUAyAAYBGAAAKgKAUgUYAegoAAgogegoYgeg8igh4iqhaYhGgogUAAg8AAYgoAAg8AAgeAK").cp());
            stroke.setBounds(0, 0, 407, 71);
            return stroke;
        },
        1: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkQAAyYiMAejIAohkAUYhuAKh4AegoAKYiqAengAynWAoYjIAKi0AKgUAKYgyAAgoAUAAAUYAAAoC0CMAyAKYAeAABQgKB4gUYEEgyCqgUG4g8YBugUDIgUB4gUYDwgeDcgUGugoYD6gUAKAAAegeYAegUAAgKgUgUYgehGiqhahuAAYg8AAg8AAjIAy").cp());
            stroke.setBounds(0, 0, 297, 58);
            return stroke;
        },
        2: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdiAAYgKAAhaAUhQAeYkEBGmaBkiqAeYigAelyAoigAKYiqAKgdAUAdAyYA8A8CMAoCCAAYAoAACCgKBugUYBugUFAgyEOgyYKohuCggeAygyYAegeAAgUgogoYgUgUgegUgogUYg8gUiCAAgeAA").cp());
            stroke.setBounds(0, 0, 224, 53);
            return stroke;
        },
        3: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWgAeYo6CWloBGl8A8YhuAKgUAKAAAyYAAAeA8A8BQAoYBGAeAUAKBQAAYBQAAAUgKDchGYFyiCCqgyHWhQYDcgoAogUAAgeYAAg8hkg8iCAAYg8AAgoAAiCAe").cp());
            stroke.setBounds(0, 0, 190, 56);
            return stroke;
        },
        4: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUyAeYlyBakiAomaAKYh4AAhkAKgUAAYgxAeAnA8B4A8YBuAyBaAKCqgUYBGAABkgKAygKYCggKDSgeCqgUYBQgKBugKAoAAYC0gUCWgeAegeYAygyg8hGhugyYhkgdhkAJjIAe").cp());
            stroke.setBounds(0, 0, 188, 39);
            return stroke;
        },
        5: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWCAAYgKAAgyAUgyAKYiqA8j6A8kiBGYiWAojIAyhQAUYhkAUg8AUAAAKYgJAoBtBQBkAAYAyAAAeAABQgeYFAhuGkhGHMgoYBkgKBagKAUgKYA8gegeg8hag8Yh4g8hkgThQAJ").cp());
            stroke.setBounds(0, 0, 181, 51);
            return stroke;
        },
        6: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANSAyYjwBGjwA8iqAeYjbAogKAKBFA8YBaBGAyAKBageYBageIIiCCqgeYCMgUAogKAUgUYAKgKAKgKAAgKYAAgoiMg8hQAAYgUAAhQAUhkAe").cp());
            stroke.setBounds(0, 0, 128, 39);
            return stroke;
        },
        7: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AK8AKYgeAAhGAeg8AUYiCA8hGAUigAoYigAogdAUAJAoYAKAoC+AoBkgKYAogKCggoCqgyYDwhQA8gUAUgUYAegogKgegogUYg8gohkgJhuAT").cp());
            stroke.setBounds(0, 0, 102, 36);
            return stroke;
        },
        8: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJYAAYhkAKhGAUi+A8YiCAohaAogKAKYgTAeAJAoAeAKYAeAKBkgKDSgeYBQgUCCgUBQgKYCqgUAegKAKgeYAKgeg8g8g8gKYgygUhGAAgoAA").cp());
            stroke.setBounds(0, 0, 88, 28);
            return stroke;
        },
        9: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgeAUAAAAAAAoYAAAoAKAeAoA8YAyBaAeBGAeBuYAUBGAAA8AKFKYAADcAKDSAAAoYAAAyAAD6gKD6YAAD6gKFeAAC0YAAH0geEOhkFKYgoCWAABkAyCCYBQDSAoA8AyAAYAyAABaigAKhaYAKgoAAqoAAsqYAKsgAAraAAhaYAKkYAyk2Ayh4YAKgeAKgoAAgUYAAgegKgKgygoYhQg8i+h4gogKYgygKgoAAgoAK").cp());
            stroke.setBounds(0, 0, 54, 449);
            return stroke;
        },
        10: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgdAUAJA8AoBQYBaCMAKAoAKD6YAKDmAAMCgUG4YgKEOgKBGg8DmYgoC0AAAeAyCgYAyCMAeBGAoAUYAeAUAAAAAegUYAKgKAegoAUgeYA8hkAAgUAKlAYAKxgAUsCAeigYAKhuAehkAUgyYAehQAAgegygoYgegUgygogygeYgygUgogegKgKYgegUiCg8gUAAYgKAAgeAAgKAK").cp());
            stroke.setBounds(0, 0, 53, 323);
            return stroke;
        },
        11: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAAYgeAUgKA8AAAoYAAAUAoBkAyBkIBaC0IAAFeYAKF8AADSgUDmYgUCqgoDmgeCMYgoCqAUCWBQCqYAyB4BGAyAygeYAygUA8jSAUi+YAAg8AAiMAAiMYgUmGAAyIAUhaYAKhQAAAAgUgyYgehGjcjcg8geYgogKAAAAgoAA").cp());
            stroke.setBounds(0, 0, 46, 288);
            return stroke;
        },
        12: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgKAKgKAUgKAUYAAAeAAAABGC+YBkDmA8DSAUDwYAeC+AeJOAUJYYAABkAKCCAABGYAKA8AABGAAAUYAAAyBkAeBGgeYAKAAAUgUAKgKYAUgeAAgKgKiqYgopOgUjcgKjcYAAiMgKi+gKhaYgKi0AKnqAKhkYAKhGgKhGgegoYgog8jch4hkgKYgUAAgeAAgUAA").cp());
            stroke.setBounds(0, 0, 58, 285);
            return stroke;
        },
        13: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAAYgoAUgJAyAdBuYBGC0AKBaAKEOYAKF8gUEihGG4YgUCCAKAoAoB4YAyCWBGBGAygyYAUgeAohaAehuIAehkIAAr4YAAmkAAloAKgUYAei0AAgogogoYgUgUhQg8hQgoYg8gUgeAAgoAA").cp());
            stroke.setBounds(0, 0, 39, 231);
            return stroke;
        },
        14: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAUYgTAeAJAyAoBuYAUAyAoBaAKAyIAeBkIAAFUYAADwgKCMgKB4YgoFeAKAeBGBkYAyBGBQBGAeAAYAoAAAehGAUhaYAUhkAAiggeloYAAhagKj6AAjSYAAmkAAAAgygyYhGg8huhGgygUYhQgKAAAAgUAU").cp());
            stroke.setBounds(0, 0, 43, 197);
            return stroke;
        },
        15: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAKYgeAeAAAeAUBQYBGDSAKCCgKEOYgUHMhaGkh4D6YgyBkAAAKAABGYAAAyAAA8AKAeYAUBGA8BuAeAKYAoAKBGhGAyh4YBGiqAojmAUkiYAKi0AeloAUi0YAAgyAUh4AAhkYAUi+AUiMAUgeYAKgUAKgKAAgKYAAgohkgyiggoYhGgKgKAAgKAK").cp());
            stroke.setBounds(0, 0, 58, 241);
            return stroke;
        },
        16: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKIgUAUIAUBGYAyBkAKBGAKCWYAACqgUDcgoBuYgeB4AAAKAKBQYAUBuBGCMAoAAYAeAAAyhGAUhGYAyh4AKhQAKl8YAKmGAAgeAehGYAKgoAAgKgUgKYgegojIhGg8AAYAAAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 37, 138);
            return stroke;
        },
        17: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgUAUAAAUAKAeYAKAUAUAoAKAeYAUAyAAAyAAH+YAAEsAAEsgKAyYgKCMgUDwgUBkYgKBGAAAUAKA8YAeCMBGCWBGBQYAyAyA8goAehuYAUhQAAgegKnqYgUnqAAs+AKiCYAKgyAAgyAAgKYgKgUhuhahQgyYgegKgoAAgoAK").cp());
            stroke.setBounds(0, 0, 35, 246);
            return stroke;
        },
        18: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AKYgoAKgUAeAAAUYAAAKAUA8AeAyYA8BuAeBQAUB4YAKBagKSwgUIcYgKIIgKMMAKDSYAKDSAUBQAyBGYAUAoAoAKAegUYAygoAeh4AekYYAekiAAiWAA08YAA2gAABGA8kiYAUhuAAAAgUgoYgKgegegUg8goYighuhagJhaAT").cp());
            stroke.setBounds(0, 0, 52, 425);
            return stroke;
        },
        19: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgoAUAAAoAAAeYAAAUAeA8AoAyYA8BuAoBaAUBaYAoB4AAcSgeJsYgUF8gKgUBuAAYBQAAAogUAKgoYAKgUAAhQAAhaYAAhQAKjIAAiWYAKj6AKmuAUsCYAKmGAUkYAoiWYAKgoAUhGAKgoYAKhQAAgKgKgUYgUgygygohugyYi0hQh4gTg8Ad").cp());
            stroke.setBounds(0, 0, 60, 344);
            return stroke;
        },
        20: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAKAAAoAnBaYAUAoAUAyAKAKYAAAKAKHMAAIcYAKOEAABkAUA8YAeB4AyAoAog8YAog8AAgUAoksYAAgeAKlUAAmGYAAqyAKjIAeiCYAKgoAAgoAAAAYAAgeg8gyhGgoYhag8hGgJg8AT").cp());
            stroke.setBounds(0, 0, 39, 245);
            return stroke;
        },
        21: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AAYgKAAgUAUgKAUYgdAoAJAeAoBQYBQB4AAAUAKD6YAKCCAAE2AAEEYAAKAAAAAAUAUYAoAoBkgUAegyYAKgKAKhQAKh4YAKhuAUigAKhkYAKhkAKh4AKgyYAUlyAei+AoiMYAUhGAKgogKgUYgKgohQg8hagyYhagoiMgogeAAYgKAAgKAAgUAA").cp());
            stroke.setBounds(0, 0, 56, 197);
            return stroke;
        },
        22: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgUAUAAAeAUBaYBGCCAAAoAKD6YAAE2gUJOgUCMYgKBGAABaAAAoYAABGAAAUAeAyYAoBQAeAUAeAAYAUAAAogUAUgoYAKgeAKgoAAmQYAAmQAAg8AUjSYAymQAAgKA8h4YAUgyAKgeAAgUYgKgeg8g8hagyYh4hGhQgJg8AJ").cp());
            stroke.setBounds(0, 0, 45, 205);
            return stroke;
        },
        23: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAUBGYBQCMAyDmAUDcYAAAyAKDmAADmYAAHMAAAKBGCMYAoBGAyA8AeAAYA8AAAeiggei+YgKg8AAgUgUkiYAAhQgKkOAAj6YAAjwgKjIAAgKYgKgUiqhkg8geYhGgegoAAgUAK").cp());
            stroke.setBounds(0, 0, 45, 196);
            return stroke;
        },
        24: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAKAAAeAnBGYAUAeAUAeAAAUYAUA8AUD6AKFeYAAG4AUBGAyAAYAyAAAoiWAejwYAynMAUiqAKhGYAUgoAAgyAAgKYgKgogygyhkgyYhQgohQgJg8AT").cp());
            stroke.setBounds(0, 0, 42, 138);
            return stroke;
        },
        25: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgKAAgKAUgKAUYAAAUAAAKAUA8IAeBGIAKG4YAKDwAADSAKAUYAAAeAKAKAUAAYAyAeBugoAUgeYAAgKAKhkAAhkYAKj6Aej6AUhaYAKg8AAgKgKgeYgUgeigiggygUYgUgKgyAAgeAK").cp());
            stroke.setBounds(0, 0, 38, 118);
            return stroke;
        },
        26: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAeAUBGYBQDIBQEsAyFKYAKBaAUBkAAAeYAUB4BuCgAyAAYAeAAAKgUAUhaYAKhQgUi0gylKYgUiMgUi0gUhQYgKiWgehagegoYgUgUgogUhugeYhugKAAAAgUAK").cp());
            stroke.setBounds(0, 0, 51, 147);
            return stroke;
        },
        27: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgdAeAJAeA8BaYBGBQAeBGBQEOYAUBQAoBGAoAKYAyAKAKg8gUi+YgKhQgKh4AAhGYgKigAAgKhugeYhkgehaAAgeAK").cp());
            stroke.setBounds(0, 0, 40, 75);
            return stroke;
        },
        28: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAKAAAeAABaYAeDwAKAyAUAyYAeA8BGBGAUgKYAUAAAUhGAAgyYAAg8geiggohQYgUhGhahugUAAYAAAAgKAAgKAK").cp());
            stroke.setBounds(0, 0, 23, 61);
            return stroke;
        },
        29: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHWAKYgeAeAKAoAeB4YAoCWgKBaiMJ2YgoCWgyDcgUBkYhuHWiWJsAAAoYAAAoAAAKAUAUYAeAeA8AKA8geYAygUAKgKBGlAYAoiMAyjwAoiWYEYxqBGkYAohGYAehQgKgoiMiMYiCiCgogTg8Ad").cp());
            stroke.setBounds(0, 0, 84, 277);
            return stroke;
        },
        30: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AD6AUYgUAUgKAKAKAoYAAAUAKAoAKAeYAoB4geDSiqK8YhaGGgJA8AJAUYAeAeBkAAAogeYAKgKAKgoAUgyYAKgyAyigAyiWYAyiMA8i+AUhaYAyiWBGigA8huYAUgoAKgeAAgKYAAg8hGhGiqh4YhkgygegJgoAd").cp());
            stroke.setBounds(0, 0, 67, 171);
            return stroke;
        },
        31: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAAYgeAKgUAeAAAeYAAAAAeAyAeAyYAeAyAeA8AAAUYAKAUAKCgAKC0YAUMqhaJ2jcImYgyB4jIGuhGB4YgnB4AAAoA7geYAogKAyg8BuiMYEOloB4kYCCnqYBumuAekEAUqAYAKm4AKgoAegoYAogygKgKiChaYiChaiWgdg8AJ").cp());
            stroke.setBounds(0, 0, 101, 347);
            return stroke;
        },
        32: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMMAKYgeAeAAAUAyBaYBaCgAKBaAUFeYAUG4gUKogoH+YgUDSg8DShQCMYhaCWjICgkYCCYiWBQgTAUAdAUYBGAUDcgyCqhQYEYiCDcjwBQkYYAoigAKhuAKmaYAUtIAUomAKhGYAKgyAehkAehQYAyigAAAAgUgeYgUgyiChGiWgoYhkgUg8AAgUAK").cp());
            stroke.setBounds(0, 0, 129, 351);
            return stroke;
        },
        33: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AScAKYgUAUAeAyBQBaYBuB4AKAUAUDSYAeGQgKJOgeHWYgeEEgeCChkDIYgoBageAohGBQYhuB4iCB4iMBQYh4BQkOCMi0BQYiMA8gKAKAAAUYAUAeBkgKDcg8YDIg8BageC0haYDchuCghuBahkYAygyBkiWAohQYA8iCAoh4AUjIYAylUAKjcAAqoIAKowIAUhuYAehkAAgKgKgUYgogyh4g8i+gyYhugUgoAAgUAK").cp());
            stroke.setBounds(0, 0, 172, 352);
            return stroke;
        },
        34: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AZyAAYgoAUgeAUAAAeYAAAUAUAoAUAyYBQCWAKAygKFKYAAFAgKCggeDmYgeDIhaFog8CgYiCFejIFojSEEYiMC0kiEOjSCWYjICWhtBkAJAUYAKAUA8gKBQgUYD6haE2jIEikiYC+i+Bkh4BkiWYBGhkBaigAUg8YAAgKAohaAohaYCCksBQkiAokYYAKhaAei+AUiWYAeigAUiqAKg8YAUiWAKhGAyigYAohaAAgeAAgeYgeg8kEiMhuAAYgoAAgoAAgKAA").cp());
            stroke.setBounds(0, 0, 215, 400);
            return stroke;
        },
        35: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVuAKYgoAKgeAoAKAeYAAAKAeAoAoAoYAeAoAyBGAUAeIAeBGIAAGuYAAHggUC0gyGQYg8GahuEsjIEsYhkCqjIDIjICgYhuBak2DShkAyYhZA8AAAoBZAAYA8AABGgUC+hQYCgg8BQgyC0huYE2jSCqi0Cqk2YBaiMBkkYAojcYBamQAokYAKlKYAUkiAUkYAUhQYAKgoAUhQAKg8YAohuAAAAgUgeYgeg8jSh4iMgoYg8gKhGAAgyAK").cp());
            stroke.setBounds(0, 0, 197, 388);
            return stroke;
        },
        36: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUAAAYgoAKAAAeAeBaYBGCgAUBagUD6YgUFohQIShQEiYhQD6iqF8iMDSYh4C+jIDIi+CWYiWBuhuBkAAAKYAAAeAKAKAyAAYBGAABQgoCChQYEsi+DmjcC+kYYEEmGCqpiCCw4YAAhGAUhGAAgKYAKgKAKgyAKgoYAKhaAAgogogUYhGg8jchkgoAAYAAAAgKAAgUAA").cp());
            stroke.setBounds(0, 0, 169, 346);
            return stroke;
        },
        37: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAAYgyAUAAAUAoBaYA8BuAKBGAKCgYAUDmgoHqgoD6YgoDchaEEhkDIYhuDciqDIjmDSYg8AygyAygKAUYgKAUAAAAAKAUYAyAoB4g8DciqYCgh4CMiWBuigYCWjmBakYBGmkYAoksAKhaAUkOYAKiMAUi0AKhGYAeiMAAAAgUgUYgKgKg8gegygeYiMhGhQgTgoAJ").cp());
            stroke.setBounds(0, 0, 126, 293);
            return stroke;
        },
        38: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALuAKYgoAeAAAeAyBkIAyBaIAACgYgKFegyH+hGEiYh4HqiWFUl8JYYgeBGgJAeAdAKYAyAKBQhGCqi+YDSj6CMjwCWmGYB4lKBGlABQowYAoksAUhuAUgyYAAgKAKgeAAgUYAAgyhahQiChGYh4gygygJgoAT").cp());
            stroke.setBounds(0, 0, 119, 312);
            return stroke;
        },
        39: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeKAKYgeAUAAAyAeA8YA8CCAeCWAAC0YAAFyigH+ksJEYiqFKjIEskYFUYiWC+lAEsksDwYh4BagUAyAAAKYAKAUAKAACCg8YCWhQC0huC+h4YBuhQA8gyCMiWYE2ksCgjmEEngYCgkYB4kOBuksYBuksAyiqAykEYAoi+AKgUAyhuYAehGAeg8AAgKYAAhknCizhaA7").cp());
            stroke.setBounds(0, 0, 248, 393);
            return stroke;
        },
        40: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAh6AAKYgUAUAAAyAUBGYAeBuAUCCAAC0YAKDcgUDIgeCqYgeCWhuFAg8CMYh4D6jIDcloEEYigBuhGAyiqBQYjIBknMCqiqAoYgUAKgeAKgKAKYgKAUAAAKAKAKYAUAUAoAAB4gUYJYhkISjSFokiYBahGC+jSBaiCYB4iWBujcBQjIYBGjIBamaAolAYAKhQAUhkAKgyYAKgyAKg8AAgKYAAhQj6iqiCgKYgoAAgKAAgUAK").cp());
            stroke.setBounds(0, 0, 263, 314);
            return stroke;
        },
        41: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfaAKYgKAAgUAKAAAKYgKAKAABkAACCYAAC0gKA8gUBaYg8FKiWFejmFyYk2HqmGGarGI6YhaBQgJAeAJAUYAoAUBGgUCChGYEsiWDSiMEsj6YE2j6CgjIDcloYC+lKAeg8C+nWYA8iCBajSA8h4YCCkEAAAAhGhGYgygyiChQhageYg8gUgyAAgeAK").cp());
            stroke.setBounds(0, 0, 248, 326);
            return stroke;
        },
        42: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAlMAAAYgeAUgUAogeBQYgyCqjSFojwFAYiMDIgUAUoIJiYkEE2loFemGFKYg8A8gyAyAAAAYAAAeAegKBugyYD6huCgh4FeleYFUlALQtSHMpiYC0jcAAAABahGYB4hQAAgehugyYiChGiMgTgyAJ").cp());
            stroke.setBounds(0, 0, 279, 295);
            return stroke;
        },
        43: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAisAAAYgUAAgKAKAKAeYAUBaAABGgUBaYgKBagUAehGCMYiCD6hGBui+DwYkYFUjSDclUEEYiqCWleD6jSCMYhQA8hGAyAAAKYAAAAAKAKAKAAYAeAUBkgoDIhQYIcj6F8kOGanMYBQhaBGhQAKAAYBGg8CqjcFynqYAyhGBGhQAogoYAygyAKgKAAgoYgKhQhGhQh4hQYiWhagoAAg8AA").cp());
            stroke.setBounds(0, 0, 268, 266);
            return stroke;
        },
        44: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AccAKYgUAUAAAKAKBGYAUBugyDwhQDSYgoBkhkC+g8BaYhkCqj6EsiCCCYjIC+ksDwlKDcYi0B4gKAUAAAUYAeA8Gai0EYi+YFKjcDIiqC+j6YC0jwBQh4DSmkYCgksBGh4AogeYAUgeAAgogogoYgogyh4hagygUYgygKg8AAgUAK").cp());
            stroke.setBounds(0, 0, 220, 248);
            return stroke;
        },
        45: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAKYgUAUAAA8AyBuYAyB4AKA8gUC0YgUDcgoCMhGCgYiqFyjwC+o6D6Yi+BQgJAKAJAUYAUAUBGAKBQgKYBkgUDSgyBageYBugoDchaBGgyYDSiMDclABkkYYAUhGAyiqAeiMYAeiWAoiCAUgeYAohaAAAAjwh4Yhug8hkgogKAAYgKAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 172, 203);
            return stroke;
        },
        46: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOYAKYgyAUAAAUAoBaIAeBQIAACqYAADIgUCCgoCqYh4HMjIEYmkEiYh4BagdAeAJAUYAUAUA8gKBugoYCqg8B4hGCqiWYCgiMBGhQBkjSYBai+AyiMAoigYAUh4AyjmAUg8YAAgeAUgyAUgyYAegyAKgogKgKYgKgyjmiMhaAAYgUAAgeAAgUAK").cp());
            stroke.setBounds(0, 0, 134, 208);
            return stroke;
        },
        47: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AB4AUYgeAoAKAUAoAyYAoAyAAAKAUCMYAeDSAKC0gKCqYgUE2gUBaiWF8YgoBkAAAeAAAKYAeAUBGhGBaiWYBkigAyiCAyjcYAoi+AKiMAAkOYAKiCAAiCAAgeYAKgoAAgegKgUYgUgUi+hkg8AAYgeAAgKAAgUAU").cp());
            stroke.setBounds(0, 0, 47, 182);
            return stroke;
        },
        48: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGQAKYgyAUAAAUAoA8YBkC+AKGahaEEYg8C+hQCCi0C+YhQBQgKAeAAAKYAeAeC0hkB4hkYBQhGB4igAohGYAohaA8iqAUh4YAKgoAKhuAAhQYAKhQAAh4AKhQYAKhuAAgegKgKYgUgeg8gUhQgeYhagKgyAAgeAK").cp());
            stroke.setBounds(0, 0, 75, 161);
            return stroke;
        },
        49: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABuAKYgUAKAAAeAeAoYAUAoAKB4AAC0YAADcgKBGiMFKYgTBGA7geBGhQYCgi+A8jIAel8IAUiCIgogeYgegeiCgygoAAYgKAAgUAAAAAK").cp());
            stroke.setBounds(0, 0, 38, 109);
            return stroke;
        },
        50: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AP8AAYgUAKAAAeAUAyYAeBQAACqgoCWYg8EOhuEOiqEiYiMDwiWDckYFeYhQBagUAyAAAKYAKAKAygeB4haYFyksEOleDmn0YBajSAehGB4kiYAohkAyhkAKgUYAKgUAUgeAAgKYAAgegygygygeYg8gojIgdgoAJ").cp());
            stroke.setBounds(0, 0, 143, 229);
            return stroke;
        },
        51: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAAYgoAKgKAyAeBGYAUBGAKBQgKA8YgUBuigFeigD6Yi0E2lKG4kOEsYgoA8gyA8gKAUYgKAeAAAAAKAUYAoAoBQgyC0igYCMh4CCiMC0jmYEsloCWjIEEmuYAogyAyhQAogyYAogoAogyAAgKYAKg8gUgyhahQYg8hGgogUhGgoYhQgog8AAgoAA").cp());
            stroke.setBounds(0, 0, 169, 231);
            return stroke;
        },
        52: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AcmAKYgKAAAAAogKAyYgKBugUBQg8BuYiCDwjIEOjwD6YjwDwkiDcnqFKYhGAyg8AoAAAKYAAAeBGgUC0hGYFUiCEOigEEjcYDci0F8maE2l8YAyhGBGhGAUgUYAogeAKgKAAgeYAAhah4h4iMgyYhGgUgyAAgKAK").cp());
            stroke.setBounds(0, 0, 222, 207);
            return stroke;
        },
        53: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Ac6CMYiWEsiWDmi0DSYk2FelUE2muFKYkrDwgKAKAdAUYBGAyEYiCFyjwYBag8CChaA8gyYDwjIEYlAFengYC+j6Aeg8AKgyYAUh4g8hkhageYgUgKgUAAAAAAYgKAAgoA8goBQ").cp());
            stroke.setBounds(0, 0, 212, 216);
            return stroke;
        },
        54: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AW0AUYgKAKgKAeAAAeYgeEOigEikOEYYjcDci0CCl8DSYhkA8hkA8AAAAYgJAUATAUAeAAYAyAADcgyBkgoYBkgoEYiCBGgyYBag8BQg8B4h4YCMiWA8hGCgjmYB4iqBuiCAogyYAogogKgohuhuYh4huhGgTgyAn").cp());
            stroke.setBounds(0, 0, 181, 166);
            return stroke;
        },
        55: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAKYgKAKAKAKAKAoYAKAyAAAUgKBaYgKCCgoBuhQCqYh4EEjwEEleEOYg8AygyAoAAAKYAAAKAAAKAUAAYAyAKEEiCCqiCYDwi0CgjSC+mGYAyhaAyhuAUgoYAegeAKgoAAgKYAAgeg8gyiChQYhagogKAAgUAK").cp());
            stroke.setBounds(0, 0, 126, 156);
            return stroke;
        },
        56: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUeAKYgKAKgKAegKAUYg8DIksFelKD6YhaBGkYDIiCBaYgyAegoAeAAAKYAAAUBQAABQgUYBageCMg8B4g8YBkg8E2jmCgiCYBkhQGumkAUgeYAohQg8g8i0gyYhGgKgeAAgUAK").cp());
            stroke.setBounds(0, 0, 165, 132);
            return stroke;
        },
        57: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APKAKYgUAKAAAUgKAoYAAA8gyBGh4CWYiWC+i0CMloDSYgyAegeAeAAAAYAAAyFAhQC0haYBkgyCqhuBkhQYCgiCAogeBGg8YAogoAygoAKgKYAogeAKgegUg8YgUg8g8gyhGgeYhQgegeAAgoAK").cp());
            stroke.setBounds(0, 0, 129, 99);
            return stroke;
        },
        58: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAKYgyAUAAAeAyBkYAoBQAAAegeCWYgoCWg8C+hQC+YhGC0igFKhQCCYhFCMgKAoBFgUYAogKCCiCBkiMYDIj6CgkOCql8YAohGAohQAegoYAohGAAgKAAgoYAAgygKgKg8gyYh4hujIg7hGAd").cp());
            stroke.setBounds(0, 0, 101, 176);
            return stroke;
        },
        59: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHgAUYgKAKAAAUAAAKYAAAUAKAyAAAoYAUC+iMFUjIDwYh4CWgoA8AAAUYAAAUAAAAAegKYBagKB4haCMiMYB4h4A8haBujIYAyhaBGhuAegoYAUgoAegyAAgKYAAgog8gyhugyYhugyhGgJgoAd").cp());
            stroke.setBounds(0, 0, 87, 119);
            return stroke;
        },
        60: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADIAAYgeAUAAAoAUAeYAoAoAUB4AACgYAAB4AAAUgeA8YgeBkgyBGhQBaYhjB4AeAKCLhQYCChQBahkAyiMYAohkAKhQAKi0YAKigAAgKhQgoYg8gehagJgoAJ").cp());
            stroke.setBounds(0, 0, 48, 98);
            return stroke;
        },
        61: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AO2AKYgKAAgKAeAAAoYgKBagKAehaBkYh4CMiWCWjmC+YksEEgdAoAJAKYAeAoDwh4GkjwYBuhGCMhaAygeYB4hQBkgyBGgUYCMgoAAhGhuiCYh4iCi+hZgyAn").cp());
            stroke.setBounds(0, 0, 140, 111);
            return stroke;
        },
        62: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJOAAYgeAUgKAUAUAyYAUBGgKAohQCgYgyBkhGB4iWDcYhuCqhkCWgKAUYgKAoAAAoAAAAYAKAAAegUAegUYAegeAygyAogeYAogeC0i0CqiqYC0i0C0igAegeYBkg8AKgohGhGYhkhkjwhFhQAT").cp());
            stroke.setBounds(0, 0, 106, 123);
            return stroke;
        },
        63: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGQAKYAAAAgKAyAAA8YAABGAAA8gKAoYgeBQhkDSiCDmYg8Bug8BkAAAUYAAAeAKAUAeAAYBGAAAegeE2mGYBQhaBahuAygyYAogoAegoAAgKYAAgogyhQhahaYhuhugygdgoAd").cp());
            stroke.setBounds(0, 0, 75, 110);
            return stroke;
        },
        64: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGkAAIgeAKIAKA8YAAAoAAAogKAUYgUBGhkCqiCC+YhGBug8BagKAUYAAAeAAAKAoAAYAogKDSiWCqiMYCqiCBQg8BQgyYAygeAUgogUgeYgKgyhkhGhkgyYhugygoAAg8AA").cp());
            stroke.setBounds(0, 0, 86, 87);
            return stroke;
        },
        65: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHCAKYgKAAgKAUAAAKYAABGhQBajcCgYipCMAAAUCVgeYBagUDSg8CCgoYAygKAygUAUAAYBagUAKgyhGhkYhaiChug7goAd").cp());
            stroke.setBounds(0, 0, 74, 51);
            return stroke;
        },
        66: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWMAKYgKAUgKAUAAAUYgKAUgKAeAAAKYg8BaomEEowC0YigA8gyAUAAAUYAAAKAAAKAAAAYAKAUEOgeCqgoYHChaCggoDchQYCWgoDwg8B4gKYCMgKAUgKAAgyYAAgegUgygegeYhahGkEiWg8gKYgoAAgKAAgUAK").cp());
            stroke.setBounds(0, 0, 196, 80);
            return stroke;
        },
        67: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AY2AKYgKAKgKAKAAAeYAABQgyBQi+DIYh4CCh4B4h4BaYjcCgoSFKiMAyYgyAUgeAUAAAAYAAAKBQAUAyAAYAoAADIg8C0hGYGGiWHgkiGulUYA8gyBQgyAogUYBQgyAygoAAgeYAAhQkOiCi+gKYhGAAgUAAgUAK").cp());
            stroke.setBounds(0, 0, 217, 138);
            return stroke;
        },
        68: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAKAAAKAKAUYAAAUAoAeAoAeYBuBaA8AyCWCqYDSDmCgC+DIEEYF8HqCWC0FeFoYEOEOgUAAHMAUYDSAKBuAAC0gKYE2gUBQgKAegyYAKgKAAgKgUgKYgogeh4gyi+gyYhagejchGiggyYkihkgegKiMhQYlyjIjIigl8mGYjmjci0jSjwkiYiqjShGhGhQgyYhag8iMgJgoAT").cp());
            stroke.setBounds(0, 0, 350, 245);
            return stroke;
        },
        69: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAAAKYAAAKBGAoBGAoYC+BaBQAyBGBQYBkBuE2IcDcHMYCWE2BQCWCMDwYCMDwDIE2AeAeYAoAoBaAyBGAUYBaAUHMA8C0AKYAoAABQAKA8AKYBkAKAKAAAogUYAUgKAUgKAAgKYAKgUgygehQgoYiWhGomkYhQgyYjwiCi0i+j6lKYi+kEigkEjSl8Yk2pYhkh4jShuYiCg8jSgTgyAd").cp());
            stroke.setBounds(0, 0, 316, 298);
            return stroke;
        },
        70: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACgAKYiMAegnAoATAeYAKAABGAUBQAKYC0AUBQAUBkAyYCMBGGuF8GGF8YDIC+DwDSFUEOYD6C+AUAKFAhGYEYgyGahkAygeYAygeAogogKgUYgKgUgygUhGAAYhaAAqohQh4gUYjwg8jIhalKjcYkEiqi+iglolAYkikEiChaiWgyYhugeiMgJhaAT").cp());
            stroke.setBounds(0, 0, 368, 191);
            return stroke;
        },
        71: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgeAAgKAKAAAUYAAAeAAAUBQAoYBaA8B4BkBGBGYAUAoA8BQAyBQYBGBuBkCgDwF8YC0EOFoGaBkAoYBuAyBQAAE2geYEEgeC+gUA8gKYBGgKAegUgegUYgKgKiCgyiMgyYo6jIgogKiWhkYkOi+k2lKl8omYiCjIgogohGgoYhag8iggThaAT").cp());
            stroke.setBounds(0, 0, 264, 198);
            return stroke;
        },
        72: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAKAAAUAAAUYAAAUBQA8A8AoYA8AeC+DmDmEsYCqDwB4CCDwDmYE2FAAAAAGQgoYGkgyAoAAAAgyYAAgKgUgKgUgUYgKgKi+hGjShGYkshkhagehGgoYi+huh4hajwjwYigiWgyhGjwkYYg8hGg8g8gegUYhGgyhugTgyAJ").cp());
            stroke.setBounds(0, 0, 233, 164);
            return stroke;
        },
        73: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAeAAAKBFCMYFeI6NSRMDwC0YBaBGAoAKCqgUYBGAABugKAyAAYHqgeBagKAegKYAUgKAUgKAAgKYAAgUg8gohGgeYg8gUnCighageYiqg8i0hQhuhaYkijcrar4kYlyYhuiCAAgJgyAT").cp());
            stroke.setBounds(0, 0, 269, 212);
            return stroke;
        },
        74: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgeAKAAAoAAAeYAAAKAyAoBQAyYAUAUA8AyAyAoYEsD6H+FyEYCgYBGAoCMBQBuBGYDmCCAeAKBkAKYBQAKCMgeFehaYD6g8BQgeAygyYAegegKgegygKYhQgKjwgeiqgKYmGgUhagUjwhGYjIhGighGiWhaYhGgohagygogUYhagymQkEjSiWYjSiMgegJg8AT").cp());
            stroke.setBounds(0, 0, 301, 143);
            return stroke;
        },
        75: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgdAUAJAeAyBaYCWDSG4HqGGGaYCMCWAyAeBkAKYBaAKI6hQCCgoYAegKAegUAKgKYAUgUAAAAgegeYgUgKg8gehugeYnMiMksiMj6iqYkOjIm4leiCh4Yg8gygKAAgoAA").cp());
            stroke.setBounds(0, 0, 221, 145);
            return stroke;
        },
        76: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMWAAYgUAAgoAKgoAAYgoAKhaAUhGAUYiMAogyAKiWAKYh4AKgeAKAAAoYAAAyBGBaBkA8YBaAyAegKBug8YBkg8B4g8BugUYBageDIAABkAeYDmA8FUCCGaC+YGkC+JsC+DIAAYBkAAC0g8DShkYCChGC+iCgKgKYAAgKgoAAhagKYkiAAn+gUhugKYlegelKhGnWigYiqg8j6haiCgyYiqhGhugei0AAYhGAAhGAAgKAA").cp());
            stroke.setBounds(0, 0, 415, 99);
            return stroke;
        },
        77: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAoAAAoAoAoYBGBGAoAKCggeYB4gKCMAABaAUYBaAUKUDwKoEOYEOBuAKAABQAAYBkAAAKAAEEhuYEih4DIhaAUgUYAogegKgegogUYgogKlKAKlAAKYleAUi+gKjwg8YhQgUkYhQkOhQYq8i+AoAAjmAAYhuAKhugKgeAAYg8AAgKAAgKAK").cp());
            stroke.setBounds(0, 0, 336, 84);
            return stroke;
        },
        78: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgnAyATBQBkB4YA8A8CqDSCMC0YAoAyA8AeAyAAYAeAAAKgKAegUYAogoAKhGgKh4YgUi+hkhkmGi0Yh4g8hGgJgKAT").cp());
            stroke.setBounds(0, 0, 74, 80);
            return stroke;
        },
        79: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAAYAAAAAAAUAAAUYAAAUAKAUBQBQYBaBkAyAUA8gKYA8gKgKhug8g8YgogyjSgxgeAJ").cp());
            stroke.setBounds(0, 0, 34, 28);
            return stroke;
        },
        80: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAKAAAKAAAeYAKAeAeAoBkBaYDmDSDwDwEOEiYEEEOAyAyAoAAYAAAAAUgUAUgUYAegeAAgKAAgoYAAhGgeiMgegyYgogyiCiChQhGYjci0q8nWgoAAYgKAAgKAAgKAK").cp());
            stroke.setBounds(0, 0, 131, 128);
            return stroke;
        },
        81: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgdAoATAeBkA8YBkAyHCEiDICWYD6C0AoAUAygeYAUgKAUgeAKgeYAKgeAAgKgUg8Ygyi+hah4iWhGYiqhQkihakig8YiMgUgUAAgUAK").cp());
            stroke.setBounds(0, 0, 125, 82);
            return stroke;
        },
        82: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAUYgTAyAJAoBuCqYCCDIBuC0CCDmYCgEYAyAyBQgyYAygeAUgyAAiCYAKjIgehaiWigYh4h4ngmGgeAAYgKAAgKAKgKAK").cp());
            stroke.setBounds(0, 0, 85, 119);
            return stroke;
        },
        83: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFeAKYgUAUgUAegUBaYg8CghQDShQCqYhGCMAAAKAABQYAABkAKBaAoA8YAoBGAoAKA8goYBugyBujIA8kOYAehQAAgoAAi+YAAjwgKhGgygyYgogUgKAAgoAK").cp());
            stroke.setBounds(0, 0, 51, 124);
            return stroke;
        },
        84: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJiAAYgKAKhGA8hGBQYhQBQhuBkg8AyYiCBugoAogUBaYgUBkAAA8AUAeYAUAUAKAKAygKYBQgKBGgoBuhuYA8g8BGhQAegyYBGhkBQi0AUhaYAKg8AAgKgUgUYgUgUgeAAgUAA").cp());
            stroke.setBounds(0, 0, 70, 84);
            return stroke;
        },
        85: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABuAUYgeAUAAAyAeA8YAUAeAAAeAKCCYAADIAAAUhuE2YgeBkAABaAKCCYAeCMAoAyAoAAYAeAABahaAegyYAohGAeiCAeiqYAeiWBQjSA8hQYAegyAAgKAAgoYgKg8AAAAhGg8YhQhQiChkgygUYgogKgoAAgoAU").cp());
            stroke.setBounds(0, 0, 58, 139);
            return stroke;
        },
        86: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AE2AKYAAAKgKAygKA8YAAA8gKA8AAAKYgUAygyA8hkBuYhuB4gJAKAJCCYAeCgAyBuA8AAYA8AABQhkBGiqYBQjSBajwAAgUYAAhQg8iCg8goYgygUgUAAgUAK").cp());
            stroke.setBounds(0, 0, 53, 102);
            return stroke;
        },
        87: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AZ8BGYleBklABQh4AUYgyAUiWAeiCAeYjIAygoAKh4AAYiMAKgKAAgUAUYgKAeAAAyAKAoYAKAUCgCCBuA8YBGAyAUgKCghaYC0huBugyFyiMYC+hGDShQA8gUYCMg8CqhkAUgeYAUgeAAAAgUgUYgUgKgUAAgKAAYgUAAh4AeiMAo").cp());
            stroke.setBounds(0, 0, 201, 81);
            return stroke;
        },
        88: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYiAUYgeAUg8Ayg8AeYgyAoi0B4igBuYiqBuj6CqiMBkYiMBkiWBkgyAeYiCBGgTAeAnA8YAoAyBQAoBQAeYBuAogeAUFUleYEYkYBQhGC0iWYC+i0EEjwAUgUYAegygegJhQAd").cp());
            stroke.setBounds(0, 0, 167, 131);
            return stroke;
        },
        89: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVQA8YlACgsMFohGAUYgUAAgoAKgeAAYhGAUgeAUAAAyYAAA8AeAeCqBGYC0BGAAAAB4huYCCiCAygoGGj6YDmiWCChQAogoYBGhGAUgegKgUYgKgTg8AJh4A8").cp());
            stroke.setBounds(0, 0, 156, 92);
            return stroke;
        },
        90: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALaB4Yh4BGigBahGAyYiMBQgeAUhkAAYg8AAgKAAgUAUYgUAeAAAoAKAoYAeAeCCBkBGAUYAoAUAKAAAUgUYAKgKAUgUAKgUYAUgeCCiMC0i0YCqigCMiMAAgKYAAgJg8ATjIBu").cp());
            stroke.setBounds(0, 0, 100, 73);
            return stroke;
        },
        91: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMAKYgKAAhGBGg8BGYkOEsiMCgiCCgYhQBahQBQgKAAYgoAUgUAAhQgeYhQgegUAKgKAoYAAAoAUBaAyBuYAeBGAUAeAyAyYBaBQAyAUA8geYAUgKAegoA8h4YAohaA8iCAohGYBaigFAocBQhuYAegoAUgyAAgKYAAgogUgJgoAT").cp());
            stroke.setBounds(0, 0, 117, 143);
            return stroke;
        },
        92: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAKYgyAegoA8lAHMYigDwigDcgUAeYgeAUgyAogoAeYgoAegeAUAAAUYgJA8AxDmA8BuYAeBGBkBkAyAKYA8AKAUgeAUigYAUiWAehGGGuEYC0maAUhQgoAAYAAAAgUAAgUAK").cp());
            stroke.setBounds(0, 0, 101, 180);
            return stroke;
        },
        93: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHCAUYgeAUhGA8hQA8YhQBGhQA8goAUYgoAUgUAKgKAUYAAAeAACqAeA8YAKAyBGBGAUAAYAeAAAKgKAUhQYAUg8CqlKBaiqYA8hagKgThGAn").cp());
            stroke.setBounds(0, 0, 52, 75);
            return stroke;
        },
        94: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAnsAAKYg8AKmQBGjSAoYgyAKh4AKhaAUYjcAemaBGleA8YiMAUjIAehaAUYi+AUgKAKAAA8YAABGBaAyCCAKYA8AAAUAAB4goYC0gyEOhGDSgoYCWgeH+haB4gKYAKAABagUBkgKYC0geC0gKAoAKYAKAAAeAUAUAKYAeAeAKAKAAAeYAAAUgoBkgoBuYgoBugeBaAAAKYAUAoAogKB4haYCChkCMhGCMg8YCCgyBGgoAAgUYAAgomGkihageYg8gKgeAAhaAK").cp());
            stroke.setBounds(0, 0, 320, 80);
            return stroke;
        },
        95: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Af4AKYkEAel8Ayi0AeYjwAenMA8hQAKYgeAKhuAKhaAKYi0AKgeAUAAAyYAAA8BkBGBuAKYA8AAAeAABGgUYDmhGC+geG4g8YJEhQCqgKBGAeYBGAoAAAAiWD6YhkCggKAUAKAoYAAAeAogKCqhQYCghQBagoD6hGYBugeAegUgKgoYgKgUi+i+huhaYh4hkgygJi+AT").cp());
            stroke.setBounds(0, 0, 272, 77);
            return stroke;
        },
        96: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AS6AeYh4AojwBGjmA8IiqAyIjSAAYiCAAhaAKgKAKYgdAUAdBQBGA8YA8AyAoAUBQAAYBGAKAAAACghGYAygKCqg8C0g8YEYhaAogKAeAKYAUAKAUAKAKAKYAoAogKAUjSEEYjmE2gyBGAAAUYAAAUAKAADSiWYHClKA8goCWgyYAegKAogUAKgUYAygegUhGhQhGYhGg8i+iCgogKYg8AAg8AAhuAe").cp());
            stroke.setBounds(0, 0, 182, 99);
            return stroke;
        },
        97: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWMAUYmkCgqoCqjcAAYhkAAgJAAATA8YAyBGAyAyA8AUYAeAKAeAKAKAAYAKAABkgeBugoYFeh4E2hGCMgKYBQgKAAAAAyAeYA8AyAAAUiCDwYgyB4gyBaAAAKYAAAKAKAKAAAKYAUAKAAAAAUgUYAKAAA8gyA8gyYC+iMDIiCB4g8YAygeA8geAKgKYAUgogegyhag8YjwigiMg8g8AAYgKAAgeAKgeAK").cp());
            stroke.setBounds(0, 0, 205, 89);
            return stroke;
        },
        98: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUoAeYhGAUh4AohaAUYiqA8iqAoleBGYkYA8gyAUgUAeYAAAUAABGAeAoYAUAUAKAKAogKYAeAABageBageYCqgyGQhuDmg8YC+goBkAAAKAyYAKAegeB4geBaYgUBQAeAUA8goYCqh4DmiCA8gKYAogKAogeAAgUYAAgohuhQi+hQYiCg7g8AAigAn").cp());
            stroke.setBounds(0, 0, 198, 60);
            return stroke;
        },
        99: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATiAyYleCCjIAomaA8YkiAoAAAAAABkYAAAeAAAeAKAKYAUAeBGgKBkgeYC+gyH0huD6gyYC0geBGAAAeAeYAoAoAAAyAAF8YAAHCgKNcgUKKYgKEOAADwAAAKYAKAoAyAKBaAAYBQgKAegeAKhGYAKgeAAi+AAjSYAAmkAKoSAen+YAUp2AKgoB4jSYAegoAAgogegyYgUgog8gyi0huYiMhPAAAAjwBF").cp());
            stroke.setBounds(0, 0, 192, 328);
            return stroke;
        },
        100: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APUAAYgKAKg8AUgyAeYjIBajIA8jwAyYigAegoAKgKAoYgKAyAAAeAUAeYAoAoA8AABQgeYBQgeFehuC+goYCqgyAUAKAUA8YAeA8AAHWgUPKYgUR0AAg8AeAeYAeAKAKAKA8gKYBagKAegKAUgoYAAgUAKjmAKnWYAKuOAUoSAeh4YAUg8AehGAohQYA8hkg8hQk2igYhGgegoAAg8AA").cp());
            stroke.setBounds(0, 0, 149, 293);
            return stroke;
        },
        101: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJsAKYigA8leBkgyAAYgUAAgoAoAAAeYAAAeAKAKBGAUYAyAKAUgKCWgeYBagKBkgeAogKYBGgUAeAKAUAyYAAAKAKBaAKBQYAKCCAAA8gUCqYgKDSgoDwgoCqYgeCMAKBGA8BuYA8BuA8BGAeAAYAoAAAog8AKhGYAUhGAKk2AUo6YAKloAKhGA8huYBQiWAKgKgegeYgegUiCg8hGgUYhQgKgyAAg8AK").cp());
            stroke.setBounds(0, 0, 106, 193);
            return stroke;
        },
        102: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaaAUYjwBQmkBui+AeYigAUj6AUjIAAYjmAAgTAKAdBGYAUAeBaBQAyAUYAoAUCCAAAygUYAygKGuhaDcgoYC+geDmgeB4gKYCWgKAoAegKB4YAABaiqPKiWLuYgeCqgoDmgUBaYgoDIAKAUA8AUYAyAUBQgKAygUYAKgKAUgUAKgeYAUgUAei0AojIYBQnMBQmaBGk2YCCpEAehkBkiCYAegeAegoAAgKYAKgygUgygygyYgyg8jciqgygeYgygKg8AAhuAU").cp());
            stroke.setBounds(0, 0, 230, 298);
            return stroke;
        },
        103: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARWAoYjcAylUBGk2A8Yj5AogKAKAnAyYAoAoA8AeBQAUYA8AKAUAAA8gUYD6hQH0huBuAAYA8AAAKAKAeAUYAyA8AKBkgUCgYg8HMhQHqhaH+YgeCCgUB4AAAUYgKA8BGAoBugeYBagKAKgKAKiCYAymQA8l8AojwYBQloBul8BQiCYAog8gKgegygyYhGhGkEhuhQAAYgUAAhkAUhkAU").cp());
            stroke.setBounds(0, 0, 179, 238);
            return stroke;
        },
        104: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJYAKYjSA8i+Aeh4AAYhtAAAKBQB3BGYAyAeAeAAC+gUYB4gKAKAAAeAUYAoAUAUAygKBGYAAAUgKAyAAAeYAAAegKBGgKAoYgKAogKBkgKBGYgeDIhQHqg8EEYgeCWgKBuAAAKYAKAoAeAeAeAKYAoAKBQgUAUgeYAKgKAUhkAUhuYBamkBGkOB4mQYBQkEAUg8BQhQYA8g8AKgegUgyYgUgyhahQhkhGYh4hGgygJhkAT").cp());
            stroke.setBounds(0, 0, 110, 217);
            return stroke;
        },
        105: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJEAAYAAAKmaA8haAKYgyAKgUAKgKAKYgTAoCVBkBQAAYAUAABQgUBagUYCqgeAAAAAUBGYAKAeAAAegKAyYgKBQiWJOg8DmYgeBagUBQgKAUYAAAoAUAKBaAAYBQAAAogKAegyYAAgKAohuAehuYBkmQB4k2BaiWYBGhaAAgehGgyYgyg8iWhag8gUYgegKhGAAgKAA").cp());
            stroke.setBounds(0, 0, 101, 151);
            return stroke;
        },
        106: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWWAKYgUAKgoAKgUAKYgoAUjwBQh4AeYjIA8jwAeksAUYg8AAg8AKgKAKYgoAKgoAeAAAoYAAAeAAAKAUAKYAyAyCCgUI6huYHMhaCWgUBQAeYAeAKAKAAAUA8YAoCMAKBuAKGkYAAG4gKFegUB4YgeBkAKBQAyBaYAyBaAoAyAogKYAogKAyg8AyhkYBGiWAKgegUi0YgUjIgUkiAAlKYAAleAKgeBQigYA8iCAAgegegoYgygoiWhahug8YhugogogJhkAT").cp());
            stroke.setBounds(0, 0, 202, 233);
            return stroke;
        },
        107: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVGAUYgoAKiMAeiCAeYleBGqKCggUAUYgdAoAJBkAyAUYAUAKB4gUB4geYDmhQJih4CMAAYBuAAAUAUAUBQYAKBaiMNmg8CqYgoBuAKBaA8BGYAoAoAeAAAogeYBkhGA8iqBkngYA8kiA8h4CWigYBahkAUgUgKgoYgKg8iChajmhuYiMg8gogJh4Ad").cp());
            stroke.setBounds(0, 0, 203, 180);
            return stroke;
        },
        108: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASIAAYgUAAgUAKgKAKYgUAAhkAehuAeYhuAejIAyh4AeYjwBGhuAegoAAYgUAAgUAKgKAKYgTAUAJAeA8AeYCCBGBaAACMgoYCgg8GuhaBaAAYBuAAAUBagoGGYgoGkgoEigyDcYgeBkAUBaAyAeYAUAKA8gKAegKYAegUAohGAUhQYAoiCAyloAoleYAKgyAKhGAKgoYAUhaBGiMBGhQYCCiWgKgejchuYh4g8iMg8goAAYgUAAgeAAgKAA").cp());
            stroke.setBounds(0, 0, 172, 192);
            return stroke;
        },
        109: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQQAKYgUAAg8AUgoAUYjSBajcA8kYAeYigAKgoAKgKAeYAAAeAABGAeAeIAUAeIEEg8YCMgeC+goBQgKYC0goCCgUAoAKYAyAKAKAUAUCMYAKBkAABQAAEOYAAC0gKCgAAAUYAAAKgKAogKAoYgKAyAAAUAUAoYAUBGAyBkAoAUYAUAUAAAAAogKYAogeBQiCAehQYAeg8AAAKgKmGYgKlyAKhGA8h4YAUgyAUg8AAgKYAAgoh4hki0hQYhkgyg8gJhQAT").cp());
            stroke.setBounds(0, 0, 159, 165);
            return stroke;
        },
        110: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AE2AeYgoAKhQAegyAUYh4AogUAUAAAoYAAAUAKAKAoAKYBGAUAUAABkgoYAygUAygUAKAAYA8gKAAAAAAFyYAKEsAAAoAUAKYAUAKB4gUAUgUYAKgKAAgyAKgyYAKjSAyjwAohQYAegyAAgUgegUYgogojIhQg8AAYgUAAgyAKgoAU").cp());
            stroke.setBounds(0, 0, 75, 89);
            return stroke;
        },
        111: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMAKYgeAKg8Aeg8AUYiqBQkiBalUBGYiWAeAAAKAAAoYAAAyAeAUAyAUYBGAUAeAACCgoYBGgUBkgUAygUYA8gKCMgeB4geYB4gUBkgeAUAAYAyAAAyBaAABQYAABGhGGkgyDSYgUB4AAAyAeAUYAyAoB4AAAegoYAUgUAUg8AyjSYBGksBQjIBuiCYBQhaAKg8gyhGYgegeighQiWg8YhkgegygJhQAT").cp());
            stroke.setBounds(0, 0, 171, 138);
            return stroke;
        },
        112: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AM+AAYgUAKgyAegoAUYhuBGi+BGkOBGYiMAegdAoAdA8YAUAUAKAAA8AAYAeAAA8gKAogKYFehkBugUAygKYAyAAAKAAAUAUYAeAeAAAAgKBQYAAAogUBugUBaYgoCqAAAyAUAUYAeAoCWAAAogoYAKgKAUg8AUhQYAyjIAohQBQhkYAUgUAUgeAKgUYAUg8gUgehagyYgogehGgogogUYhagygygJg8AJ").cp());
            stroke.setBounds(0, 0, 128, 93);
            return stroke;
        },
        113: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFKAoYgoAUhQAehGAeYhGAUg8AUgKAAYAAAAAAAKAKAUYAoAoAoAKCCgeYBGgKBGgKAKAKYAeAAAKAAgKAoYAAAUgUBagoBaYgeBQgeBQAAAKYAKAoBuAUAogeYAKgKAUgoAUgoYAyh4AyhaAyg8YBQhkAAgUh4hQYiWhZgUgKhkA7").cp());
            stroke.setBounds(0, 0, 71, 66);
            return stroke;
        },
        114: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAgWAAKYmGBujwA8jwAyYiMAUleAoigAUYgyAAg8AAgUAKYgeAAhaAKhaAAYi0AKgeAKAAAoYAAAeAoAoBQAeYBaAoBkAKB4gUYAogKC+geC+geYC+geDcgeBagKYI6haAKAAAyAKYBkAKBQBuAACCYAAB4iMKKh4G4YgoB4AKBGAyAeYA8AUBugKAogoYAegeAUhGAyjmYBQmGA8jcBujIYA8iCAegyCCigYAogyAAgKAAgoYAAgogKgegKgUYgegohuhGi0haYiMhGgegKgyAAYgoAAgyAAgUAK").cp());
            stroke.setBounds(0, 0, 275, 200);
            return stroke;
        },
        115: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAg0AAAYg8AUkYAoh4AKYjIAUlyAykEAoYjwAok2AoiWAUYgoAAgoAKgKAAYgdAUAJCCAoAyYAeAeAoAACCgeYFohaCCgUGQg8YHqg8FAgeBuAeYBGAUAKAeAABkYgKBki0KKg8CMYhQC+AoCgCCgoYAogKAyg8A8hkYAehQBajcAoiMYBGjcBQiCCWiMYAygyAygyAAgKYAKgogUgyhGg8Ygygyiqhuhkg8YgygehQAAgyAA").cp());
            stroke.setBounds(0, 0, 270, 163);
            return stroke;
        },
        116: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAnOAAAYgUAKgyAKgyAUYiCAoi0AekiAoYiWAUiqAUgyAKYg8AAhQAUgyAAYgyAKiCAUh4AUYhuAUiCAUgyAAYigAUkiAohQAKYg8AKgKAKgUAeYgUAeAAAoAUAyYAeAyCWgKDwg8YFUhQDIgeGGgoYCCgUCCgKAogKYBkgKImgyA8AAYBaAAAoAyAABkYAABQgyDIhaFUYhGDcAAAeAoAeYAyAoCWAAAogyYAKgKAoh4AyiCYBuleAohGCMiWYBQhaAKgegUg8YgegyksjchageYgogKgUAAgyAA").cp());
            stroke.setBounds(0, 0, 306, 137);
            return stroke;
        },
        117: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWMAKYgeAUhQAUhGAeYkOBklKBQm4AyYi+AUgKAKAAAoYAAAKAeAeAoAUYBQAoBaAKCMgeYAygKCWgeBugUYB4geDIgoB4gUYEOgyAKAAAyAoYAyAoAKA8gUCMYgUCMgoDSgeBkYgUBkAAA8AeAUYAoAeBkgUAygoYAUgKAUg8AoiWYBQkEA8h4BahkYAegoAogyAAgUYAUgygKgygegeYgegUh4hGiWhGYhugog8gJhQAT").cp());
            stroke.setBounds(0, 0, 201, 119);
            return stroke;
        },
        118: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARgAeYkEBalKBQlyAoYgyAKgyAKgUAKYgoAKgJBQATAeYAUAKAUAKAygKYAoAAA8gKAegKYAegKCggeCqgeYCggeDIgoBGgKYCggeAyAAAUAyYAKAegKAUg8DcYgUBuAAAUAyAeYAoAUAoAAAygUYAegKAKgUAeg8YAyhkAyg8BGgyYCWhugohQkYiMYiCg7geAAiMAn").cp());
            stroke.setBounds(0, 0, 168, 70);
            return stroke;
        },
        119: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXwAoYl8B4n+Bkm4AeYhaAKhQAKgKAAYgKAKAAAKAAAUYAAAUAKAKA8AeYA8AeAKAABQAAYAoAABGAAAogKYAogKCggeCMgUYCWgeDmgoCMgUYEOg8BaAAAyAUYA8AoAAAohQDwYgeBkgeBaAAAUYAAAeAeAUBaAAYBaAAAKgKAohQYBGiWA8hGCMiCYAygoAKgogUgyYgKgegKgUhQgyYiMhahug8gyAAYgoAAgoAAiCAo").cp());
            stroke.setBounds(0, 0, 215, 83);
            return stroke;
        },
        120: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANIAUYkiBajcAojIAKYhGAAg8AKAAAAYAAAKAAAKAAAUYAeBGBkA8BQAAYA8AAFAg8AygUYAogKB4AAAoAUYAyAUAKAygUCCYgoDwjSLkiMHCYhuFAAAAKCCAKYAoAAAUAAAogKYAygUAAgKAyiqYAoiqBulKBQjwYBuksCWl8Aeg8YAKgUAyg8AogoYA8gyAUgeAAgUYAAgegyhGgyg8Yg8gyiChagygUYgygKhGAAhuAU").cp());
            stroke.setBounds(0, 0, 142, 225);
            return stroke;
        },
        121: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAwIAAAYgUAAgeAUgUAKYhGAoiMAoh4AeYiMAUkYAyh4AKYhaAAgUAKAAAeYAAAUAoAoAyAeYA8AeC0gKEYgoYD6gyAeAKAKAoYAAAyjIFAjSEYYocLQpsI6xCMCYkOC+gJAUAJAUYAUAUAogKCCgyYF8iWHglAH+muYIInCIIomIcqyYBah4B4h4BkhGYCMhkgUgokEiCYh4g8g8gJgyAJ").cp());
            stroke.setBounds(0, 0, 355, 329);
            return stroke;
        },
        122: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAl+AAeYiCA8iCAyi0AeYi+Aoi0AohaAKYgeAAgeAKAAAKYgKAKAoAoA8AeYAyAUAUAKBGAAYBaAKAUAAEihGYCqgeAUgKAUAUYAKAKAKAKAAAKYAAAojcE2jSD6YhuB4lUFKiWCCYkEDSmaEimQEEYjvCgAAAAAJAUYAUAUAUAACMgyYCWgoCMhGDShuYJYlUJYn+LQsqYAogyBQhGA8gyYC0iMAAAAhGg8YgygykEiCgoAAYgUAAgyAKgoAU").cp());
            stroke.setBounds(0, 0, 294, 248);
            return stroke;
        },
        123: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAlMAAKYhuAykiBGmQBQIlAA8IgKAeYAAAoAeAUBkAUYCqAeDIgeFKhkYCCgoBGAAAAAyYAABki+FejSEYYhkCCmQGQiWB4YlKD6lyDImaCWYh4AogJAKAJAeYAUAUBaAACWgeYDwgoDchGD6iMYGGjIEijwFemaYBahaCWjSC0kEYCWjIBGhQBQgyYBkhGAKgUgyg8YgegoiChahQgyYhGgUgoAAgyAK").cp());
            stroke.setBounds(0, 0, 282, 237);
            return stroke;
        },
        124: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAiiAAUYhkAohuAei0AeYjIAegeAKgKAoYgUBGAoAUCCAAYBkAAAAAACWg8YEYh4AeAoi0EOYkYGanCFeowDmYiqBGhGAek2BaYiWAyh4AoAAAKYAAAUA8AUBGAAYDSAAG4hQDwhaYDmhaEEigDwi0YB4huDIjICqjcYCqjSBGhGBkhQYAegUAKgeAAgKYAAgeg8g8hugyYh4gygegJhaAd").cp());
            stroke.setBounds(0, 0, 263, 175);
            return stroke;
        },
        125: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAjoAAUYlACMiqA8kEA8YigAejwAyhuAKYhQAKhkAUgoAUYgyAUAAAeAoAeYBGAoB4AUBkgeYBQgUQ4j6AUAAYAeAAAeAoAKAoYAKBagyEsg8EYYhaFeh4EYi+EsYjmFojSC0nqDwYjwB4iqBGksBkYigA8geAUAAAKYAAAUAeAUAoAAYBQAAGQhGC0goYGQhkDmh4D6jcYEYj6Eim4C+nWYBkjmB4mGAyj6YAehaAehGA8hGYAegoAUgoAAgKYAAg8hQg8iqhQYh4gohQgJhQAd").cp());
            stroke.setBounds(0, 0, 282, 315);
            return stroke;
        },
        126: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAjoAAUYi0BGmaB4iCAeYiqAomQAyjwAeYhGAAhGAKgKAKYg8AeBuCCCMAeYBuAeAygKH+iWYFUhaDwg8BugKYBugKAUAegoC0YhQFehaEYiCD6YigFAiqDmkOEYYjmDcnCEioSEYYhGAeg8AeAAAKYAAAeAUAUAygKYBagKGaiMDwhuYI6j6EOjwGapYYC0kECMksCMmGYBQjwBGh4BkhaYBahQAKgyg8gyYhGhGj6hahuAAYgUAAgyAKgeAK").cp());
            stroke.setBounds(0, 0, 285, 310);
            return stroke;
        },
        127: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AakAUYh4BGiqAykYAoYhaAKhGAUgKAAYgUAUBkBGBQAUYBQAUCCAABagoYBQgeBQAAAeAUYAoAUgKAyhQCWYh4D6iqEshaCCYgoAyg8Bag8BQYi0DwkEEsloFKYiCB4haBkAAAKYAAAUAogKBagoYCCg8Cqh4CgiMYGQlKFemkHCrGYCCjIA8hQCMh4YBkhkAAgeh4g8Yhagoi+hGgoAAYgKAAgoAKgeAK").cp());
            stroke.setBounds(0, 0, 220, 253);
            return stroke;
        },
        128: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkGAAAYgKAKgeAKgKAKYg8AojSBQjwBGYiqAogoAKhkAKYhGAAg8AKAAAAYgKAUBGBGA8AeYAyAeBkAUA8AAYA8AABkgeCMhGYCqhQBkAAAABQYAABGh4FohQCqYiWFKksG4kYE2YkYE2m4FKmGDSYiCBGgoAeAAAUYAAAeAUAKBQgUYC+geFyiWDmiWYJsmGGuoIHgvAYCMkYAyhGCMhkYCChkgohGkiiMYiChGg8gJgyAJ").cp());
            stroke.setBounds(0, 0, 283, 305);
            return stroke;
        },
        129: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeyAUYiCA8kEAomGAUYgoAAgeAAAAAKYgeAUBuBkBQAUYBGAUBkAACggeYC+geA8AUgUBGYgKAeiMDIh4CCYhaBuj6D6h4BuYjICqmaEiloDcYiMBQgJAUAJAUYA8AeF8iMEEiWYGkjwFAj6HMnMYEikiBkhaBagyYAegKAUgUAKgKYAegygogyi0hkYiqhagegJhQAd").cp());
            stroke.setBounds(0, 0, 246, 198);
            return stroke;
        },
        130: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbgAAYgeAKgyAUgoAUYh4AyjSBGiMAeYiCAoksAyigAUYgoAAgoAKgKAKYgUAUAUAoA8AeYA8AeAAAACWAAICgAAIC+g8YEOhQCWgoAoAAYAyAKAeAeAKAoYAKA8haFehQDSYhGC0h4DchQBkYh4CWi0CqiCBQYi+CCjcBuj6BaYg8AUhGAegKAAYAAAUAAAAAKAUYAeAeBQAKCWgKYDmgUDmhQEEiqYGQkED6loEYrkYBQjmAog8BahkYAogoAegoAAgUYAKgyg8g8iMg8YhkgehGAAhQAA").cp());
            stroke.setBounds(0, 0, 221, 234);
            return stroke;
        },
        131: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbqAKYgyAekiA8iCAKYiqAUiWAKhaAAYiCgUgeAUBGBGYAoAoBaAyBQAUYBQAUB4gKDSg8YCqgoAUAAAyAUYAoAKAAAegoBuYhGDwh4DciMDIYk2G4lKEOngD6YhuAyhkAyAAAAYAAAKAAAKAAAKYAUAUBkgKCggoYD6g8CMhGDmiWYFejmEilKE2ocYBQiMAegoBGhGYAogyA8gyAogUYA8geAUgeAAgeYAAgehkhahkhGYiMhag8gJhQAT").cp());
            stroke.setBounds(0, 0, 226, 217);
            return stroke;
        },
        132: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUeAeYgyAUhGAeg8AKYhQAegyAKjSAeYhQAUgUAKAKAeYAAAKAeAUAeAKYBGAoBGgKDcgyYBugeBkgUAKAAYA8AAgKBQgyCqYgoB4gyBQhaB4YigDckOCCo6CCYhQAUhGAUgKAAYgJAUATAUA8AUYBGAKCWgKDmgoYFAgyCqhGC+i0YCgiCBaiCB4jwYA8iCAUgeAygyYAogeAKgeAAgKYAAgohuhuhagoYhagngyAAhkAn").cp());
            stroke.setBounds(0, 0, 176, 135);
            return stroke;
        },
        133: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASmAeYhaAoiqAyhuAUYhaAUkiAeigAKYhQAKgUAAgKAUYgKAUAAAAAKAUYAeAyDIBaBaAAYAeAACMgeCggoYCggoCMgeAUAAYBGAAAAAyhQDIYkYKyj6FynWGaYhaBGgoAyAAAKYAKBGEEiCD6jIYBuhQC+i+BahuYCgi+C0ksDSmuYBai+AohGAogoYAUgeAUgeAAgKYAAgUgogygygeYhQgoiWgygoAAYgUAAg8AKgoAU").cp());
            stroke.setBounds(0, 0, 168, 215);
            return stroke;
        },
        134: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASwAAYgKAAg8Aog8AoYiMBahQAoi0AyYiWAoiCAUi0AKYi+AUAAAAgKAeYgKAyAyAyCMBGYB4A8AeAADmhaYDwhaDShQAeAAYAoAAAKAeAAAyYgUBaiMEEiMDSYi0EOloHMjcDmYgoAoAAAUAAAAYAoAyFAjcC+jIYDcjwCCigDwl8YDSlUAog8CCiCYCMiMAKgUiChQYh4hGiggdg8AJ").cp());
            stroke.setBounds(0, 0, 164, 203);
            return stroke;
        },
        135: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVQAKYgUAAgyAegyAUYiqBaj6BGm4BGYiCAUhkAegKAAYgUAUAeAoAyAeYAeAUAoAKAyAAYBQAKCWgeF8haYDIgoAygKAUAKYAeAUAAAeg8BkYjcF8k2FKoIGQYhGAygyAyAAAKYAAAUA8gKBugoYDchaCghaCqiMYDwi0DmjmDwkiYCMiqB4h4BGgyYAygoAUgegKgeYgKgohugyiWhGYhugegeAAgyAK").cp());
            stroke.setBounds(0, 0, 183, 170);
            return stroke;
        },
        136: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARqAKYgeAKg8Aeg8AUYjIBQjwA8j6AoYigAUgoAKAAAUYAAAyBkAoB4AKYBuAKBkgUCggyYBQgeBageAegKYBGgKAAAAAoAKYAUAKAUAKAKAKYAyBGhkGkiCEOYhaC0iqC+i0B4YhQA8iWBQhaAyYhkAoAAAKAAAUYAKAoA8AKBugKYCWgUCCgyCMhaYCghuCgiWBkiMYBaiMBkjcBuk2YBGjIAegyBahuYBGhQAAgohagyYg8goiWgyg8AAYgUAAgoAAgeAK").cp());
            stroke.setBounds(0, 0, 157, 186);
            return stroke;
        },
        137: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQaAAYgKAKgoAKgoAUYhQAejwBGhuAUYgyAKhaAKhGAKYhuAKgeAKgKAKIgUAUIAeAeYAoAoBkAUBkgKYBQAAAygUBugeYBQgeBagUAeAAYA8gKAAAAAeAeYAeAeAAAAgyCqYg8DmhQCWhuCCYiCCMjSCCjwBQYhaAegKAKAAAeYAKAUAeAKB4gKYC0gKC+hGCqhuYBkhGCWiMAyhQYA8hQBQiWAyh4YBGiWAog8BQhQYBGhGAKgegogyYgUgKgygog8gUYhGgogegKgyAAYgoAAgeAAgUAA").cp());
            stroke.setBounds(0, 0, 145, 140);
            return stroke;
        },
        138: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaGAUYhkAynCCCjmAoYiWAekYAyhuAKYgeAAhQAKhQAAYh4AKgUAAgKAUYgKAeAAAoAUAeYAoAyCWBkA8AUYBGAUBQgKCghGYDchaHCiMDcgyYB4gUAeAKAoAoYAyAygKAUi0FyYjIGGhGCMhkBuYhaBageBGAAB4YAAC0A8BkBGgUYAogKBuhaAohGYBQiCBujSC+nCYCqmGAyhQB4hQYBGgyAog8gKgoYgUhQlAjShkAAYgKAAgeAAgUAU").cp());
            stroke.setBounds(0, 0, 218, 196);
            return stroke;
        },
        139: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AR0AKYgUAKgoAKgeAUYgoAKhQAeg8AUYhkAegoAAhGAAYhGAAgKAKAAAKYAAAUA8A8AoAUYAeAUBGAACCgoYB4geA8AAAAAUYAUAehGDIhaCgYgyBkhQBkiqDIYiqDSjSC+jICMYgoAegeAeAAAKYAAAKBkAAA8gUYBkgeC+hkBkhGYBuhaEYkYBuiWYBkh4BkiWBuiqYAeg8AyhGAogeYBkhugKgejIhkYiMg8gegJg8AT").cp());
            stroke.setBounds(0, 0, 155, 165);
            return stroke;
        },
        140: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAj8AAUYiCBQhaAeiCAoYpOCqruCCmaAUYiWAKgKAAgUAUYgnAoATA8BkBaYBaBQAyAeBaAAYA8AAAUgKAygUYCghaFyhkKKiWYCWgeCMgeAUAAYAKAKAUAKAKAAYAKAegUAUiqCCYmkE2oIFemQDwYiCBQh4BQgUAKYgeAeAAAKAUAKYAKAKAKAABugUYCggoBugyDmhuYG4jmIIk2GQkiYB4hQCCg8C+hQYBageBGgoAKAAYAyg8iCiWi+h4Yhkg7goAAhQAd").cp());
            stroke.setBounds(0, 0, 281, 173);
            return stroke;
        },
        141: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Aa4AUYh4AyjmAymkBQYnWBQjSAeiCgeYg8AAgKAAgeAKYgoAUgJAeATAoYAUAyCgCMBaAyYAyAUBGAABGgyYCqhuCqgyISiMYE2hGBGgKAUAeYAUAegUAygyBGYgUAehGBQgyA8YgyBGhaB4hGBQYjmEiAAAAAKAKYAKAKAUgKA8geYCChGCMhkEOjSYCgiMAogUBQgeYAogKAogUAUAAYAogeAygyAAgUYAAhGkOkshageYgyAAAAAAhaAU").cp());
            stroke.setBounds(0, 0, 223, 115);
            return stroke;
        },
        142: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWCAUYhkAoiMAok2BQYleBah4AUjSAKYhkAKg8AAgKAKYgnAoBFBkBuAeYB4AoA8gKDchGYFyh4E2hGA8AKYAoAKAKAKgKAeYgUBGi+EYhGBGYg8A8goCMAKBuYAKBQAoAUBQgoYBagoB4iWDSksYBuiqBQhaBQgoYBug8AKgehGhQYgegegygehGgoYh4gyg8gJhaAd").cp());
            stroke.setBounds(0, 0, 188, 114);
            return stroke;
        },
        143: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APeAUYgyAUiWAyiWAyYkiBkg8AKiqAKYhuAAgKAKAAAoYAAAoBGA8BGAeYAyAUAKAKA8gKYAoAAAogKAUgKYBGgyHqi+AeAAYAyAAAyAeAAAoYAAAUgUAyhGB4YjIE2g8B4AeAAYAKAAA8g8A8g8YBuhaB4huCMh4YAygoBGgyBGgeYBQgyAKgegyg8Yg8hGjmh4hGAAYgUAAgyAKgoAK").cp());
            stroke.setBounds(0, 0, 150, 90);
            return stroke;
        },
        144: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AM+AAYgKAAgeAKgKAKYgUAKhuAohuAyYjcBGiWAyhuAKYgeAAgeAKAAAAYAAAKBGA8AoAKYA8AUBugKDIgyYBkgeBagUAKAAYAKAAAAAKAKAKYAKAUhkDmhaC0YhGCggUAyAeAKYAeAABuhkCgi+YCgi+BQhQBkhaYAogeAegeAKAAYAKgygegeiqhaYhGgogyAAgoAA").cp());
            stroke.setBounds(0, 0, 119, 93);
            return stroke;
        },
        145: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALQAAYgKAAgUAKgKAKYgoAUleBkiMAeYhQAUhGAKAAAKYgJAUAnAoAyAUYAyAeAyAAC+goYCqgeAeAAAAAeYAAAei+GahaCWYgyBQg8CCAAAKYAAAKAKAAAAAKYAUAKDIjSC0jIYCqi+CWiWBkhGYBuhagKgUjSiCYhag8gyAAgoAA").cp());
            stroke.setBounds(0, 0, 109, 112);
            return stroke;
        },
        146: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMgAKYgUAAgeAUgeAeYhQA8g8AUj6BaYkYBkgeAUgUAeYAAAUAABGAUAUYAUAeCWgoCgg8YBGgeBkgoA8gUYBageAKAAAoAKYAyAUAKAeAAAyYgKAyiqHMgyB4YgUAygUAoAAAUYAAAKAUAUAKAUYAeAUAKAKAegKYA8gKAogeAUg8YAUhaEOmkBkhaYAUgeAygoAegUYBkg8Aegygyg8YgegojSiWhQgoYhGgeg8AAgyAK").cp());
            stroke.setBounds(0, 0, 133, 123);
            return stroke;
        },
        147: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALkAAYgKAKgeAUgUAKYgyAygoAKkiBaYksBkAAAKAAA8YAAAyAoAUAoAAYAKAAAygKAygeYB4gyEihkAyAAYAyAAAoAogKAyYgKAohuE2geBQYgeA8AAAoAoAKYAoAUAUgKAogoYAegeAUgUAAgeYAKhQEilUA8AAYAUAAAyg8AAgUYAAgegygyhuhQYiChkhGgJhGAJ").cp());
            stroke.setBounds(0, 0, 118, 89);
            return stroke;
        },
        148: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANwAUYgKAKgyAogoAeYiCBQhQAoiWAoYhGAUhuAUg8AKYigAUgUAUAAA8YAAAyAUAeAyAAYCggKFAhGCqhQYAegUAygKAKAAYAeAAAoAeAAAUYAAAKgeA8gUA8YgeBGgoBugeA8YgoCWAAAoAoAUYAoAeAegeAyhQYBQiqDSkYBag8YAegeAegeAKgKYAUgygog8iMhaYiChGg8gJhGAd").cp());
            stroke.setBounds(0, 0, 131, 95);
            return stroke;
        },
        149: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJiAKYg8AeAAAoBQBuYA8BaAUBQAKCqcAAUADcAAAAmwgAUAAyYAAAUgUAegUAUYgeAegKAAgyAAYgeAAiCgUiCgeYkOgygeAAAAAUYAAAUAoAyCCBQYDwCWB4BkBkCCYB4CMBQAoA8gyYBGg8AyiMAUi+YAUhugKjcgUmuYgenWgKoSAKm4YAAoSAej6AyjIYAeiCAKgUgUgoYgegohGgyh4g8YiCgyhQgJgyAT").cp());
            stroke.setBounds(0, 0, 111, 399);
            return stroke;
        },
        150: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AImAKYgUAKgKAKAAAKYAAAKAeA8AeA8YAoBGAUA8AKAyYAUBkAKMWgKFoYgUFKAAA8gUAoYgUAogyAegeAAYgUAAhkgehugeYkshkAUAKgUAKYgJAUATAoCCB4YCqCgC+C0BGBkYBGBaAoAUAogKYA8gUBuigAoh4YAUhQAAgKAAmuYAAjwgKl8AAjSYgKmuAKhuAohuYAohkAAgygogeYgogyhkhGhagoYhkgohGgJgeAT").cp());
            stroke.setBounds(0, 0, 102, 269);
            return stroke;
        },
        151: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAAYgUAKgKAeAUA8YAoBkAKB4AKEEYAKEEgUC+gUAyYgKAUgoAUgeAAYgUAAg8gKg8gKYiWgog8AAgUAUYgJAUAJAeBuBkYB4BkB4CCBGBQYAoAoA8AoAeAAYAeAAAogoAohaYBQi0AKgyAAngYAAjcAAjSAKgoYAAhagegyhGhGYhahQhQgdg8AJ").cp());
            stroke.setBounds(0, 0, 77, 163);
            return stroke;
        },
        152: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFAAKYAAAKAKAoAKAoYAeA8AAAeAADIIAADmIgeAKYgeAKgKAAhkgUYiWgygyAAAAAUYAAAUAKAUB4BuYA8AyBQBQAeAoYBkB4AoAKA8iCYBGiMAAgeAKkYYAAlAAAAAiMhkYhGgogygJAAAT").cp());
            stroke.setBounds(0, 0, 59, 101);
            return stroke;
        },
        153: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABaAAYgoAKgeAeAAAUYAAAeAAAUAoAyYBQBQAUBGAeDSYAeD6AAEsAAKUYgKKogKDSgeFKYgoFegUBkg8BkYg7BaAAAyAnBaYAeAyAyAoA8AeYAoAUAAAAAUgKYAUgKAyg8Aog8YB4iWDmkOCgigYCCiCAUgogUgUYgegoAKAAlKDmYh4BahkBGgKAAYgKAAgKgKAAgUYgKgKAAiMAKigYAKigAKk2AKjcYAAjcAUksAAiWYAKiWAKkiAAjSYAKmuAKiMAehkYAUhGgKgegegoYhGhajmhPhaAT").cp());
            stroke.setBounds(0, 0, 100, 388);
            return stroke;
        },
        154: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC+AKYgKAKgUAUgKAKYgKAoAKAoAoAoYAoAeAeBGAUBaYAeCWgKMggoIIYgyI6gyEihQCCYgKAUgeAegKAeYgUAUgKAoAAAeYAABGAoBkBaA8YBQAyAAAAC+jcYBkhuE2ksDwjSYCgiWAUgegegeYgegUgyAeleDmYi0B4iWBkgKAAYgKAAgKgKAAgKYgKgUAUi0AUjSYA8qUA8qyAUjIYAKjIAUiCAeg8YAehGgUgyhGg8YiChui0gnhQAd").cp());
            stroke.setBounds(0, 0, 122, 325);
            return stroke;
        },
        155: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADwAKYgUAUAAAeAeBGYA8BuAeAyAKBGYAyCMAAAUAAG4YAAGGAABkgeDmYgUCqhQFAgyBkYgoBGhkCMgeAeYgoAegKAoAAAoYAAA8AoCCAoA8YAyA8AeAUAogKYAKAABkhaBuhuYDcjcH0muDwi0YAegUAogyAAgeYAAgoh4A8m4D6YiCBQiCA8AAAAYgeAAgUgKAAgeYgKgoAKjSAUmQYAKiMAKigAAg8YAKiMAoocAAg8YAAgeAKg8AKgyYAKhGAAgKgUgeYgeg8hQgyiggyYhagUgyAAgeAK").cp());
            stroke.setBounds(0, 0, 145, 295);
            return stroke;
        },
        156: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACMAAYgoAUAAAeAeA8YCMEEAKAoAUEOYAKFKgKDShGEEYgoCqgoBahkCMYgyBaAAAAAAAyYAAAyAyB4AyBGYAUAUAeAeAUAKYAeAKAKAAAegKYAUgKAegeAegoYC+kiFUmQImpOYCqi0AegogUgeYgegUi0CWn0HWYiMCCiCBugKAKYgUAKgUAAgKAAYgUAAAAgKAAgyYgKgoAUlAAUn+YAAg8AKhuAKhQYAKjIAAgKgogyYgogogogUh4goYhagehQAAgeAA").cp());
            stroke.setBounds(0, 0, 159, 234);
            return stroke;
        },
        157: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAAYgoAUAAAoAeBQYAUAeAUBQAUAyYAUBaAAAoAKDIYAADcgKCCgeD6YgUDIgyBaiWDcYgeAoAAAKAAAyYAABkBQCgA8AKYAUAKAogUAegoYA8hQFKksEijmYA8gyBGg8AUgKYAygoAUgogUgUYgUgegyAUl8C+YhaAohQAogKAAYgUAAAAgUAUhuYAUigAel8AKjcYAKhuAKh4AAgoYAehkgKgKgogyYh4h4iWhFg8AT").cp());
            stroke.setBounds(0, 0, 113, 213);
            return stroke;
        },
        158: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACWAAYgUAKgKAKAKAoYAAAUAUAyAUAoYA8BaAoBuAUBaYAAAoAKBagKCMYAAC0gKAogUBaYgeCCgyBkhGBaYh3C+AAgKAdB4YAeBaAoA8AoAoYAyAoAUgKBQhQYC0jSGGloEOjmYCMhuAUgeAKgeYAKgeAAAAgoAKYgeAAiqBakYCqYhkA8haAogKAAYgeAAgKgeAKleYAAi+AKjcAKhQYAAh4AAgegKgKYgUgeiMhGhagUYhagUgoAAgeAA").cp());
            stroke.setBounds(0, 0, 130, 188);
            return stroke;
        },
        159: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACgAUYgKAKgUAKAAAKYAAAKAUAoAUAyYBaDSAoDwgeEOYAABagKBkgKAeYgeBag8B4hQBkYhQBugJAeAJBQYAUA8AoBQAeAeYAoAoAegKA8gyYBkhkC+huHCjwYFUi0AUgKgKgeYAAgKgKgKgUAAYgogKjcBGk2BkYhaAUhQAegUAAYgyAAAAgUAKjSYAKhuAKi+AAiCYAAiCAKiMAAgyYAKgyAAgyAAgKYgKgyjmiWhGAAYgKAAgeAAgKAU").cp());
            stroke.setBounds(0, 0, 132, 182);
            return stroke;
        },
        160: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgeAUAAAoAUAKYAUAUAyCCAKBGYAKAyAKCCAADIYAAGkgUB4hQCgYgeBagJAoAdBaYAoBuBGBQAogKYAKAAAogoAegoYAegoCgigCWigYEikiBuhugKgKYgKAAgKgKAAAAYgUAAj6CMigBkYhkA8hGAegegUYgUgKgKg8AKlKYAKi0AKi+AAgyYAekEAAAKhkhQYhahQhagJgoAT").cp());
            stroke.setBounds(0, 0, 99, 179);
            return stroke;
        },
        161: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAAYgKAKgUAKgKAKYgUAeAAAeAoAyYBGBkAKBkAeImYAUKUgUKUhGH+Yg8HCgeBahaBkYgyA8gKAUAAAeYAAAoAyBkAoAyYBQBQA8AABag8YAygoDchaBQgUYBagUEigoDIgUYHCgoBQAAJEAAYIIAABaAACWAUYC+AUAyAAAogyYAegeAAgegegyYgogyiChahagoYhkgygyAAjwAUYkiAeAKAAjIAUYhkAUhkAKgUAAYgeAAhkAKhaAKYn+A8i0AeiCAKYhQAUh4AKhQAAYjmAKgKAAAAi+YAAg8AKh4AAhaYAKhaAKjSAKiqYAAiqAUlKAKjcYAKjmAUlKAKi0YAUmkAKiMAehuYAUhGAAgUgKgKYgUgUjIhkhGgeYhGgKgyAAgoAA").cp());
            stroke.setBounds(0, 0, 343, 373);
            return stroke;
        },
        162: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAyAAYgKAKgUAKgKAKYgKAUAAAKAAAUYAKAUAKAUAKAKYBGA8AoCgAyHWYA8JOAKF8gUGkYgKEsgoCMhGBGYgKAKgUAegKAUYgKAeAAAKAUAoYAeA8BGBQAoAUYAyAUAeAAA8gyYAegUBagyBGgeYCghQBugUHCg8YAogKEsgUCWgKYDSgUHMAACgAKYBkAABkAAAUAAYAygKAygoAAgoYAAgyiMhkiMg8YhkgogyAAmaBGYg8AKi+Aei0AUYi0AekOAoiWAeYkYAyiWAKgygKYgygKgKgogKleYAAiqgKjcgKhuYgKkEgUvKAKiWYAAhGAAhGAKgUYAAgeAAgKgUgUYgegeh4g8hkgUYhGgKgyAAgeAA").cp());
            stroke.setBounds(0, 0, 293, 304);
            return stroke;
        },
        163: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AB4AAYgUAUAAAyAoBkYA8CWAKBGAAGaYAKFygKHWgeGuYgUEigeGGgUA8YgKA8goBkgeBGYgUAegKAoAAAUYAAAoA8CCAoAoYAyAyAegKB4haYEEjIGQhuLQhQYBQgKBGgKAKgKYBGgeg8hkiMg8Yg8gegeAAhaAUYjcA8lyBah4AeYhQAUh4AehGAUYh4AogKAAgUgUIgegKIAKjIYAAhuAKkYAUj6YAKjwAKloAKi+YAUsMAAhuAeiMYAUhGAAAAgegUYgUgehuhQhQgoYhGgegyAAgeAA").cp());
            stroke.setBounds(0, 0, 188, 338);
            return stroke;
        },
        164: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAKYgKAUAAAUAeBQYAoBkAKBQAAEEYgKDwgKCggUEOYgUCMgUBQgyBGYgUAoAAAyAUA8YAeBGAeAoAeAAYAKAAAygeAygeYDwiMEOg8JYgUYCqgKAogKAAgeYAAgegegegygoYgogegKAAgyAAYgoAAhGAAg8AUYhuAKkiAyhuAKYgeAAhQAUhGAKYhGAUhGAKgKAAYgyAKgKgKAAh4YAAi0AotmAKhuIAAhGIgygoYhkhQhkgdgKAd").cp());
            stroke.setBounds(0, 0, 155, 179);
            return stroke;
        },
        165: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAeAAAUAeBGYAUAoAUBGAUAyYAyC0AeGaAAJsYAAH0AAAKhGCWYgoBagKAyAoBGYAoBGAUAeAeAKYAoAUAegKBGgyYBGgyB4g8BkgeYBageD6gyC0gUYBQgKBQgKAKgKYAegUAAgegygyYhQhahGgUh4AeYgoAKiMAeiMAeYjcAogeAAgKgKYgKgUgKiCgKleYgKhugKk2gKkOYgKkigKjmAKhQYAAiCAAAAgUgeYgUgUgogehQgoYh4gygogJgeAT").cp());
            stroke.setBounds(0, 0, 133, 250);
            return stroke;
        },
        166: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJsAUYgeAoAAAyAeBGYAoBuAUBkgKCWYgUFehQGuiMHMYiCG4haC0igC0YgyA8AAAKAAAeYAAA8AyBuA8A8YA8BGAUAABugyYC0hGEEgyG4geYDIgKHgAKD6AUYEEAUGQBaFABuYCgA8AyAAAegeYAogegehahQhQYg8hGi0iWgygeYg8gehaAAiqAKYhaAKkiAKqKAAYocAAmkAKhQAAYiMAKgUAAAAgoYAAgKAeiCAyigYAyiWA8jSAehkYCCmaBum4BGlKYAUhkAeiCAKgoYAUg8AAgoAAgKYgUgoi+ighagoYg8gUgeAAgUAU").cp());
            stroke.setBounds(0, 0, 335, 308);
            return stroke;
        },
        167: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKeAKYgoAoAAAKAeBGYBQCWAKBkgoDSYgoDIhaF8gyCCYgUAygeBagUA8Yg8CqiCC0igCMYhuB4gTA8AnBaYAUAeAoAoAeAeYAyAyAKAAAoAAYAoAAAUAAAogeYBQgyA8geBkgUYB4geDwgeD6gUYHMgeL4BaHWCMYBkAeAyAAAygUYBagogyh4iWiCYgogegygegUgKYgogKiMgKksgUYlegUiMAAleAKYloAAmaAUiCAUYgyAKgegUgKgeYgKgeAAAAB4lAYCWlyCqowBamaIAUg8IgygyYiMiMiqhZgeAn").cp());
            stroke.setBounds(0, 0, 310, 243);
            return stroke;
        },
        168: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABkAKYgoAUAKAeAyB4YBuEEAUC+geEiYgUDIgyCChaBkYhPBuAAAoBjBkYA8A8A8AeAoAAYAKAAAogUAogeYBQhGCCgyDchGYHWiWHChuG4hQYHqhaEOgUB4AeYAeAKA8AKAeAAYAyAKAKAAAegeYAegeAAgKgKg8YAAgygKgegKgUIgUgeIiCAKYk2AUoSBGpiBuYnMBQiMAokEA8YjSA8goAAgegUYgUgUAAgUAUjwYAKiMAKi0AAhQYAekigKgyhkhQYgegUgygogegUYhkgyg8gJgoAT").cp());
            stroke.setBounds(0, 0, 324, 170);
            return stroke;
        },
        169: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACCAKYgUAUAAAUAyCCYAyCgAKBugKCMYgKA8gKBQgKAeYgUBQgyBugoAeYgoAygeA8AAAeYAAAyCWCMBGAKYAeAKAKgKAogoYBGgyBagyCggyYH0igJsiWHCg8YCCgUEOgKBuAUYA8AKAAAAAegeYAegeAKgKAAgyYAAgogKgUgUgUIgUgeIh4AKYjwAKmGAynCBQYoSBahkAUkYBQYhkAUg8AKgUAAYgygKAAgeAojmYAokOAAhageg8YgegyhQhQhQgyYhGgehGgJgeAT").cp());
            stroke.setBounds(0, 0, 283, 133);
            return stroke;
        },
        170: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADIAUIgeAUIAUBGYAeBQAABagUCCYgeB4gKAUhGBQYhQBQgKAUAAAyYAAAeAAAKAyAyYA8BGAeAABQgyYCMhGCqg8EOgyYDSgoG4g8D6gUYC0gKHMAAEiAAYCCAKAeAAAUgUYAogUAKgegUgeYgUgeiWhkhQgeYhagogyAAiWAeYi0AojwAokEAeYmaA8kYAojmAyYiCAeh4AUgeAAIgyAAIAAgoYgKgyBkjmAyg8YAUgeAAgogKgeYgKgKgogegogUYiMhagygTgoAn").cp());
            stroke.setBounds(0, 0, 286, 93);
            return stroke;
        },
        171: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAUYgUAeAAAUAoBGYAUAeAUAeAKAUYAoBaAKDIgeDSYgUCMgUAohQBkYgeAegUAoAAAUYAAAyAKA8AyAoYBGA8AyAKAygoYBuhaFohkHChGYEigoBQgKF8AAYFegKAUAAAegUYAUgKAUgUAKgUYAUgUAAgKgUgUYgegoiChQh4gyYiCg8goAAjmA8YhaAeigAehuAeYkEAyjSAyjSAyYi+AygeAAgKgoYgKgeAylAAeh4YAKgyAUhGAKgUYAegyAAgogegeYgogyksiCgyAAYgKAAgUAKgKAK").cp());
            stroke.setBounds(0, 0, 237, 130);
            return stroke;
        },
        172: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADmAKYgKAKgKAUAKAeYAAAeAKAyAKAoYAKBagKBkgoBkYgeBugeAyhGBGYhZBaAAAeBPBkYA8A8AyAUAogeYBQgoAygeBkgeYE2hkGuhkE2gyYBugUBQAAC0AAIDmAAIAUgeYAUgeAAhGgogeYgUgUgKAAhuAKYlUAKsgB4kiBQYhaAUgeAAAAgeYAAgKAUhQAehQYAehaAehaAAgUYgKgygeg8g8hGYhQhQhQgdgUAd").cp());
            stroke.setBounds(0, 0, 213, 100);
            return stroke;
        },
        173: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABaAKYAAAKAKAyAKAyYAeBuAABGgUB4YgUBagKAeg8BGYgUAegKAeAAAKYAAAUAyA8AoAUYAoAUAUAAAogeYBahQGaigD6gyYCggeAegUAAgeYAAgogegUgeAAYg8AAowCMhkAoYgUAKgUAKgUAAYgUAAAAgKAKgyYAAgeAKg8AKg8YAUigAAgegogoYhGhQhugngKAd").cp());
            stroke.setBounds(0, 0, 113, 80);
            return stroke;
        },
        174: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABuAUYgeAeAAAeAoBaYBGCgAoC0AAC0YAACWgKBugeB4YgeB4goBGhGBaYgyBQgJAoATAoYAUAoBGBGBGAeYAyAeAKAAAegKYAUgKAUgKAAAAYAAgUB4hQA8goYCghQGaiCCggeYA8gKBkgUA8gKYA8gKA8gKAKgKYAygUAUh4gygoYgegUgeAAiMAUYjmAekOA8jwBQYiWAogoAKgKgoYAAgKgKgUAKgKYAAgeAypEAKiWYAKiMgKgog8g8Yg8hGighag8AAYgUAAgUAKgKAK").cp());
            stroke.setBounds(0, 0, 162, 168);
            return stroke;
        },
        175: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABkAUYgKAoAAAKAeA8YA8BaAKBGAAC0YAAE2g8DchkCWYgeA8AAAeAKAyYAeAyBGA8AeAAYAKAAAogKAegUYDShuGagoEiAyYC0AeAUAAgKgyYgUg8jSighkgUYgogKi0AoleBQYiMAegeAAAAgUYAAgKAeiCAUiMYAykEAKg8AUkEYAUiMAAAKhkhGYh4hGg8gTgUAn").cp());
            stroke.setBounds(0, 0, 133, 141);
            return stroke;
        },
        176: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgnAeAAAeBFBaYAeAeAoAyAKAeYAeA8AAAKAADIYAABuAAD6gKCqYgUIIAKBuA8CMYBaC+CCAoF8goYCqgUA8gUAygoYAygyAKgogUgeYgegeg8gKjcAKYjwAKgUAAgygUYh4g8goh4AAmQYAAkOAokEBQlAYAoiqAAgKiWhGYiWg8hugogeAAYgKAAgUAAgKAA").cp());
            stroke.setBounds(0, 0, 115, 204);
            return stroke;
        },
        177: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgnAUAJAyA8BGYA8BQAeA8AKBuYAKAoAKDIAAC+YAKFKAAAeAUAyYAUBGAyAyA8AeYA8AeBQAKCqAKYC+AKCWgUAygUYAygeAyg8gKgeYgKgygogKkYgKYj6gKgKAAgygeYgygUgUgUgKgeYg8huAUlKBQk2YAehuAAg8gegUYgKgKhGgohGgoYiWhGhQgJgoAJ").cp());
            stroke.setBounds(0, 0, 114, 144);
            return stroke;
        },
        178: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAAYgKAUAAAoAUCCYAUBQAeCCAKBQYAKBaAKBQAKAKYAKAeBQBQAyAeYB4AyD6AeEigeYIIgoEigyBuhGYBQgogKhGhQgoYgygeiWgehagKYg8AAgKAKhkAoYhuA8hGAUkYAoYjcAUjSAKhQgeYgegKgegUgKgKYgUgUAAgKAAhQYAKgoAKhaAUg8YAUhaAAgUgKgUYgUgeigh4gygKYgygKgoAAgUAA").cp());
            stroke.setBounds(0, 0, 190, 87);
            return stroke;
        },
        179: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AISAKYgUAKgKAUAAAUYgKAeAKAKAeAoYA8BGAeBaAAA8YAACqh4JihuF8YgyCqigH0geBGYgeBQgeAogyA8YgoAygJBQATA8YAUAyAUAKB4AAYCgAAB4AyDcCCYHMEOGuFKFyFUYDcDSAoAeAoAKYAoAKAogUAKgoYAyh4h4k2iqiWYgogogogehQgoYg8gUhug8hQgyYkEigjmiCqAlKYjIhugUgKAKgyYAAgUA8i0BQi+YCgmGCWmkB4lyYAoiMA8iMAeg8YA8iCAAgUgyhQYhGhujwiMh4gKYgyAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 234, 407);
            return stroke;
        },
        180: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AG4AeYgUAUgKAKAKAeYAAAKAKAeAUAUYAyBaAKCWgoEEYgyGuhGFeh4HgYhGEigeBGhkCqYgeBQAAAoAKAyYAKAyAeAUBaAyYEOCMFoEYF8FeYCMCCAyAAAohQYAUgoAKgUgKhGYgKiWgyhQh4hQYhuhGjwiMksiMYiWhQiChQgUgKYgogyAAgUA8i+YCMmGCqocCMoSYA8i+Ayh4AyhaYAog8AKgeAAgyYAAgyAAAAg8g8YhGg8iWhuhGgeYg8gUg8AAgoAe").cp());
            stroke.setBounds(0, 0, 141, 361);
            return stroke;
        },
        181: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAUYgeAeAAAKAeBGYAeBaAAB4gUB4Yg8DwigHChGCCYgeAegeAygeAeYgoA8gUAyAAAoYAAAoAyAyBGAeYCMBGC0DSEOGQYBuCgAUAKA8geYAogUAeg8AAhkYAKhkgKgyhGhQYhGhkksjwi+h4YgogUgegegKgUYgegyAKgeCCj6YBGh4BujcBGiMYBGiMBGiMAUgeYAyhaAAgog8hGYhQhkigh4gyAAYgKAAgeAKgKAK").cp());
            stroke.setBounds(0, 0, 98, 250);
            return stroke;
        },
        182: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEiAAYgoAUAAAKAUAyYAeBGAABageBkYg8C0huDmg8BQYg7BQAKAKBtCCYA8A8BaBuAyA8YCCC0AeAUAoAAYBGAABGh4gKhkYgUhahGg8jShuYiMg8gUgUAKg8YAUhGFAmQBGgoYAygeAKgogUgyYgKgegUgegygyYhuhuhQgThGAJ").cp());
            stroke.setBounds(0, 0, 65, 149);
            return stroke;
        },
        183: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAKYgUAUAAAKAUA8YAeBaAAAegyC0YgyC+geBkg8BuYgyBagJBGATAeYAKAKAyAeAyAKYCqA8EOCWCWB4YDmC0CqCMC+CqYAyAyBGA8AeAKYBkAyBQgeAAhaYAAhQhuj6g8g8Ygygoh4hGkYiWYjShklyighkgeYhQgegegUAAgeYAAgUEYpEAUgeYAKAAAAgUAAgUYAAgohQhQhag8YhQgogogJgeAT").cp());
            stroke.setBounds(0, 0, 164, 201);
            return stroke;
        },
        184: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APKAKYgKAKAAAUAKAeYAKCgAABQgKBkYgoDIhGEEiMFoYiCFegyBuhQCqYiCEEhkCWiMCMYhaBkgJAeAJBaYAeCMAoBQAyAAYAKAAAogKAogKYCqg8G4hkEOgoYGag8GGgoEigUYBugKBagUAegeYAUgegKgehGhGYhQhQgygUh4gKYhuAAhaAKj6A8YhuAUigAohaAKYj6Ayn+BGgeAAYgeAAAAgKAAgUYAAgKAohuAyh4YCMk2CCkiCClKYEEp2AohaCMiMYBQhaAAgUhahQYhQhGiChkg8geYgygUhQAAgUAK").cp());
            stroke.setBounds(0, 0, 243, 286);
            return stroke;
        },
        185: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfuAAYgUAKgeAyAAAoYAAA8gUBQhGCCYiqFKjIEilAFUYjSDcqUKehGA8YgeAUg8AogyAUYh4BGgTA8AnBuYAUAoBuB4AeAUYAeAUAeAACWg8YH+jIHMhuPKiMYDcgeAogKAegoYAAgKAAgKAAgKYAAgKgKgKgyAKYgeAAhQAKhQAAYmuAUqABGo6BaYhaAUhQAAgKAAYgKAAgKgKAAgKYAAgyHCnWKAqUYHMnWCMiCCWh4YAogeAegeAKgUYAUg8hkiMiWhuYhahGg8gJgoAJ").cp());
            stroke.setBounds(0, 0, 263, 280);
            return stroke;
        },
        186: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AWqAKYgUAUAAAUAUA8YAUAeAKAeAAA8YAABQAAAAgyBQYiWEEtwPei0BaYiWBagKAKgeAyYgnBQAACWAxBaYAoAoAUAACWhGYDShkGuiCHMhuYH0iCIShQHCgoYBkgKBkgKAUAAYBGgeAUgogogoYgUgUgKAAigAKYn+AUw4CgrQCgYgeAAgeAKAAgKYgUgUAygyD6kEYG4m4HCmkCghuYBuhQAKgUgUg8YgUg8h4h4hag8Yh4hQhugTg8Ad").cp());
            stroke.setBounds(0, 0, 313, 224);
            return stroke;
        },
        187: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAAYgoAUgUAeAKA8YAUC+AAAegeBkYhGC0h4DwigDwYhaCMiqCqiMBuYiCBagTAyAdBQYAoBQCMB4AyAAYAUAAAegKAUgUYDciWG4iCMgigYEYgyDShGAegyYAAgUAAAAgKgKYgegUAAAAjcAUYmkAyk2AolyBQYlKBGAAAAgUgKYgegKAUgyA8haYD6leFUnMBuiMYBQhkAKgegog8YgogohuhGh4gyYhkgogeAAgoAA").cp());
            stroke.setBounds(0, 0, 230, 194);
            return stroke;
        },
        188: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQGAKYgKAKAAAUAKBGYAKAoAAA8AAAUYAACqj6Guj6D6YhuBuiMBkiWBQYgyAeg8AegKAUYgUAeAAAKAAAyYAKCWBkCWBaAAYAUAAA8geA8geYCghQCghGDShGYDchGH0iWC0goYHgh4AKAAAUgUYAegeAAgUgegUYgKgKoIBGtcCCYh4AUhuAKgKAAYgKAAgKgKAAgKYAAgeFUmuDIjwYAygyBahkA8hGYBkhkAUgUAAgeYAAgegygyhGgUYgUgKhQgehGgeYhQgeg8gUAAAAYgKAAgKAAgKAK").cp());
            stroke.setBounds(0, 0, 231, 184);
            return stroke;
        },
        189: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOiAAYgUAUAAAUAUBGYAUBGgUA8goBkYhkDSj6EiiqBuYhGAoiCBGhGAUYgeAUgoAUgKAUYgUAeAAAAAAA8YAKCgBQBuBaAAYAUAAAygKAogeYB4gyCCgyCCgoYEOhQLaigEigoYCWgUC+goBGgUYAogUAKgegKgUYgUgUAKAAsgBQYiMAKjIAUhuAKYomA8gKAAAAgUYAAgoIwpOCChkYB4hageg8kEhuYh4gogeAAgeAA").cp());
            stroke.setBounds(0, 0, 242, 151);
            return stroke;
        },
        190: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATYAAYgUAUAAAeAKBGYAeB4geB4iCD6YgoBGg8BugoA8YhkCqkOGahQBaYhQBkh4B4huBaYiMBkg8A8AAAeYAABQBGCWAyAyYAoAeAKAABkgoYC0g8E2gyIIgoYBkgKCCgKBGgKYBGAAA8gKAKgKYAegKAUgogKgUYgKgogoAApYgKYpiAAgUAAAAgoYAAgUAyhQCCiqYE2maE2l8EEkYYBGhGA8hQAKgKYAUgygKgogyhGYgyhQiCiCgygeYgygehagJgeAJ").cp());
            stroke.setBounds(0, 0, 177, 233);
            return stroke;
        },
        191: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKyAKYgKAKAAAoAKAeYAAAoAKBGAAAoYgKE2j6MWjcF8YgyBkgeAohuCMYgUAUgKAoAAAUYgJBGBjCWAyAAYAUAAAygUAygUYDwh4IIiWEigoYCWgKAegeg8hGYgegehagygeAAYgKAAgeAKgeAKYleBkm4BkgegKYgKAAgKgUAAgKYAAgoC0ngCWlUYDInWBQiWBGhaYA8hGgUgyhuhkYhkhahag8gyAAYgoAAgKAAAAAK").cp());
            stroke.setBounds(0, 0, 147, 231);
            return stroke;
        },
        192: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKKAKYgUAUAAAKAUAoYAUBQAAAegKBGYgUCMhaDci0EsYhuDIgyA8huBuYhkBagJAeAJA8YAUBaBaBkAoAAYAKAAAygKAogeYCqhQEYhaC0gUYBGgKA8gKAKgKYAygUAKhGgogKYgUgKhaAKlAAUYjIAUgegKAAgeYAAgoFeoIC+j6YBGhQA8hQAKgKYAKgogog8hkhkYhkhagogehGAAYgoAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 107, 167);
            return stroke;
        },
        193: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAKYgKAKAKAUAoBaYBGCMAKAogyC0Yg8EOh4EihaCCYgeAog8BQgyAyYgyAygoAyAAAKYgJAyAnA8BkBGYA8AoAoAAAegeYAegeB4hQBQgoYBagoCqhQDchQYFAh4B4hQhQgUYgygKmkBakYBQYiMAogUAAAAgeYAAgyFKqoB4jIYAegyAUgyAAgKYAAgogygoiCgoYgygUhGgUg8gUYhkgegKAAgUAK").cp());
            stroke.setBounds(0, 0, 136, 168);
            return stroke;
        },
        194: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAKYgUAUAAAKAKAoYAeBugUBuhaC+YiMEihkCqh4BkYg8A8geAoAAAeYAAAeA8BuAeAeYAeAeAAAACCgyYBageEOgyC0geYDcgeBGgUAUgUYAUgUAKgKgKgKYgKAAhugKj6AAYi+AAi0AAgKAAYgygKAKgeBuiqYCMjSBkiMBkh4YBuiCAKgUgUgoYgKgoigiWgygeYgygKgyAAgUAK").cp());
            stroke.setBounds(0, 0, 113, 138);
            return stroke;
        },
        195: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJ2AKYgKAKAAAUAUBGYAKAoAKA8AAAeYAABuhuEYiCDIYhQBuh4B4hkA8YgeAUgyAegKAUYgeAeAAAAAAAyYAABGAyBkAyAoYAyAyAUgKCMhGYCqhaCCg8EYhaYEYhaC+g8DwhGYDSgyAUgKAKgUYAUgUAAAAgUgKYgKgUgeAAkEAoYx0CqBugUAAgUYAAgoFAocB4iqYAog8AogyAAgKYAKgyg8gojcg8YhagKgUAAgUAK").cp());
            stroke.setBounds(0, 0, 186, 152);
            return stroke;
        },
        196: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AZoAKYgKAKgKAegKAUYgKBQgoAyhaB4YjSEEiCCCmaEsYmuFAi+CCgoAAYgKAAgUAUgKAKYgdA8AJA8BGBuYAeAoAeAeAKAAYAUAAAeAAAygeYCqhGDIhGCWgoYEEhGImh4DcgUYC0gUBGgUAegUYAUgUAAgKgKgUYgKgKgeAAhkAKYleAUnWA8nCBGYi0AogUAAAAgUYAAgUHClKHglUYEOjIDIiCAUAAYAeAAAogyAAgeYAAg8iCi+hQg8Yg8gUgeAAgUAK").cp());
            stroke.setBounds(0, 0, 209, 180);
            return stroke;
        },
        197: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AVGAKYAAAAgKAUAAAUYgUBQhuCMigCqYiCCChaBQocF8YhQA8hQAogeAUYhGAUgeAUAAAoYAAAoAUA8AyBGYAyA8AKAKBQgoYCWg8E2hkDcgoYDcgyGGg8D6geYBkgKAUgUgegeYgKgUh4AAigAUYhGAAhaAKgoAAYh4AKlyAojmAoYhuAKhkAKAAAAYgUgKDcigHWlAYC+h4DIiCAygeYBkgyAKgKgKg8YgUhQigi0g8AAYgKAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 186, 146);
            return stroke;
        },
        198: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APyAKYgUAKAAAUgKA8YgKBagKAog8CWYg8CMhaCWhaB4YjmE2kiFogoAeYgUAKgoAegKAUYgeAeAAAKAAAeYAAAeAKAeAKAKYAeAoBuBaAeAAYAKAAA8geBGgyYCqhuDmhuEihuYAygUAygUAKgKYAegUAAgogUAAYgegUkiBGkEBGYiWAygUAAAAgUYAAgeE2mQDmkOYAygyA8hQAogyYBGhaBGhQBahQYAegeAUgeAAgKYAAgegyhGhGg8YhkhQhagTgoAT").cp());
            stroke.setBounds(0, 0, 137, 183);
            return stroke;
        },
        199: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMqAAYgeAUAAAeAeA8YAoBGAABGgoBaYg8CMiqDwjIEOYhuCMhkBuhaA8YhGAygKAyAABaYAABkAyBGAyAAYAAAAAygUAogeYC+huF8igEYhaYCMgyBagUDcgyYBugUAogeAAgeYAAgyhGAAkOAyYiWAUnqB4iCAoYg8AUhGAKAAgUYAAgoHqowDmjmYB4iCAKgKAAgeYgKgogogohGgyYiChaiCgng8AT").cp());
            stroke.setBounds(0, 0, 165, 167);
            return stroke;
        },
        200: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKAAKYgUAKAAAoAeBGYA8Cgg8DIjIEYYhkCChkBkhuBQYiCBkgTAeAJA8YAUBGCCCCAyAAYAUAAAogUAygeYCMhaCqhGEOhaYCMgyCqgyBQgUYBGgUBageAogKYBugyBQhahQAAYiCAKn0BklKBkYg8AUg8AKgKAAYgeAAAKgUAyg8YBahuEileBkhuYBkhuAKgKgKgeYgKgygogoiChQYjSh4gogJgoAT").cp());
            stroke.setBounds(0, 0, 163, 148);
            return stroke;
        },
        201: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANmAUYgUAKgKAoAAAoYAAAegUAygKAeYgyBuiWCgiWBkYgoAeg8AogeAUYgoAegeAKhGAKYgoAKgyAKgKAKYgoAegyBaAAA8YAAAoAAAUAKAKYAUAeAeAAA8geYAygUAKAAEEAAYCWAADcAAB4AAYDmAKAegKAUgeYAKgogUgKjcgeYkOgejSgogUAAYgygUAogUEEigYCWhQCMhQAUgKYBGgeAegogKgyYgKhQhGh4g8hGYg8gygegJgeAd").cp());
            stroke.setBounds(0, 0, 122, 104);
            return stroke;
        },
        202: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgUAUAAAUAUAoYAoAyAoBkAUBGYAKAyAKBGAACWYAADmgKAUg8BuYgoA8gKBQAeBQYAoBkBGBaAyAAYAKAAAygyBGg8YB4h4DIiqEsjwYDmi+B4hkAAgUYAAgUgoAAhGAyYhGAoigBQmuDcYhaAygoAAgegeYgegegKg8AKkOYAKkYAAAAhQg8YhuhahkgTgyAd").cp());
            stroke.setBounds(0, 0, 132, 136);
            return stroke;
        },
        203: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgKAUAKAeAUAoYA8BGAUA8AKCWYAKBuAAAegUBaYgUBkgUAygyBQYgUAUgKAeAAAKYAAAeAoBaAUAeYAyAoAegKAyhQYAyhQCqjIBuiCYBahkAKgUgUgKYgKAAg8AohQA8YhQA8g8AogKAAYgUAAAAhkgKjwYAAkEAAAAhkgeYhQgUgyAAgUAA").cp());
            stroke.setBounds(0, 0, 62, 107);
            return stroke;
        },
        204: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAUYgeAeAAAAAKA8YAKAeAUBGAKAoYAKAoAUBGAAAoYAKBugoDSgyA8YgeAogUBGAAAoYAABuBkC+A8AAYAKAABGg8BGhQYCWiMDSi0DIigYA8gyA8g8AKgKYAUgegKgUgUAAYgKAAlyCgh4A8YhaAogygKgKhGYgKgeAAgoAUiCYAejmAAAKhQhQYhQhGhQgygUAAYgKAAgUAKgKAK").cp());
            stroke.setBounds(0, 0, 102, 123);
            return stroke;
        },
        205: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAKAAAyAAAoYAAAUAUAyAUAeYBGCMAUBkAeD6YAKCgAyFoAeCMYBuJYBkFyCWF8YDcIcDSFUFUFUYCgCgAKAKBuA8YDcB4B4AUBGgyYBGgyAKhQgei0YgUh4gUjwgKi+YAAhagKhQAAgKYgKhQgeAegoBuYhaEihaC0gyAAYgKAAgogKgegUYiqhQk2lAi0kYYj6l8jmrGhaqKYgKhugKhkAAigYAAjwAKhaAoiqYAUhGAAgyAAgUYgUh4lUizhkAd").cp());
            stroke.setBounds(0, 0, 215, 428);
            return stroke;
        },
        206: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAAYgTAUAJAeAoBuYBGCCAoB4AKBaYAoEEAKAyBQFAYAoCqBaEOAyB4YBkEYC0EsCgC0YB4CMCWCMBuAyYB4A8B4AoAyAAYAyAAAygUAUgeYAUgoAAhGgUiqYAAhagKiMAAkEYAKlKAAgegUAAYgKgKgKAUgKAoYhaE2huEig8AoYgeAegegKhQgyYhQgojIjIhQh4Yi+kOi0nWg8mGYgeiWAAj6AUiCYAKgyAAgyAAgKYgUhGiqhuiMgoYhagKgKAAgUAA").cp());
            stroke.setBounds(0, 0, 173, 289);
            return stroke;
        },
        207: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AKYgoAKgKAUgKAUYAAAoAAAeBGAoYB4BQCMCWB4DIYB4DSDmEsCqC+YFUFoFeD6FUB4YDmBQDIAUAUgoYAUgUgKhGgyhaYgehGgehQhQkOYgUhGgyhGgeAAYgUAAAAAUgKCWYgKCMgUBQgeAUYhkA8lyigj6jmYi0igi0jcigkEYigjwhGiqgUi0YgKhQgegohGgeYhkgyjcgJhkAT").cp());
            stroke.setBounds(0, 0, 247, 212);
            return stroke;
        },
        208: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAUYAAAeAABkAeAyYAUAeA8A8AUAAYA8AACMB4BQB4YBQB4AUAoAyEEYBGFeAKCWAAGGYAAFeAABkgoDcYgUCMgyDSgUAoYgoA8g8AAi+gyYhQgUhGgKAAAAYgKAKgKAKAAAUYAAAUAUAeBQBQYAyAyBaBuAyBGYCCC0AeAKBahaYB4huBajmAylAYAeigAUleAAi+YAAlygynChGksYhQlUhQi0iCh4YhkhakiiqhGAAYgKAAgKAAgKAU").cp());
            stroke.setBounds(0, 0, 91, 344);
            return stroke;
        },
        209: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHCAAYgUAUAKAUAyAyYBkCMAyCWA8GaYA8HMAeGugKIIYgKFUAABGgUBuYgeDIgoBug8B4Yg8B4goAAkihQYjSg8gKAAgKAKYAAAUAKAeB4BuYBGA8BkBaAyA8YA8A8BGBGAeAeYA8A8AUAKA8goYA8geCWiWAohGYB4jIA8kEAAkiYAAkshaxCg8l8YAAgegKgyAAgUYgKgegKhGgKg8YgUiMgejSAAhGYAAhQgUgehQgoYhGgoi0g8gUAAYgKAAgKAAAAAA").cp());
            stroke.setBounds(0, 0, 109, 373);
            return stroke;
        },
        210: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAAAKYAKAKBGA8BaA8YBaA8BuBQAyAoYCWCMB4C0A8CqYBaD6gKFehaFoYgyC0goBQhQAUYgyAUgoAAi+goYhagUhkgUgUAAYhQAAAeA8CCBuYCWBuCMB4BQBaYBaBkAeAKBGgoYAygUBahkAegyYBGiCA8j6AejwYAymkgekih4ksYhQjSgegyh4h4Yigiqiqh4jmhaYhkgegUAAgeAK").cp());
            stroke.setBounds(0, 0, 108, 262);
            return stroke;
        },
        211: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIcAKYgKAUAAAKAoBuYBkD6AoCgAUFAYAKC0AKBGgKB4YgUEOgyC+gyAyYgUAUgKAKgogKYgUAAiCgoh4goYiCgehugoAAAAYgKAAgUAKgKAKYgJAKAJAKB4BuYB4BkCMCWCqC0YAyAyAUAKAeAKYCMAUCMjmAylKYAylegeqUhak2YgoiqhkiMh4hQYhGgegKAAgeAK").cp());
            stroke.setBounds(0, 0, 102, 229);
            return stroke;
        },
        212: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFeAAYgUAegKAyAUAeYAKAUAeAyAyAoYBQBGAoBGAeBaYAoC+AKIcgoDIYgeC+AKAAlUgyYhkgUhagKgKAAYgxgKATAoCMCCYDcC+BQBQAyBGYAeAoAeAeAUAKYAyAKA8g8BkigYAyhGAohuAKhkYAUh4gKocgUkEYgKhagojmgKgoYgUgygogyh4hGYiqhuhagdgUAJ").cp());
            stroke.setBounds(0, 0, 90, 208);
            return stroke;
        },
        213: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAKYgeAeAKAeA8AyYBkBGAyBaAoCgYBQFKgeFohuA8YgoAegeAAiWgeYiggegKAAAAAKYAAAKAoAyA8A8YA8BGBGBGAeA8YBGBuAeAKA8gKYBQgeCCiCAyhuYA8huAKhGAAjcYAAjSgUiCgyjIYgoiggehGg8gyYhuhaiggng8Ad").cp());
            stroke.setBounds(0, 0, 76, 161);
            return stroke;
        },
        214: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACCAKYgUAegUAyAAAyYAAAoAeAoA8AUYAyAUCqCqBGB4YBuCgBGCgAeBuYAoC0geCChQAyYgyAehaAKhQgUYhkgKjIgegyAAYhZAAAxBQC0BkYC0BkCCBkAeAyYA8BaAeAUAyAAYAyAAA8geA8hQYCWi+BQkYgojcYgyjwiMjmkYkYYg8g8g8g8gUgKYgUgKgegUgKgUYg8hQgegUgegUYg8gKgUAAgUAK").cp());
            stroke.setBounds(0, 0, 104, 187);
            return stroke;
        },
        215: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC0AeYgoBQAKAyBaAoYBkAyCgCgA8BuYA8B4AKBugyAoYgeAeiCAAjSg8YhkgUhagUgKAKYgdAKAdAyCMBQYDSB4BaBGBaB4YAyA8BagKBGhGYBuiCAejmgyigYgyiMiCigiqiCYhkhagogogKgeYgUgegegKgygKYgoAAAAAAgUAe").cp());
            stroke.setBounds(0, 0, 87, 123);
            return stroke;
        },
        216: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEiAUYgUAKgKAUAKAoYAAAyAKAeA8BaYBQCMA8B4AAAyYAAAogUAogeAKYgKAKhkAAhuAAYiCAKhQAAAAAKYAAAKAeAeCCA8YBkAyCMBQBGAoYBGAoBGAoAKAAYAoAABQhkAUhGYAyighkkYi+jcYgegegog8gKgeYgyhag8gTgoAn").cp());
            stroke.setBounds(0, 0, 79, 104);
            return stroke;
        },
        217: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgTAKAJAoA8C+YAeBaA8CgAoBkYBkE2BGCMBkCMYB4CMCgBkDwBaYHMCWKUgoF8i+YCChGCChQAKgeYAUgogohGhkhGYiChuh4hujmjmYiCiChuhkgKAAYgeAAAKAyA8B4YAeA8A8CCAeBaYBGCWAAAUAAAyYAABQgoAehQAeYhkAehQAKi+AKYloAKk2g8i+h4YjSh4igkYh4maYgeiMgogyhGgyYg8gogygJgeAT").cp());
            stroke.setBounds(0, 0, 277, 162);
            return stroke;
        },
        218: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYgTAeA7EOBGCqYA8B4AoA8BkBkYCgCqDIBkE2BQYCCAeD6AyB4AKYF8AoCqgKDchQYCMgoBQhGgKg8YgKgUgogygogoYigiqiqjShui0YhQiCgegegUAKYgUAUAABGAKBQYAUBuAoEYAAAoYAAAygUAegoAUYiWBQocgok2h4Yiqg8hagyhuhuYhuhugohGgoiWYgyiWgUgyhGgUYgogKgeAAgUAK").cp());
            stroke.setBounds(0, 0, 247, 123);
            return stroke;
        },
        219: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYgTAoBPFABQC0YCMEODwC+FUBuYCCAoE2BGCgAUYF8AyD6gKEEhGYCqgyA8goAUhGYAKgeAAgKgUgeYgUgegogogogoYiMh4jmkYiCi0Yhah4gUgegUAKYgeAKAAAyAeBkYA8DIAoCqAKA8YAeCqhQAologKYm4gUlAhQjmigYi0h4hkiMhGjmYgUhGgeg8gUgUYgogyhQgJgeAT").cp());
            stroke.setBounds(0, 0, 262, 129);
            return stroke;
        },
        220: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYgJAoBFC0BaCMYBaCCDcDICCA8YF8CqH+A8DchaYAygeA8gyAAgeYAAgegUgehQhaYiCiCigjSiWjcYgyhGgUgKgKAUYgKAKAUBaAeBkYAyDcAUCMgeAeYgKAUgUAAhaAAYjIAAjmg8iWhGYiMhGiqiWiWjIYhGhQgegJgKAT").cp());
            stroke.setBounds(0, 0, 182, 95);
            return stroke;
        },
        221: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAhwAAUYi+A8muBukOAyYkOAyksAomGAyYh4AKhuAUgUAAYg8AegTBuAnA8YAoAoBQgKFehQYJiiMNciWC+AAYBaAAAAAAAoAeYBkBQAUBaA8PUYAUDwAKX6gUBkYgKBugeAygyAeYgyAUiWAAi+geYhagKhGgKgKAAYgeAUAKAoAoAUYAKAUBGAeAyAoYCqBkCqB4BuBkYDSC0A8AABGiMYAohQAehkAUiWYAUiqAAhagUj6YgelUgenCgKkYYgoqegKiMAAk2YgKloAKhGAohkYAKgoAUgyAKgUYAKgogKgKgKgeYgegyhkhQiMhGYhug8gUAAhGAAYg8AAgeAAhQAU").cp());
            stroke.setBounds(0, 0, 287, 412);
            return stroke;
        },
        222: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAlCAAKYhkAojSAei+AUYkOAep2Bal8BGYiMAUhuAKhuAKYiqAAgoAKgUAoYgJA8AJBQAyAUYAeAUBagKBQgUYAoAAA8gUAogKYAoAACWgeCMgeYJEhaHWg8GQgeYCqgKAKAAAoAUYBGAeAUA8AeEOYAyGGAUFoAUJYYAKCqAKFAAKDmYAeHMAABQgoBQIgeAyIg8AAYgogKgoAAgKgKYgUAAgKAAAAAUYAAAUBQCMBQBuYAeAyAyBQAeAyYAoBQAoAoAoAAYBaAABQi0AekiYAUhkgKjSgUiqYAAgUgUhagKhQYgekEg8x+gKngYgKjmAAhaAKgUYAKgUAeg8AegoYAegyAUgyAAgKYAAgyhQhQiqhuYi0hkg8gJh4AT").cp());
            stroke.setBounds(0, 0, 302, 395);
            return stroke;
        },
        223: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeyAeYmaBun0BaqKA8YlyAoAKAAgeAeYgUAUAAAKAAAyYAAAoAKAUAKAKYAoAeBkAAC+goYFyhQKUhuHCgyYDSgeAeAKA8AyYBGBGAUBuAeHMYAeIIAKD6gKKKYgKNIAABkhGBGIgUAeIhkAAYgygKhkgKhQgKYhGgUhGgKgKAKYgKAAgKAKAAAUYAAAeAKAKAyAeYBaA8DcCqCCCMYCqCgAoAUA8gyYBQhGA8i+AUkEYAKhkAAhagKjSYgUkigUnWgUlKYgKl8gUq8AKiCYAAiWAUg8AohkYAyhuAAgehGg8Ygyg8i0huhQgeYhGgKgyAAiqAe").cp());
            stroke.setBounds(0, 0, 263, 397);
            return stroke;
        },
        224: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAj8AAAYh4Aon0B4kOAyYiMAUn+A8nqA8YkOAUAAAKAABQYAAAoAAAUAUAUYA8AyBkAAEig8YGkhaKyh4ISg8YCWgUAeAAA8AoYBGA8AUCCAoKUYAUEEAASIgUDmYgKCqgKA8gyAoYgeAUhuAKiMgUYiggegUAAgUAKYgeAUAeAoBkBGYCCBaCWB4B4BkYCMCMA8AUA8g8YBuiCAyksgemkYAAhkgKiCAAg8YgKg8gKiqAAiWYgeocgKjmAAloYAAmGAAgeAyh4YAohGAAgogegyYgegohkhGh4hGYhagogegKgyAAYgoAAgoAAgKAA").cp());
            stroke.setBounds(0, 0, 284, 362);
            return stroke;
        },
        225: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Ac6AAYgyAUkEBGjmA8YjwAyjmAomuBGYlyA8AAAAgUAeYgUAeAABaAKAeYAKAeBGAACWgoYGahkGGhQHWhQYFAgyAKgKAyAeYBQAoAKBQAKHCYAUHggeNIgeBuYgKAygoAegyAKYgyAKiWgKhugUYhkgUgeAKAAAeYAAAUAUAKBGAoYCCBQDcCWBuBkYB4BaAoAUAogeYA8goAyiCAUi+YAUhuAAgogUmQYgUpYgUpYAKhaYAKh4AKg8AohQYAKgoAUgyAAgKYAAgyhahQiMhGYhugygegKgyAAYgeAAgoAAgKAA").cp());
            stroke.setBounds(0, 0, 235, 284);
            return stroke;
        },
        226: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AU8AoYjcBGlKBQlAAyYmGBGgeAKgeAUYgdAoAJBQAyAeYAeAUCMgeEYhGYGkhkEsgyCCAAYAyAKAUAAAoAeYBGAyAKAUAKDwYAKDwgKMCgUEEYgKDmgeEEgoD6YgoDSgKAohQEOYhGEEgoBGhGBQYg8A8goAAjShaYiCgygogKgKAUYgKAeAeAoBuBuYA8A8BQBaAyA8YBuCgAKAKA8AeYA8AeAeAAAogeYA8goBujcBQj6YCqpEBkqoAes0YAesgAAgKAUhaYAKgyAehQAKgeYAUgoAKgyAAgKYAAgehkhaiChaYjIiBAKAAjIA7").cp());
            stroke.setBounds(0, 0, 197, 410);
            return stroke;
        },
        227: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATEAeYksBanCBalyAeYhkAKgJAKATAyYAUAoAoAeBQAoYBQAoAygKDmgyYDSg8EEg8CWgUYBugUAoAKAyAoYBQBGAUBQAeHWYAUF8AUJOgKHWYgKH0gKGagUBQYgeC0hGAKmGh4YiWgogUAAAAAyYAAAKAUAeBQAyYCqCCDICqB4BkYBuBuBGAoAogKYBGgeBGiWAojmYAUiMAAj6geoSYgowGgUwQAeiCYAKgeAUgyAKgeYAohaAKgUgegyYgohkkYiWh4AAYgKAAg8AKhGAU").cp());
            stroke.setBounds(0, 0, 183, 406);
            return stroke;
        },
        228: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYOAKYj6B4piCCn0AyYiCAUgoAKgKAeYgdBQAnA8BuAAYAyAAC0gUBugUYAogKC0geC0geYCqgeDSgoBQgKYDSgoBaAKAoBaYBQC0AyIIAAKoYgKIIgeKygeA8YAAAUgUAKgUAKYgeAUg8gUiCg8YhQgogUAAAAAKYgKAUAyBaBQBkYBuCCCMDIAoBGYAUAeAeAoAKAKYBaBQBuh4BGjmYAoiMAKhugKi0YgKhagKhuAAgoYgemkgKkYgKkEYAAhQgKiqAAiCYgKiCgKjcAAigYgKlAAKgeBGh4YAohQAKgUgogyYgygyiWhaiChGYiCgygygJhGAT").cp());
            stroke.setBounds(0, 0, 216, 370);
            return stroke;
        },
        229: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAKYj6BGksA8jIAUYh3AKgKAKA7BGYBkBkBkAUCMgoYDmhGCWgoAyAAYBaAKAyBGAeCMYAyEsAUP8goNmYgKEsgKAygyAyYgeAUAAAKhkAAYhQgKhGAAhugUYiWgegeAAAAAeYgKAeAeAeAeAKYA8AUEsDIC0CMYCMBuAoAUAogUYA8gUAyhkAeigYAeh4AAlKgenqYgepsgKjwAAnCYgKngAKgyAyh4YA8hugKgeg8g8YhQhQi+huhQAAYgUAAgyAAgoAK").cp());
            stroke.setBounds(0, 0, 138, 359);
            return stroke;
        },
        230: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQuAAYgKAAg8AehGAeYiWBQhQAehuAUYiCAeksAohGAAYgoAAgUAKgKAKYgUAeAAA8AKAoYAUAUAAAKA8gKYAeAAA8gKAegKYAogKCggeC0goYCqgoCqgeAogKYBagUAAAAAeAeYAoAoAKBaAeF8YAyN6AAJigyB4YgUAoAAAAgyAAYgUAAhkgKhQgeYiggog8AAgKAUYAAAKAoAoA8AyYBkBaCqCqBkBkYAyAyAUAUAeAKYBGAUAUgKA8hkYCWjcAKg8gomGYgUlegKh4gUm4YgoqyAKhuA8iCYAohQgKgehQg8YgygoighQg8gUYgoAAgoAAgUAA").cp());
            stroke.setBounds(0, 0, 155, 293);
            return stroke;
        },
        231: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAsiAAUYh4AekiAyl8AoYm4AomGA8lKBQYigAeiqAoj6AoYjcAegeAKgoAeYgeAegJBGATAyYAeBQBGAADchQYA8gUBageA8gKYEEg8OYiWEEgUYD6gUFUgeCggKYDSgKAUAAAeBGYAUAyAKC0gUFAYgUKAhGHqhaFKYgeCChGA8hkgKYgUAAhagUhkgUYjmgoAUAAAAAeYgKAoAeAUCWCMYCgCCBaBkBQBkYBGBuAeAKBGgoYBagyCMkEBGkEYAyjSAejmAooIYAKhQAKjcAKjIYAenqAKhkA8hkYBGh4AAAAgKgUYgegeiChah4g8YiqhPgeAAiWAd").cp());
            stroke.setBounds(0, 0, 349, 314);
            return stroke;
        },
        232: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAtKAAUYhQAUhaAUleAoYqKBQkOAoksA8YiCAUksA8jwAoYmuBGAAAAgeAeYgdAyAJBaAoBGYAUAeA8gKBagoYBugoDShGCWgeYIShuDSgoImg8YG4g8BGAAC+gKYDIgKAeAKA8BGYAyA8AKA8AKCgYAKDcgKC+hGHgYhGISgUBkgeAoYgeAUgyAAgygoYgygegeAAAAAUYAAAKAeA8AUA8YAeBGAeBGAAAUYAyCCBQBaBGAAYAyAABah4AyiWYAyiWAyjmAej6YAKhuAek2AKhGYAenCAoi+BGhuYA8hagUg8iMiMYiWiMighahQAAYgKAAgeAAgeAU").cp());
            stroke.setBounds(0, 0, 349, 267);
            return stroke;
        },
        233: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAoeAAAYgKAAhGAUg8AUYlKBun+B4kEAoYiCAKjmAehuAKYgyAAhQAKhGAAYiMAKjcAUigAKYg8AAg8AKgKAAYgeAUgJCMAdAyYAKAUAUAKAUAAYAUAACggUCqgoYFog8DcgoFogyYCMgUCqgeBQgKYIwhkCggKBaAoYBQAoAoBugKDSYgUGkgoF8haGuYgoDSgKAogeAUYgeAKgUgKhag8Yhag8gogKgKAUYgKAoDmImA8BQYAeAoAeAKAogUYAygeAUgeA8h4YB4j6BGkYAelAYAAgeAUiMAKiCYAUiMAUi0AKhaYAekiAeiMBaiCYBQh4AKgogygyYgyg8h4hGiMhGYhkgygegKgyAAYgoAAgeAAgKAA").cp());
            stroke.setBounds(0, 0, 320, 279);
            return stroke;
        },
        234: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAvWAAUYhuAej6AokOAUYqoBGksAomkBQYhuAekEAojIAeYjIAeiqAogUAAYgoAegJBaAnA8YAUAeAKAAAoAAYA8AAC0geBQgeYBageCCgUFyg8YMqiCEYgeJigoYFKgUAoAAAeAUYAoAeAKAUgKCMYAAIchaIShkBkYgyA8geAKi0geYhQgKhagKgKgKYgogKgUAKAKAeYAAAoAeAoBkBuYBaBuB4CgAeA8YAeA8AoAoAeAAYAyAABGhQBaiMYBui+BQkiCCraYAeiqAeiqAUgoYAKgeAeg8AUgoYAegoAUgoAAgKYAAgoiMhui+hkYhugyg8gJiCAd").cp());
            stroke.setBounds(0, 0, 367, 234);
            return stroke;
        },
        235: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAqgAAKYhuAeh4AUl8AoYpiAyk2Ayl8BGYjSAojSAojIAeYg8AAg8AUgUAAYgeAUgUAoAAAyYAABQA8AUCWgoYEEhGA8gKGQg8YGGg8FygoCggKYBQAADcgUC+gKYC+gKCqgKAKAKYAyAKAeAoAKBGYAeCCAUFygKEsYAAG4geB4huAyIgyAUIiqgUYlKgogKAAAeA8YAUAeAeAeB4BkYCqCCCCB4BGBQYBGBaAUAKAygUYBQgoBujmAojmYAoi0AomuAKl8YAKj6AKigAUg8YAKgeAUgyAUgeYAUgeAUgeAAgKYAAgoh4hQiMhQYigg8gygJhuAT").cp());
            stroke.setBounds(0, 0, 330, 242);
            return stroke;
        },
        236: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAmmAAKYhkAejSAei0AKYpEAyjwAemGBGYkYAykOAoh4AKYhaAKgTAKAJAeYAKAKAoAeAyAeYBkBQAUAACWgeYCggyBQgKE2gyYJOhQDSgUImgeYEOgKAUAAAKA8YAeBQhGHgg8DwYhGEshGAyjchQYjIhGh4gegKAAYgKAKAAAKAUAoYAKAeAoA8BGBQYCMCqBQBuA8B4YAoBaAKAKAeAAYAeAKAygeA8hGYCqjIBGi0DSrkYBGj6AehaBGhQYAUgeAUgeAAgKYAAgUgUgegogeYhGhGjciMgygUYgyAAg8AAhaAK").cp());
            stroke.setBounds(0, 0, 308, 202);
            return stroke;
        },
        237: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Af4AKYgoAKjIAohuAKYm4A8ngBGigAoYhkAUkOA8huAKYhGAKg8AUAAAeYAAAeAUAeBaAoYBkAyBGAAB4goYFUiCMCiMGGgKYCCAAAAAAAeAeYAUAUAKAKAAAeYgKA8gyDwgoB4YgeBagUAegeAAYgUAAjmhQhugyYg8gegyAAAAAUYAAAKA8BGA8BQYCMCMB4CgAyBaYAUAoAeAeAKAAYAyAKBkhaAohkYAUgoA8igAyiWYBakYAKgeBkhuYAUgeAKgeAAgKYAAgohGhGiChkYiMhkgegJhGAT").cp());
            stroke.setBounds(0, 0, 249, 134);
            return stroke;
        },
        238: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAj8AAKYgUAAgyAegoAUYh4Ayi+A8l8BQYl8BQhGAUhGAKYiqAeksAojcAKYjIAUgoAAgUAUYgUAKgKAUAAAKYAAAeAyAyBuAyYCCBGAeAADcg8YImigNci0DwgKYBkgKAKAAAUAUYA8AyAKBug8EEYhGFohGD6hkC+YhaC+hGBGhkAAYgoAAiqgyiChGYgygUgygUgKAAYhGAAAoBGCMCCYBuBaBQBkB4CCYA8BQAoAeAygKYBkgKDmjwBai0YBQigBaleBaoIYAojwAohuBQhuYAegeAKgeAAgUYAAgohahGjIhkYhkgyhQgJg8AT").cp());
            stroke.setBounds(0, 0, 284, 227);
            return stroke;
        },
        239: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAhmAAAYgKAKjwAyjIAoYhaAKiMAehGAKYhGAKiMAehkAUYhkAKi0AoiCAUYh4AUi+AohuAUYhkAUhkAUgUAKYgoAUgJA8AJAyYAeBQBaAADIhGYDIg8Eig8ImhaYF8hGB4gKBaAAYBkAAAyAUAyBGYA8BkAAAUhaGuYhaHMg8DSgyBGIgeAyIgogUYgygegoAAgKAeYAAAUBQCqA8BGYAyA8BaBGAeAAYAoAABQhaAehaYAyh4Bal8BGloYA8kYAKgeAohaYAeg8Aog8AegeYBQhaAKgegegyYgeg8kijIhQgeYgygKhQAAgKAA").cp());
            stroke.setBounds(0, 0, 271, 206);
            return stroke;
        },
        240: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdiAUYiCAen0BujwAoYhuAUiCAUgoAKYgyAKigAoiqAeYigAeiMAegUAAYgoAUgJBuAdAyYAoAeAoAACWgyYC+g8DcgyF8hQYGahQEYgyBQAAYBkAABQBQAABkYAAAyhGFAhGDmYgyCggoBagUAKYgKAAgegKgegUYhGgegeAAAAAoYAAAeBkDIA8A8YCWDIBQg8CMmuYAohkAyiqAeh4YBQj6Aeg8B4iCYAygyAKgogogyYgog8jSighkgoYg8gUgoAAiCAU").cp());
            stroke.setBounds(0, 0, 250, 166);
            return stroke;
        },
        241: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AcwAUYp2C+kYAyq8AyYi+AUgUAAgUAeYgJAoAJAyAyAyYAoAeAKAAAyAAYAeAAAoAAAUAAYAegKB4gUCCgeYB4gUCMgUAogKYBQgUJOhaC+geYDIgeA8AeAUCWYAKCWhGK8goA8YgUAehGgUgygoYgogegUgKgUAKYgyAAAAAoAyBuYAeAyAyBuAoBaYBGCgAeA8AoAAYAyAAAogoAyhuYBai0AehkAyl8YAUiqAei+AKgyYAUhkAyhuA8hQYA8hQAAgeg8g8Yg8gyiChQhkg8YhkgegygJh4Ad").cp());
            stroke.setBounds(0, 0, 245, 191);
            return stroke;
        },
        242: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AccAUYi+BamGBknCBQYj6AogoAKjSAUYhkAKhuAKgUAKYg8AKgTA8AnAoYAKAKAeAKBuAAYCCAAAKAAFohGYDSgyEsg8CggeYFehGBkgKBaAoYA8AUAKAeAUCCYAoDwAAHggeH+YAACWgKAygKAeYgeAogoAAiCg8YhkgygeAAAAAUYAAAKAyBGAyBGYA8BQBQB4AoBGYCCC+AAAKAeAKYBkAyCCjSAokEYAAhGAAhGgKj6YgemkgepOAKhkYAAhaAehQAog8YAogogKgehGhGYgygygygehugyYiqhGgogJhGAd").cp());
            stroke.setBounds(0, 0, 238, 251);
            return stroke;
        },
        243: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AcwAKYgeAKhkAehkAeYm4CCkiA8qAAyYiWAUg8AAgKAUYgUAUAAA8AAA8YAUBGAKAKBagUYAoAABQgUA8gKYBGgKCMgUB4geYD6goEigyFUg8YDSgeA8AAAeAAYA8AUAeAUAUBGYAKAoAAAoAADcYAACMgKCMAAAeYgUCqgoD6gUB4YgKAKgKAUgKAKYgUAKgKAAgogKYgegUgogUgegeYgygogegKgKAUYgKAUB4EiBQC0YBaCqAUAeAygKYAogKAogyAohQYBai+Aoi0AejcYAKhQAKhkAAgoYAKgoAAgyAKgeYAomQAKgyA8iCYAUgyAogyAUgeYAyhGAAgog8gyYg8g8huhGh4gyYhugyhGgJhaAT").cp());
            stroke.setBounds(0, 0, 245, 218);
            return stroke;
        },
        244: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("Ad2AeYiMBQomBunMAyYmaAyksAegKAUYgoAUAAAyAAAoYAKAeAoAKCCAAYBkAAA8gKC0geYBugeDSgeCMgeYCMgUCMgUAegKYBQgKGQgyBGAAYAoAAAeAKAUAKYBGAeAAAAAAHWIAAGkIgUAyYgUAogUAKgeAUYgyAUgeAAiWgeYiMgUgyAAgKAUYgUAeAeAUCqB4YBaA8CCBQAyAyYA8AoA8AoAKAAYAyAKA8gyA8huYA8h4AAgUAAoSYAAmuAAg8AUhQYAUiCAAgUhahQYhahQhuhGgeAAYgUAAgoAKgoAU").cp());
            stroke.setBounds(0, 0, 233, 178);
            return stroke;
        },
        245: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfQAAYgKAKleA8jSAUYjSAUjmAoocBQYhuAKiCAUg8AKYiCAKgUAUAABGYAAAoAAAKAeAUYAUAeAKAAA8gKYAoAAB4gUBugUYFehGNShuC0AAYBuAAA8AUAeBGYAeA8AAAKhGEsYgyDwgeBkgoAoYgUAegKAAgogUYgeAAgKAAgKAAYgKAKAyCgAeAyYA8BaBaA8AogKYBagUAyiCCWnqYAyi+AohQBQhaYAegeAegoAKgKYAUgogUgogygyYg8hGiWhuhGgeYgogUhkgKgKAA").cp());
            stroke.setBounds(0, 0, 250, 146);
            return stroke;
        },
        246: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYsAAYhGAUnMBGkYAeYhGAKh4AKhGAKYiCAUiqAeh4AKYhaAKAAAAAAAyYAAAeAKAUAUAUYAeAeAyAACqgeYFAhGKyhkCqAAYBuAAAyAUAKAoYAKAehGDmgeAeYgUAegeAKgeAAYgeAAAAAAAKAeYAKBQAUAeAeAyYAoA8AKAKAogKYAygKAegyCqkiYAUgeAogyAegeYBGhGAAgegyg8Ygyg8iChugygKYgogKgyAAgyAA").cp());
            stroke.setBounds(0, 0, 199, 82);
            return stroke;
        },
        247: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUAAeYjmBuoIB4muAoYhQAKgdAUAJAeYAKAeB4A8A8AUYAoAKAKAABGgUYE2hkImiCBaAAYBQAAAKA8geDIYgoFAhGC0haBGYg8Aog8AAiMgoYh4gogUAAgKAKYgKAUAUAoBaBaYAyAyA8BGAeAoYBaB4AKAKAoAAYAyAAB4haBQhuYAegeA8h4AehQYAUhQBGkOAeiCYAeiWAehGA8hGYBGhagegei+hkYiMg7geAAhkAn").cp());
            stroke.setBounds(0, 0, 174, 148);
            return stroke;
        },
        248: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbqAAYgUAKloBGvKCgYm3BQATgKAABQYAAAeAAAoAKAKYAUAeAAAABGgKYAyAAB4gUB4geYD6gyC+geEYgoYFygyBugKAyAUYAoAUA8BGAeBGYAoBQAAAohGH0YhQKUhGFAg8BGIgeAoIhGgUYgegKgoAAAAAAYgKAAAUAyAoBGYBQCMCgCWA8AAYAeAAA8hGAegyYA8iMBkowBGqeYAUiMAUiCAKgeYAUhaAyhaBGhkYAogyAegyAAgKYAAgegegogygoYgygyi+iChGgeYgygUhkgKgKAA").cp());
            stroke.setBounds(0, 0, 233, 253);
            return stroke;
        },
        249: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbCAKYhaAejIAykYAyYj6AyowCCjmBGYgyAUg8AUAAAKYgKAeAAA8AUAUYAKAUAKAAAyAAYAegKBGgUBGgUYBkgeFyhkDwgoYAogKDIgeC0geYGGgyAAAAAUA8YAeBGAKDSAAF8YAAF8gKCMgeDwYgeCWgUA8g8AUIgoAeIi+geYhugUhQAAgKAAYgUAUAeAyCgCMYBkBQBaBkAeAeYCCCgAUAKBGhGYAygyBQigAehuYA8jcAUjmAUq8YAKo6AAgoA8haYAKgeAUgeAAgKYAAgUiChah4gyYh4gog8gJhGAT").cp());
            stroke.setBounds(0, 0, 223, 249);
            return stroke;
        },
        250: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAiiAA8Yo6C+rkB4psAKYjmAAgeAKgKAKYgTAoATA8BaBGYCMBuAyAAEihGYJsiWPeiqCCAUYBQAUAUAyAACMYAACMgyGGgyEsYhQG4iqHMhuBuYhGBGgeAAkEhaYjchGgygKAAAeYAAAUAUAeBuCCYBkBuCWDIAeA8YAoA8AeAUBGgKYBQgKA8geBGhGYBkhaBQh4BGiMYCglKBQloBaqyYAUiWAUigAKgeYAUhuAyhuA8haYAog8AUgoAAgeYAKgoAAAAhGg8YgygygogehkgyYi0hPgKAAkEBP").cp());
            stroke.setBounds(0, 0, 292, 292);
            return stroke;
        },
        251: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeAAKYhkAemGBQjcAyYloBGnWBGjmAKYiMAKgKAKAAAyYAAAUAUAKA8AeYCqBQBkAADSgyYEYhGMWiMCqAAYCggKA8AeAoCCYAoBuAKBugUFKYgKEYAABugUD6YgUDwgoEEgoDIYhGE2hkE2g8BkYhaB4gyAAlohuYkihagygKAAAoYAAAUAoAoCgB4YCMB4C+C0A8BaYB4CgBGAACCiCYCgigCWkYBGksYA8jIBGowAyoIYAelKAKjcAKhaYAKjwAoiCBaiMYAog8AAgegegyYgeg8iChGi0hGYgygUg8gegUgKYgygKgyAAhGAK").cp());
            stroke.setBounds(0, 0, 259, 368);
            return stroke;
        },
        252: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXcAKYhkAoqUCWksAoYiCAUi0AUhaAKYgUAAgUAAAAAKYAAAUBkA8BGAKYBuAUCMgKJEhaYCWgUC0gUBGAAYCCgKAKAAAUAUYAoAoAKBGAAFyYAAI6gyE2iMEOYg8CCgUAUhkgKYgoAAhagUhGgUYhGgUg8gUgKAAYgKgKgKAKAAAKYgKAKAUAeAyAoYBaBkBQB4A8BkYBQCMAyAeBQgyYA8geBuhkAog8YBah4BkjcAojIYAoiWA8nqAomQYAKhkAKhaAKgeYAKgeAegyAegoYAegoAegoAAgKYAKgogegehag8Yi0iCjmhFhkAn").cp());
            stroke.setBounds(0, 0, 213, 253);
            return stroke;
        },
        253: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AS6AKYgUAKiWAoigAoYigAokEA8iWAoYiqAoh4AogKAKYgTAUAJBaAeAyYAeAoAyAeAeAAYAKAABGgeBGgeYBQgeB4gyBQgUYCWgyFohkAeAAYAeAAA8AoAeAoYAUAoAAAUAACCYAACMgeDmgeDSYgoDSgoDcgKAoYgeBGgoAAjwgoYiqgegeAAAKAoYAKAoAeAoBaBGYBuBaCCCMA8BaYBuCqBQgoCMkYYBujmAKgyAUlyYAKigAKjIAAhGYAKhGAKh4AAg8YAUiMAKg8Ayg8YAyhGAAgUhQhQYgegehGgygygeYhGgygUgKgyAAYgeAAgeAAgeAK").cp());
            stroke.setBounds(0, 0, 166, 219);
            return stroke;
        },
        254: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXwAKYgUAAhGAeg8AeYiqBGjwBQiqAoYj6A8kEAoiCAKYhkAKgeAAgKAUYgTAUAJAoA8AoYBuBQBaAKBkgoYCgg8JOigC+geYDcgoAKAKgKEYYgKC+AAAKgeEEYgoEsgyDchQDcYhGDchGBahGAUYgyAKgogKjchQYkYhagKAKC0C+YBkB4CqDIAeAyYAUA8AoAUA8gKYBGgKAygeBQhGYDmjcCWnCBasgYAymQAUhQBuiqYAUgeAKgoAAgUYAAgohahQh4g8YhugyhGgJhGAT").cp());
            stroke.setBounds(0, 0, 199, 256);
            return stroke;
        },
        255: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AV4A8YmaCCmGBGmaAUYiqAKgUAKAAAeYAAAeA8A8BGAeYBGAoA8AACCgeYF8hkJEhuCMAAYBGAAAKAKAACCYAKDIg8GuhGDSYgyC0gyBugyAoIgeAyIhGgKYgoAAg8gUhagoYiqhGgegKgUAKYgUAAAKAUBuCWYAyA8BGBuAoA8YBkCgAAAAAoAKYBuAUCWh4BujmYBujSBQkiBGngYAejIAohuBGhkYAUgUAUgoAAgUYAKgogKAAgogyYgygoiChQg8gUYhGgTgoAJjSA8").cp());
            stroke.setBounds(0, 0, 201, 205);
            return stroke;
        },
        256: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQQAyYiqA8jSA8iCAUYhuAek2AygyAAYhFAAgKAUAxA8YAoAoA8AeA8AKYA8AKCMgUCqg8YISiWAygKBQAeYBGAeAUBkgKEEYgUISgeGagoDwYgeC0g8EEgeBkYgyCggUAyhGAAYgyAAkYg8gogUYgegUgeAAgKAUYgKAUHMHCAeAKYAoAKAegKA8gyYBQg8BahkAohaYBGiWAyj6AelAYAKh4AKhuAAgeYAAgeAKi+AAi+YAUnCAKkEAUhQYAKgoAUgyAUgeYA8hkAAgyhQg8YhahGi+hGhQAAYgUAAhaAUhQAe").cp());
            stroke.setBounds(0, 0, 166, 296);
            return stroke;
        },
        257: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APyAKYh4A8i+A8lKBQYi+AyigAygKAAYgKAUAAAyAUAUYAUAUAKAKAygKYAeAABkgUBageYFUhQEOgyBaAUYAoAAAeAUAKAyYAeBGAUH+AAG4YAAHCgKCqgeAyYgeA8gyAKiggoYiggegKAAAAAUYAAAUAoAoBaBaYA8A8BaBkAoAoYB4CgBGAKBQiCYBah4BGi0AUiCYAUhugKkihGtIYAAhQgKhkAKgoYAKhQAehuAegyYAKgeAKgeAAgKYAAg8h4hQi0hGYhkgUgeAAg8AK").cp());
            stroke.setBounds(0, 0, 151, 253);
            return stroke;
        },
        258: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALQA8YigBahGAejwA8Yh4AUhuAogKAAYgKAUAABGAKAUYAeAUBugUGkiCYEEhaAAAKAUAKYAoAeAUEEAKJYYAKF8gKCqgeA8IgUAoIh4AAYhGAAhagKgeAAYgygKgeAAAAAUYAAAAAoAoA8AyYAyAoBkBaBGBGYCqCqAoAKA8hkYCCi+AUhagKjIYgKgygKhaAAgoYgenCgKjIAAjIIAAjwIAeg8YAohuAAgUgogoYhGg8i0hQhGAAYgUAAgyAUhGAo").cp());
            stroke.setBounds(0, 0, 122, 219);
            return stroke;
        },
        259: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUKAUYiMBGlKBajmAeYg8AKhaAUgyAKYgoAKhkAKhGAAYh4AKgKAKgeAKYgUAeAAAyAAAeYAUAeAKAAAoAKYAyAKAygKEEgyYBGgKCqgeCggeYCggUCggeAogKYBagUBGAKAoAoYAUAUAUBQAUCWYAUCgAAMMgUDmYgUDcgKAKhQgKYgoAAgegKgygeYhGgygygKgKAUYAAAUAyBaCCCqYA8BQBGBuAeAyYA8BaAoAoAeAAYBuAAB4jwAUjwYAAgogKi0gKiqYgoo6gKnWAKhGYAKgyAehGAohGYAegogKgegogoYhQhQkiiWg8AAYgUAAgoAKgeAK").cp());
            stroke.setBounds(0, 0, 186, 252);
            return stroke;
        },
        260: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AScAAYgKAAg8AegyAUYjwBki0AylyAyYjSAegeAAgUAUYgKAoAAAoAUAUYAoAeBagKGkhkYGGhQBGgUBaAKYBkAAAKAAAUBkYAUB4AKCWAAEOYAAEOgKDSgUAyYgKAeAAAAgUAAYgogKAAAAAAAUYgKAoC0EEAeAKYAoAKAegeAyhGYBaiMAUhGgUiCYAAgogKi0AAigYgKl8AKhGA8h4YAUgyAUgyAAgKYAAgyhkhQi0haYhkgogoAAhQAA").cp());
            stroke.setBounds(0, 0, 169, 176);
            return stroke;
        },
        261: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AN6AKYgeAKhaAohQAeYiWBGiqAojIAoYiMAegUAKgKAyYAAAUAAAUAKAUYAKAeAKAAAyAAYA8AAAoAAF8huYEOhGAygKAeAKYAKAKAKAeAUAeYAUAyAKAUAAC+YAKDIgKGGgUDIYAAAygKBkgKBGYAAA8gUBGAAAUYgUAoAAAAgogKYgeAAgegUgUgKYgygUgUAAAAAeYAAAoAeBQAUAyYAoBQB4DSAeAUYAyA8A8gyA8igYBakEAUiWAKqAYAKowAAAoBujcYAKgUAKgUAAgKYAAg8hkhGighGYhugegygJhGAT").cp());
            stroke.setBounds(0, 0, 139, 225);
            return stroke;
        },
        262: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AI6AyYiMA8h4AoiWAoYiMAogUAKAAA8YAAAoAUAeAyAAYAUAABGgUA8gKYGkh4AegKAyAyYA8BGAKBaAAJiYAAJ2geJEgeAyYgKAUgUAAgUgKYgKgKgUgKgUAAYgegKgKAAAAAKYgUAoDcF8A8AoYAUAKAKAAAUgUYA8geA8iCAeiMYAUhQAAgegKlAYgKi+gKmQAAksYgKpsAKg8A8iCYAUgoAUgyAAgKYAAgegogog8geYhQgojIg8gyAAYgKAAhGAUg8Ae").cp());
            stroke.setBounds(0, 0, 114, 275);
            return stroke;
        },
        263: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKyAAYgeAKgyAUgeAKYhuAohaAeiqAyYi+AogUAUAAAyYAAAeAeAoAoAAYAUAAA8gKAygUYDchGDwgoA8AUYAoAUAKAoAAH0YAAGkgKAygKAeYgUAegKAKgUAAYgUAAgegKgKAAYgygoAAAeA8B4YBkCqAyBaAUAoYAUAoA8A8AUAAYAAAAAUgKAUgUYAogoAohuAUh4YAKhGAAjIgKiqYAAhGgKigAAiMYgUkOAKg8AehuYAKgeAAgeAAgUYgKgog8g8hagyYhagogyAAhaAA").cp());
            stroke.setBounds(0, 0, 109, 183);
            return stroke;
        },
        264: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASwAUYgyAKhaAUg8AKYi+AopiCChkAeYhaAUgKAUAAAyYAABGAyAKCCgoYAogKBQgUBGgUYDIgyH+hkBQAAYA8AAAeAUAeAyYAUAyAAAUgoDcYgoDcgoCWgeAoYgUAegKAAgyAAIgyAAIAKAoYAUBQCWCgA8AAYBQAAAyh4BumuYAyjSAehGBQhkYAegeAUgoAAgKYAAgog8g8h4hQYiWhZgeAAiWAd").cp());
            stroke.setBounds(0, 0, 171, 128);
            return stroke;
        },
        265: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIwAUYhkAyiqBGiCAoYhGAUhGAegKAKYgKAUAAAeAKAUYAeAeBQgUC0g8YDwhkAyAAAeAyYAUAeAABugUGaYgUFeAAAKgygUYgUgKgKAAgKAKYgKAUA8BuAyAoYBGA8AygUA8iCYAegyAAgKAKi0YAKmQAUiMA8iCYAUgeAKgoAAgUYAAgogogohug8YhugogogJhaAd").cp());
            stroke.setBounds(0, 0, 96, 131);
            return stroke;
        },
        266: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMAKYgyAUi0AolKBaYmaBuhQAUgeAoYgKAKgKAeAAAKYAAAoAUAoAeAAYAUAAB4geDchGYDcg8FKhQBGAAYAyAAAKAAAUAeYAKAKAUAeAKAeYAKAegKAegoDwYg8EYgyC+gUAoYgeAogoAUgogKYgegUgKAKAUAyYAeBaCMCgA8AAYAeAAAyg8AohaYAehaBGjwA8kOYAojIAUgyBQhkYAegyAegoAAgKYAAgyhGg8iWhkYhkg8hQgJg8AT").cp());
            stroke.setBounds(0, 0, 156, 147);
            return stroke;
        },
        267: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AIIAUYhaAei0AoiCAKYg8AKgyAKAAAKYgTAKAJAeAoAoYA8A8BQAADSgoYB4gUAyAUAABGYAAAogoEYgoEEYgUB4geAogogUYhGgeAAAUAyBuYAUA8AUAoAeAeYA8BGAygKBahkYBGhQAUgoAeiqYAoj6AohuBQhuYBaiCAKgUgeg8Ygegyi+igg8geYgoAAg8AAhaAU").cp());
            stroke.setBounds(0, 0, 101, 130);
            return stroke;
        },
        268: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARCAAYgUAKhkAUhuAeYh4AUiMAohGAKYg8AUiMAehuAeYhuAUhkAeAAAKYgTAUAJBQAeAUYAyAoCWgKCMgyYBQgeDwhGCqgoYB4gUAUgKAoAKYAyAUAKAUAABuYAACghGHCgoAoYgeAogeAAiggoYhagUg8gKgKAAYgUAUAoAyBaBaYA8AyBGBQAeAyYBkCCAAAAAeAAYAeAAA8gyA8hkYBGhuAehkAUjIYAKhaAUhuAKg8YAKgyAKhQAKgyYAKhkAUgoAogyYAKgKAKgeAAgKYAAgUgyg8hQgyYhuhQg8gJgyAJ").cp());
            stroke.setBounds(0, 0, 145, 146);
            return stroke;
        },
        269: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APKAeYhkAylyBkkiAyYigAegoAKgKAoYAAAoAKBGAeAUYAUAUAKAABQgKYAogKBagUA8gUYEEhQFohQAoAUYAeAKAKAogKCMYgeE2g8CWhuAyYg8AogygKiWhGYhug8gegKgKAKYgUAUAKAeBaBuYBaBkBGBaAoBQYAoBGAeAeAeAAYAoAABuhGA8hGYBkhuA8iWBklUYAyjIAehaAyg8YBahkgKgUjwiCYiMg7geAAhkAn").cp());
            stroke.setBounds(0, 0, 146, 140);
            return stroke;
        },
        270: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMMAKYgUAKgUAKgKAKYgoAojcBakYBaYhQAUhGAegUAKYgKAKgKAUAAAUYAAAeAAAKAUAUYAUAUAKAAA8AAYAyAAAoAAA8gUYDwhaDwhQAUAKYAKAAAUAUAKAeYAKAoAKAoAACgYgKGGg8DmhuAyYgyAUgUAAh4goYiWgygKAeCMCgYAyA8A8BQAeAyYBGBaAoAeAygKYAogKB4iCAyhaYBaigAojmAenMYAKigAUhaAohQYAUgoAKgoAAgKYAAgehGgoiWgyYhugegoAAgyAK").cp());
            stroke.setBounds(0, 0, 121, 166);
            return stroke;
        },
        271: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAKYgUAUgKAeAUAeYAeAyCqA8CgAeYBuAUF8AUBGgKYCMgUA8BQgoCqYgKAogoCMgeCCYigJsiMFKiWCMYh4BugeAAmkiqYhGgUhGgegUAAYgnAAATAoBQBaYCWCWCgC+BGBuYAKAUAUAUAUAKYAyAeBGAABkgyYCCg8CCiWBujIYBai+CCloB4mkYBuloAeg8Buh4YBQhGAKgegegyYgUgygygoiChkYi0iCgeAAiCAUYhkAUigAUiCAAYiCAAhugKjIgeYiggUAAAAgKAK").cp());
            stroke.setBounds(0, 0, 177, 244);
            return stroke;
        },
        272: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AFUAAYgUAAAAA8AUAeYAeAoBaBQA8AeYBGAoBkAUCqAoYCgAeAoAUAoAUYBGAyAKAogoDSYhGFUhuFoh4DcYg8B4goAyhQAeYhaAegyAAiqhGYiqhQhagegyAAYhFAAAUAyBtBQYC0CCCqC0A8B4YAeA8AoAeAoAAYAyAAB4hGBGg8YBahQAyhQA8iCYBai+A8igCWo6YAoiMBQiqAygyYAKgKAegeAUgKYAKgUAKgUAAgKYAAhGiqi0hug8Yg8gegKAAhQAAYigAUk2hGjIhaYhugygeAAgeAA").cp());
            stroke.setBounds(0, 0, 162, 234);
            return stroke;
        },
        273: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AH+AUYgKAKAAAeAAAeIAAAoIAyAKYBkAKB4AoAeAKYBGAyAKAogeCqYgKAygKBagKA8YgyEsiCGahQBkYgeAohaAogoAAYgKAAhGgUhGgeYi+hag8gKAAAoYAAAKAeAeAoAeYB4BuBkB4AyBaYAyB4AeAKBugyYBug8B4iMA8iWYAoiMA8jcA8kYYAeiWAoiqAUgoYAehkAyhQAegKYAegKAUgogKgeYgKgoiWiWg8geYgogegUAAhkAAYhQAAgygKgygKYhkgUgeAAgUAU").cp());
            stroke.setBounds(0, 0, 123, 195);
            return stroke;
        },
        274: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AD6AKYgoAyAABaAoAUYAUAKB4AUCCAKYCCAKB4AUAUAKYA8AKAyAoAKAoYAyCMjcI6iWCWYgUAKgeAUgUAKYhGAegygKi0g8Yi0g8geAAgKAeYAAAUAKAeAyAeYBaBGCWC+AoBkYAeBkAoAeA8gKYBGgKB4g8BQhQYCCiCBQiMCCmGYBakYA8huBQhQYAygyAAgKAAgeYgKg8iMiWhkg8IgygeIjSAAYi0AAgoAAiggeYhkgUhagKAAAAYgKAAgKAAgKAK").cp());
            stroke.setBounds(0, 0, 137, 174);
            return stroke;
        },
        275: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAtUAAKYgUAKgyAegeAeYiWCCkOCWm4DcYnMDmuEFynCCMYhkAegUAKgKAUYAAAUAAAKAUAUYAKAKAyAeAyAKYBQAeAUAKBQAAIBkAAIBkg8YCChQMgmaE2iMYBugyD6h4C0hQYImkOAAAAAoAyYAoAygeBuiMHMYgeBagoB4gUA8YgeB4goAog8AAYgUAAhGgKhGgeYh4gog8AAAAAUYgKAUBaBkCqC0YCgCqAUAKA8gKYAygKB4iWBGiMYAyhaAUhQBkmGYB4nMAUgyCWigYAygyAKgegUgyYgUgoh4gyiggyYh4gUgyAAgyAK").cp());
            stroke.setBounds(0, 0, 344, 183);
            return stroke;
        },
        276: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAg+AAKYgUAAgeAegKAKYh4Buh4BQjcCCYj6CWhGAekYCMYmkDIhkAojwBkYjmBagTAUAdAeYAUAUBuAoBQAKYBGAUBGgUA8goYA8gyFojIEiigYCMhQC+hkBQgoYDciCDwh4AegKYBGgUAoAoAABkYAAAygyD6haGuYgyDcgKAKi+goYhGgUg8gUgKAAYgyAAAKAeA8BGYBuBkDmDIAUAKYA8AKAygyBQiMYAyhaAoiCAUigYAykYAyksAKg8YAKhGAyhuBGhQYAegyAegoAAgKYAAhGhagojIgoYiCgKgUAAgoAK").cp());
            stroke.setBounds(0, 0, 259, 173);
            return stroke;
        },
        277: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APUBQYksCWjwBajmAoYgyAUg8AAgUAAYgyAAgeAeAAAeYAAAyCMBQBuAKYAyAKAUgKC0hQYBkgoCMg8BGgoYCqhGAygKAUAyYAUAegeKygUC0YgeDmgyD6g8CqYgUBQAAAyA8BuYAyBuBGBGAeAAYAeAAAygoAehGYAohQCWi0E2k2YBuh4AogoAAgUYAAgegegKgeAUYgoAelUDcg8AoYg8AogoAAgUgeYgKgeAKkiAekEYAUjmAymQAKgoYAUgyAeg8Ayg8YAegeAegoAAgKYAAgegygyhGgyYhGgyhkgogeAAYgKAAhQAehaAy").cp());
            stroke.setBounds(0, 0, 183, 231);
            return stroke;
        },
        278: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHqAyYg8Aeh4A8haAoYi+BGgeAeAAAyYAABQA8AACghaYCghaA8gUAoAUYAUAKAKAKAKAUYAAAUAABuAAB4YAKDmgUDSgeB4YgKAogKAyAAAUYAAAoAoBGAyBGYBGBaAygKAohkYAehQCWjcCWi+YBuiWAUgogegKYgKAAiWCCiWCCYhGBGgeAKgUgoYgUgoAAhaAUj6YAKjmAKgoBGhQYAyg8AAgUg8gyYgygyhkgygoAAYgKAAgyAUgyAe").cp());
            stroke.setBounds(0, 0, 116, 144);
            return stroke;
        },
        279: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQaAKYgUAKgyAUgyAUYiqBGjSBGiCAUYloBGgeAAgUAeYgKAKAAAUAAAUYAKBQAyAeBugUYBGAAFKhaDchGYBGgUA8gKAKAAYAUAAAKAKAKAUYAKAUAAAygUDwYgUCWgKC0AAAyYAADwBQCWCWBGYDwBuHWAAD6huYA8gUAKgUgUgoYAAgegegeg8g8YhuhkAAAAj6BGYg8AUgyAKhkAAYjIAKg8gUgyhuYgeg8AAgKAAhkYAAg8AKhkAKhGYAeiWAohkBuh4YBQhkAKgUgogyYgyg8jciCgoAAYgKAAgeAAgUAK").cp());
            stroke.setBounds(0, 0, 219, 154);
            return stroke;
        },
        280: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgxAUAAAoA7BkYA8BaAeA8AeBaYAUBQAAAKAAK8YAAH+gKFAgKEOYgeLaAeEiCMD6YCgEYDwBkIcAUYCWAKFUgUCWgKYC+gUC0gyC0hGYCCgyA8goAAgoYAAgKgKgygUgyYgeh4gyjcgUi+Ygej6AAgegUgUYgog8gUAegyDIYg8DShGDcgeA8YgoAyhuBag8AeYhkA8jcAokiAKYjwAUjIgUiqgyYg8gUgUgKgygyYhkhkgohugojwYgUiMAAgUAAqUYAAtwAUnqA8leYAKgyAKhGAKgoYAKgyAAgUgKgeYgKg8hGg8hkg8YjSh4gegJhGAT").cp());
            stroke.setBounds(0, 0, 264, 398);
            return stroke;
        },
        281: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYg7AeAKAoBFB4YAyBQAyBaAUBaYAoCqgKJEg8R+YgUFAAUEOA8CgYBaEECqCME2AyYDmAoG4AKDwgeYC+gUEYhaAygyYAygyAAgegyiCYg8iWgyjcgojwYgojSgUgygeAAYgeAAgKAUgoCqYgoCqhQEOgeAyYgyBahuBahuAeYjcAymGgKjIhGYhagehGhagoiCYgeiCgKi+AAmGYAUq8A8sCBGkYYAeiCAAgKgegoYgohQiMhui0haYhQgegeAAg8AK").cp());
            stroke.setBounds(0, 0, 226, 361);
            return stroke;
        },
        282: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgTAoAJAeBGB4YBkCWAoBkAKCqYAKBkAATigKCCYgKCMAUEEAeB4YBGEECMCgEEBuYBaAeBQAUCqAUYCgAUJOAKDmgUYEsgeEEg8DShQYA8geBGgUAUgKYAygUAogyAAgoYAAgKgKg8gUg8Yg8i+g8j6gokYYgUiqgUhGgoAAYgegKgKAUgoC0YgyD6hGEigeA8YgeAyhuBkhGAoYiWBalKA8maAKYlUAKjwgeiChGYhGgohahkgohQYg8iCgKhGAAn+YAAj6AKkYAAhkYAUkYAom4AUhGYAeiCAAgogUgoYgog8g8gyh4g8YjSh4hagTgyAd").cp());
            stroke.setBounds(0, 0, 307, 325);
            return stroke;
        },
        283: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgUAUAAAUAUB4YAeCMAKA8gUDmYgKB4gKB4AAAeYgKCqgKHCAKCCYAUCgAeCWAoBQYAUAeAoA8AyAoYBGBGAUAUBkAyYC+BaDcA8D6AoYEYAoHMAAEYgeYDmgUEsg8Cqg8YEOhaFeiqAyhGYAegyAAgegehkYgohkgeiqgojwYgejSgKgegeAKYgKAAgeBQgoBuYhGDmhQDcgyBGYgoBGg8AoiCBGYi+Baj6BGksAyYjSAen+AAi0geYk2gojShQigh4YhuhQgyhQgyiqYgUhQAAgeAAjwYAAiqAKiCAKhaYAejwAKhuAeiWYAUhaAAhGAAgUYgUhQg8hGhugoYg8gKgeAAgUAK").cp());
            stroke.setBounds(0, 0, 348, 251);
            return stroke;
        },
        284: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgnAeAAAeBPCgYA8BuAKA8AKGQYAKDSAAEYAKCMYAAEEAKBaAeBuYA8DwCqCgFABuYFoB4FoAyJsAAYF8AADwgUD6goYC0geD6hGA8geYAogUAogyAAgeYAAgegUhQgohQYgohkg8jSgojcYgUhkgUhugKgUYgKgygegygeAAYgUAAgKAegeC+YgoDIgyD6geA8YgUBGgoAygoAoYgeAegUAKg8AKYhaAekEAejIAKYiqAUnMAAi+gUYkOgUkYgyigg8YiCgyhuhagoh4Ygoh4gKhaAAmGYgKngAUjIBGjSYAohuAAgog8gyYgogoi0hahQgUYhQgKgeAAgoAK").cp());
            stroke.setBounds(0, 0, 355, 258);
            return stroke;
        },
        285: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAKAUB4YAeCgAKA8gUD6YgKCMgKDIAAC0YAAEOAAAoAUBaYAeB4AeA8BGBGYCMCWEYBuFeAoYC+AUFeAACMgKYFKgyDwhGDwiMYCghaAUgog8igYgoh4hQlKgUiqYAAgUgUgegKgKYgKgUgKAAgKAeYgKAKgUA8gUBGYgoCWhQEEgoBQYgoBahQBGiMAyYo6DIsqhui+kiYg8hugeigAKi+YAKj6BGnqAehkYAUg8gKgUhGg8Yh4hQhugdgoAd").cp());
            stroke.setBounds(0, 0, 259, 213);
            return stroke;
        },
        286: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAUYgUAeAAAUAUBGYA8CgAAAUgKJ2YgKGuAKBQAyBuYBkDcCqBaGaAyYCMAKJEAACqgKYHMgyC0huhGi+Yg8iMhGksgykYYgUiWgUgygeAAYgogKgKAygKDIYgUEEgUCggoB4YgoBkiCBGjSAoYmGA8n0gUiChQYgygeg8g8gUgeYgehGgKhuAAi+YAAkOAokEBGigYAehQAAhagegyYgog8jwiWg8AAYgUAAgUAKgKAK").cp());
            stroke.setBounds(0, 0, 228, 195);
            return stroke;
        },
        287: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AaaAKYAAAKgeBkgUBuYhkGagyCMhGAoYgyAehuAoh4AeYhaAUgyAAi0AAYi+AAgeAAhQgUYhkgehagogegeYhGhQAAi+A8kEYAUg8AAgegKgUYgKgegygyhGgoYgygegUgKgoAKYg8AAgJAKATCMYAUBkAAAoAACCYgKFyAKA8BQBkYAeAyAUAUBGAeYC+BkC+AoFUAAYC+AAA8gKBkgKYCWgeCWgyCChGYDIhuAUgUg8iqYgyh4geiggej6YgUhkgKhagKgKYgKgUgUAAgUAK").cp());
            stroke.setBounds(0, 0, 193, 123);
            return stroke;
        },
        288: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAAAeCWYAUBaAKAeAAEEYAKC+AKBkAKAoYAeBuA8BGB4A8YCWBQCgAeDcgKYDwgKCMgoCWh4YBuhQAAgeg8iMYgohahGi0AAgeYAAgKAAgUgKgKYgUgegUAKgUAyYgKAyhkC+goBQYhGBkhkAojmAAYiCAAgegKgygKYi+hGgehGAAkEYAAhQAKhkAKg8YAei0gKgeiCg8YhQgegygJgUAT").cp());
            stroke.setBounds(0, 0, 146, 124);
            return stroke;
        },
        289: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAUAAAUAKBaYAeBuAKB4gKBuYgoHqAAH0AUCgYAeCWAoA8B4A8YCgBQB4AUEYAAYEiAAB4geDIhaYBug8AogeAKgyYAKgogKgKgyiMYgehahalKAAgeYAAgogUgogUAAYgKAAgKAegeBQYg8CMhaDSgoBGYgyBQgoAehaAUYhkAehGAKh4AAYjIAAh4gogohQYgKgUgUg8gKgoYgyjIAonMBangYAKg8AKg8AAgeYAAgoAAAAgogyYhkhQiCgngoAd").cp());
            stroke.setBounds(0, 0, 155, 201);
            return stroke;
        },
        290: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAoAKYgeAKAKAoAoAyYAyBGAKAoAAEYYAAC0gKBugUCgYgUDmgKBGgoBQYgUAyAAAUAAAeYAAAyAoBQAoAeYAeAeAUAABkg8YBGgyCCgoBQAAYBaAAAAAogyGGYg8GagUCCgyA8YgyBQAKB4BGCMYAoBGAKAUAUAAYAeAABGhaAehaYAUg8AojmAUigYAej6AoksAUhQYAUg8AUgyAUgoYAyhQAAgUgygyYg8gyh4g8g8AAYgogKgUAKhkAoYh4AyhGAKgUgUYAAgKAAgeAAgeYAUiqBan0AoigYAKgeAUg8AKgoYAohaAAgUgyg8YhkhajwhPhGAn").cp());
            stroke.setBounds(0, 0, 93, 293);
            return stroke;
        },
        291: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAyAAYgUAUAAAUAoBQYAoBGAAAKAAB4YAKCWgeHqgUBQYgKAogUAygKAoYgUAogKAeAAAKYAAAeAyBQAeAUYA8AoAUAABGgoYBkhGB4gyDcg8YAygKA8gUAKAAYAeAAAoAUAKAUYAUAUgUBQgyCMYgyCgAAAeAoAeYAeAUBaAAAogUYAogKAKgeAoh4YAoh4AohGBahQYAygyAegeAAgKYAAgehQhGhug8YhuhGgyAAiCAyYigBGk2BugeAAYgoAAgUgUAAgeYAAhaB4piAohuYAKgeAKgyAAgUYAAgogKgKgegoYhGg8jmg7g8AT").cp());
            stroke.setBounds(0, 0, 131, 170);
            return stroke;
        },
        292: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAKYgUAKgKAUAAAKYAAAAAKAeAeAeYBGBaAyCCAKCqYAUBkgKBQgUA8YgeAyAeBaA8AeYAoAeAUAABQgyYBQg8DShaBGgKYBGAAAeAUAKAoYAAAUAKBuAACCYAKCCAKBuAAAKYAKAeAoAKBQgUYAyAAAegKAKgUYAUgUAKgKAAiMYAAjwAUhkAygyYAegUgKgegogoYgogogygehkgeYhkgogKAAhGAoYhGAojwBQgeAAYgUAAgUAAAAgKYgUgUgekiAKh4IAAhQIgogoYhQhaiggdg8Ad").cp());
            stroke.setBounds(0, 0, 120, 134);
            return stroke;
        },
        293: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGQAUYgUAUAAAeAoBGYBaCgAAD6haKUYgeEEgyDmg8D6YgUBageB4gKAyYgeBugyBkg8BQYhQBkgJA8ATBuYAoBuAeAKCWhQYC0hkC+gyFygoYB4gKAyAAAAAUYAAAAgoBkgyBuYksKyhQDIAKAUYAeAUD6ksEil8YCWi+BahkBGgoYBQgoAogoAAgeYAAg8hGhGighkYhGgygUAAhGAAYg8gKgUAKgyAUYjSBGksBGiWAKIhkAKIgKgeYAAgUAAgeAAgoYAeiWFK5UAUhaYAehuAehGAohGYAyg8gKgegygyYhGg8kEh4hQAAYgKAAgeAAgKAU").cp());
            stroke.setBounds(0, 0, 169, 376);
            return stroke;
        },
        294: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMgAUYi0CChuA8jIBQYiCAyhaAegyAAYg7AAATAyA8AUYBQAeA8AABagUYBagUCqgyB4gyYA8gUAUAAAUAKYAeAKAyAyAKAoYAUA8geBag8BQYgoAygoBaAABGYgKBkAUBQBQCMYBkCqAoBaAUBaYAUBagKBkgeBQYgUA8AKAKAygUYB4gyA8hQAKhuYAeh4goh4h4i+YhGhugKgogKhQYgKhQAUhGBGiWYBGiWA8huA8hGYBahkgUgoi+haYjchjgUAAg8Ad").cp());
            stroke.setBounds(0, 0, 128, 187);
            return stroke;
        },
        295: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeoAUYh4AyhaAeruCgYtIC+hQAUgoAKYgxAeAABkAnAeYAUAKAUAAAUAAYAeAADIgoAogUYB4goKeiWFeg8YE2gyA8AAAoAKYA8AUAKAegUCCYgyHCgKC+AAFAYAAN6CMHqGGG4YDIDwD6CqDwBQYBkAoAUAAAogUYAygeAKgegUiCYgKi+AAg8gUmaYgKmGAAgogoAAYgUAAgKAUhGDwYg8DmgyB4goA8YgeAeAAAKgogKYhugKiqiChkiMYi+kOiCl8gonMYgKhuAAl8AKiWYAUjSAokOAehGYAehaAyhQA8g8YAygyAAgegegoYg8haigiCg8geYgygKgyAAhaAU").cp());
            stroke.setBounds(0, 0, 334, 379);
            return stroke;
        },
        296: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAAYgKAAgoAegeAUYgeAehGAegyAeYiMA8l8Buk2BGYizAogKAKAnAoYAoAoA8AUBaAAYBaAAAogKHqiMIFKhaIAoAUYA8AeAKAogKDwYgoLQA8KyCCG4YBaFADIEYDwCWYCgBuCWAyBagoYAygUAKgegKh4YgUiqAAgUgKlKYAAi0gKigAAgKYgKgogeAKgKAeYgKAUgeBGgUBQYhGC0hGCCgeAoYg8Ayg8gUhahaYi0jIiClegym4YgekYAUqUAoigYAehQAyhaBQhkYAog8AegyAAgKYAAgyhuhQi0haYiCg8hGgJgoAJ").cp());
            stroke.setBounds(0, 0, 240, 336);
            return stroke;
        },
        297: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASIAKYgUAAgyAeg8AoYkECqjSBGm4A8YhuAUgKAUAAAyYAAAyAeAeAyAUYA8AKBugUGuiCYE2hQBQgeAUAKYAoAUAAAAg8MqYgUCqgUEigUC0YgoH+gKDIAKDIYAUC0AUBkA8B4YBaDIDSCMEsBQYEEBGF8gKE2haYDIgyDmhkAogoYAUgUAAgygUgyYgoiCgejwgUjSYgUi0gUhQgoAAYgUAAAAAKhGDSYhGD6huDIhkBkYhQBQigAokiAKYjcAKhQgKiMgoYi+g8hkhkgyjSYg8jSBGvAB4pYYAoi+AyjSAeg8YAehQAyg8BGhGYAegeAogoAAgKYAohGg8hGi0haYi+hahagJhGAT").cp());
            stroke.setBounds(0, 0, 311, 358);
            return stroke;
        },
        298: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMCAKYgUAAgyAegyAoYhuBGhaAyjwBkYhkAyhaAogKAKYgKAUAAAoAKAUYAAAKAUAAAKAAYAoAACggoDmhQYBugoBugeAKAAYAyAAAABkhGI6YgoGGgKC0AKDcYAKBkAKBuAKAoYAeCWBaDSBaCCYBaCWDwCgDSA8YD6BGDwgUEihuYBQgeAegeAKgyYAKgUgKgUgyi+YgoiMgUh4gUjcYgKi+gUgygeAAYgUAAgKAegoCWYgoC+g8DmgeA8YgeA8geAogoAUYiCBGk2gUiWhQYhuhGiCiWg8iCYhGi0geiqAAk2YAAkOAUiqAyjmYAyjmBai0B4h4YBGhQAKgUAAgeYAAgygygUjIg8Yh4geg8AAgyAK").cp());
            stroke.setBounds(0, 0, 233, 292);
            return stroke;
        },
        299: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAg+AAAYgKAKg8AUgyAeYi+BajSBQkEBGYkOBGn0BQlKAeYjvAUgeAUBPBQYBGBGBkAoBaAKYA8AAAUAACMgyYC+g8C0gyE2hQYGQhkFUhQAoAAYAyAKAKAegeCMYhGGagKIIA8FeYAoDwBGDmBGCWYC0FUF8EsGQBaYBaAUDmAABkgUYBQgUBQgoAKgeYAUgegKgygyh4YgyiMgyiWgyi+YgoiCgUgogUAUYAAAAgUBGgUBQYgoC+goCggKAyYgoBGg8AKiggyYlyh4kYkOh4leYhulUgemkBQmQYA8k2AehQDciqYAKgUAUgeAKgKYAAgeAAgKgogeYgUgehQgohQgoYiChGg8gJg8AJ").cp());
            stroke.setBounds(0, 0, 374, 314);
            return stroke;
        },
        300: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkkAAKYgKAAgoAegoAUYjSCMlUBupiCWYhGAKiMAohkAeYjIAyiWAUjwAKYhaAKhQAAgKAKYgKAKAAAoAKAoYAeAyCCBQBGAUYA8AKBQgKBageYGGiMLGjcEEhGYDcgyCMgUAUAeYAUAUAAAUgyDIYiCImhGHqAKEYYAUI6C0EEG4BuYCqAyBkAKDSAAYDcAABagKDIgyYDIgyDchkAog8YAUgoAAgKgoiMYgoiggejcgUjmYgUiWgKgygKgKYgegogUAohGEsYhQFAgeBGhaBaYhQBahQAejwAeYjmAei+gKi0g8Yiqg8hahGgyh4Yg8hugKhGAAjSYAAiqAAgyAeiMYAejSA8jcBQjmYBakYA8hkCCiWYBGhGAKgUAAgeYAAgeAAgKgogeYg8gokOiCgeAAYgUAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 410, 295);
            return stroke;
        },
        301: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfQA8YjSBukiBQnMBuYmaBajSAekEAUYhGAAhGAKgKAAYgKAKAAAoAUAoYAKAUAeAeAyAUYA8AeAUAABGAKYBaAAAKAALajIYMWjSB4geAoAUYAeAKAAAKAAAoYAAAegKA8AAAoYgyEEgUGaAUC0YAeEiA8C+CWDcYCMDwCqCCEEBaYE2BuHCAUCChaYAogUAKgogUhGYgojSgokOgUkiYAAhagKhagKgUYgKgogegUgUAUYgUAKAAAKg8DmYhGEihQDSg8A8YgyAyhQAKiMgeYiqgojIh4hkh4Yhahkhkj6goi+YgojSgKj6AojSYAeigBQi0BkhuYAUgeAegeAAgKYAKgyg8gyi0hQYiggxAAAAigBF").cp());
            stroke.setBounds(0, 0, 376, 260);
            return stroke;
        },
        302: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYEAKYiMBaiCAyjmBQYlKBkk2BQjmAeYhGAKhGAKgKAAYgUAUAAAeAKAoYAoAyB4AyBkAAYA8AAA8gUMqkYYDchGAygKAeAeYAUAeAAAAgoD6YhQHWgKFABQEYYAeBuBkDcBGBkYA8BaCMCCBaA8YDSB4EsBQEYAAYDSAABQgoAAhQYAAgUgKhGgUg8YgeiMgei+gUjSYgKhQgKhGgKgUYgKgegeAAgKAUYgKAAgeBagoBkYhaEYhGCChGAeYhkAojwhGiqiCYiMhkg8hkhGi+Yg8i0gUhuAAi+YgUmQBakODIjcYAUgUAUgoAAgKYAAgyh4hQiqg8YhQgUgeAAgyAK").cp());
            stroke.setBounds(0, 0, 305, 257);
            return stroke;
        },
        303: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbWAKYgyAKn0B4i0AoYmGBQkYAyi0AUYh4AKgKAKgUAUYgKAKgKAUAAAKYAAAUAyAoBGAeYBQAoBuAKBkgoYDwhaBkgeDSgyYD6g8EigyBQAAYAeAAAoAKAUAKYBGAeAAAog8DIYgyCggUBQAACWYAABuAKAeAUBGYAyCWBQBkCqBQYCWBGCqAeE2AAYDSAACMgUB4goYB4goAygUAAgyYAAgKgUg8gUgyYg8h4gyi+geigYgeiWAAgKgegeYgUgegUAAgKAKYAAAKgUBQgKBaYgoEOgeBQhGBQYhGBGiWAej6gKYi+gKgygKhQgoYgogUgKgUgegyYhGiWAUi+Buj6YAyhaAyhGBag8YAogeAKgogKgeYgUgejmiqgogUYgeAAgyAAgyAK").cp());
            stroke.setBounds(0, 0, 321, 156);
            return stroke;
        },
        304: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALaAoYhuA8i+BGjcAyYi0AygeAUAAAyYAAAoAUAKCMgKYBuAAAUgKCMgoYEshkAogKAeAoYAUAeAAAUgeDSYgeDmgUEEAUB4YAUEiCqEEDSBaYCCAyEEAoDSgKYEYgKDSg8DShkYB4hGAUgygyhuYhGiWg8i+gUigYgUhagKgegeAAYgUAAgUAygoCCYhGDwgoBkg8A8YhQBGhQAei+AKYiMAUjSAAhGgUYjIgoh4i0gKkiYgKiCAKhaAoiqYAeiCAyhkBQhQYBGhQAAgUg8g8Ygygyh4hGhQgUYhQgTgeAJhuAo").cp());
            stroke.setBounds(0, 0, 258, 186);
            return stroke;
        },
        305: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AM+AUYhkA8igA8k2BQYi0AygoAUgUAUYgUAeAAAKAAAeYAKAUAUAAAyAAYBkAADcgoCCgyYCWgyA8gKAeAeYAUAUAKAKgKAoYgKBQgKGQAKC+YAeFoA8EEB4CqYAyBQBuBuBaBGYBQA8CqBaBQAUYBGAUB4AAAogUYBGgUAAgegeiMYgUhGgUhQAAgUYgKhGgej6AAg8YAAhGgKg8gUAAYgUAKgeBQgoCgYgyDIgeAyg8AAYhaAKiMhahah4YhQhkgyhkgei+YgUhkAKksAUigYAej6AohuBahaYBQhQgUgyjIhaYiCgygogJgyAd").cp());
            stroke.setBounds(0, 0, 187, 226);
            return stroke;
        },
        306: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASwAAYgKAKgoAUgUAUYhGAojcBuh4AyYh4AynWB4g8AAYgKAAgeAKgKAUYgUAUAAAAAAAUYAUAoAoAUA8AKYBaAKFAhaEih4YC+haAygKAoAUYAeAeAAAegUCCYhQFygKAyAKCWYAACqAUA8AyB4YBQCgCCBuEOCgYEYCgCWAyB4gKYBGgKAygUAUgoYAUgogKhugoiWYgUiCgojcgeiqYgKhkgegygegKYgeAAAAAKgeC0YgyEOgeCMgoAeYgoAegoAAhkgeYkYhQjcj6AAjwYAAg8AeiMAohuYAoiMAyhQB4iCYBQhaAKAAgKgoYgKg8hGhGiWhQYgygehGAAgeAA").cp());
            stroke.setBounds(0, 0, 229, 203);
            return stroke;
        },
        307: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYOAeYiMA8lKBuhQAUYi+AojwAUlUAUYhuAKhQAKgKAAYgKAKgKAUAAAKYAAAeBuBuA8AeYBGAeCCAABkgeYAygKCWgeCMgoYCMgeC0goBageYCqgoAegKAeAeYAUAeAAAAi0DcYocJshkBui+EsYjcFKhuDShGDcYhZEsAAEYBZDIYAeA8B4B4BkAyYCWBaDcBQC+AeYCWAeAKAAEYAKYC+AKBaAAC0gKYB4AAB4gKAUAAYEsgoB4gUC0gyYB4goCqg8CMg8YC0hQAUg8g8jmYgyiggojSgei+YgUiWgKgogegeYgUgUgeA8gUCCYgoDmhGEOgoBGYgeA8g8BGgyAeYhkA8k2BajSAeYkEAolAAAmugeYlAgeiCgeiMhQYiChQg8hQgeh4YgojIAoi0CCkOYDmnCEslyJso6YEOkEBag8C0hkYB4hGAUg8hGhGYhQhQj6huhagKYgoAAgeAAhQAe").cp());
            stroke.setBounds(0, 0, 325, 364);
            return stroke;
        },
        308: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AR0AUYloCCl8BkkEAUYgoAAgyAKgKAKYg7AKAKBGA7AKYBGAUCMAKAyAAYBugKE2g8B4gUYC0goAUAAAABGYAAAygKAUigDSYl8H0h4C+iCD6YiWE2hQEYAeCqYAUBuAoBGBaBaYBaBQCCBGCqA8YD6BQDcAeFUAAYE2AAC0geEihQYDmhGCCg8AygoYA8g8AAgUgoiMYg8jIgei0gokOYgKhugUgogeAAYgoAAgUA8goDmYgUB4geB4gKAoYhGDIiWBkkiAyYkiA8nMAAkOg8YlehGiWj6BuloYAyi+C+lUC+jwYBkiMD6kOBQhQYBkhaBuhQBkgyYCChGAKgohQhQYg8gyiWhugygUYgygKgyAAhGAU").cp());
            stroke.setBounds(0, 0, 265, 293);
            return stroke;
        },
        309: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAKYgUAAhGAegyAeYjSBujmBaiqAyYhGAKgoAeAAAUYAAAKAAAKAKAKYAUAUAUAKBGAAYBuAUB4gUBGgoYBkgyBugeA8AAIA8AAIAAAoYAAAegKAegeAyYlUHWiCDwhQDwYiWGuB4DmHCCWYHWCWIwAAIIiqYBQgeCCgoBGgeYDShaAKAAgojSYgoiggUiggUjmYgKhkgKhGgKgUYgKgegoAKgUAeYgKAKgoBugeCCYgoB4gyCCgKAoYiCD6leB4psAAYjIAAiCgKhkgUYiCgohuhQg8huYgUgoAAgUAAhQYAAhuAKhGBGiMYBQiWBuiqCMiqYC0jcCChuB4g8YC0hkgUhQkiigYhkgyg8gJhGAT").cp());
            stroke.setBounds(0, 0, 262, 235);
            return stroke;
        },
        310: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAUYgdAeAJAoAeA8YBQBuAKBaAAFyYAAHWgoH+g8CWYgUBQAUA8BuBQIAyAoIA8gUYAogKBGgUAygKYDmhQJihuGGgeYAoAAAogKAUAAYBugKE2gUBGAKYBaAABQAeAeAyYAoA8gKBkhQHMYhGGQhaEOhkA8YgyAogygKjIgyYjmhGAAAAgUAUYgKAKAUAUBuBuYCgC0B4CCAoBaYAyBkAeAUBagyYBkgyB4h4BGh4YAyhQAehaAojSYB4pOBkmaAyhuYAUgUAUgeAUgUYAUgUAKgUAAgUYAAgyhkhaiqhkYhug8gUgKiWAeYhkAUhQAKj6AKYhQAAiCAKhaAUYhkAKhkAKgeAAYjcAelKAoiWAeYhaAKh4AUgoAAYhGAKgKAAgegeYgogoAAgoAKl8YAAm4AomQA8iCYAehkAAAAgygyYhuhuiqhahGAAYgUAAgUAKgKAK").cp());
            stroke.setBounds(0, 0, 295, 380);
            return stroke;
        },
        311: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEiAKYgUAeAAAUAUA8YAeA8AABGgKCMYgKC+goEsgeCWYgeCWgKAUhuCCYhtCMAAAeCpCMYBGAyAUAABugyYCChGCWgoEsg8YEigyE2goC+gKYCqgKAUAKAyBQYAoBGAABQgeDSYgyEOhkHqgoBaYgyBug8AyhGgKYg8gKjIg8hagoYhugogUAAgKAoYAAAeAKAKA8BGYAoAoA8BQAoAyYA8BQAeAoBaCgYAeAyAoAeAyAAYAyAADSiWBQhaYAog8AUgoAohuYAyiMAKhGBkn0YAokEAyjwAUgeYAUhGAUgeBGhQYAog8AAgegogoYg8g8jciChQgUYhGgUhkAAhkAUYgyAUhQAKg8AKYg8AKiMAUhkAKYjSAej6AojIAyYiWAehGAAgUgUYAAgKgKgUAKgoYAKgeAUhuAKhkYAUhkAeiqAehuYAoi0AKg8A8iWYAUg8gKgohGgyYg8g8hugyg8AAYgeAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 247, 335);
            return stroke;
        },
        312: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAAYgUAUAAAeAUBGYA8CCAAAyAAIIYAAHqgKCMgeCqYgUBuAAAyAeAoYA8BGBQAUBQgyYBQgoBugeC0goYDwgyCCgKEYgUYD6gUBaAUA8A8YAUAeAAAKAAA8YAAAogUA8gKAoYgKAegUCCgKBuYgoDwgeCqgUBGYgUBGg8BugUAKYgoAehQgKjSg8YjmhGgeAAAAAoYAAAUAeAeBGBGYCqC0BaB4BaCWYAyBaAyAAB4hQYCMhQBGhaAyiCYAohkA8lAA8mQYAejwAyiMBaiMYAeg8gKgohGhGYhGhGiMhahGgeYhGgeg8AKhaAeYh4AyhuAUjwAeYiCAKjIAUhuAUYkOAogeAAgegoIgUgUIgKmaYAAmkAKj6Aeh4YAUiMAKgKgKgoYgehajmhthQAd").cp());
            stroke.setBounds(0, 0, 215, 349);
            return stroke;
        },
        313: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAyAAYgeAKgUAUAAAUYAAAKAKAeAKAUYAKAUAUA8AKAoYAKBQAAAyAAFKYgKGQgKBagoC+YgKCCAAAeAeA8YBGBGA8AKB4g8YBug8A8gUCqgoYFUhaFAgoDwAAYBkAABQAUAUAeYAeAegKBugUBGYgKAogKBGgKA8YgKCggyFUgeCqYgUCqgoBugyBuYhQCMgeAKkOhaYhkgehkgegUAAYgegKgUAKAAAeYAKAKBQBaBaBaYCWCWBkB4AeA8YAyBkAeAKBagyYB4g8BQhGAyhGYAohQAeg8AehGYAehaBapOAymuYAejcAehkBki0YAeg8AAgUhQhQYg8g8hkhGhagyYhGgohQAKiCAyYiqBGgyAKnqBGYhGAKiMAehaAUYhkAKhaAUgUgKYgygKAAgUAAjmYAUoIAKhaAehkYAoi+AAgUhahGYhahGiCgngoAJ").cp());
            stroke.setBounds(0, 0, 218, 350);
            return stroke;
        },
        314: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABGAKYgeAKAAAUAeBQYAUA8AKAUgKCWYAACqgUG4gUB4YAAAogUBQgUAyYgTCMAJA8BGAyYAyAeAygKBGgoYB4hGF8h4CMAAYCCAAAoAogKCMYgKDIhQIwgeB4YgUBQhGCqgeAUYgoAegoAAiqg8YjIg8gKAAgUAKYgeAKAUAeCCCCYB4CCBQBaAoBQYAyBQAeAABuhGYB4hQBQhkAoiWYAehkA8lAAym4YAejwAeh4A8hkYAUgeAKgeAAgUYAAgehuhkhkg8Yhkg8g8gKhQAoYhkAonqCMgeAAYgKAAgUgKgKgKYgegUAAAAAAhQYAAhkAonWAKhkYAKgoAUhGAKg8YAUgyAKgyAAgKYgKgohkhQhGgoYhGgUgUAAgoAK").cp());
            stroke.setBounds(0, 0, 141, 308);
            return stroke;
        },
        315: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHMAKYgUAKAAAUAoBkYAoBaAAAAgKBaYgKCMhuFKhQCCYgKAehGBQhGBGYh4B4goA8AAAyYAAAoAoBQAyAoYAyAyAeAABGgyYB4hQDIhQDcg8YFehaCWAAA8BaYAeAoAeBQAAA8YgKCMgyE2g8DIYhkE2igFKhkBGYgoAehGAUgygKYgygKj6hGgegUYgKgKgUAAgUAAYgoAAAKAoA8BGYBQBkBQBkBQCCYBaCMAeAUBQgKYBkgKAygeBkhuYCqi+B4jcBQjwYBQjSBamkAolAYAUiMAUhQAyg8YAohQgKgehahGYgegUhQgygygeYiWhGgyAAigAyYiMAyiWAejcAoYiWAUgeAAgKgeYgKgyEYpOBkiMYA8hageg8hug8Yh4g8iWg8gUAAYAAAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 180, 334);
            return stroke;
        },
        316: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADcAKYgUAeAAAUAeAyYAeA8AACMgeB4YgoCggyBuhaBaYg7BQAAAyA7BGYAyA8AoAAA8goYCqiCAygeCqgoYCMgeBQgKBkAAYCqAAAeAeAAC0YAACqgeFKgyDwYgyD6haFAhGBkYgyBagUAAjwhGYiqgyAAAAAAAeYgKAoAeAyBuBuYA8AyA8BQAeAyYA8BaAUAUAyAAYAeAKAUgKAogUYBQg8DmkEAyhuYAohGAUhkAUiWYAUjIAomQAUjwYAekEAKgoAohaYAUgoAKgoAAgUYAAgohQhQhkgyYhkgog8gKg8AUYgyAUowCMgeAAYgKAAgKgKgKgKYgUgUAAgKBGjIYBQkOAAgehQhGYgygyhuhGgeAAYgKAAgUAAgKAK").cp());
            stroke.setBounds(0, 0, 148, 289);
            return stroke;
        },
        317: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADSAKYgoAUAAAeAeA8YA8B4AUCCgoC0YgoC0g8CMhQBaYg8BGgJAyAJAoYAUAoBGBGAeAKYAeAAAygUA8gyYBQhGA8geCMgyYC+g8CggUBGAoYA8AoAACggoEiYgyFehuFAhuB4YgeAogKAAgyAAYgeAAhQgUiCgyYjIhGgygKAAAeYAAAoAoAyBkBuYBuBuBaBuBGBaYA8BaA8AKBkg8YA8goDIjSAog8YA8hkAAgeBuowYAei+AojIAAgoYAKgyAehGAehGYAohQAKgeAAgUYgUgyhuhahagyYh4g8goAAk2BQYj6BGgyAKgKgoYAAgKAUiMAoiqYBQlUAAAehGhQYgygoiMhkgoAAYgKAAgeAAgKAK").cp());
            stroke.setBounds(0, 0, 143, 278);
            return stroke;
        },
        318: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEYAAYgKAUAKAyAUAeYBQCCgKBkhkDSYgoBagUAUhQBGYhkBkgeAyAAAyYAABGBaBuAyAAYAUAAAogKAogeYCWhkDIhQEihQYFAhQBaAKA8B4YBQC0jSKKjIC+YhkBag8gKj6h4YhagyhQgegKAAYgeAKAUAoA8BQYBuCgAyBaBGBuYAeA8AoA8AKAKYAoAeBGAABGgUYBGgUAKgKBahaYCCiWBaiMBajIYBGi0Bak2Aoj6YAUhaAUhGAogoYAKgUAKgUAAgKYAAg8ighuiggyYhagegeAAigAyYiCAonMBkgygKYgoAAAAAAAAgeYAAgeCMjwA8hQYAogyAKgygUgoYgKgKjIh4hagoYgygUgyAAgUAA").cp());
            stroke.setBounds(0, 0, 175, 240);
            return stroke;
        },
        319: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ACCAKYgUAKAAAKAKA8YAUBGAAAogoDSYgeC0gUBageBGYgKAogKAoAAAUYAAAoAeBGAoAUYA8AoAeAABQgoYBagyBageCggeYEshGE2gyFAgUYDcgKBGAKAyAoYAeAeAAAKAAA8YAAAegKA8gKAeYgKAegUB4gUB4Yg8EYgoB4hGA8YgoAogoAAiqg8YiqgygegKAAAeYAAAKAeAyAoAyYBkCMBQB4AyBkYAeBQAeAUAeAAYAeAAC+haAygoYBahaAoiCBun0YAUiMAeiMAKgeYAUg8A8huAohQYAegyAAgUgUgoYgohGjcighGgUYhGgKgeAAiWAyYigA8haAUiqAKYiWAUnqBGiWAUYi0AoAKAAgUgeYgUgeAAAAAKg8YAoiqAoh4AUgoYAyhagUgohahaYhahQhGgJgoAT").cp());
            stroke.setBounds(0, 0, 230, 225);
            return stroke;
        },
        320: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ADIAKYgKAKAAAUAKAoYAUBGgKBagKBkYgUBkgUAehaBkYhZBuAAAeBZBkYBQBQAeAABkgyYDchuHMh4GkgyYCMgUAUAAAoAKYA8AUAKBGgoB4YgyC0i+GagyAoYgyAygoAKh4gKYiMgKg8AAhQgUYhkgKgUAUBQBGYB4BaB4CCAUA8YAyBaAoAKCWhQYC+haAyhGDcoIYCgl8AAAABQhQYAygoAUgeAAgUYAAgogygyighaYiWhQg8gKi+AyYg8AKiMAehkAUYjSAolKBQiMAyYhkAegeAAgKgeYAAgUBGi+AyhaYAyhQgKgUhGhGYhahahkgdgeAd").cp());
            stroke.setBounds(0, 0, 207, 185);
            return stroke;
        },
        321: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC0AKYgeAKAAAeAUBQYAUAyAKAeAABQYAABkgKAUgeBQYgoB4geA8gyBQYgxBQAAAUAxB4YBGCgAyAKCMhkYCMhkFKh4D6geYAogKCggUCWgeYJEhQGkgyBuAKYBQAKAeAUAUAyYAUAygKBQhGEEYg8D6gKAUg8AAYgKAAhagKhkgUYjSgegeAAAAAUYgKAUAUAoB4BkYBuBQBGBGB4CMYAeAoAKAAAeAAYBaAABuhaBGiWYAog8AKgyAeigYAykEAyhuBuiWYAyhGAAgygegeYgog8i+iChug8YgygUg8AAiMAoYh4AekEAyjwAeYhuAKiqAehuAUYhuAUiWAUhQAKYiWAei+AehuAoYgyAKg8AKhGAAIhkAAIgKgoYAAg8BGj6AohGYAegoAAgygUgeYgeg8jIiCgyAAYgKAAgKAAgUAK").cp());
            stroke.setBounds(0, 0, 309, 181);
            return stroke;
        },
        322: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AC0AAYgeAKAAAoAUBGYAyCMgoCWiMDIYgeAogKAoAAAUYAAAyAoBkAoAoYAeAeAKAAAeAAYAeAAAegUAogUYCChaC0hGDwg8YCCgeFeg8DSgeYBagKC0gUCCgUYCCgKCMgUA8AAYAygKBaAAA8gKYDIgeCMAKAoAyYAyAogUCChQCqYgeBGgUAegUAAYgUAKgygKhugKYhQgUhQgKAAAKYgKAKAUAoBGBaYBaBkAoA8AeBGYAeA8AUAKA8AAYAyAAAygeBGg8YA8g8AKgUBGi+YBGiqAyhuAyg8YBahkAAgehQhQYhQhGi0h4gygKYgUgKgoAKgyAKYiWAok2AyleAoYjSAengBGhkAUYgyAKhuAUhkAKYhkAUiCAUgyAUYg8AKhQAUgoAAYhaAKgKgKAKhaYAUhQAyh4AegoYAKgUAUgeAAgKYAAgohahahkg8YgygegUAAgoAA").cp());
            stroke.setBounds(0, 0, 324, 134);
            return stroke;
        },
        323: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdEAKYgUAAgyAUgeAUYhQAohuAejIAyYnWBkmGA8lKAUYiWAAgeAUAAAeYAAAeAoAoBQAeYBGAoAAAACMAAYCCAAAUgKCMgeYDmg8NIigBGAAYAoAAAeAeAAAyYAAAoh4FehQDSYgyCCgoAyhkB4YhQBagKAUAAAyYAABaBaBuBGAUYAoAAAKAACCgyYCCg8CWAUA8A8YAoAyAAA8g8DSYg8C0g8C0g8BaYiWEYksEOmGDmYjwCWmGC0iMAeYhGAUgUAKAKAeYA8A8I6iMFoigYFeigEsjcDmkiYCMi0Bai+BGkEYAoiMA8h4BQhaYBGhGAKgUgeg8YgehGi0iChageYhGgUhaAKhGAoYhGAoiCAogoAAYgoAAgKgKAAgyYAKgyAKgeDSmGYC+loAog8BuhGYBGgyAygoAAgeYAAgyi0iMigg8YhQgehQAAgyAK").cp());
            stroke.setBounds(0, 0, 256, 360);
            return stroke;
        },
        324: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUeA8YhGAoh4AohQAeYkEBQlyBajIAUYiCAUgUAyBaAyYCMA8CWAAD6hQYDmhQFohuAyAAYAoAAAUAKAAAyYAAAoh4FohQC+YgyCMgeA8hQBaYhGBagUAoAAAeYAAAyAoA8AoAoYBGAyAeAABagoYBug8A8gUBaAAYA8AAAUAKAUAUYAeAUAAAKAABGYAAAygKBGgeBuYhQFAhkDcigC+YjmEinCFAmGCqYiWA8gJAKAJAKYAeAUA8AAB4goYHqh4F8jID6kOYB4iCC+jwAyh4YBGh4AohuAyjcYAyi+AehQBGhGYA8hGAAgehGhGYgegeg8gogygeYiMhGg8AKiCBQYg8AehQAogyAKYgoAKgUgeAKgoYAAgUBGiMBQigYEOocAKgKB4hQYBag8AKgyhag8YhGg8h4g8hGgUYhkgdgeAJiMA8").cp());
            stroke.setBounds(0, 0, 205, 342);
            return stroke;
        },
        325: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHqAKYgUAKgyAogoAoYgyAohQBGgyAeYgyAogyAeAAAKYAAAKAKAKAUAKYA8AeA8gUC0g8YBGgeAKAKAABkYAAA8gKBGgeBuYhGEigoCChQBuYgyBGgKBGAoAeYAKAUAUAABQAAYBugKBQAUAUAoYA8BQhuGuiMEYYhaCqhQCCiWDcYgoA8geAyAAAAYAAAoAegUBkhQYCChkCWiWA8hkYBkiWB4kYB4leYAUhQAohkAegoYAUgyAUgoAAgKYAAgyiChGhkgKYgegKgoAKgeAKYgeAKgyAKgUAAIgoAKIAKgoYAAgyDSomAyhkYAegyAohQAogyYAogyAeg8AAgKYAAg8hGgoiggyYhugUgyAAgoAK").cp());
            stroke.setBounds(0, 0, 94, 284);
            return stroke;
        },
        326: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMgAKYgUAKgoAUgUAUYhGA8g8AUjcBQYlyCCAAAKAABGYAAAeAKAUAKAKYAUAeCCgeC+hGYE2h4AygKAoAyYAUAKAAAUAAAeYAAA8iqHCg8CMYhQCWAKAyBaAyYC0BaD6FoBQEEYAeB4AACCgeBGYgoBahQAeiggUYiqgejIgUgKAKYgeAKAKAeAoAoYAUAUBQAyBGAoYDSCCBQA8AyBGYBQCMBkgUB4igYCCigA8iqAAjIYAAiggyiWhaigYhki0kOksiChQYhuhQAKgUD6mGYCMjSAogoBkhGYBagyAUgygUgoYgKgehahGh4haYiWhkhQgJhGAT").cp());
            stroke.setBounds(0, 0, 145, 294);
            return stroke;
        },
        327: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALuAAYgUAKgUAUgUAKYg8AygyAUkEBQYiMAyh4AogUAAYgoAUgJA8AdAyYAUAeAyAABkgoYBugyE2huAoAAYAoAAAoAoAAAoYAAAUhuFUgeA8YgoBGAAAeAeAeYAKAKAUAUAUAKYBkAoC0C0A8B4YAoBQAUBagKAoYgKAygeAUhGAAYg8AAgoAAiMgoYhkgUhkgUgUAAYgogKgKAAAAAUYAAAeA8AoBaA8YDSBuBkBQBaB4YBGBaB4gyBQigYCMkshukYl8ksYhkhQgegeAAgeYAAgeA8haBkhuYBahuAygoA8geYAygeAUgeAAgeYAAgehGhGhkhGYh4hahGgJg8AJ").cp());
            stroke.setBounds(0, 0, 128, 195);
            return stroke;
        },
        328: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOYAAYgUAKgoAUgoAeYjICWiMA8lKAyYhQAKgeAKgUAKYgUAeAAAyAKAeYAUAUAAAABuAAYCMgKDwg8CMg8YCMg8AKAAAeAUYAyAUAAAUgyB4YgoBQgyCMg8CqYgUAyAKAoBGB4YBaCgA8BuAABGYAKAogKAKgUAUYgUAUgKAKgeAAYi+AAi+AKgKAKYgKAUAKAKCWBGYCgBQB4A8BkBGYAeAUAoAUAKAAYAoAAA8g8Aog8YAehGAAAAgKhaYAAhGgKgygUgyYgohuhGiCg8hGYhuiWgUgegKgoYgKgyAUgoBQh4YCCjIBGhQB4huYAUgKAUgeAAgKYAKgegKgKgegoYhGhQiWhahQAAYgUAAgeAAgKAA").cp());
            stroke.setBounds(0, 0, 132, 189);
            return stroke;
        },
        329: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQaAKYgUAAhaAehQAUYkOBQjcAojIAKYhGAAg8AKgUAAYg7AKA7B4B4A8YBQAoAoAADmg8YB4geCggoBQgUYBGgKBQgUAUgKYAogUAUAKAAAUYAAAej6FejwEsYigDIhkBuhkBaYgyAog8AygKAKYgeAeAAAKgKAyYAAAeAAAyAKAUYAUBGAeAADIg8YAogUCMgeB4geYC+goB4gUGkhQYCggeEEgUAyAKYBQAKAKAKAKCMYAUFAhkIIiqHCYhGDIgyBahQBuYhaB4goAegoAAYgUAAhugehugoYhugohagogKAAYgoAAAUAeBQBaYB4B4BQBuBGB4YAoBQAyAyAeAAYAeAABagyBQhQYCCiMCCiqBQiqYBkjICCnqBuqeYAykEAKgoAyg8YAUgeAUgUAAgKYAAgogogohQg8YiqiCgygKiMAoYiWAelKBGmkA8YjIAojIAegoAKYgyAKgoAAAAgKYgegUBQh4C+jmYGun0CgiWCghQYBQgoAUgKAAgeYAAgyiWiCiCgyYgygUhGAAhGAK").cp());
            stroke.setBounds(0, 0, 235, 383);
            return stroke;
        },
        330: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AL4AAYgUAKg8AUhGAUYiWAyiWAUiqAUYiCAKgKAAAAAUYAAAeAeA8BGAoYA8AoAKAAAyAAYAoAAAygKA8gUYBagUD6hGAegKYAeAAgKAehQBuYi+EEiqC+iWBuYgoAegeAogKAKYAAAKgKAoAAAoYAAA8AUAeAoAAYAKAABkgUBugUYG4huJ2hQA8AeYAoAeAUCMgeBkYgoCMhaDShGBkYgoA8haBGgoAKYgUAAg8gKhQgKYhGgUgygUgKAAYgKAAAAAeAUAUYAoAeA8BkAyBkYAyBkAoAyAUAAYA8AADSiqBuiWYB4igAyiCBGlUYAeiCAKgeAogyYAUgUAKgeAAgKYAAgohGhGhkgyYhuhGgoAAi0AyYhQAUigAehuAKYh4AUiqAehuAUYhuAKhGAKgKAAYgegeAogyDwjmYDmjwB4hkBGgKYAogKAUgUAAgeYAAgoh4huhagyYhGgegyAAg8AA").cp());
            stroke.setBounds(0, 0, 187, 221);
            return stroke;
        },
        331: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXIAKYgeAKhGAegyAUYhuAyjwBGlABaYkiBQg8AKiMAKYiCAKgoAKAAAeYAAAoBkA8BkAeYBQAKBQgKD6hQYGkiMFAhQAyAKYAeAKAoAoAAAeYAAAygoCCgyCWYhQD6hQCqhuB4YhGBaAAAoA8BGYAyAoAUAABagoYBQgeCqgyA8AAYA8AAAyAoAUA8YAoBkgUEshGEOYhQFoiCEYhuBQYhQAygoAAjchQYiWgogygKgKAAYgeAUAKAUBkBuYBkB4B4CWAyBaYA8BaAeAKBagoYBug8B4huBah4YCMi+BakYBkqAYAoj6AKgyA8haYAyhaAAgeg8gyYg8g8iWhQhQgeYg8gUgeAAiWAoYi0AygUgeBai+YBGiMC+lABkh4YAegeAogoAegeYA8goAegygKgoYgKgohahGiChGYiCgygegJhaAT").cp());
            stroke.setBounds(0, 0, 211, 335);
            return stroke;
        },
        332: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AT2AeYgoAehGAUgeAUYiMAyl8BalyBGYhkAUhkAUgUAAYgKAAgKAKAAAKYAAAUBGBQA8AUYBGAeBGgUEYhaYD6hQDIg8CggeYCCgeAKAehQCWYg8CCgyBGg8BGYgyAyAAAKAAAeYAAAeAKAeAKAeYAeAyAoAKBGgoYBug8DwgoBQAUYAoAKAUAyAAA8YAAC+h4FohGAyYg8AohagKjchGYh4goAAAAB4CgYAoAyA8BQAeAoYBGBuAoAeAoAAYAoAAB4g8A8gyYBQhGAyhkBQksYBGjIAohuA8hGYAUgeAUgeAAgKYAAgegygyhahGYhuhGgogKigAeYjIAehGAAAAgyYAAgeB4iqBQhaYAogoAogoAegKYAUgUAegUAKgKYAUgUAAgKgKgUYgKgegygohkgyYhugxgeAAhkAn").cp());
            stroke.setBounds(0, 0, 202, 190);
            return stroke;
        },
        333: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ARMA8YjwBuhuAeowBGYhGAKg8AKgUAAYgeAUgKAyAAA8YAUA8AKAAD6gyYI6h4DmgyAUAAYAUAAAUAUAUAKIAUAeIgKB4YAABGgKDmgUDcYgyMMAKgogyCMYgeBGAAAKAKAoYAUAyAoA8AoAKYAKAAAeAAAUAAYCMgyCqgoB4gUYC0goDmAAA8AeYBQAoAUBGgUCqYgyIIgeDSgyCWYgeBugoBQgUAKYgUAUg8geg8goYgUgUgUgUAAAAYgUAAAUA8A8CMYAeBQAyBkAKAyYA8CWAoAKBuh4YBahQAohQAUhaYAoiqBuo6AokEYAUiWAehGBGhaYBuiCgKgUjIiMYhQgyhagygUgUYg8geg8AAh4AeYgoAKigAUiWAeYkiAygUAAgUgyYgUgyAopsA8m4YAei+AKgUBahuYBQhkgKgoiMhkYhQgyighGgeAAYgKAAhGAUhGAo").cp());
            stroke.setBounds(0, 0, 267, 379);
            return stroke;
        },
        334: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AakAeYiCAolUBQnqBQYksA8jIAKh4gUYhagUgxAyAdBGYAUAoCMCCBGAoYBaAyAyAABQgyYCChQAegKC0g8YDchGImiMBagKYBGAAAAAAAKAUYAUAogeAyg8BQYgeAogyA8goAyYiCCqiqDcgeAUIgeAeIgygUYhkg8h4gegeAeYgKAUAAAABGBaYA8BaAeBkAeDIYBGHWAUEigKGkYgKGQgUCWhQCqYgeBGgKAKgeAKYg8AUiCgKiqgoYj6g8gUgKgUAUYgKAKAAAKAAAKYAAAAA8AyBGA8YCqB4BuBkCCCCYA8AyA8AyAUAKYAeAAAygUBGgyYBQhGAyg8AyhuYBkjIAUi+gKm4YgKk2genMgokOYAAgogUiggKigYgUiWgKiMgKgKYgKgUAKgKBGgyYBkhGEEi+BkhQYBQhQAygeBkgeYCMgyAygygKgyYgUgyi0jchahGYhQgxgeAAh4An").cp());
            stroke.setBounds(0, 0, 223, 394);
            return stroke;
        },
        335: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQkAUYgyAUigA8igAyYk2BuhGAKi0AAYhQAAgUAKgUAKYg7A8CpCWCMAAYAyAAAUAABQgoYBugyFoiWBageYA8gUAyAAAoAoYAUAUAKAegUAeYgUAokYHCAAAKYAAAAgegKgUgKYgUgKgUgKgUAKYgyAKAAAeAyBuYBuD6AyDcAUFeYAeGkgyG4haBkYgeAUAAAAgyAAYgeAAiCgoh4goYjwhGg8gUgeAUYgUAKAUAUB4BkYCWCCC0C0BaBuYBQBkAyAoAoAKYBkAUBuhuBQjIYAohuAKhGAeigYAej6gKqeg8ksYgUiWgUhGgyhkYgohkgKgUg8g8YgegegUgeAAgKYAAgKA8g8B4haYAogoA8g8AygoYAygoAygyAegUYAygoBuhGAogKYAegKAegoAAgeYAAgyhahGi0huYhugxgyAAh4Ad").cp());
            stroke.setBounds(0, 0, 162, 331);
            return stroke;
        },
        336: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAUYgoAUiWAyiCAoIjwBQIiMAKYhQAAhGAKAAAAYgxAyCVCCBuAAYAUAAAogKAogUYAogUCCgyB4gyYC0hGAygUAUAKYAyAAAUAeAAAeYAAAKjIFogUAUYAAAAgUgKgegUYgygogygegUAAYgKAAgKAKgKAKYgKAKAKAUAoBQYBaDSAeCCAAEsYAADIAAAogUBGYgeB4geAygeAKYgUAAhQgUiMgeYh4gehkgUgKAAYgeAKAUAUAyAoYBkBGBuBaBuBuYBaBGAeAeAeAKYBGAKAygeAyhaYBuigAekEgel8YgKjSgoi0gohQIgehGIAogoYAogoCqiWBahGYAegeA8goAygUYBQgoAUgegegyYgKgehuhGhkgyYhagegogJhkAd").cp());
            stroke.setBounds(0, 0, 133, 215);
            return stroke;
        },
        337: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANcAKYiWBugyAehaAoYjIBkjIBGhaAAYhQAAAoBGBkAUYB4AeC0goEEhaYB4gyAKAAAyBGYAeAeAAAUAAAyYAABGAAAKgoAyYgeAegeA8gUAeYgUA8gKAUAABQYgKBkAUAyBGCCYBQCMA8B4AUBGYAUBGAACMgKAyIgUAeIiMAKYiCAAgoAKhkAUYi+A8iMAUhuAKYhuAKgeAKAAAoYAAA8BkBkBkAyYBGAoAUAAB4hGYBkg8BagyBugeYBGgUAeAAB4AAYB4AAAUAABuAoYDcA8FUCCFoCqYFACMEiBuFABGYDcA8BQAKBagUYCMgUEYh4C+iCYBuhGAUgUgUgKYAAgKiqgKkOAAYjwAAjSgKgUAAYgUAAg8gKgoAAYkYgUlehQlohuYj6hQleh4iCg8YgegUhQgUg8gUIhkgUIAUgUYAogeAohaAKhGYAKh4goh4hui0YhaiMgUhkAeh4YAoiMCgkOBQhkYBQhag8hGkYhuYhkgegeAAgoAK").cp());
            stroke.setBounds(0, 0, 416, 278);
            return stroke;
        },
        338: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJsAKYgKAKgoAegUAKYhuBQkYB4hkAKYgyAKgKAAAAAUYAAAyCCAUCCgeYAogKBageBGgUYCCgyAKAAAoAyYAyA8gKBGhGBQYhQBugKCCA8BuYCWEEAeBagKBuYgKAeAAAegKAAYAAAKgeAAhQgUYhugoiMgKhkAKYgyAKgyAAg8gKYhagKAAAAgUAUYgTAoAnBaBQAoIAyAeICggUYDmgUBGAKDcBaYA8AUB4AyBaAoYBaAoBuAoAeAUYAoAKBuAyBaAoYC+BGFoCgBGAeYBkAoBugKC0hQYEYiCD6h4AegUYAUgUAKgKAAgUYAAgygegKloAUYiqAAiMAKgKAAYAAAAhkAKhuAAYk2AAgegKsqkEYiMgoh4gogKAAYgUgKAKAAAegoYAygyAUg8gKhaYgKhGgUg8haiWYgyhaAAAAAAhQYAAhaAAAAA8iCYA8iCAog8Ayg8YAyg8gKgehGgyYg8goiWg8goAAYgKAAgeAAgKAK").cp());
            stroke.setBounds(0, 0, 318, 218);
            return stroke;
        },
        339: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAsYAAAYgKAKgeAUgeAKYhaA8hGAoiWAyYhQAUhaAegeAKYhQAUk2BQiWAeYnqBukOAokEAKYiWAAgKAKgKAUYgeAeAAAoAeAyYAoA8BuBkA8AeYBQAoAogKCMg8YA8geBagoAygUYBkgeCqg8AygKYAUAABageBugeYEYhQGGhaAoAAYAoAAAUAUgKAeYgKAUhuBkkYDcYl8EslKD6loDwYiMBkiCBQgUAKYgUAUgyAUg8AKYgyAUhQAUgoAKYhGAUj6Aog8AAYgoAAgUAeAAAoYAAAyBaBuBkAyYBGAyAogKBag8YBkhGBkgoBugoYBGgeAoAABkgKYBkAAAUAABaAUYCqAyEiBuDmBuYA8AeAyAUAAAAYAAAABQAoBaAoYFUCqDcBQE2BkYCMAoDwAyAyAAYCWAAEEhuEEiqYB4haAogUgKgUYAAgKhugKksAAYmkgKlAgUjcgoYhugUj6g8gygUYgUAAg8gUhGgUYiWgyloiCi0hGYhGgohkgogygUYhagoiWgog8AAYgoAAgKgKAegKYAogUC+hkCChGYG4kEG4ksFAj6YA8gyBGgyAogeYBGgyDchuB4goYBkgoAUgKAAgyYAAhGhuiCighuYhGgygUgKgoAAYgeAAgeAAgKAA").cp());
            stroke.setBounds(0, 0, 422, 290);
            return stroke;
        },
        340: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbCAKYhGAUAAAUAyBuYAUAoAUAogKAAYAAAAgeAKgeAKYhGAKhuAejSAyYi+AohkAUj6AyYhuAUiMAUg8AUYhQAUhQAKhuAAYiCAAgUAKgKAUYgTAeAJAyAeAeYBGAyDmCCAoAAYAUAABGgeBagoYC0haB4gyDSg8YAogKAogKAUgKYAKAABageBageYBageB4goBGgUYA8gUA8gUAAAAYAKAAgKEYgKBQYgKAegKA8AAAeYgUBkg8C+goBuYiWGQjmEOnCEsYigBkgeAUAKAeYAUAoDwg8C+hkYCCg8BGgyCgh4YDIiqBGhQCMj6YBujcA8igAyj6YAUhGAUhaAKgoYAKgoAKg8AKgoYAUhaAUg8AohQYAog8AAgogKgeYgKgeiChQhkgyYhugohQgJg8AT").cp());
            stroke.setBounds(0, 0, 223, 240);
            return stroke;
        },
        341: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAm6AAKYgKAUgKAUAAAUYgKAUgKAegKAUYhGBaoIDwoIC0YhGAUhGAUgKAAYgKAAgogKgygeYiMhGhQgKgeAeYgeAeAKAUAoBGYAUAoAUBGAKAoYAyCWgUJsg8FUYgeC+hQD6haDIYhuEEigDSkODwYhGA8g8A8AAAKYgJAyBPAKBagyYBagoDci0B4h4YB4huCCi0A8h4YAyhaAyiWAoiWYAyjcBGnMAelyYAAhuAUiqAKhQIAeiMIBugUYCCgUIIh4CCgeYAygUBkgeBGgUYCWgyCggoCqgUYCMgUAogKAAgoYAKhGhkhaj6iCYh4gygogJgeAT").cp());
            stroke.setBounds(0, 0, 303, 351);
            return stroke;
        },
        342: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AXcAKYAAAAgKAUAAAKYAAAUgKAeAAAeYgeBGi0C0jmCqIi0CCIh4gyYiChGg8gKgoAoYgeAeAKAeAyBaYAeAoAeA8AAAUYAUA8AAKKgUC+YgoImhaFojcHgYgoBahQCWgyBkYgyBugeBQAAAKYAKAeA8gUAyg8YA8g8CgjcA8haYDclUCWn0BGo6YAejwAAgUAUlKYAKigAKigAAgeYAKgeAKgyAAgUYAAgeAKgKAogKYBQgeEYh4CghQYBkgyBageA8gUYBugeAogegKgyYgKgygyhGhQhQYhuhkhkgngoAd").cp());
            stroke.setBounds(0, 0, 190, 370);
            return stroke;
        },
        343: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ASmAKYgKAKgKAUAAAyYgKBkgKAoiCCWYh4Cgn0H0gegKYgKAAgogUgogUYg8gUgUgKgUAKYgoAKAAAoAoBaYA8CMAKBQAKC+YAKC+gKIIgUCMYgoFUgyC0hkCMYgoAygKAeAAAeYAAAyAKBkAeA8YAyBkAeAABGhaYCWi+Cgi0EOkYYC+i+AegygoAAYgUAAiCBQi+CMYi+CMAAAAgUgUYgUgKAAgeAKjSYAAiCAKiMAAgeYAAhGAKiWAUnWYAKjcAUjmAKAAYAeAAH0lADIiMYCWhuBQgoB4gyYB4gogKhkiCiMYg8g8huhQgygeYgygKgyAAgUAK").cp());
            stroke.setBounds(0, 0, 164, 343);
            return stroke;
        },
        344: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOEAAYgKAKgKAUAAAoYAABQgKAehQBuYhuCMhGBQi+C+Ii0CqIgogUYg8gehGgKgeAUYgeAUAAAeAUAUYAUAUAyCCAKA8YAUBkAKF8gUC+YgKDSgUBagyBuYgoBkgJAoATBQYAyB4BGBQAogKYAKAAAogoAogyYAogoCWiqCWiWYFAk2BGhQgUgKYgUgKiMBGjwCMYhuBGg8AegeAAYgoAKgKgKAAgeYgKgoAKp2AKh4YAejIAAgegUgeYgUgUAAAABQgyYBug8DmigCqh4YCChkB4hGAeAAYAKAAAUgKAKgKYA8gygUhGhuhuYhkhuhugxgyAT").cp());
            stroke.setBounds(0, 0, 127, 261);
            return stroke;
        },
        345: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AOsAUYgKAKgKAeAAAKYAAAygyBGhkBQYhQBGi+CCh4BGIhuBGIgygeYhGgog8gUgyAKYgoAKgJAeAJAeYA8BkAUAeAUAyYAeBaAUCWgKC0YAACMgKAog8BaYgoA8gKBQAeBQYAoBkBGBkAyAAYAKAAAygyA8g8YB4h4C+igEYjmYEOjSBuhkAAgeYAAgUgUAAhGAoYgoAeigBQiWBQYigBQiWBQgeAUYhGAegyAAgegoYgUgegKgoAKloIAKi+IBQgeYDShGCWg8Bkg8YAogeCggyA8gKYBGgKAKgKAAgyYAAgeAAgegUgUYgohGi0iggoAAYgKAAgKAKAAAK").cp());
            stroke.setBounds(0, 0, 131, 189);
            return stroke;
        },
        346: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATOAKYgUAUAAAKAUA8YAUCMgeCCiCDwYhuDckEGai0DmYhaCCiMCMiWBuYiMBkgUAeAAAoYAABGBGCqAoAoYAoAUAUAABkgoYCqgyEsgyGagoYCCgKB4gKAeAAIAygKIgUAeYhkCCuYOihuBQYgUAUg8AegoAUYhuA8geA8AyBkYAoBQB4B4AoAAYAKAABGgUBQgeYHCi0H+iCKehaYJOhQgeAAAogeYAKgKAKgUAAgKYAAgKgKgKhaAAYloAAtmBkpOBaYiqAegeAAAegyYAohQIwpYJspsYFKlUCWiMB4haYAogeAogoAKgKYAUg8hGh4iChuYhkhQg8gegoAAYgyAAgUAegKBGYgKBagUBGhGB4YhuDchkCgiCCqIg8BQIoSgKYn0AAgoAAgegUYgKgKgKgKAAgKYAAgKDSksCqjcYDSkOD6kiDcjwYBGhQA8hGAKgUYAUgeAAgKgUgoYgohkjIjShGgUYg8gKgyAAgUAK").cp());
            stroke.setBounds(0, 0, 273, 378);
            return stroke;
        },
        347: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANmAUYgUAKgKAeAAAyYAAAogKAogKAUYgoBkiqC0iWBkYgoAeg8AogeAUYgoAegeAKhGAKYhkAUgUAKgoBGYg7CMAdBkBkgyYA8geBugKFAAKYFeAKgUAAAAAAYAAAKjwCqloDwYgUAUgoAUgeAKYiCAoAABGB4CMYAUAUAUAUAKAAYAKAAA8gUBGgUYEYhuCWgoH0hkYBugUDmgoCWgUYCMgKAygUgKgoYgKgUhGAAjcAUYlyAejIAemGA8YiMAUgyAKAAgKYAAgeQ4rkCghGYBkg8AUgKgUg8Ygoh4iqiWg8AUYgKAAgKAUgKAeYgoBkgUAUhGBaYhaBuhkBuhuBaIhaBQIiWgUYmug8goAAAAgUYAAgUBagyC+huYCWhaCMhQAegKYAogUAKgKAKgeYAehGgyiMh4h4YgygogegJgeAd").cp());
            stroke.setBounds(0, 0, 202, 177);
            return stroke;
        },
        348: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AKKAKYgUAUAAAKAUAyYAyCWhGDSjSGGYiMEEgeAoiCB4YiBCMAAAKAdBkYAUBGBQBQAeAAYAKAAAygUAygUYCChGGkiCAUAUYAKAAgoAykiFyYj6E2g8A8g8AoYiCBQAUBQCWB4YBGA8AUAAB4hQYC0h4DmhuFAh4YCWgyAUgKAUgeYAAgKAAgKgKgKYgKgUgUAAhaAUYhuAUjwAyjIA8YiMAogUAAAUgyYAKgUEElKBGhQYAUgUB4iMB4iWYDwkOA8hGBahQYA8gyAKgUgog8Yg8hQighuhQgKYg8gKgeAUAABaYAABagoCChuDIIgoBaIhuAKYgyAAh4AKhQAAYhQAKhQAAgKAAYgKAAgKgUAAgKYAAgKAyhQA8haYCgkEB4igDwlAYAyhGAKgegyg8Ygog8iCh4g8geYgygKhGAAgUAK").cp());
            stroke.setBounds(0, 0, 154, 260);
            return stroke;
        },
        349: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ALQAKYgUAKAAAKAUB4YAUBQgKBagoB4Yg8CgkOIIhaCCYgeAeg8A8g8A8Yh4BuAAAUAAA8YAKBaBkCMA8AAYAKAAAygUA8geYCMg8G4iWAUAUYAKAAmuImg8A8YgUAUgoAogUAKYhQAygKA8AyBGYAeAoBkBQAeAAYAKAAA8geBGgoYDIiMBugyE2h4YC0hGAUgKAAgeYAAgUAAgKgeAAYg8AAksBGjmBGYiMAogKAAAUgyYAyhkLQtwB4hkYBQhGAAgUgUgyYgohGiqh4hGgKYhGgKgKAUgKBkYAABGgKAogyBkYgoBkhuDmgUAUYgKAKAAAAksAKYiCAKh4AAgKAAYgKAAgKgKAAgUYAAgyHWqyDmkYYAygyAAgegeg8YgUgoigigg8geYg8gehagJgeAT").cp());
            stroke.setBounds(0, 0, 163, 257);
            return stroke;
        },
        350: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGkAKYgKAKAAAKAKAUYAeBQgyCCiCDmYhGBugeAohQBQYg8A8geAoAAAUYAAAeAoBGAoAUYAUAKAKAAA8geYBugyE2hQAKAUYAKAAgoAokOE2YiCCWg8AygoAeYhPAogKAoAxA8YAoAoBGAyAUAAYAKAAA8gUA8goYCWhQB4gyDwhQYDIhGAegUgUgeYgUgKiqAej6A8YhaAUhaAUgUAAYhGAUAyhGHqn+YBuh4CCiCAogeYAygoAegeAAgKYAAgohahGhagyYhGgegUgKgeAKYgeAKAAAAgKA8YAAAogKAoAAAUYgeAyg8B4goBQYgoBGgKAAgeAAYgUAAhaAKhaAAYh4AKg8AAgKgKYgKgKCgjwC0jSYA8hGAogyAAgUYAAgUhkhkg8geYgogKgyAAgKAK").cp());
            stroke.setBounds(0, 0, 120, 165);
            return stroke;
        },
        351: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHqAKYgKAKAAAUAKAoYAoCCgyCgigFKYh4DwgKAehuBuYgoAygoAyAAAKYgJA8BFCWAyAAYAKAAA8gUA8geYB4g8DchQAoAKYAUAAAAAKigDcYkYGGgeAogyAeYhaA8AKA8BaBaYAeAeAeAUAUAAYAKAAAygeAygoYBuhGDIhuC+hGYCCg8AegKgKgeYgKgUAAAAgoAKYhGAAjIA8iMAoYh4AogeAAAAgKYAAgoJYsWBuhuYAogoAUgeAAgKYAAgyiCiChageYg8gKgKAKgKBkYAABGgoCChGCCYgKAegKAAjcAKYiMAKgeAAgKgKYgKgKAKgUA8h4YBui+B4jIB4iqYAyhGAohGAAgKYAAgyiMigg8geYgogKgyAAgUAK").cp());
            stroke.setBounds(0, 0, 114, 218);
            return stroke;
        },
        352: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAUAKYgdAUAJAUAeBaYA8BuAAAUAUMCYAUMCAAAUAKAKYAUAUBGgKAogKIAogKIAAs0YAKpsgKjIgKgUYgKgehuhkgygeYgygKgUAAgoAK").cp());
            stroke.setBounds(0, 0, 33, 186);
            return stroke;
        },
        353: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAAYAAAKAKC+AKBkYAKAoAKDIAADSYAAEsAKBkAKAoYAeCMBkCCAogKYAegKAehGAKhGYAUhkgUlUgejmYgUiWhQlogKgUYgUgegegogegKYgogUgoAAAAAA").cp());
            stroke.setBounds(0, 0, 32, 146);
            return stroke;
        },
        354: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANSAAYiCAoloA8jIAKYiCAKgeAKAAAoYAAAoA8A8BGAUYBaAoA8AABagUYBugeEig8AoAAYBkAAAUAygeDIYgoFehaHWgoAoYgeAegygKhQgyYhQgygegKAAAyYgKAeAyBkAyBaYAUAoAoBQAeBGYAyCCAeAoAoAAYAeAAA8geAegoYBQhkBGi0AykOYAojIBamaAUgyYAKgeAehGAegyYA8h4AAgUhahQYhGhGh4hQhQgyYg8gUgoAAgyAA").cp());
            stroke.setBounds(0, 0, 135, 188);
            return stroke;
        },
        355: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAgqAAKYgUAAhkAehaAeYk2Bkj6AylKAyYjIAel8AojIAUYiMAKgKAKgoAoYgUAoAAAoAKAyYAeA8AyAKDmgyYBagKDSgoCggUYCqgeFKgyDmgeYDmgoDIgeAKAAYA8AAAyAUAoAyYA8A8AUBGAABkYAACgiCKohaFKIgUAyIi0AoYm4BQj6Aom4AyYiqAKiMAUgKAKYhGAoAeBaBaAoYA8AeCCAADmgoYBugKBugUAeAAYAegKBQgKBGAAYBugUEYgUFUgUYAygKBuAABkgKYCqgKAUAAAUgUYAKgKAKgUAAgKYAAgUhQhag8gyIgegUIAeiMYBupYB4lKDmkEYBGhQAKgogKg8YgKhQhag8kiiMYiMhGgUgKg8AAYgoAAgyAAgeAK").cp());
            stroke.setBounds(0, 0, 283, 230);
            return stroke;
        },
        356: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AMMAUYigBkhkAejcBGYiCAeh4AogKAKYgoAKAAAoAAAoYAKAeAAAAAyAAYAUAAA8AAAogKYI6iWAeAAAeAeYAyAygKBGhGFoIgyEOIhaAeYgyAKiCAohkAeYjSA8geAUAKAyYAUBQA8AKCggoYCWgoCWgeDmgoYBugUBugUAKgKYAogUgegyhkg8YgogUgKgKAKgUYAAgKAKg8AKgyYAeiCA8i+AohGYAKgeAog8AUgoYAogyAKgUAAgeYAAgygUgehQgoYgegKhGgogogeYhug7g8AAhQAd").cp());
            stroke.setBounds(0, 0, 128, 136);
            return stroke;
        },
        357: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AdYAAYgKAAgyAeg8AUYh4A8j6A8l8BGYlKA8i+Aej6AKYjSAUgeAKAAAeYAAAeAoAoBQAoYBGAeAAAACMAAYB4AAAogKBkgUYEEg8NIiqA8AAYAyAAAeAeAAAyYAAAohuFKhaDcYgyCCgyBQhuB4Yg8BQgKAKAAAyYAABaBaB4BQAKYAUAAAeAAAogUYBQgoAUgoAKiWYAAgeAKgyAKgeYAKgUBai0Bui+YC+loA8hQBagyYA8geA8gyAAgeYAAg8i0iCighGYhGgehaAAgeAA").cp());
            stroke.setBounds(0, 0, 241, 165);
            return stroke;
        },
        358: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AeAAKYgUAKgeAKgKAKYhGAyjcA8hkAAYg8AAgeAKAAAyYAABQA8AeBageYBQgeBagKA8AKYA8AKA8AUAUAeYAeAygUCMhkEiYhuFUi0DwleEOYkiDmnMDwlKBkYhaAegJAKAJAUYAeAeCWgUDwgyYGkhuGGi0EsjwYBkhQC+jIBGhaYB4igBQigBGkEYAyiqA8h4BGhGYA8hGAKgKAAgoYAAg8huhuiWhQYhQgehGgJhQAT").cp());
            stroke.setBounds(0, 0, 242, 230);
            return stroke;
        },
        359: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGGAKYgKAKg8AogoAoYgoAohQA8g8AoYg8AogoAeAAAKYAAAKAKAKAKAKYAyAUBagKBugoYBQgeAUgKAUAKYAUAKAKAKgKBQYAAAygUBugeBaYhGEigoCChGBkYgeAegKAegKAeYAAAyAAAAAeAUYAUAUAKAKBGgKYBagKAKgKAKhkYAAg8AUgoA8igYAohuAyiCAUg8YA8igA8huBaiCYBah4gygyjmhGYhkgUgoAAgyAK").cp());
            stroke.setBounds(0, 0, 82, 135);
            return stroke;
        },
        360: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AJYAKYgeAKhGAKhGAAYg8AKg8AKAAAAYgUAUAAAyAUAUYAeAUAAAABGAAYA8AABaAeAUAeYAKAUAKAUgKBGYgUD6h4FKi0E2Yg8BkgoA8iCC+YgoBGAAAKAKAKYAUAKC0iWB4h4YAygyA8hQAegoYBkigB4kOB4leYAUhaAohkAUgoYAegoAKgoAAgKYAAgegygyg8geYhGgUhaAAg8AK").cp());
            stroke.setBounds(0, 0, 94, 167);
            return stroke;
        },
        361: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("APeAUYhQA8hGAygoAUYhQAojmBGi0AyYjwA8gyAUgUAeYgJAeAJAoAoAUYAUAUAeAABuAAYCWAAAogKCMhGYBugyCWg8BagUYAygUAUAAAoAKYBQAeAAgKAAHMYAAEOAADIgKBuIgKCgIAeBGYAoBGAoBGAoAUYAoAUAegKBQhGYBGg8CWhQBkgeYAeAABugKCWAAYDwgKAAAAAAgUYAKg8huhug8AAYg8AAk2AyhkAUYiMAegeAAgegeYgygyAAhkAKn0YAUk2AAhGAohQYAohQAAgegegeYgKgKhGgog8geYighFgyAAg8Ad").cp());
            stroke.setBounds(0, 0, 221, 178);
            return stroke;
        },
        362: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAegJBQAdAeYAUAUAyBuAeBGYAUAyAAAoAAGaYAAG4gKCCgoFUYgUDIgKBGgeBGYgeBQAUA8B4BQIA8AoIBkgUYA8gUA8gKAKgKYBGgoAAi+hQhGYgegUAAgKgKhaYgUiMAepsAeksYAUkYAUhaAohQYAohkgKgeh4hQYh4hQiMhGgyAAYgeAAgUAAgUAA").cp());
            stroke.setBounds(0, 0, 53, 236);
            return stroke;
        },
        363: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAkuAAKYgyAKh4AUhuAAYhkAKhkAAgUAKYgUAAgyAAgeAKYhkAKqeBajmAoYigAUksBGiqAoYhkAegKAKgKBGYAAAoAAAAAUAeYAUAUAUAAA8AAYAyAAA8AAAogUYC+g8HghkFAgyYFogyISgyBQAUYBQAUAyAeAUAoYAeAygUCMg8FeYhGHMhQEYhaCWYhQCMgoAKkOhGYi0gygyAAAAAUYAAAKAoAoAyAyYCqC+CMC+AeBQYAKAoAyAoAoAAYAyAABag8BkhaYCWiWAohaA8kiYCCpYB4oIA8igYAUgeAegyAUgeYA8hGAAgUhahQYgogohQg8g8goYiCg8gegJiWAT").cp());
            stroke.setBounds(0, 0, 292, 245);
            return stroke;
        },
        364: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAKAKYgKAegJgUAxCCYAyCCAKBagKJYYAAI6gKAygoDcYgeCMAKAyBaAoYA8AUAUAAA8geYAegeAUgKAKgoYAUg8AAhQgUgoYgUgoAAgeAAo6YAAqAAAgKAyjIYAehuAAAAgUgUYgyhGighQhGAAYgUAAgUAAgUAK").cp());
            stroke.setBounds(0, 0, 37, 206);
            return stroke;
        },
        365: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ANwAUYgyAUi+Ayi+AoYmGBagoAKgUAUYAAAeAAAyAKAeYAoAoAoAAB4goYCCgyCMgeCggeYC0gUBQAAAyAUYBGAeAKAogoDmYgKBGgUCWgUCCYgeDmgKBQgoBkYg8CCgUAKiqgyYhGgKhQgUgUAAYgyAAAAAeBGBQYBaBkBGBuAoBGYAeBGAeAeAeAAYAoAABagyBGg8YBGgyA8huAehkYAUhGAejmAolUYAokOAUhQBQiWYAohQAAgUgUgoYgegoh4hkhagoYhQgngoAAh4Ad").cp());
            stroke.setBounds(0, 0, 138, 187);
            return stroke;
        },
        366: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AB4AKYgKAKAAAUAUBGYAUBkAKDwgKDIYgUCqAAAUhQBuYgyBGAAAUAAAoYAKAoCCBaAoAAYAeAABQgyAUgoYAegyAAhGgUgyYgUgoAAgKAAiMYAUkOAKgeAei+YAeiqAAAAhug8YhagogygJgUAT").cp());
            stroke.setBounds(0, 0, 39, 122);
            return stroke;
        },
        367: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYOAAYgyAUiMAUiWAUYhQAKi0AUiWAeYjwAoiCAUk2BGIh4AeIAAAeYAABGAyA8BQAAYAUAAAogKAegKYDIhaGuhQG4goYDIgUAeAAAyAUYBGAUAUAyAABkYgKBageDcgyDcYgoC0gKAegyAyIgeAeIhQAAYgyAAhQgUg8gKYi0gogoAKBaBQYBkBaBuB4AoA8YBQB4AeAKBuhQYCMhkAog8AyiWYAUgoBGlKA8k2YAeiWAUgoAyg8YAygyAAgUAAgUYAAgog8gyiMhGYhkgygKAAhGAAYgyAAgoAAgUAA").cp());
            stroke.setBounds(0, 0, 205, 160);
            return stroke;
        },
        368: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AYEAeYlyBunWBQn0AeYiqAKgeAKAAAeYAAAUAUAUBGAeYBQAeBGAACqgeYBQgUC0gUCMgUYCMgUB4gUAKAAYAAgKBugKCCgUYCWgeBkgKAUAKYA8AKAoAeAAAoYAAAehGDIgUAeYgKAKjmBGi0AyYgoAKgyAKgeAKYiCAekOAokiAeYk2AeAAAAAKA8YAKAeBkBuAeAKYAKAABkgUBkgUYD6g8J2h4CWgUYCCgUDIgUA8gKYBagKAUg8g8g8IgogoIAog8YAyhGAygyBGgoYBQg8AUgegeg8YgKgehkg8iMhGYiCg7goAAiqAn").cp());
            stroke.setBounds(0, 0, 215, 105);
            return stroke;
        },
        369: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUUAKYgKAKhQAUg8AeYiqA8iqAyiMAeYjwAohuAUiWAKYhQAUhGAKgKAKYgTAUAJAeA8AeYA8AeAUAKBGAAYAoAABQgKAogKYAygKCCgeBkgUYBugUCqgeBugeYDmgoAUAAAoAeYAyAoAKAygUBkYgKB4geC0gUBQIgUA8Ig8AUYgoAKh4AehuAUYi0Ayi+AojIAoYiCAUgeAoBGA8YAUAUAeAUAoAKYA8AKAUAACMgeYDwgoFygyDIgUYBkgKBagUAKAAYAegegKgog8gyIg8gyIAUhGYAyi0A8igA8hQYAKgUAegeAegeYAyg8AKgogUg8YgKgogogei+haYhug8geAAgoAAYgoAAgoAAgUAK").cp());
            stroke.setBounds(0, 0, 184, 129);
            return stroke;
        },
        370: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AP8AAYgUAAh4AeiMAoYiMAejSAyh4AeYiCAUhuAegKAKYgxAeAxBQBkAUYA8AKAUAACMgUYDwgoFog8DSgUYCggKAegKAUgUYAegegUgehGg8YhahGhGgKh4AA").cp());
            stroke.setBounds(0, 0, 138, 39);
            return stroke;
        },
        371: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AUAAUYjmBQjwBQi0AeYi0AehGAKkEAoYhkAKgUAKAAAeYAAAUBGAoAyAUYBQAegeAAMqigYCWgeCCgUAUAAYAyAKAoA8AABGYAAA8geCWgeCgYgKBGgKA8AAAAYAAAAgeAKgUAAYgeAAhuAehuAUYjmA8leBQiCAUYiWAUhaAUgUAUYgxAoAxBQBaAeYA8AKB4AAB4gUYEEgoBagUDcgeYCCgKDIgUBugUYDmgUAUAAAAg8YAAgegygohGgyYgegUgKgKAAgKYAAgKAUg8AUhGYA8jIA8huBGhQYBGg8AUhGgegyYgUgogogUiqhaYiMg8g8gJhaAd").cp());
            stroke.setBounds(0, 0, 182, 133);
            return stroke;
        },
        372: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAAAKYAAAKAAAeAKAUYAKAoAAAyAACCYAADSAKAyBGA8YA8A8A8AUCqAAYCMAABQgUAKgeYAUgegKgogUgeYgog8g8gKi0AUYhQAKgUAAgKgUYgegeAKigAohQYAUgeAAgKgKgeYgKgyg8gyhGgUYhGgUgoAAAAAK").cp());
            stroke.setBounds(0, 0, 64, 70);
            return stroke;
        },
        373: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AA8AKYgKAKAKAyAeB4YAUBkAKDSgeBQYgKAygoA8goA8YgJAUATAyAyAyYAyA8AUAACWg8YEOhkFohGH0goYCCgKAUAegeC+YgUC+gKA8geA8YgUA8AABGAUAUYAUAUAKAAAyAAYBkgKAogoAeiMYAoiCAehGBuhkYA8hGAegeAAgUYAAgoh4hki+haYg8gegKAAhQAKYgoAAi+Aei0AoYm4BakOAohQAAYhaAAAAAKAeh4YAUhuAyiCAegoYAUgUAKgeAAgKYAAgehuhuhQgyYhQgygygJgUAT").cp());
            stroke.setBounds(0, 0, 200, 136);
            return stroke;
        },
        374: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABQAUYgoAoAKAeAyAoYA8AyAeA8AUBQYAUBGAAE2gUCqYgKCMgoDwgUAeYgUAogoAogyAoYgeAeAAAAAAAeYAKAoCMCWAoAUYAeAKAKgKAogUYAygeCgg8B4geYCggoEEgoH0gyYEigeCggKGuAAYG4AACCAKEiAoYB4AUAogKAegoYAegeAAgygegyYgegyhkhQhagoYgygegKAAhaAAYg8AAhkAKg8AKYmGBG6QCqkiAKYgyAAAAAAgUgyYgehQAAhkAyn+YAUjSAKhuAUgUYAKgogKgygegeYgegehug8hGgUYhagKg8AAgeAU").cp());
            stroke.setBounds(0, 0, 348, 168);
            return stroke;
        },
        375: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AR+AUYhGA8geAUi+AyYlABukEA8iqAKYgyAAgyAKAAAAYgxAyCfBuB4AAYAyAKAegKBGgoYA8gUCWgyCMgyYE2hkAogKAKAKYAAAAgKBGgKBGYgeC0gKDIAKBuYAUCMAKAoBQBGYAyAyAUAKAyAKYAeAKBaAKBGAAYCCAAAKgKAygUYBQgeBah4AAg8YAAgKgKgogUgeYgyhGgehGgUhaYgKg8gKgegKAKYAAAKgUAygUA8YgeCCgeBGgeAeYgUAUgUAKg8AAYiMgKhGg8AAhuYAAhQA8jIA8h4YAohQAKgUA8goYAegUAUgeAAAAYAAgehuhahGgeYhugxgUAAgyAd").cp());
            stroke.setBounds(0, 0, 184, 122);
            return stroke;
        },
        376: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AAeAAYgeAUAAAyAABQYAKBQAKDcAKJiYAKHCAKAeAyBkYA8BkBkBQBuAyYCWA8EiAeGuAKYEiAKCMgKD6geYC+geDcgeAUgUYAegKAKgoAAgyYAAiCiChGkOgKYh4gKgUAAgeAUYhaA8goAKi+AeYhuAUh4AUgyAAYi+AelUgUiMgoYjShGgyhaAUmGYAKk2AejSBQigYAohaAAgogUgyYgegyiqigg8geYgygUhGAAgoAA").cp());
            stroke.setBounds(0, 0, 240, 198);
            return stroke;
        },
        377: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAgMAAKYjwBQhaAeiWAoYlABQlAAynWAyYmaAoAAAAgeAUYgnAyAABkAxAoYAeAUBugKDIgoYBagKCCgeBQgKYDcgeJ2hkDIgeYBkgUBkgKAUAAYA8AAAyAUAoAyYA8A8AUA8AABuYAACWhaH+hkFoYhkGQAUBGCqgKYBGAAAUgKAUgUYAegoAUhGAyjmYAoj6BQksAyiCYBGjSBkiqBkh4YBahkAUg8gohGYgeg8hag8jchuYiqhQgUgKg8AAYg8AAgeAAg8AK").cp());
            stroke.setBounds(0, 0, 283, 211);
            return stroke;
        },
        378: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AbqAAYgUAAhaAUhkAUYmuBQl8A8m4AyYi0AUhQAUgUAKYgxAoATBQBQAoYBGAoBkgKD6goYFKgyFygeISgoYC+gKCggKAUAAYAegKAegeAAgUYAAgoiqiWhGgeYgegKgyAAhGAA").cp());
            stroke.setBounds(0, 0, 217, 48);
            return stroke;
        },
        379: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AHWAKYhkA8haAejcBGYg8AKgJAeAJAeYAUAUBGgKCCgeYC+g8AoAAAeAKYAeAKAAAogeCMIgUBkIgeAKYg8AKkOBagKAKYgUAUAAAeAeAKYAUAKgKAKFKgyYB4gUB4gUAKgKYAKAAAAgUAAgKYAAgUgogogUAAYgUAAAAgKAehGYAUhaAUgeAog8YA8hGgKgUiChQYhkgogegJgyAT").cp());
            stroke.setBounds(0, 0, 77, 66);
            return stroke;
        },
        380: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfGAUYh4AoiMAeiMAKYgyAKhkAKhQAKYhGAKiWAUhkAUYhuAKjmAeiqAeYi0AUi0AUgeAKYhkAKgeAKgKAyYAAAyAAAeAeAUYAoAUAUAABagUYA8gUE2g8CWgUYBGgKDmgoDSgUYEOgoH0goAoAKYAeAAAeAeAKAeYAAAogUB4geBaIgUBGIiWAeYi0AomGBQhkAUYgyAAhkAUhQAKYhaAKhGAAgKAKYgKAAiWAKi0AUYi0AKigAUgKAAYgeAUAKAeA8A8YBkBQAAAADSgoYD6goCMgUEOgoYCCgUCWgUA8gKYBkgUGQgoCggKYBagKAoAAAKgKYAUAAAegoAAgKYAAgKgKgUgUgUIgegeIAohaYAog8AegoA8hGYBahQAKgegUgyYgKgehuhah4hQYhag7goAAiMAd").cp());
            stroke.setBounds(0, 0, 252, 108);
            return stroke;
        },
        381: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AfaAUYiWAohuAUjIAeYhuAKiCAUgyAKYg8AKiCAKhuAUYhuAKi0AehuAKYhuAUiWAUhGAKYjSAUgKAKgKA8YAAAoAAAKAKAUYAUAoAeAAB4gUYE2hGIShQHCgyYAeAAAogKAUAAYAeAABugKBugKYDcgUAUAAAeA8YAUAegUBagyCWYgoCCAAA8AeAoYAeAUAKAKAyAAYA8AAAAgKAegUYAKgKAUgoAKgeYAoh4A8haBQhQYBahQAKgegUgyYgKgeigiChkg8YhQgegUgJh4Ad").cp());
            stroke.setBounds(0, 0, 252, 82);
            return stroke;
        },
        382: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AQuAKYgyAKh4AohkAeYjmBQh4AehuAAYhQAAgUAAhageYhugogogKAAAoYAAAoAoA8A8AeYBGAeCCAoBkAKYBkAUBQgKCMgoYBugoBugUAoAAYAoAAAKAKAUAUYAeAeAAAKAAAoYAACWiWEikiFyYiCCgiCCWiMB4YhGBGg8AyAAAKYgKAKAKAKAUAUYAyAoCqhGCqiMYFAkOCqiqC0jwYB4iqCWi0AygyYAUgUAogeAegUYAygoAygyAAgUYAAg8hGhaiChaYiqiChQgTi0Ad").cp());
            stroke.setBounds(0, 0, 171, 182);
            return stroke;
        },
        383: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ATEAAYgKAAiWAKigAAYmGAUiqAKiCAUYgyAUgyAKAAAAYgKAAAKAKAKAKYAUAUAAAAgUAAYgeAAAAAUAUAUYAAAKAAAAgUAKYgeAAAAAKAAAKYAAAUgKAKgUAAYgUAAgKAKAAAAYAAAeBQAyAoAAYAUAAAKAKAAAAYAAAKAKAAAUAAYAKAAAeAKAUAUYBQAoAeAKAUAAYAKgKAKAKAKAAYAKAKAUAAAygKYCCgeBkgKHWgUYM0geJiAUGuBaYAyAKAyAKAKAAYAAAAAAgUAAgKYgKgKAKgKAUgKYAUgKAUgUAAgKYAKgKAUgUAKgKYAUgKAAgKAAgUYAAgKAAgKAAAAYAUAAAAgUgUgKYgKgKgogKgegKYgeAAgogUgUgKYgUgUjmg8iMgUYjcgojmgUlAgUYjSAAngAAgeAA").cp());
            stroke.setBounds(0, 0, 332, 48);
            return stroke;
        },
        384: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("EAnYAAKYgUAKgeAegoAeYgeAogeAUgKAAYgUAAmaGuiqC+YhQBahaBkgeAeYgyA8hGBQhkB4YgeAygoAygKAKYgKAKgyA8goAyYgyA8goAyAAAAYgKAKgUAUgKAUYgUAegUAUAAAAYgKAKgUAUgKAeYgUAegUAUAAAAYgKAKgKAKgKAKYgKAeiMC0gyA8YgUAUgoA8goA8YgoAyg8BageAoYigDIkiHWAAAyYAAAUAAAAAoAAYAoAAAKAKAAAUYAAAKAAAUAUAAYAKAKAKAUAAAUYAAAUAAAAAyAAYAoAAAKAKAKAKYAAAKAKAAAKAAYAyAAAUAAAAAUYAAAUAAAAAUAAYAoAAAUgUAUgyYAKgUAUgoAKgUYAKgUA8haBGhkYCCjSAogyBah4YAogyA8hQAUgoYAyg8BQhuAyg8YAUgUA8haBkiMYAegeAyhGAogoYAegyBkh4BahuYBahuBkh4AegeYC0jcDSjcDSjSYDmjwAogygyAAYgoAAAKgKA8g8YAygoAUgogUAAYgKAAAAgKgKgKYAAgKgKgKgKAAYgUgKAAAAAAgUYAAgKgKgKgUAAYgUAAgKAAAAgKYAAAAgKgKgUAAYgoAKAAgKAAgUYAAgUgKgKgKAAYgUAAAAAAAAgUYAAgKgeAAgeAK").cp());
            stroke.setBounds(0, 0, 282, 336);
            return stroke;
        },
        385: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AGuAAYAAAAAAAKAAAKYAAAKgUAKgKAAYgUAAgeAKgKAKYgUAKAAAAgKgKYgKgKgKAAgeAKYgUAKgUAKAAgKYgKgKgKAKgeAKYgUAKgUAAgKAAYAAAAgUAAgKAKYgKAKAAAAgKgKYAAgKgKAAgUAAYgUAAgKAAgKAyYAAAyAAAAAKAeYAUAUAAAAgKAUYgKAKgKAUAAAKYAAAKA8BuBQCCYBQCCE2H0E2HqYEsHqEEGaAUAeYA8A8A8AKCgAAYB4gKAKAAAogUYAegUAegeAUgUcAA8gBaAUyghwAAKgAKYAAgKgKgUgUgKYgKAAgUgKAAAAYgKAUg8goAAgUYAKgKgKgKgegKYgegUgKgKAAgKYAKgKgKgKgegKYgUgKgUgUgKgKYAAAAgKgKgKgKYgKAAgKgKAAgUYAAgeAAAAg8AAYgoAKgUAKgUAUYgUAUgUAKgKAAYAAAAjcFykOHCYrQTOAyhQgUgKYAAgKhui+iCjcYiCjcj6maigkiYiqkiigkOgegoYgUgogegogUgKYgKAAgKAAAAAA").cp());
            stroke.setBounds(0, 0, 336, 268);
            return stroke;
        },
        386: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("ABaAUYgKAUgKAUAAAUYAAAegKAAgeAKYgUAAgKAKAAAAYAAAeAoDwAeBQYA8DwAeBkBuDcYAeBGAeA8AAAAYAAAAAeA8AeA8YCCDcDmEsDcDSYFUFKGuEYHCC+YAyAeBuAoBGAeYCqBGBkAoB4AeYB4AoAUAAAAgeYAAgUAUgeAegKYAKAAAKgKAAgKYAAgKAAgKAKAAYAAAAAKgKAAgKYAAgKAAgUAKAAYAUgUgygegygUYhGgKi0hGh4gyYqekOommumGomYhGhah4jSAAgKYAAAAgegygeg8Ygyh4g8iCgehkYgoh4hGkEgKh4YgUhagUgogUAeYgKAUhGgUgKgKYgKgKgKgKgUAAYgKAAgKAAgKgKYAAgKgUgKgeAAYgUAAgegKgKgUYgUgKgKAAgeAU").cp());
            stroke.setBounds(0, 0, 306, 310);
            return stroke;
        },
        387: function(defaultColor) {
            var stroke = new createjs.Shape(new createjs.Graphics().f(defaultColor).p("AEYAAYgKAKAAAUAAAUYgKAoAAAKgeAKYgeAAgKAUgKAUYAAAUgKAKAAgKYgKgKAAAAgoAKYgeAKAAAAAAAeYAKAKgKAKAAAAYgKAAAAAKAAAKYAAAKgKAUgUAKYgKAKgKAUAKAKYAAAAgKAKgKAAYgdAAAJBGAeAeYAoAeAAAAgUAKYgKAKAAAKAAAUYAKAUBGAoAoAAYAKAAAKAAAAAKYAKAKAAAAAKgKYAKAAAUAKAUAKYAoAeBGAeAeAKYAeAABGAUAKAUYAKAAAKAKAKAAYAKAAAKAAAAAKYAKAKAygKAegeYAKgKAKgKAKAAYAKAAAKgKAAgKYAKgUAKgUAUgKYAUgUAKgKAAgKYgKAAAAgKAKgKYAKgKAAgKgKgKYgUgeAeg8AegeYAUgKAKgKgKgKYAAAAAAgKAKAAYAAAAAKgKAAgKYAAgUgogUgKAUYgUAUAAgeAKgeYAegygKgUg8gKYgegKAAAAAKgoYAAgUAAgKgUgUYgUgKgKAAAAAUYgKAKAAAAgUgUYgKgKgUgKgKAAYgUAAgygeAAgKYAAAAgegKgeAAYgogKgegKgKAAYAAgKgeAAgKAAYgUAAgUgKgKAAYAAAAgKAAgKAA").cp());
            stroke.setBounds(0, 0, 89, 77);
            return stroke;
        }
    };

    return strokes;
});
/**
 * @module Skritter
 * @submodule Model
 * @param Strokes
 * @author Joshua McFarland
 */
define('models/Assets',[
    'Strokes'
], function(Strokes) {
    /**
     * @class Assets
     */
    var Assets = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Assets.audioPlayer = new Audio();
            Assets.strokeShapes = {};
        },
        /**
         * Plays an audio file using the native HTML5 audio element.
         * 
         * @method getAudio
         * @param {String} audioId
         * @return {Object}
         */
        getAudio: function(audioId) {
            if (Assets.audioPlayer.paused) {
                Assets.audioPlayer.src = skritter.api.get('root') + '.' + skritter.api.get('domain') + '/' + 'sounds?file=' + audioId;
                Assets.audioPlayer.play();
            }
            return Assets.audioPlayer;
        },
        /**
         * Returns a stroke in the form of a sprite from the preloaded spritesheet.
         * 
         * @method getStroke
         * @param {String} bitmapId
         * @param {String} color
         * @return {Sprite}
         */
        getStroke: function(bitmapId, color) {
            color = (color) ? color : '#000000';
            return Strokes[bitmapId](color).clone();
        }
    });

    return Assets;
});
/**
 * This class module contains numerous helper functions that are used throughout the application.
 * Additional functions used repeatedly shoud also be stored here. They are stored in the global skritter namespace.
 * 
 * @module Skritter
 * @class Functions
 * @author Joshua McFarland
 */
define('Functions',[],function() {
    /**
     * @method bytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    var bytesToSize = function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0)
            return '';
        var i = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    };
    
    /**
     * @method concatObjectArray
     * @param {Array} objectArray1
     * @param {Array} objectArray2
     * @returns {Array}
     */
    var concatObjectArray = function(objectArray1, objectArray2) {
        return Array.isArray(objectArray1) ? objectArray1.concat(objectArray2) : undefined;
    };
    
    /**
     * @method extractCJK
     * @param {String} value
     * @returns {Array}
     */
    var extractCJK = function(value) {
        return value.match(/[\u4e00-\u9fcc]|[\u3400-\u4db5]/gi);
    };
    
    /**
     * @method getAngle
     * @param {Array} points An array of point values
     * @return {Number} The angle formed by the first and last points
     */
    var getAngle = function(points) {
        var point1 = points[0];
        var point2 = points[points.length - 1];
        var xDiff = point2.x - point1.x;
        var yDiff = point2.y - point1.y;
        return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    };
    
    /**
     * @method getBoundingRectangle
     * @param {Array} points An array of point values
     * @param {Number} areaWidth The width of the canvas area
     * @param {Number} areaHeight The height of the canvas area
     * @param {Number} pointRadius The radius of
     * @return {Object} The bounds of the calculated rectangle
     */
    var getBoundingRectangle = function(points, areaWidth, areaHeight, pointRadius) {
        var left = areaWidth;
        var top = 0.0;
        var right = 0.0;
        var bottom = areaHeight;

        for (var i in points) {
            var x = points[i].x;
            var y = points[i].y;
            if (x - pointRadius < left)
                left = x - pointRadius;
            if (y + pointRadius > top)
                top = y + pointRadius;
            if (x + pointRadius > right)
                right = x + pointRadius;
            if (y - pointRadius < bottom)
                bottom = y - pointRadius;
        }

        var width = right - left;
        var height = top - bottom;
        var center = {x: width / 2, y: height / 2};

        return {x: left, y: bottom, w: width, h: height, c: center};
    };

    /**
     * @method getDistance
     * @param {Point} point1
     * @param {Point} point2
     * @return {Number} The distance between the first and last points
     */
    var getDistance = function(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;
        var ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
    };

    /**
     * @method getLineDeviation
     * @param {Point} start The starting point of a line segment
     * @param {Point} end The ending point of a line segment
     * @param {Point} point Point to measure distance from the line segment
     * @return {Number} The distance from the point and line segment
     */
    var getLineDeviation = function(start, end, point) {
        var px = end.x - start.x;
        var py = end.y - start.y;
        var segment = (px * px) + (py * py);
        var z = ((point.x - start.x) * px + (point.y - start.y) * py) / parseFloat(segment);
        if (z > 1) {
            z = 1;
        } else if (z < 0) {
            z = 0;
        }
        var x = start.x + z * px;
        var y = start.y + z * py;
        var dx = x - point.x;
        var dy = y - point.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    };
    
    /**
     * @method getMySqlDateFormat
     * @param {Number} unixTime
     * @returns {String}
     */
    var getMySqlDateFormat = function(unixTime) {
        var date = (unixTime) ? new Date(unixTime * 1000) : new Date();
        var dateString = date.getUTCFullYear() + '-' +
                pad((date.getUTCMonth() + 1), '0', 2) + '-' +
                pad(date.getUTCDate(), '0', 2) + ' ' +
                pad(date.getUTCHours(), '0', 2) + ':' +
                pad(date.getUTCMinutes(), '0', 2) + ':' +
                pad(date.getUTCSeconds(), '0', 2);
        return dateString;
    };
    
    /**
     * @method getPressurizedStrokeSize
     * @param {Number} strokeSize
     * @param {Point} point1
     * @param {Point} point2
     * @returns {Number}
     */
    var getPressurizedStrokeSize = function(point1, point2, strokeSize) {
        strokeSize = (strokeSize) ? strokeSize : 18;
        var speed = getDistance(point1, point2);
        if (speed < 15) {
           strokeSize *= 1.00; 
        } else if (speed < 20) {
           strokeSize *= 0.95; 
        } else if (speed < 25) {
           strokeSize *= 0.90; 
        } else if (speed < 30) {
           strokeSize *= 0.85; 
        } else if (speed < 35) {
           strokeSize *= 0.80; 
        } else {
           strokeSize *= 0.75; 
        }
        return strokeSize;
    };
    
    /**
     * @getRandomInt
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    /**
     * @method getUnixTime
     * @param {Boolean} milliseconds If true then the returned time will include milliseconds
     * @return {Number} The current unix time
     */
    var getUnixTime = function(milliseconds) {
        var date = new Date();
        if (milliseconds) {
            return date.getTime();
        }
        return Math.round(date.getTime() / 1000);
    };

    /**
     * Takes a the first character from a string and return whether it is a kana character.
     * 
     * NOTE: It's also currently checking for the unicode tilde because those need to be filtered
     * out of Japanese writings as well. For Chinese it's also filtering out periods, but I don't
     * think they are actually an issue when it comes to rune prompts.
     * 
     * @method isKana
     * @param {String} character
     * @returns {Boolean}
     */
    var isKana = function(character) {
        var charCode = character.charCodeAt(0);
        return (charCode > 12352 && charCode < 12438) || (charCode > 12449 && charCode < 12538) || charCode === 65374 || charCode === 46;
    };
    
    /**
     * @method isLocal
     * @returns {Boolean}
     */
    var isLocal = function() {
        var hostname = document.location.hostname || window.location.hostname || location.hostname;
        if (hostname === 'html5.skritter.com' || hostname === 'html5.skritter.cn')
            return false;
        return true;
    };
    
    /**
     * @method isMobile
     * @returns {Boolean}
     */
    var isMobile = function() {
        if (navigator.userAgent.match(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i))
            return true;
        return false;
    };

    /**
     * @method maskText
     * @param {String} text The text to be masked
     * @param {String} value The value in the text to mask
     * @param {String} mask The mask to apply to the contained values
     * @return {String} The text with the specied value masked
     */
    var maskCharacters = function(text, value, mask) {
        text = '' + text;
        value = '' + value;
        mask = '' + mask;
        var chars = value.split('');
        for (var i in chars) {
            var expression = new RegExp(chars[i], 'gi');
            text = text.replace(expression, mask);
        }
        return text;
    };
    
    /**
     * @method pad
     * @param {String} text The text requiring padding
     * @param {String} value The value to be applied as padding
     * @param {Number} size The number of spaces of padding to be applied
     * @return {String}
     */
    var pad = function(text, value, size) {
        value = '' + value;
        var string = text + '';
        while (string.length < size)
            string = value + '' + string;
        return string;
    };
    
    /**
     * @method sortAlphabetically
     * @param {Array} array
     * @param {String} field
     * @param {Boolean} descending
     * @returns {Array}
     */
    var sortAlphabetically = function(array, field, descending) {
        return array.sort(function(a, b) {
            if (descending) {
                if (a[field] > b[field])
                    return -1;
                if (a[field] < b[field])
                    return 1;
            } else {
                if (a[field] < b[field])
                    return -1;
                if (a[field] > b[field])
                    return 1;
            }
            return 0;
        });
    };
    
    /**
     * Returns a Bootstrap alert of the given level containing the given text.
     * 
     * @method twbsAlertHTML
     * @param {String} level One of {success, info, warning, danger}
     * @param {String} text The alert text to be displayed
     */
    var twbsAlertHTML = function(level, text) {
        return "<div class='alert alert-" + level + "'>" +
                "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                text +
                "</div>";
    };

    return {
        bytesToSize: bytesToSize,
        concatObjectArray: concatObjectArray,
        extractCJK: extractCJK,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getLineDeviation: getLineDeviation,
        getMySqlDateFormat: getMySqlDateFormat,
        getPressurizedStrokeSize: getPressurizedStrokeSize,
        getRandomInt: getRandomInt,
        getUnixTime: getUnixTime,
        isKana: isKana,
        isLocal: isLocal,
        isMobile: isMobile,
        maskCharacters: maskCharacters,
        pad: pad,
        sortAlphabetically: sortAlphabetically,
        twbsAlertHTML: twbsAlertHTML
    };
});

/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/storage/IndexedDBAdapter',[],function() {
    var IndexedDBAdapter = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            IndexedDBAdapter.this = this;
            IndexedDBAdapter.database = null;
            IndexedDBAdapter.databaseName = null;
            IndexedDBAdapter.databaseVersion = 1;
        },
        /**
         * @method count
         * @param {String} tableName
         * @param {Function} callback
         * @returns {undefined}
         */
        count: function(tableName, callback) {
            var promise = $.indexedDB(IndexedDBAdapter.databaseName).objectStore(tableName).count();
            promise.done(function(count) {
                callback(count);
            });
            promise.fail(function(error) {
                console.error(tableName, error);
            });
        },
        /**
         * @method deleteDatabase
         * @param {Function} callback
         * @returns {undefined}
         */
        deleteDatabase: function(callback) {
            var promise = IndexedDBAdapter.database.deleteDatabase();
            promise.done(function() {
                if (typeof callback === 'function')
                    callback();
            });
            promise.fail(function(error) {
                console.error(error);
            });
        },
        /**
         * @method openDatabase
         * @param {String} databaseName
         * @param {Function} callback
         * @returns {undefined}
         */
        openDatabase: function(databaseName, callback) {
            IndexedDBAdapter.databaseName = databaseName;
            var promise = $.indexedDB(IndexedDBAdapter.databaseName, {
                version: IndexedDBAdapter.databaseVersion,
                schema: {
                    1: function(transaction) {
                        transaction.createObjectStore('decomps', {keyPath: 'writing'});
                        transaction.createObjectStore('items', {keyPath: 'id'});
                        transaction.createObjectStore('reviews', {keyPath: 'id'});
                        transaction.createObjectStore('sentences', {keyPath: 'id'});
                        transaction.createObjectStore('strokes', {keyPath: 'rune'});
                        transaction.createObjectStore('srsconfigs', {keyPath: 'part'});
                        transaction.createObjectStore('vocabs', {keyPath: 'id'});
                    }
                }
            });
            promise.done(function(event) {
                IndexedDBAdapter.database = promise;
                if (event.objectStoreNames.length < 1) {
                    IndexedDBAdapter.this.deleteDatabase(function() {
                        IndexedDBAdapter.this.openDatabase(databaseName, callback);
                    });
                } else {
                    callback();
                }
            });
            promise.fail(function(error) {
                console.error(databaseName, error);
            });
        },
        /**
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         * @returns {undefined}
         */
        getAll: function(tableName, callback) {
            var items = [];
            var table = IndexedDBAdapter.database.objectStore(tableName);
            var promise = table.each(function(item) {
                items.push(item.value);
            });
            promise.done(function() {
                callback(items);
            });
            promise.fail(function(error) {
                console.error(tableName, error);
                callback(items);
            });
        },
        /**
         * @method getItems
         * @param {String} tableName
         * @param {Arrau} keys
         * @param {Function} callback
         * @returns {undefined}
         */
        getItems: function(tableName, keys, callback) {
            var position = 0;
            var items = [];
            var table = IndexedDBAdapter.database.objectStore(tableName);
            keys = Array.isArray(keys) ? keys : [keys];
            keys = _.remove(keys, undefined);
            getNext();
            function getNext() {
                if (position < keys.length) {
                    var promise = table.get(keys[position]);
                    promise.done(function(item) {
                        position++;
                        if (item)
                            items.push(item);
                        getNext();
                    });
                    promise.fail(function(error) {
                        console.error(tableName, keys[position], error);
                    });
                } else {
                    callback(items);
                }
            }
        },
        /**
         * @method getItemsWhere
         * @param {String} tableName
         * @param {String} attribute
         * @param {String} value
         * @param {Function} callback
         */
        getItemsWhere: function(tableName, attribute, value, callback) {
            var items = [];
            var table = IndexedDBAdapter.database.objectStore(tableName);
            var promise = table.each(function(item) {
                if (item.value[attribute] === value)
                    items.push(item.value);
            });
            promise.done(function() {
                callback(items);
            });
            promise.fail(function(error) {
                console.error(tableName, error);
            });
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var items = [];
            var table = IndexedDBAdapter.database.objectStore('items');
            var promise = table.each(function(item) {
                if (item.value.vocabIds.length > 0) {
                    var splitId = item.value.id.split('-');
                    items.push({
                        base: splitId[1] + '-' + splitId[2] + '-' + splitId[3],
                        id: item.value.id,
                        last: (item.value.last) ? item.value.last : 0,
                        next: item.value.next,
                        part: item.value.part,
                        style: item.value.style,
                        vocabIds: item.value.vocabIds
                    });
                }
            });
            promise.done(function() {
                callback(items);
            });
            promise.fail(function(error) {
                console.error('schedule', error);
                callback();
            });
        },
        /**
         * @method removeItems
         * @param {String} tableName
         * @param {Array} keys
         * @param {Function} callback
         * @returns {undefined}
         */
        removeItems: function(tableName, keys, callback) {
            var position = 0;
            var table = IndexedDBAdapter.database.objectStore(tableName);
            keys = Array.isArray(keys) ? keys : [keys];
            removeNext();
            function removeNext() {
                if (position < keys.length) {
                    var promise = table.delete(keys[position]);
                    promise.done(function() {
                        position++;
                        removeNext();
                    });
                    promise.fail(function(error) {
                        console.error(tableName, keys[position], error);
                    });
                } else {
                    if (typeof callback === 'function')
                        callback();
                }
            }
        },
        /**
         * @method setItems
         * @param {String} tableName
         * @param {Array} items
         * @param {Function} callback
         * @returns {undefined}
         */
        setItems: function(tableName, items, callback) {
            var position = 0;
            var table = IndexedDBAdapter.database.objectStore(tableName);
            items = Array.isArray(items) ? items : [items];
            setNext();
            function setNext() {
                if (position < items.length) {
                    var promise = table.put(items[position]);
                    promise.done(function() {
                        position++;
                        setNext();
                    });
                    promise.fail(function(error) {
                        console.log('tableName: ' + error);
                        console.error(tableName, items[position], error);
                    });
                } else {
                    if (typeof callback === 'function')
                        callback();
                }
            }
        }
    });

    return IndexedDBAdapter;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('Log',[],function() {
    /**
     * @class Log
     */
    function Log() {
        Log.key = 'LzHnQTQNkfsT2e4aA4Hlkj6I';
    }
    /**
     * @method access
     */
    Log.prototype.access = function () {
        var promise = $.ajax({
            url: 'log/access.php',
            type: 'POST',
            dataType: 'json',
            data: {
                key: Log.key,
                user_id: skritter.user.getSetting('id'),
                date: skritter.fn.getMySqlDateFormat(),
                version: skritter.settings.get('version'),
                user_agent: navigator.userAgent
            }
        });
        promise.done(function(data) {
            console.log(data);
        });
        promise.fail(function(error) {
            console.error(error);
        });
    };
    /**
     * @method user
     */
    Log.prototype.user = function () {
        var settings = _.clone(skritter.user.get('settings'));
        settings.created = skritter.fn.getMySqlDateFormat(settings.created);
        settings.anonymous = (settings.anonymous) ? 1 : 0;        
        var promise = $.ajax({
            url: 'log/user.php',
            type: 'POST',
            dataType: 'json',
            data: {
                key: Log.key,
                settings: JSON.stringify(settings)
            }
        });
        promise.done(function(data) {
            console.log(data);
        });
        promise.fail(function(error) {
            console.error(error);
        });
    };
    return Log;
});
/**
 * @license RequireJS text 2.0.10 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('require.text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.10',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                errback(e);
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes,
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

define('require.text!templates/modals.html',[],function () { return '<!-- /MODAL: default -->\r\n<div class="modal fade modal-vertical-centered" id="default" tabindex="-1" role="dialog" aria-labelledby="default" aria-hidden="true">\r\n    <div class="modal-dialog">\r\n        <div class="modal-content">\r\n            <div class="modal-header">\r\n                <h4 class="modal-title" id="label-default"></h4>\r\n            </div>\r\n            <div class="modal-body text-center"></div>\r\n        </div><!-- /.modal-content -->\r\n    </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n\r\n<!-- /MODAL: confirm -->\r\n<div class="modal fade modal-vertical-centered" id="confirm" tabindex="-1" role="dialog" aria-labelledby="confirm" aria-hidden="true">\r\n    <div class="modal-dialog">\r\n        <div class="modal-content">\r\n            <div class="modal-header">\r\n                <h4 class="modal-title" id="label-confirm"></h4>\r\n            </div>\r\n            <div class="modal-body text-center"></div>\r\n            <div class="modal-footer">\r\n                <button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>\r\n            </div>\r\n        </div><!-- /.modal-content -->\r\n    </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n\r\n<!-- /MODAL: default -->\r\n<div class="modal fade modal-vertical-centered" id="add-items" tabindex="-1" role="dialog" aria-labelledby="add-items" aria-hidden="true">\r\n    <div class="modal-dialog">\r\n        <div class="modal-content">\r\n            <div class="modal-header">\r\n                <h4 class="modal-title" id="label-add-items"></h4>\r\n            </div>\r\n            <div class="modal-body text-center">\r\n                <input id="quantity" type="number" name="quantity" min="1" max="40" value="1">\r\n                <button id="add-button" type="button" class="btn btn-sm btn-success" data-dismiss="modal">Add</button>\r\n                <button id="cancel-button" type="button" class="btn btn-sm" data-dismiss="modal">Cancel</button>\r\n            </div>\r\n        </div><!-- /.modal-content -->\r\n    </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n\r\n<!-- /MODAL: progress -->\r\n<div class="modal fade modal-vertical-centered" id="progress" tabindex="-1" role="dialog" aria-labelledby="progress" aria-hidden="true">\r\n    <div class="modal-dialog">\r\n        <div class="modal-content">\r\n            <div class="modal-header">\r\n                <div class="pull-right"><span class="modal-progress-text" style="display:inline-block; vertical-align:middle"></span></div>\r\n                <h4 class="modal-title" id="label-progress"></h4>\r\n            </div>\r\n            <div class="modal-body">\r\n                <div class="progress progress-striped active">\r\n                    <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">\r\n                        <span class="sr-only">100% Complete</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div><!-- /.modal-content -->\r\n    </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->\r\n\r\n<!-- /MODAL: login -->\r\n<div class="modal fade modal-vertical-centered" id="login" tabindex="-1" role="dialog" aria-labelledby="login" aria-hidden="true">\r\n    <div class="modal-dialog">\r\n        <div class="modal-content">\r\n            <div class="modal-body text-center">\r\n                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\r\n                <form class="form-signin">\r\n                    <h2 class="form-signin-heading">Please log in</h2>\r\n                    <input id="login-username" type="text" class="form-control" placeholder="Username" value="mcfarljwtest1" required autofocus>\r\n                    <input id="login-password" type="password" class="form-control" placeholder="Password" value="bd6e182631" required>\r\n                    <button id="login-button" class="btn btn-primary">Log In</button>\r\n                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\r\n                    <div id="error-message"></div>\r\n                </form>\r\n            </div>\r\n        </div><!-- /.modal-content -->\r\n    </div><!-- /.modal-dialog -->\r\n</div><!-- /.modal -->';});

/**
 * @module Skritter
 * @submodule Component
 * @param templateModals
 * @author Joshua McFarland
 */
define('views/components/Modal',[
    'require.text!templates/modals.html'
], function(templateModals) {
    /**
     * @class Modal
     */
    var Modal = Backbone.View.extend({
        /**
         * @method initialze
         */
        initialize: function() {
            Modal.this = this;
            Modal.element = null;
            Modal.id = null;
            Modal.options = null;
            this.$el.on('show.bs.modal', function() {
                if (Modal.this.$el.children().hasClass('in')) {
                    Modal.this.$el.children('.in').modal('hide').one('hidden.bs.modal', function() {
                        Modal.this.$(Modal.element).modal(Modal.options);
                    });
                    return false;
                }
            });
        },
        el: this.$('#modal-container'),
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateModals);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Modal #login #login-button': 'handleLogin',
            'click.Model #add-items #add-button': 'triggerAddItemsClicked'
        },
        /**
         * @method handleLogin
         * @param {Object} event
         */
        handleLogin: function(event) {
            event.preventDefault();
            var username = this.$(event.target.parentNode).children('#login-username').val();
            var password = this.$(event.target.parentNode).children('#login-password').val();
            this.show('default', function() {
                skritter.user.login(username, password, function(result) {
                    if (result.statusCode === 200) {
                        document.location.href = '';
                    } else {
                        Modal.this.$('#login #error-message').html(skritter.fn.twbsAlertHTML('warning', result.message));
                        Modal.this.show('login');
                    }
                });
            }).setBody('Logging In').noHeader();
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        hide: function(callback) {
            this.$(Modal.element).modal('hide').one('hidden.bs.modal', callback);
            return this;
        },
        /**
         * @method noBody
         * @returns {Backbone.View}
         */
        noBody: function() {
            this.$('.modal-body').hide();
            return this;
        },
        /**
         * @method noHeader
         * @returns {Backbone.View}
         */
        noHeader: function() {
            this.$('.modal-header').hide();
            return this;
        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            return this;
        },
        /**
         * @method setBody
         * @param {String} text
         * @returns {Backbone.View}
         */
        setBody: function(text) {
            this.$('#' + Modal.id + ' .modal-body').html(text);
            return this;
        },
        /**
         * @method setProgress
         * @param {Number} percent
         * @param {String} text
         * @returns {Backbone.View}
         */
        setProgress: function(percent, text) {
            percent = (percent === 0) ? '0' : percent;
            if (percent) {
                this.$('#' + Modal.id + ' .progress-bar').width(percent + '%');
                this.$('#' + Modal.id + ' .progress-bar .sr-only').text(percent + '% Complete');
            }
            if (text)
                this.$('#' + Modal.id + ' .modal-progress-text').text(text);
            return this;
        },
        /**
         * @method setTitle
         * @param {String} text
         * @returns {Backbone.View}
         */
        setTitle: function(text) {
            this.$('#' + Modal.id + ' .modal-title').html(text);
            return this;
        },
        /**
         * @method show
         * @param {String} id
         * @param {Function} callback
         * @param {Object} options
         * @returns {Backbone.View}
         */
        show: function(id, callback, options) {
            id = (id) ? id : 'default';
            options = (options) ? options : {};
            options.backdrop = (options.backdrop) ? options.backdrop : 'static';
            options.keyboard = (options.keyboard) ? options.keyboard : false;
            options.show = (options.show) ? options.show : true;
            options.remote = (options.remote) ? options.remote : false;
            Modal.id = id;
            Modal.options = options;
            Modal.element = this.$('#' + id).modal(options).one('shown.bs.modal', callback);
            this.$(Modal.element).children('.modal-content').show();
            this.reset();
            return this;
        },
        /**
         * @method triggerButtonClicked
         */
        triggerAddItemsClicked: function() {
            this.trigger('addItemsClicked', this.$('#add-items #quantity').val());
        }
    });

    return Modal;
});
define('require.text!templates/home-logged-in.html',[],function () { return '<div id="home-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a href="#study"><span class="fa fa-navbar fa-pencil"></span> Study</a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a class="options-button" href="#options"><span class="fa fa-navbar fa-gear"></span> Options</a></li>\r\n                    <li><a class="logout-button" href=""><span class="fa fa-navbar fa-power-off"></span> Logout</a></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class="container">\r\n        <div class="row content">\r\n            <div id="notification"></div>\r\n            <div class="col-md-6">\r\n                <div class="media">\r\n                    <a class="pull-left" href="#">\r\n                        <span id="user-avatar" class="media-object"></span>\r\n                    </a>\r\n                    <div class="media-body">\r\n                        <h4 class="media-heading">Overview</h4>\r\n                        <p><strong><span class="user-name"></span></strong>, you currently have <strong><span id="user-items-due"></span></strong> items ready to review.</p>\r\n                        <a class="btn btn-primary link-button" data-fragment="study" href="#study" role="button">Study</a>\r\n                        <a class="btn btn-primary sync-button" role="button">\r\n                            Sync <span id="user-unsynced-reviews"></span>\r\n                        </a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div id="active-lists" class="col-md-6">\r\n                <h4><span class="fa fa-edit"></span>My Lists (<a href="#vocab/list">Manage</a>)</h4>\r\n                <div id="table-container"></div>\r\n            </div>\r\n\r\n        </div>\r\n        <div class="row">\r\n            <div class="col-md-6 content">\r\n                <div class="media">\r\n                    <a class="pull-left" href="https://github.com/mcfarljw/skritter-html5">\r\n                        <img id="github-logo" class="media-object" src="images/github-logo.png" alt="">\r\n                    </a>\r\n                    <div class="media-body">\r\n                        <h4 class="media-heading">Help out on GitHub!</h4>\r\n                        <p><a href="https://github.com/mcfarljw/skritter-html5/issues"><strong>Click here</strong></a> to submit issues and even help contribute to the project.</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="col-md-6"></div>\r\n        </div>\r\n    </div>\r\n</div>';});

define('require.text!templates/home-logged-out.html',[],function () { return '<div id="home-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a class="cursor login-button">Log In</a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container">\r\n        <div id="introduction" class="content row">\r\n            <div class="col-md-3">\r\n                <img src="images/skritter-logo.png" alt="">\r\n            </div>\r\n            <div class="col-md-9">\r\n                <h2>Learn to Write Chinese and Japanese Characters.</h2>\r\n                <p><strong>Skritter</strong> is a tool for learning Chinese and Japanese writing with stroke-level feedback, tone practice, audio playback, definition practice, and progress feedback.</p>\r\n            </div>\r\n        </div>\r\n        <!--<div id="features" class="row">\r\n            <div class="col-md-6 content">\r\n                <div id="canvas-container"></div>\r\n            </div>\r\n        </div>-->\r\n    </div>\r\n</div>';});

define('require.text!templates/vocab-lists-table.html',[],function () { return '<table id="vocab-lists-table" class="table table-hover">\r\n    <thead></thead>\r\n    <tbody></tbody>\r\n</table>\r\n<div id="message" class="text-center" style="display: none;"></div>\r\n<div id="loader" class="text-center"><img src="images/ajax-loader.gif" alt=""></div>';});

/**
 * @module Skritter
 * @param templateVocabListsTable
 * @author Joshua McFarland
 */
define('views/vocabs/VocabListsTable',[
    'require.text!templates/vocab-lists-table.html'
], function(templateVocabListsTable) {
    /**
     * @class VocabListsTable
     */
    var VocabListsTable = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabListsTable.this = this;
            VocabListsTable.fieldNameMap = {};
            VocabListsTable.lists = [];
            VocabListsTable.sortType = 'studying';
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListsTable);
            var divHead = '';
            var divBody = '';
            VocabListsTable.this.$('#message').text('');
            VocabListsTable.this.$('#loader').show();
            VocabListsTable.this.$('table thead').html(divHead);
            VocabListsTable.this.$('table tbody').html(divBody);
            if (!VocabListsTable.lists) {
                VocabListsTable.this.$('#message').show().text("Unable to load lists due to being offline.");
            } else if (VocabListsTable.lists.length === 0) {
                VocabListsTable.this.$('#message').show().text("You haven't added any lists yet!");
            } else {
                //generates the header section of the table
                divHead += "<tr>";
                for (var a in VocabListsTable.fieldNameMap)
                    divHead += "<th>" + VocabListsTable.fieldNameMap[a] + "</th>";
                divHead += "</tr>";
                //generates the body section of the table
                for (var b in VocabListsTable.lists) {
                    var list = VocabListsTable.lists[b];
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in VocabListsTable.fieldNameMap)
                        divBody += "<td class='list-field-" + field + "'>" + list.get(field) + "</td>";
                    divBody += "</tr>";
                }
            }
            VocabListsTable.this.$('table thead').html(divHead);
            VocabListsTable.this.$('table tbody').html(divBody);
            VocabListsTable.this.$('#loader').hide();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.VocabListsTable #vocab-lists-table .list-field-name': 'selectList'
        },
        /**
         * @method load
         * @param {String} sortType
         * @param {Array} fieldNameMap
         * @param {Array} filterStatus
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        load: function(sortType, fieldNameMap, filterStatus, callback) {
            VocabListsTable.fieldNameMap = fieldNameMap;
            VocabListsTable.sortType = sortType;
            skritter.lists.load(sortType, fieldNameMap, function(lists) {
                lists = lists.filter(function(list) {
                    if (!filterStatus || _.contains(filterStatus, list.get('studyingMode')))
                        return true;
                });
                VocabListsTable.lists = lists;
                VocabListsTable.this.render();
                if (typeof callback === 'function')
                    callback();
            });
            return this;
        },
        /**
         * @method selectList
         * @param {Object} event
         */
        selectList: function(event) {
            var listId = event.currentTarget.parentElement.id.replace('list-', '');
            skritter.router.navigate('vocab/list/' + listId, {trigger: true});
            event.preventDefault();
        }
    });

    return VocabListsTable;
});
/**
 * @module Skritter
 * @submodule Views
 * @param templateIn
 * @param templateOut
 * @param VocabListsTable
 * @author Joshua McFarland
 */
define('views/Home',[
    'require.text!templates/home-logged-in.html',
    'require.text!templates/home-logged-out.html',
    'views/vocabs/VocabListsTable'
], function(templateIn, templateOut, VocabListsTable) {
    /**
     * @class HomeView
     */
    var Home = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Home.this = this;
            Home.lists = new VocabListsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateIn);
                this.$('#user-avatar').html(skritter.user.getAvatar('img-circle'));
                this.$('.user-name').text(skritter.user.getSetting('name'));
                Home.lists.setElement(this.$('#active-lists #table-container')).load('studying', {
                    'name': 'Name',
                    'studyingMode': 'Status'
                }, ['adding', 'reviewing']);
                this.listenTo(skritter.scheduler, 'change:schedule', this.updateDueCount);
                this.listenTo(skritter.sync, 'change:active', this.updateSyncStatus);
                this.updateDueCount();
                this.updateSyncStatus();
            } else {
                this.$el.html(templateOut);
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home #home-view .login-button': 'handleLoginClicked',
            'click.Home #home-view .logout-button': 'handleLogoutClicked',
            'click.Home #home-view .options-button': 'handleOptionsClicked',
            'click.Home #home-view .sync-button': 'handleSyncClicked'
        },
        handleLoginClicked: function(event) {
            skritter.modal.show('login');
            event.preventDefault();
        },
        handleLogoutClicked: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        handleOptionsClicked: function(event) {
            skritter.router.navigate('options', {trigger: true});
            event.preventDefault();
        },
        handleSyncClicked: function() {
            skritter.user.sync();
        },
        updateDueCount: function() {
            Home.this.$('#user-items-due').text(skritter.scheduler.getDueCount());
        },
        updateSyncStatus: function() {
            if (skritter.sync.isSyncing())  {
                Home.this.$('.sync-button').html('Syncing...');
                Home.this.$('.sync-button').addClass('disabled');
            } else {
                Home.this.$('.sync-button').html('Sync');
                Home.this.$('.sync-button').removeClass('disabled');
            }
        }
    });

    return Home;
});
define('require.text!templates/options.html',[],function () { return '<div id="options-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a id="save-button" href="#"><i class="fa fa-navbar fa-check"></i> Save</a></li>\r\n                        <li><a href="#"><i class="fa fa-navbar fa-ban"></i> Cancel</a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container content">\r\n        <h1>Studying</h1>\r\n        <div class="row">\r\n            <div class="col-sm-6">\r\n                <form id="parts" role="form">\r\n                    <h3>Parts <button type="reset" class="btn btn-xs btn-default">Enable All</button></h3>\r\n                    <div class="form-group">\r\n                        <label class="control-label" for="parts-definition">Definition</label>\r\n                        <input id="parts-definition" type="checkbox" checked>\r\n                    </div>\r\n                        <div class="form-group">\r\n                        <label class="control-label" for="parts-reading">Reading</label>\r\n                        <input id="parts-reading" type="checkbox" checked>\r\n                    </div>\r\n                    <div class="form-group">\r\n                        <label class="control-label" for="parts-tone">Tone</label>\r\n                        <input id="parts-tone" type="checkbox" checked>\r\n                    </div>\r\n                        <div class="form-group">\r\n                        <label class="control-label" for="parts-writing">Writing</label>\r\n                        <input id="parts-writing" type="checkbox" checked>\r\n                    </div>\r\n                    \r\n                </form>\r\n            </div>\r\n            <div class="col-sm-6">\r\n                <form id="other" role="form">\r\n                    <h3>Other</h3>\r\n                    <div class="form-group">\r\n                        <label class="control-label" for="audio">Audio</label>\r\n                        <input id="audio" type="checkbox" checked>\r\n                    </div>\r\n                    <div class="form-group">\r\n                        <label class="control-label" for="heisig">Heisig Keywords</label>\r\n                        <input id="heisig" type="checkbox" checked>\r\n                    </div>\r\n                    <div class="form-group">\r\n                        <label class="control-label" for="hide-reading">Hide Reading</label>\r\n                        <input id="hide-reading" type="checkbox" checked>\r\n                    </div>\r\n                    <div class="form-group">\r\n                        <label class="control-label" for="squigs">Squigs</label>\r\n                        <input id="squigs" type="checkbox" checked>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>';});

/**
 * @module Skritter
 * @param templateOptions
 * @author Joshua McFarland
 */
define('views/Options',[
    'require.text!templates/options.html'
], function(templateOptions) {
    /**
     * @class OptionsView
     */
    var Options = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Options.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateOptions);
            this.$('input').bootstrapSwitch();
            this.load();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Options #options-view #save-button': 'save'
        },
        /**
         * @method load
         */
        load: function() {
            //parts
            var activeParts = skritter.user.getActiveParts();
            this.$('#parts-definition').bootstrapSwitch('setState', _.contains(activeParts, 'defn'));
            this.$('#parts-reading').bootstrapSwitch('setState', _.contains(activeParts, 'rdng'));
            this.$('#parts-tone').bootstrapSwitch('setState', _.contains(activeParts, 'tone'));
            this.$('#parts-writing').bootstrapSwitch('setState', _.contains(activeParts, 'rune'));
            //audio
            this.$('#audio').bootstrapSwitch('setState', skritter.user.get('audio'));
            //hide-reading
            this.$('#hide-reading').bootstrapSwitch('setState', skritter.user.getSetting('hideReading'));
            //squigs
            this.$('#squigs').bootstrapSwitch('setState', skritter.user.getSetting('squigs'));
            //heisig
            this.$('#heisig').bootstrapSwitch('setState', skritter.user.getSetting('showHeisig'));
        },
        /**
         * @method save
         * @param {Object} event
         */
        save: function(event) {
            event.preventDefault();
            //parts
            var activeParts = [];
            if (this.$('#parts-definition').bootstrapSwitch('state'))
                activeParts.push('defn');
            if (this.$('#parts-reading').bootstrapSwitch('state'))
                activeParts.push('rdng');
            if (this.$('#parts-tone').bootstrapSwitch('state'))
                activeParts.push('tone');
            if (this.$('#parts-writing').bootstrapSwitch('state'))
                activeParts.push('rune');
            if (activeParts.length === 0) {
                skritter.modal.show('confirm').noHeader().setBody('You need to select at least one part to study!');
                return false;
            } else {
                skritter.user.setActiveParts(activeParts);
            }
            //audio
            skritter.user.set('audio', this.$('#audio').bootstrapSwitch('state'));
            //hide-reading
            skritter.user.setSetting('hideReading', this.$('#hide-reading').bootstrapSwitch('state'));
            //squigs
            skritter.user.setSetting('squigs', this.$('#squigs').bootstrapSwitch('state'));
            //heisig
            skritter.user.setSetting('showHeisig', this.$('#heisig').bootstrapSwitch('state'));
            //ISSUE #117: scheduler needs to be reloaded on options save
            skritter.scheduler.loadAll(function() {
                if (skritter.view.study)
                    skritter.view.study.clearPrompt();
                skritter.router.navigate('/', {trigger: true, replace: true});
            });
        }
    });
    
    return Options;
});
define('require.text!templates/reviews.html',[],function () { return '<div id="reviews-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a href="#"><span class="fa fa-navbar fa-arrow-left"></span></a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container content">\r\n        <button id="refresh-button" type="button" class="btn btn-default btn-sm">Refresh</button>\r\n        <button id="sync-button" type="button" class="btn btn-sm btn-success">Sync</button>\r\n        <button id="delete-all-button" type="button" class="btn btn-danger btn-sm pull-right">Delete All</button>\r\n        <table id="reviews-table" class="table table-hover">\r\n            <thead>\r\n                <tr>\r\n                    <th>ID</th>\r\n                    <th>Score</th>\r\n                    <th>BearTime</th>\r\n                    <th>ReviewTime</th>\r\n                    <th>ThinkingTime</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody></tbody>\r\n        </table>\r\n    </div>\r\n</div>';});

/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('views/Reviews',[
    'require.text!templates/reviews.html'
], function(templateReviews) {
    /**
     * @class ReviewsView
     */
    var Reviews = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {  
            Reviews.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateReviews);
            this.refresh();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Reviews #reviews-view #delete-all-button': 'handleDeleteAllClicked',
            'click.Reviews #reviews-view #refresh-button': 'handleRefreshClicked',
            'click.Reviews #reviews-view #sync-button': 'handleSyncClicked'
        },
        /**
         * @method handleClearClicked
         * @param {Function} event
         */
        handleDeleteAllClicked: function(event) {            
            skritter.data.reviews.remove(skritter.data.reviews.toJSON());           
            this.refresh();
            event.preventDefault();
        },
        /**
         * @method handleRefreshClicked
         * @param {Function} event
         */
        handleRefreshClicked: function(event) {
            this.refresh();
            event.preventDefault();
        },
        /**
         * @method handleSyncClicked
         * @param {Function} event
         */
        handleSyncClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method loadReviews
         */
        refresh: function() {
            skritter.data.reviews.loadAll(function() {
                var div = '';
                skritter.data.reviews.sort();
                var reviews = skritter.data.reviews;
                for (var i in reviews.models) {
                    var review = reviews.at(i);
                    switch (review.get('score')) {
                        case 1:
                            div += "<tr class='danger'>";
                            break;
                        case 2:
                            div += "<tr class='warning'>";
                            break;
                        case 3:
                            div += "<tr class='success'>";
                            break;
                        case 4:
                            div += "<tr class='info'>";
                            break;
                    }
                    div += '<td>' + review.id + '</td>';
                    div += '<td>' + review.get('score') + '</td>';
                    div += '<td>' + review.get('bearTime') + '</td>';
                    div += '<td>' + review.get('reviewTime') + '</td>';
                    div += '<td>' + review.get('thinkingTime') + '</td>';
                    div += '</tr>';
                }
                this.$('#reviews-table tbody').html(div);
            });
        }
    });
    
    return Reviews;
});
define('require.text!templates/study.html',[],function () { return '<div id="study-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a href="#"><span class="fa fa-navbar fa-arrow-left"></span></a></li>\r\n                        <li><span class="fa fa-navbar fa-pencil"></span> <span id="items-due">0</span></li>\r\n                        <li><span class="fa fa-navbar fa-clock-o"></span> <span id="timer">0:00</span></li>\r\n                        <li><a id="add-button" class="cursor"><span class="fa fa-navbar fa-plus"></span></a></li>\r\n                        <li><a id="audio-button" class="cursor"><span class="fa fa-navbar fa-volume-off"></span></a></li>\r\n                        <li class="pull-right"><a id="info-button" class="cursor"><span class="fa fa-navbar fa-info-circle"></span></a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div id="prompt-container" class="container"></div>\r\n</div>';});

define('require.text!templates/prompt-defn.html',[],function () { return '<div id="defn" class="prompt">\r\n    <div class="row">\r\n        <div id="info-container" class="col-md-4">\r\n            <!--<h4 class="prompt-question"></h4>-->\r\n            <div id="prompt-writing-box" class="prompt-box pull-left">\r\n                <div class="prompt-writing-buffer pull-left"></div>\r\n                <div class="font-size-large prompt-writing"></div>\r\n            </div>\r\n            <div id="prompt-reading-box" class="prompt-box pull-left">\r\n                <div class="font-size-normal prompt-reading"></div>\r\n            </div>\r\n            <div id="prompt-definition-box" class="font-size-normal hidden prompt-box">\r\n                <div class="prompt-heisig"></div>\r\n                <div class="prompt-definition"></div>\r\n            </div>\r\n            <div id="prompt-sentence-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-sentence"></span>\r\n            </div>\r\n            <div id="prompt-mnemonic-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-mnemonic"></span>\r\n            </div>\r\n        </div>\r\n        <div id="input-container" class="col-md-8">\r\n            <div id="prompt-previous" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-left"></span></div>\r\n            <div id="prompt-next" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-right"></span></div>\r\n            <div class="prompt-style"></div>\r\n            <div id="prompt-text">\r\n                <h1 class="prompt-definition" style="font-weight: bolder"></h1>\r\n                <h4 class="prompt-tip"></h4>\r\n            </div>\r\n            <div id="grading-container"></div>\r\n        </div>\r\n    </div>\r\n</div>';});

/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/LeapController',[],function() {
    /**
     * @class LeapController
     */
    var LeapController = Backbone.Model.extend({
        initialize: function() {
            LeapController.this = this;
            LeapController.controller = new Leap.Controller();
            LeapController.canvasSize = skritter.settings.get('canvasSize');
            LeapController.offsetX = 250;
            LeapController.offsetYMin = 150;
            LeapController.offsetYMax = 450;
            LeapController.offsetZ = 200;
            LeapController.oldPt = {};
            LeapController.points = [];
            LeapController.waitingCounter = 0;
        },
        /**
         * @method disable
         */
        disable: function() {
            LeapController.controller.removeAllListeners();
            LeapController.controller.disconnect();
        },
        /**
         * @method enable
         */
        enable: function() {
            LeapController.controller.on('animationFrame', this.loop);
            LeapController.controller.connect();
        },
        /**
         * @method loop
         * @param {Object} frame
         */
        loop: function(frame) {
            if (frame.pointables.length > 0) {
                var x = frame.pointables[0].tipPosition[0];
                var y = frame.pointables[0].tipPosition[1];
                var z = frame.pointables[0].tipPosition[2];
                console.log('leap', x, y, z);
            }
        }
    });
    
    return LeapController;
});
define('require.text!templates/grading-buttons.html',[],function () { return '<div id="grading-buttons" class="row" style="display: none;">\r\n    <div id="grade1" class="col-xs-3 col-sm-3"></div>\r\n    <div id="grade2" class="col-xs-3 col-sm-3"></div>\r\n    <div id="grade3" class="col-xs-3 col-sm-3"></div>\r\n    <div id="grade4" class="col-xs-3 col-sm-3"></div>\r\n</div>\r\n';});

/**
 * @module Skritter
 * @submodule Components
 * @param templateGradingButtons
 * @author Joshua McFarland
 */
define('views/prompts/GradingButtons',[
    'require.text!templates/grading-buttons.html'
], function(templateGradingButtons) {
    /**
     * @class GradingButtons
     */
    var GradingButtons = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            GradingButtons.animationSpeed = 100;
            GradingButtons.expanded = true;
            GradingButtons.value = 3;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateGradingButtons);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.GradingButtons #grade1': 'handleButtonClick',
            'click.GradingButtons #grade2': 'handleButtonClick',
            'click.GradingButtons #grade3': 'handleButtonClick',
            'click.GradingButtons #grade4': 'handleButtonClick'
        },
        /**
         * @method collapse
         */
        collapse: function() {
            GradingButtons.expanded = false;
            for (var i = 1; i <= 4; i++) {
                if (this.$('#grade' + i).hasClass('selected')) {
                    this.$('#grade' + i).show(GradingButtons.animationSpeed);
                } else {
                    this.$('#grade' + i).hide(GradingButtons.animationSpeed);
                }
            }
        },
        /**
         * @method expand
         */
        expand: function() {
            GradingButtons.expanded = true;
            this.$('#grading-buttons').children().show(GradingButtons.animationSpeed);
        },
        /**
         * @method grade
         * @param {Number} value
         * @returns {Number}
         */
        grade: function(value) {
            if (value)
                GradingButtons.value = value;
            return GradingButtons.value;
        },
        /**
         * @method handleButtonClick
         * @param {Object} event
         */
        handleButtonClick: function(event) {
            this.select(parseInt(event.currentTarget.id.replace(/[^\d]+/, ''), 10));
            if (GradingButtons.expanded) {
                this.triggerSelected();
            } else {
                this.toggle();
            }
        },
        /**
         * @method hide
         * @param {Boolean} skipAnimation
         */
        hide: function(skipAnimation) {
            if (skipAnimation) {
                this.$('#grading-buttons').hide();
            } else {
                this.$('#grading-buttons').hide(GradingButtons.animationSpeed);
            }
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.$('#grading-buttons').remove();
            return this;
        },
        /**
         * @method select
         * @param {Number} value
         */
        select: function(value) {
            if (value)
                GradingButtons.value = value;
            for (var i = 1; i <= 4; i++) {
                if (GradingButtons.value === i) {
                    this.$('#grade' + i).addClass('selected');
                } else {
                    this.$('#grade' + i).removeClass('selected');
                }
            }
            this.show();
            return this;
        },
        /**
         * @method show
         */
        show: function() {
            this.$('#grading-buttons').show(GradingButtons.animationSpeed);
            return this;
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (GradingButtons.expanded) {
                this.collapse();
            } else {
                this.expand();
            }
            return this;
        },
        /**
         * @method triggerSelected
         */
        triggerSelected: function() {
            this.trigger('selected', GradingButtons.value);
        }
    });

    return GradingButtons;
});
/**
 * @module Skritter
 * @param GradingButtons
 * @author Joshua McFarland
 */
define('views/prompts/Prompt',[
    'views/prompts/GradingButtons'
], function(GradingButtons) {
    /**
     * @method Prompt
     */
    var Prompt = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.this = this;
            Prompt.data = null;
            Prompt.dataItem = null;
            Prompt.gradingButtons = new GradingButtons();
            Prompt.gradeColorHex = {
                1: '#e68e8e',
                2: '#efec10',
                3: '#70da70',
                4: '#4097d3'
            };
            Prompt.gradeColorFilters = {
                1: new createjs.ColorFilter(0, 0, 0, 1, 230, 142, 142, 1),
                2: new createjs.ColorFilter(0, 0, 0, 1, 239, 236, 16, 1),
                3: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1),
                4: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1)
            };
            Prompt.teachingMode = true;
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradeSelected);
        },
        /**
         * @method render
         * @return {Backbone.View}
         */
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            this.$('.prompt-writing').addClass(Prompt.data.vocab.getTextStyleClass());
            this.$('.prompt-sentence').addClass(Prompt.data.vocab.getTextStyleClass());
            this.$('.font-size-normal').css({'font-size': skritter.settings.fontSize.normal()});
            this.$('.font-size-large').css({'font-size': skritter.settings.fontSize.large()});
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Prompt .prompt #prompt-previous': 'previous',
            'click.Prompt .prompt #prompt-next': 'next'
        },
        data: function() {
            return Prompt.data;
        },
        /**
         * @method handleGradeSelected
         */
        handleGradeSelected: function() {
            console.log('GRADING', Prompt.dataItem.review());
        },
        /**
         * @method load
         */
        load: function() {
            console.log('PROMPT ITEM', Prompt.dataItem);
            Prompt.gradingButtons.grade(Prompt.dataItem.getGrade());
            //TODO: unhide these options for traversing
            this.$('#prompt-next').hide();
            this.$('#prompt-previous').hide();
        },
        /**
         * @method next
         */
        next: function() {
            if (Prompt.data.isLast()) {
                this.triggerComplete();
            } else {
                Prompt.data.next();
                Prompt.dataItem = Prompt.data.getDataItem();
                if (!Prompt.dataItem.isFinished()) {
                    skritter.timer.reset();
                    this.reset();
                }
                this.redraw();
                this.load();
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            if (!Prompt.data.isFirst()) {
                Prompt.data.previous();
                Prompt.dataItem = Prompt.data.getDataItem();
                this.clear();
                this.redraw();
                this.load();
            } else {
                this.triggerPrevious();
            }
        },
        /**
         * @method redraw
         */
        redraw: function() {
            this.$('.font-size-normal').css({'font-size': skritter.settings.fontSize.normal()});
            this.$('.font-size-large').css({'font-size': skritter.settings.fontSize.large()});
        },
        /**
         * @method resize
         * @param {Object} size
         */
        resize: function(size) {
            size = (size) ? size : {};
            size.width = (size.width) ? size.width : skritter.settings.get('appWidth');
            size.height = (size.height) ? size.height : skritter.settings.get('appHeight');
            size.canvas = (size.canvas) ? size.canvas : skritter.settings.get('canvasSize');
            size.navbar = (size.navbar) ? size.navbar : Prompt.this.$('.navbar').height();
            Prompt.this.$('#input-container').width(size.canvas);
            Prompt.this.$('#input-container').height(size.canvas);
            //manually resizes the info section to fill vertical mobile devices
            if (size.width <= 601 && skritter.settings.get('orientation') === 'vertical') {
                Prompt.this.$('#info-container').height(size.height - $('.navbar').height() - size.canvas - 32);
                Prompt.this.$('#info-container').width('');
            } else {
                //manually resizes the info section to fill horizontal mobile devices
                if (size.height <= 601 && size.width > 601) {
                    Prompt.this.$('#info-container').height(size.canvas);
                    Prompt.this.$('#info-container').width(size.width - size.canvas - 32);
                } else {
                    Prompt.this.$('#info-container').height('');
                }
            }
            Prompt.this.redraw();
        },
        /**          
         * @method set
         * @param {Object} data
         */
        set: function(data) {
            console.log('PROMPT DATA', data);
            skritter.timer.reset();
            Prompt.data = data;
            Prompt.dataItem = Prompt.data.getDataItem();
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            console.log('PROMPT COMPLETE', Prompt.data);
            Prompt.data.save();
            this.trigger('complete');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.trigger('previous');
        }
    });
    
    return Prompt;
});
/**
 * @module Skritter
 * @param templateDefn
 * @param LeapController
 * @param Prompt
 * @author Joshua McFarland
 */
define('views/prompts/PromptDefn',[
    'require.text!templates/prompt-defn.html',
    'models/LeapController',
    'views/prompts/Prompt'
], function(templateDefn, LeapController, Prompt) {
    /**
     * @class PromptDefn
     */
    var Defn = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Defn.leap = new LeapController();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            hammer(this.$('#prompt-text')[0]).on('tap', this.handleTap);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method handleGradeSelected
         */
        handleGradeSelected: function() {
            this.updateColor();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished()) {
                Prompt.this.next();
            } else {
                skritter.timer.stopThinking();
                //sets the item as finished and initial review values
                Prompt.dataItem.set('finished', true);
                Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
                Prompt.this.load();
            }
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.show.reading();
            Prompt.data.show.style();
            Prompt.data.show.writing();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                this.updateColor();
                Prompt.data.hide.question();
                Prompt.data.hide.tip();
                Prompt.data.show.definition();
                Prompt.gradingButtons.show();
                if (skritter.user.get('audio'))
                    Prompt.data.vocab.play();
            } else {
                skritter.timer.start();
                Prompt.data.show.question("What's the definition?");
                Prompt.data.show.tip("(Click to show the answer)");
            }
        },
        /**
         * Updates the prompt color based on the current selected grade value.
         * 
         * @method updateColor
         */
        updateColor: function() {
            Prompt.this.$('.prompt-definition').removeClass(function(index, css) {
                return (css.match(/\bgrade\S+/g) || []).join(' ');
            });
            Prompt.this.$('.prompt-definition').addClass('grade' + Prompt.gradingButtons.grade());
        }
    });

    return Defn;
});
define('require.text!templates/prompt-rdng.html',[],function () { return '<div id="rdng" class="prompt">\r\n    <div class="row">\r\n        <div id="info-container" class="col-md-4">\r\n            <!--<h4 class="prompt-question"></h4>-->\r\n            <div id="prompt-writing-box" class="prompt-box pull-left">\r\n                <div class="prompt-writing-buffer pull-left"></div>\r\n                <div class="font-size-large prompt-writing"></div>\r\n            </div>\r\n            <div id="prompt-reading-box" class="prompt-box pull-left">\r\n                <div class="font-size-normal prompt-reading"></div>\r\n            </div>\r\n            <div id="prompt-definition-box" class="font-size-normal prompt-box">\r\n                <div class="prompt-heisig"></div>\r\n                <div class="prompt-definition"></div>\r\n            </div>\r\n            <div id="prompt-sentence-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-sentence"></span>\r\n            </div>\r\n            <div id="prompt-mnemonic-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-mnemonic"></span>\r\n            </div>\r\n        </div>\r\n        <div id="input-container" class="col-md-8">\r\n            <div id="prompt-previous" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-left"></span></div>\r\n            <div id="prompt-next" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-right"></span></div>\r\n            <div class="prompt-style"></div>\r\n            <div id="prompt-text">\r\n                <h1 class="prompt-reading"></h1>\r\n                <h4 class="prompt-tip"></h4>\r\n            </div>\r\n            <div id="grading-container"></div>\r\n        </div>\r\n    </div>\r\n</div>';});

/**
 * @module Skritter
 * @param templateRdng
 * @param LeapController
 * @param Prompt
 * @author Joshua McFarland
 */
define('views/prompts/PromptRdng',[
    'require.text!templates/prompt-rdng.html',
    'models/LeapController',
    'views/prompts/Prompt'
], function(templateRdng, LeapController, Prompt) {
    /**
     * @class PromptRdng
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Rdng.leap = new LeapController();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRdng);
            hammer(this.$('#prompt-text')[0]).on('tap', this.handleTap);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method handleGradeSelected
         */
        handleGradeSelected: function() {
            this.updateColor();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished()) {
                Prompt.this.next();
            } else {
                skritter.timer.stopThinking();
                //sets the item as finished and initial review values
                Prompt.dataItem.set('finished', true);
                Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
                Prompt.this.load();
            }
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.show.style();
            Prompt.data.show.writing();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                this.updateColor();
                Prompt.data.hide.question();
                Prompt.data.hide.tip();
                Prompt.data.show.definition();
                Prompt.data.show.reading();
                Prompt.gradingButtons.show();
                if (skritter.user.get('audio'))
                    Prompt.data.vocab.play();
            } else {
                skritter.timer.start();
                Prompt.data.show.question("How do you say it?");
                Prompt.data.show.tip("(Click to show the answer)");
            }
        },
        /**
         * Updates the prompt color based on the current selected grade value.
         * 
         * @method updateColor
         */
        updateColor: function() {
            Prompt.this.$('.prompt-reading').removeClass(function(index, css) {
                return (css.match(/\bgrade\S+/g) || []).join(' ');
            });
            Prompt.this.$('.prompt-reading').addClass('grade' + Prompt.gradingButtons.grade());
        }
    });

    return Rdng;
});
define('require.text!templates/prompt-rune.html',[],function () { return '<div id="rune" class="prompt">\r\n    <div class="row">\r\n        <div id="info-container" class="col-md-4">\r\n            <!--<h4 class="prompt-question"></h4>-->\r\n            <div id="prompt-writing-box" class="prompt-box pull-left">\r\n                <div class="font-size-large prompt-writing"></div>\r\n            </div>\r\n            <div id="prompt-reading-box" class="prompt-box pull-left">\r\n                <div class="font-size-normal prompt-reading"></div>\r\n            </div>\r\n            <div id="prompt-definition-box" class="font-size-normal prompt-box">\r\n                <div class="prompt-heisig"></div>\r\n                <div class="prompt-definition"></div>\r\n            </div>\r\n            <div id="prompt-sentence-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-sentence"></span>\r\n            </div>\r\n            <div id="prompt-mnemonic-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-mnemonic"></span>\r\n            </div>\r\n        </div>\r\n        <div id="input-container" class="col-md-8">\r\n            <div id="prompt-previous" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-left"></span></div>\r\n            <div id="prompt-next" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-right"></span></div>\r\n            <div class="prompt-style"></div>\r\n            <div id="canvas-container"></div>\r\n            <div id="grading-container"></div>\r\n        </div>\r\n    </div>  \r\n</div>';});

/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('views/prompts/Canvas',[],function() {
    /**
     * @class Canvas
     */
    var Canvas = Backbone.View.extend({
        /**
         * @method initialize
         * @param {Object} options
         */
        initialize: function(options) {
            Canvas.this = this;
            Canvas.gridColor = 'grey';
            Canvas.gridLineWidth = 1;
            Canvas.size = (options && options.size) ? options.size : skritter.settings.get('canvasSize') ;
            Canvas.strokeColor = '#000000';
            Canvas.strokeSize = 12;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeJointStyle = 'round';
            Canvas.squigColor = '#000000';
            Canvas.textColor = '#000000';
            Canvas.textFont = 'Arial';
            Canvas.textSize = '12px';
            Canvas.element = this._initElement();
            Canvas.stage = this._initStage();
            createjs.Touch.enable(Canvas.stage);
            createjs.Ticker.addEventListener('tick', this.tick);
            this.listenTo(skritter.settings, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(Canvas.element);
            this.createLayer('grid');
            this.createLayer('background');
            this.createLayer('hint');
            this.createLayer('stroke');
            this.createLayer('overlay');
            this.createLayer('feedback');
            this.createLayer('input');
            this.drawGrid('grid');
            return this;
        },
        /**
         * @method initElement
         * @returns {DOMElement}
         */
        _initElement: function() {
            var element = document.createElement('canvas');
            element.setAttribute('id', 'prompt-canvas');
            element.setAttribute('width', Canvas.size);
            element.setAttribute('height', Canvas.size);
            return element;
        },
        /**
         * @method initStage
         * @returns {Stage}
         */
        _initStage: function() {
            var stage = new createjs.Stage(Canvas.element);
            stage.enableDOMEvents(true);
            stage.autoClear = true;
            return stage;
        },
        /**
         * @method clear
         * @param {String} layerName
         * @returns {Backbone.View}
         */
        clear: function(layerName) {
            if (layerName) {
                var layer = this.getLayer(layerName);
                layer.removeAllChildren();
                layer.uncache();
            } else {
                var layers = this.getLayers();
                for (var i in layers) {
                    layers[i].removeAllChildren();
                    layers[i].uncache();
                }
            }
            return this;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            Canvas.stage.addChild(layer);
            return layer;
        },
        disableInput: function() {
            Canvas.stage.removeAllEventListeners();
        },
        /**
         * Draws the to the background using a font rather than assembling
         * the character strokes.
         * 
         * @method drawCharacterFromFont
         * @param {String} layerName
         * @param {String} character
         * @param {String} font
         * @param {Number} alpha
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        drawCharacterFromFont: function(layerName, character, font, alpha, color) {
            var layer = this.getLayer(layerName);
            color = (color) ? color : Canvas.textColor;
            font = (font) ? font : Canvas.textFont;
            var text = new createjs.Text(character, skritter.settings.get('canvasSize') + 'px ' + font, color);
            text.alpha = (alpha) ? alpha : 1;
            layer.addChild(text);
            if (layer.cacheCanvas)
                layer.updateCache();
            return layer;
        },
        /**
         * @method drawContainer
         * @param {Bitmap} layerName
         * @param {String} container
         * @param {Number} alpha
         * @returns {Bitmap}
         */
        drawContainer: function(layerName, container, alpha) {
            var layer = this.getLayer(layerName);
            if (layer.getChildByName('character'))
                layer.removeChild(layer.getChildByName('character'));
            if (alpha) {
                container.cache(0, 0, Canvas.size, Canvas.size);
                container.filters = [new createjs.ColorFilter(0, 0, 0, alpha, 0, 0, 0, 0)];
            }
            layer.addChildAt(container, 0);
            return container;
        },
        /**
         * @method drawGrid
         * @param {String} layerName
         * @param {String} color
         * @returns {Container}
         */
        drawGrid: function(layerName, color) {
            color = (color) ? color : Canvas.gridColor;
            var grid = new createjs.Shape();
            var layer = this.getLayer(layerName);
            if (layer.getChildByName('grid'))
                layer.removeChild(layer.getChildByName('grid'));
            grid.name = 'grid';
            grid.graphics.beginStroke(color).setStrokeStyle(Canvas.gridLineWidth, Canvas.strokeCapStyle, Canvas.strokeJointStyle);
            grid.graphics.moveTo(Canvas.size / 2, 0).lineTo(Canvas.size / 2, Canvas.size);
            grid.graphics.moveTo(0, Canvas.size / 2).lineTo(Canvas.size, Canvas.size / 2);
            grid.graphics.moveTo(0, 0).lineTo(Canvas.size, Canvas.size);
            grid.graphics.moveTo(Canvas.size, 0).lineTo(0, Canvas.size);
            layer.addChild(grid);
            grid.graphics.endStroke();
            return grid;
        },
        /**
         * @method drawShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Number} alpha
         * @returns {Bitmap}
         */
        drawShape: function(layerName, shape, alpha) {
            shape.alpha = (alpha) ? alpha : 1;
            this.getLayer(layerName).addChild(shape);
            return this;
        },
        /**
         * @method drawShapePhantom
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Function} callback
         * @returns {CreateJS.Shape}
         */
        drawShapePhantom: function(layerName, shape, callback) {
            var layer = this.getLayer(layerName);
            layer.addChild(shape);
            createjs.Tween.get(shape).wait(300).to({alpha: 0}, 1000).call(function() {
                layer.removeChild(shape);
                if (typeof callback === 'function')
                    callback();
            });
            return shape;
        },
        /**
         * @method enableInput
         */
        enableInput: function() {
            var layer = this.getLayer('input');
            var oldPt, oldMidPt, points;
            var stage = Canvas.stage;
            if (!stage.hasEventListener('stagemousedown')) {
                var marker = new createjs.Shape();
                layer.addChild(marker);
                stage.addEventListener('stagemousedown', down);
            }
            function down() {
                points = [];
                oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
                Canvas.this.triggerInputDown(oldPt);
                oldMidPt = oldPt;
                if (skritter.user.getSetting('squigs')) {
                    marker.graphics.beginStroke(Canvas.squigColor);
                } else {
                    marker.graphics.beginStroke(Canvas.strokeColor);
                }
                stage.addEventListener('stagemousemove', move);
                stage.addEventListener('stagemouseup', up);
            }
            function move() {
                var point = new createjs.Point(stage.mouseX, stage.mouseY);
                var midPt = new createjs.Point(oldPt.x + point.x >> 1, oldPt.y + point.y >> 1);
                marker.graphics
                        .setStrokeStyle(skritter.fn.getPressurizedStrokeSize(point, oldPt), Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .moveTo(midPt.x, midPt.y)
                        .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

                oldPt.x = point.x;
                oldPt.y = point.y;
                oldMidPt.x = midPt.x;
                oldMidPt.y = midPt.y;
                points.push(oldPt.clone());
                stage.update();
            }
            function up(event) {
                var x = event.rawX;
                var y = event.rawY;
                marker.graphics.endStroke();
                if (x >= 0 && x < Canvas.size && y >= 0 && y < Canvas.size) {
                    Canvas.this.triggerInputUp(points, marker.clone(true));
                } else {
                    Canvas.this.fadeShape('background', marker.clone(true));
                }
                stage.removeEventListener('stagemousemove', move);
                stage.removeEventListener('stagemouseup', up);
                marker.graphics.clear();
            }
        },
        /**
         * @method fadeLayer
         * @param {String} layerName
         * @param {Function} callback
         * @returns {Container}
         */
        fadeLayer: function(layerName, callback) {
            var layer = this.getLayer(layerName);
            if (layer.getNumChildren() > 0) {
                createjs.Tween.get(layer).to({alpha: 0}, 750).call(function() {
                    layer.removeAllChildren();
                    layer.alpha = 1.0;
                    if (typeof callback === 'function')
                        callback(layer);
                });
            }
            return layer;
        },
        /**
         * @method fadeShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Function} callback
         * @returns {Container}
         */
        fadeShape: function(layerName, shape, callback) {
            var layer = this.getLayer(layerName);
            layer.addChild(shape);
            shape.cache(0, 0, Canvas.size, Canvas.size);
            createjs.Tween.get(shape).to({alpha: 0}, 300, createjs.Ease.quadOut).call(function() {
                shape.uncache();
                layer.removeChild(shape);
                if (typeof callback === 'function')
                    callback();
            });
            return layer;
        },
        /**
         * @method getLayer
         * @param {String} name
         * @returns {Container}
         */
        getLayer: function(name) {
            return Canvas.stage.getChildByName('layer-' + name);
        },
        /**
         * @method getLayers
         * @returns {Array}
         */
        getLayers: function() {
            var layers = [];
            for (var i in Canvas.stage.children) {
                var child = Canvas.stage.children[i];
                if (child.name && child.name.indexOf('layer-') > -1)
                    layers.push(Canvas.stage.children[i]);
            }
            return layers;
        },
        /**
         * @method hideMessage
         */
        hideMessage: function() {
            var layer = this.getLayer('feedback');
            for (var i in layer.children)
                createjs.Tween.get(layer.children[i]).to({y: -30}, 1000, createjs.Ease.bounceOut).call(hideChild);
            function hideChild() {
                layer.removeChild(layer.children[i]);
            }
        },
        /**
         * @method injectLayer
         * @param {String} layerName
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        injectLayer: function(layerName, color) {
            var layer = this.getLayer(layerName);
            var inject = function() {
                if (color)
                    this.fillStyle = color;
            };
            for (var a in layer.children) {
                var child = layer.children[a];
                if (child.children && child.children.length > 0) {
                    for (var b in child.children)
                        if (!child.children[b].children)
                            child.children[b].graphics.inject(inject);
                } else if (!child.children) {
                    child.graphics.inject(inject);
                }
            }
            return layer;
        },
        /**
         * @method resize
         * @param {Object} event
         */
        resize: function(event) {
            Canvas.size = event.canvas;
            Canvas.element.setAttribute('width', Canvas.size);
            Canvas.element.setAttribute('height', Canvas.size);
            Canvas.this.$(Canvas.element).width(Canvas.size);
            Canvas.this.$(Canvas.element).height(Canvas.size);
            Canvas.this.drawGrid('grid');
        },
        /**
         * @method setLayerAlpha
         * @param {String} layerName
         * @param {Number} alpha
         * @returns {Container}
         */
        setLayerAlpha: function(layerName, alpha) {
            var layer = this.getLayer(layerName);
            layer.alpha = alpha;
            layer.cache(0, 0, Canvas.size, Canvas.size);
            return layer;
        },
        /**
         * @method showMessage
         * @param {String} text
         * @param {Boolean} autoHide
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        showMessage: function(text, autoHide, callback) {
            var self = this;
            var layer = this.getLayer('feedback');
            var message = new createjs.Container();
            var box = new createjs.Shape(new createjs.Graphics().beginFill('grey').drawRect(0, 0, Canvas.size, 30));
            var line = new createjs.Shape(new createjs.Graphics().beginStroke('black').moveTo(0, 30).lineTo(Canvas.size, 30));
            message.name = 'message';
            message.y = -30;
            message.addChild(box);
            message.addChild(line);
            text = new createjs.Text(text, '20px Arial', '#ffffff');
            text.x = (Canvas.size / 2) - (text.getMeasuredWidth() / 2);
            text.y = 2.5;
            message.addChild(text);
            createjs.Tween.get(message).to({y: 0}, 500, createjs.Ease.sineOut).wait(2000).call(function() {
                if (autoHide)
                    self.hideMessage();
                if (typeof callback === 'function')
                    callback();
            });
            layer.addChild(message);
            return this;
        },
        /**
         * @method stage
         * @returns {CreateJS.Stage}
         */
        stage: function() {
            return Canvas.stage;
        },
        /**
         * @method tick
         */
        tick: function() {
            Canvas.stage.update();
        },
        /**
         * Enables the view to fire events when the canvas has been touched.
         * 
         * @method triggerInputDown
         * @param {Object} point
         */
        triggerInputDown: function(point) {
            this.trigger('input:down', point);
        },
        /**
         * Enables the view to fire events when the canvas touch has been released.
         * 
         * @method triggerInputUp
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        triggerInputUp: function(points, shape) {
            this.trigger('input:up', points, shape);
        },
        /**
         * @method tweenShape
         * @param {String} layerName
         * @param {CreateJS.Shape} fromShape
         * @param {CreateJS.Shape} toShape
         * @param {Number} duration
         * @param {Function} callback
         * @returns {CreateJS.Shape}
         */
        tweenShape: function(layerName, fromShape, toShape, duration, callback) {
            duration = (duration) ? duration : 500;
            var layer = this.getLayer(layerName);
            layer.addChildAt(fromShape, 0);
            createjs.Tween.get(fromShape).to({
                x: toShape.x,
                y: toShape.y,
                scaleX: toShape.scaleX,
                scaleY: toShape.scaleY,
                rotation: toShape.rotation
            }, duration, createjs.Ease.backOut).call(function() {
                if (typeof callback === 'function')
                    callback();
            });
            return fromShape;
        },
        /**
         * @method uncacheLayer
         * @param {String} layerName
         * @returns {CreateJS.Container}
         */
        uncacheLayer: function(layerName) {
            var layer = this.getLayer(layerName);
            if (layer.cacheCanvas)
                layer.uncache();
            return layer;
        }
    });

    return Canvas;
});
/**
 * Handles adjustments made when tweening from a user drawn squigs to
 * 
 * @module Skritter
 * @class Mauler
 * @author Joshua McFarland
 */
define('Mauler',[],function() {
    /**
     * @method tweak
     * @param {Bitmap} bitmap
     * @param {Number} bitmapId
     * @returns {Bitmap}
     */
    var tweak = function(bitmap, bitmapId) {
        return bitmap;
    };


    return {
        tweak: tweak
    };
});
// ShortStrawJS, a javascript implementation
// http://www.lab4games.net/zz85/blog/2010/01/21/geeknotes-shortstrawjs-fast-and-simple-corner-detection/
//
// Derived heavily from the AS3 implementation of the ShortStraw Corner Finder (Wolin et al. 2008)
// by Felix Raab. 21 July 2009.
// http://www.betriebsraum.de/blog/2009/07/21/efficient-gesture-recognition-and-corner-finding-in-as3/
//
// Based on the paper ShortStraw: A Simple and Effective Corner Finder for Polylines
// http://srlweb.cs.tamu.edu/srlng_media/content/objects/object-1246294647-350817e4b0870da27e16472ed36475db/Wolin_SBIM08.pdf
//
// For comments on this JS port, email Joshua Koo (zz85nus @ gmail.com)
//
// Released under MIT license: http://www.opensource.org/licenses/mit-license.php

/**
 * @module Skritter
 */
define('Shortstraw',[],function() {
    /**
     * @class Shortstraw
     * @param {Array} points
     * @returns {Array}
     * @constructor
     */
    function Shortstraw(points) {
        var DIAGONAL_INTERVAL = 40; //default 40
        var STRAW_WINDOW = 3; //default 3
        var MEDIAN_THRESHOLD = 0.95; //default 95
        var LINE_THRESHOLD = 0.95; //default 95
        var self = this;

        if (!points)
            return;

        this.distance = function(p1, p2) {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return Math.pow((dx * dx) + (dy * dy), 1 / 2);
        };

        this.pathDistance = function(points, a, b) {
            var d = 0;
            for (var i = a; i < b; i++)
            {
                d += this.distance(points[i], points[i + 1]);
            }
            return d;
        };

        this.isLine = function(points, a, b) {
            var distance = this.distance(points[a], points[b]);
            var pathDistance = this.pathDistance(points, a, b);
            return (distance / pathDistance) > LINE_THRESHOLD;
        };

        this.median = function(values) {
            var s = values.concat();
            s.sort();
            var m;
            if (s.length % 2 === 0) {
                m = s.length / 2;
                return (s[m - 1] + s[m]) / 2;
            } else {
                m = (s.length + 1) / 2;
                return s[m - 1];
            }
        };

        var s = determineResampleSpacing(points);
        var resampled = resamplePoints(points, s);
        var corners = getCorners(resampled);
        var cornerPoints = [];

        for (var i in corners)
        {
            cornerPoints.push(resampled[corners[i]]);
        }

        function determineResampleSpacing(points) {
            var b = boundingBox(points);
            var p1 = {x: b.x, y: b.y};
            var p2 = {x: b.x + b.w, y: b.y + b.h};
            var d = self.distance(p1, p2);

            return d / DIAGONAL_INTERVAL;
        }

        function resamplePoints(points, s) {
            var distance = 0;
            var resampled = [];

            resampled.push(points[0]);

            for (var i = 1; i < points.length; i++)
            {
                var p1 = points[i - 1];
                var p2 = points[i];
                var d2 = self.distance(p1, p2);
                if ((distance + d2) >= s) {
                    var qx = p1.x + ((s - distance) / d2) * (p2.x - p1.x);
                    var qy = p1.y + ((s - distance) / d2) * (p2.y - p1.y);
                    var q = {x: qx, y: qy};
                    resampled.push(q);
                    points.splice(i, 0, q);
                    distance = 0;
                } else {
                    distance += d2;
                }
            }
            resampled.push(points[points.length - 1]);
            return resampled;
        }

        function getCorners(points) {
            var corners = [0];
            var w = STRAW_WINDOW;
            var straws = [];
            var i;

            for (i = w; i < points.length - w; i++)
            {
                straws[i] = (self.distance(points[i - w], points[i + w]));
            }

            var t = self.median(straws) * MEDIAN_THRESHOLD;

            for (i = w; i < points.length - w; i++)
            {
                if (straws[i] < t) {
                    var localMin = Number.POSITIVE_INFINITY;
                    var localMinIndex = i;
                    while (i < straws.length && straws[i] < t)
                    {
                        if (straws[i] < localMin) {
                            localMin = straws[i];
                            localMinIndex = i;
                        }
                        i++;
                    }
                    corners.push(localMinIndex);
                }
            }
            corners.push(points.length - 1);
            corners = postProcessCorners(points, corners, straws);
            return corners;
        }

        function postProcessCorners(points, corners, straws) {
            var go = false;
            var i, c1, c2;

            while (!go)
            {
                go = true;
                for (i = 1; i < corners.length; i++)
                {
                    c1 = corners[i - 1];
                    c2 = corners[i];
                    if (!self.isLine(points, c1, c2)) {
                        var newCorner =
                                halfwayCorner(straws, c1, c2);
                        if (newCorner > c1 && newCorner < c2) {
                            corners.splice(i, 0, newCorner);
                            go = false;
                        }
                    }
                }
            }

            for (i = 1; i < corners.length - 1; i++)
            {
                c1 = corners[i - 1];
                c2 = corners[i + 1];
                if (self.isLine(points, c1, c2)) {
                    corners.splice(i, 1);
                    i--;
                }
            }

            return corners;
        }

        function halfwayCorner(straws, a, b) {
            var quarter = (b - a) / 4;
            var minValue = Number.POSITIVE_INFINITY;
            var minIndex;

            for (var i = a + quarter; i < (b - quarter); i++)
            {
                if (straws[i] < minValue) {
                    minValue = straws[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }

        function boundingBox(points) {
            var minX = Number.POSITIVE_INFINITY;
            var maxX = Number.NEGATIVE_INFINITY;
            var minY = Number.POSITIVE_INFINITY;
            var maxY = Number.NEGATIVE_INFINITY;

            for (var i in points)
            {
                var p = points[i];
                if (p.x < minX) {
                    minX = p.x;
                }
                if (p.x > maxX) {
                    maxX = p.x;
                }
                if (p.y < minY) {
                    minY = p.y;
                }
                if (p.y > maxY) {
                    maxY = p.y;
                }
            }
            return {x: minX, y: minY, w: maxX - minX, h: maxY - minY};
        }
        
        return cornerPoints;
    }

    return Shortstraw;
});
/**
 * @module Skritter
 * @submodule Model
 * @param Mauler
 * @param Shortstraw
 * @author Joshua McFarland 
 */
define('models/CanvasStroke',[
    'Mauler',
    'Shortstraw'
], function(Mauler, Shortstraw) {
    /**
     * @class CanvasStroke
     */
    var CanvasStroke = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change:points', function(stroke) {
                var points = _.clone(stroke.get('points'));
                stroke.set('corners', Shortstraw(points));
            });
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            isTweening: false
        },
        /**
         * Returns the angle created by the starting and ending point of the entire object.
         * 
         * @method getAngle
         * @return {Number} description
         */
        getAngle: function() {
            return skritter.fn.getAngle(this.get('points'));
        },
        /**
         * Returns the contained stroke ids.
         * 
         * @method getContainedStrokeIds
         * @return {Array}
         */
        getContainedStrokeIds: function() {
            var ids = [];

            if (!this.has('contains')) {
                ids.push(this.get('id'));
                return ids;
            }

            var contains = this.get('contains');
            var position = this.get('position');
            for (var i in contains)
            {
                var contained = contains[i];
                ids.push(position + '|' + contained);
                ids.push((position + 1) + '|' + contained);
            }

            return ids;
        },
        /**
         * Returns the length of the stroke based on the distance between the corner segments.
         * 
         * @method getLength
         * @return {Number}
         */
        getLength: function() {
            var length = 0;
            for (var i = 0; i < this.get('corners').length - 1; i++)
                length += skritter.fn.getDistance(this.get('corners')[i], this.get('corners')[i + 1]);
            return length;
        },
        /**
         * Returns the sprite transformed to fit the stroke data and canvas size.
         * 
         * @method getInflatedSprite
         * @param {String} color
         * @return {unresolved}
         */
        getInflatedSprite: function(color) {
            var sprite = skritter.assets.getStroke(this.get('bitmapId'), color);
            var spriteBounds = sprite.getBounds();
            var data = this.getInflatedData();         
            var ms = sprite.getMatrix();
            
            var sx = data.w / spriteBounds.width;
            var sy = data.h / spriteBounds.height;
            ms.scale(sx, sy);
            ms.translate(-data.w / 2, -data.h / 2);
            ms.rotate(data.rot * Math.PI / 180);
            var t = ms.decompose();

            sprite.setTransform(t.x, t.y, t.scaleX, t.scaleY, t.rotation, t.skewX, t.skewY);
            var finalBounds = sprite.getTransformedBounds();   
            sprite.name = 'stroke';
            sprite.x += finalBounds.width / 2 + data.x;
            sprite.y += finalBounds.height / 2 + data.y;

            return sprite;
        },
        /**
         * Returns an inflated version of the data based on the canvas size.
         * 
         * @method getInflatedData
         * @return {Object}
         */
        getInflatedData: function() {
            var bounds = this.get('sprite').getBounds();
            var canvasSize = skritter.settings.get('canvasSize');
            var data = this.get('data');
            return {
                n: data[0],
                x: data[1] * canvasSize,
                y: data[2] * canvasSize,
                w: data[3] * canvasSize,
                h: data[4] * canvasSize,
                scaleX: (data[3] * canvasSize) / bounds.width,
                scaleY: (data[4] * canvasSize) / bounds.height,
                rot: -data[5]
            };
        },
        /**
         * Returns an inflated version of the params based on the canvas size.
         * 
         * @method getInflatedParams
         * @return {Array}
         */
        getInflatedParams: function() {
            var params = skritter.data.params.where({bitmapId: this.get('bitmapId')});
            var inflatedParams = [];
            for (var p in params) {
                var param = params[p].clone();
                //inflates the param corners
                var corners = _.cloneDeep(param.get('corners'));
                for (var c in corners) {
                    var inflatedCorner = this.getInflatedSprite().getMatrix().transformPoint(corners[c].x, corners[c].y);
                    corners[c].x = inflatedCorner.x;
                    corners[c].y = inflatedCorner.y;
                }
                param.set('corners', corners);
                //inflates the param deviations
                var deviations = _.cloneDeep(param.get('deviations'));
                for (var d in deviations) {
                    var inflatedDeviation = this.getInflatedSprite().getMatrix().transformPoint(deviations[d].x, deviations[d].y);
                    deviations[d].x = inflatedDeviation.x;
                    deviations[d].y = inflatedDeviation.y;
                }
                param.set('deviations', deviations);
                inflatedParams.push(param);
            }
            return inflatedParams;
        },
        /**
         * Returns an object of the bounding rectangle of the points.
         * 
         * @method getRectangle
         * @return {Object}
         */
        getRectangle: function() {
            var canvasSize = skritter.settings.get('canvasSize');
            return skritter.fn.getBoundingRectangle(this.get('points'), canvasSize, canvasSize, 14);
        },
        /**
         * Returns an object of the bounding rectangle of the corners.
         * 
         * @method getRectangleCorners
         * @return {Object}
         */
        getRectangleCorners: function() {
            var canvasSize = skritter.settings.get('canvasSize');
            return skritter.fn.getBoundingRectangle(this.get('corners'), canvasSize, canvasSize, 14);
        },
        /**
         * Returns the raw sprite without any transformations or positioning.
         * 
         * @method getSprite
         * @param {String} color
         * @returns {Bitmap}
         */
        getSprite: function(color) {
            return skritter.assets.getStroke(this.get('bitmapId', color));
        },
        /**
         * Returns a sprite of the target stroke that has been altered based on the users input.
         * 
         * @method getUserSprite
         * @param {String} color
         * @return {Bitmap}
         */
        getUserSprite: function(color) {
            var sprite = this.getInflatedSprite(color);
            var rect = this.getRectangle();
            sprite.name = 'stroke';
            sprite.x = rect.x;
            sprite.y = rect.y;
            return Mauler.tweak(sprite, this.get('bitmapId'));
        }

    });

    return CanvasStroke;
});
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/study/Param',[],function() {
    /**
     * @class Param
     */
    var Param = Backbone.Model.extend({
        /**
         * @method getAngle
         * @return {Number}
         */
        getAngle: function() {
            return skritter.fn.getAngle(this.get('corners'));
       },
        /**
         * @method getBitmap
         * @return {Bitmap}
         */
        getBitmap: function() {
            return new createjs.Bitmap(skritter.assets.getStroke(this.get('bitmapId')).src);
        },
        /**
         * @method getLength
         * @return {Number}
         */
        getLength: function() {
            var length = 0;
            for (var i = 0; i < this.get('corners').length - 1; i++)
            {
                length += skritter.fn.getDistance(this.get('corners')[i], this.get('corners')[i + 1]);
            }
            return length;
        }
    });

    return Param;
});
/**
 * @module Skritter
 * @param StudyParam
 * @author Joshua McFarland
 */
define('Recognizer',[
    'models/study/Param'
], function(StudyParam) {
    /**
     * @class Recognizer
     * @param {CanvasCharacter} userCharacter
     * @param {CanvasStroke} userStroke
     * @param {Array} userTargets
     * @constructor
     */
    function Recognizer(userCharacter, userStroke, userTargets) {
        //set the values for recognition
        this.currentPosition = userCharacter.getStrokeCount() + 1;
        this.stroke = userStroke;
        this.targets = userTargets;
        this.canvasSize = skritter.settings.get('canvasSize');
        //set the scaled threshold values
        this.angleThreshold = 30;
        this.distanceThreshold = 150 * (this.canvasSize / 600);
        this.lengthThreshold = 300 * (this.canvasSize / 600);
        this.orderStrictness = 0;
    }

    /**
     * @method recognize
     * @param {Array} ignoreCheck
     * @param {Boolean} enforceOrder
     * @returns {CanvasStroke}
     */
    Recognizer.prototype.recognize = function(ignoreCheck, enforceOrder) {
        var results = this.getResultSet();
        if (enforceOrder)
            this.orderStrictness = 0;
        for (var i in results)
        {
            var result = results[i];
            var scores = result.scores;
            if (!_.contains(ignoreCheck, 'corners')) {
                if (scores.corners === false)
                    continue;
            }
            if (!_.contains(ignoreCheck, 'angle')) {
                if (scores.angle > this.angleThreshold)
                    continue;
            }
            if (!_.contains(ignoreCheck, 'distance')) {
                if (scores.distance > this.distanceThreshold)
                    continue;
            }
            if (!_.contains(ignoreCheck, 'length')) {
                if (scores.length > this.lengthThreshold)
                    continue;
            }

            /*if (!_.contains(ignoreCheck, 'offset')) {
                var orderOffset = result.position - this.currentPosition;
                if (_.contains(ignoreCheck, 'offset') || orderOffset > this.orderStrictness)
                    continue;
            }*/

            var total = 0;
            for (var s in scores)
            {
                total += scores[s];
            }
            results[i].result = total;
        }

        results = _.filter(results, 'result');
        
        if (results.length > 0) {
            var matched = _.first(_.sortBy(results, 'result'));
            this.stroke.set('bitmapId', matched.bitmapId);
            this.stroke.set('contains', matched.contains);
            this.stroke.set('data', matched.data);
            this.stroke.set('feedback', matched.feedback);
            this.stroke.set('id', matched.id);
            this.stroke.set('params', matched.params);
            this.stroke.set('part', matched.part);
            this.stroke.set('position', matched.position);
            this.stroke.set('result', matched.result);
            this.stroke.set('scores', matched.scores);
            this.stroke.set('sprite', matched.sprite);
            return this.stroke;
        }

        return null;
    };

    /**
     * @method getResultSet
     * @returns {Array}
     */
    Recognizer.prototype.getResultSet = function() {
        var results = [];
        var maxPosition = this.currentPosition + this.orderStrictness;
        var minPosition = this.currentPosition - this.orderStrictness;
        for (var a in this.targets) {
            var variations = this.targets[a];
            for (var b in variations.models) {
                var stroke = variations.at(b);
                var position = stroke.get('position');
                //filters out items not possible based on strictness settings
                if (minPosition > position || position > maxPosition)
                    continue;
                //sets the remaining values to be passed to resultset
                var bitmapId = stroke.get('bitmapId');
                var data = stroke.get('data');
                var id = stroke.get('id');
                var params = stroke.getInflatedParams();
                var part = stroke.get('part');
                var variation = stroke.get('variation');
                var rune = stroke.get('rune');
                var sprite = stroke.get('sprite');

                //TODO: update this backwards check to use the new params concept
                //right now it's just a hack to manually inject params backwards
                //don't check accept anything backwards when studying squigs
                if (!skritter.user.getSetting('squigs')) {
                    var reverseCorners = _.cloneDeep(params[0].get('corners')).reverse();
                    var reverseDeviations = _.cloneDeep(params[0].get('deviations')).reverse();
                    params.push(new StudyParam({
                        bitmapId: bitmapId,
                        data: data,
                        contains: params[0].get('contains'),
                        corners: reverseCorners,
                        deviations: reverseDeviations,
                        feedback: 'backwards',
                        id: id,
                        param: param,
                        part: part,
                        position: position,
                        variation: variation,
                        rune: rune,
                        sprite: sprite,
                        stroke: stroke
                    }));
                }

                for (var p in params) {
                    var result = [];
                    var param = params[p];

                    var scores = {
                        angle: this.checkAngle(param),
                        corners: this.checkCorners(param),
                        distance: this.checkDistance(param),
                        length: this.checkLength(param)
                    };

                    result.bitmapId = bitmapId;
                    result.contains = param.get('contains');
                    result.data = data;
                    result.feedback = param.get('feedback');
                    result.id = id;
                    result.param = param;
                    result.part = part;
                    result.position = position;
                    result.variation = variation;
                    result.rune = rune;
                    result.scores = scores;
                    result.sprite = sprite;
                    results.push(result);
                }
            }
        }
        return results;
    };

    /**
     * @method checkAngle
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkAngle = function(param) {
        var score = Math.abs(this.stroke.getAngle() - param.getAngle());
        return score;
    };

    /**
     * @method checkCorners
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkCorners = function(param) {
        var cornerPenalty = 200;
        var cornerDiff = Math.abs(param.get('corners').length - this.stroke.get('corners').length);
        if (cornerDiff > 1)
            return false;
        return cornerDiff * cornerPenalty;
    };

    /**
     * @method checkDistance
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(param) {
        //ISSUE #75: might be better to check the distance from the mid-points
        var score = skritter.fn.getDistance(skritter.fn.getBoundingRectangle(this.stroke.get('corners'), this.canvasSize, this.canvasSize, 6),
                skritter.fn.getBoundingRectangle(param.get('corners'), this.canvasSize, this.canvasSize, 6));
        return score;
    };

    /**
     * @method checkLength
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkLength = function(param) {
        var score = Math.abs(this.stroke.getLength() - param.getLength());
        return score;
    };


    return Recognizer;
});
/**
 * @module Skritter
 * @param templateRune
 * @param Canvas
 * @param CanvasStroke
 * @param LeapController
 * @param Prompt
 * @param Recognizer
 * @author Joshua McFarland
 */
define('views/prompts/PromptRune',[
    'require.text!templates/prompt-rune.html',
    'views/prompts/Canvas',
    'models/CanvasStroke',
    'models/LeapController',
    'views/prompts/Prompt',
    'Recognizer'
], function(templateRune, Canvas, CanvasStroke, LeapController, Prompt, Recognizer) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Rune.canvas = new Canvas();
            Rune.failedAttempts = 0;
            Rune.leap = new LeapController();
            Rune.maxFailedAttempts = 3;
            Rune.minStrokeDistance = 10;
            Rune.teaching = false;
            this.listenTo(Rune.canvas, 'input:down', this.handleInputDown);
            this.listenTo(Rune.canvas, 'input:up', this.handleInputUp);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.setElement(this.$('#canvas-container')).render();
            hammer(this.$('#canvas-container')[0]).on('doubletap', this.handleDoubleTap);
            hammer(this.$('#canvas-container')[0]).on('hold', this.handleHold);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         */
        clear: function() {
            Rune.canvas.setLayerAlpha('stroke', 1);
            Rune.canvas.clear('background');
            Rune.canvas.clear('hint');
            Rune.canvas.clear('stroke');
            Rune.canvas.clear('feedback');
        },
        /**
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            //sets the item as finished and initial review values
            Prompt.dataItem.set('finished', true);
            Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
            //checks if we should snap or just glow the result
            if (skritter.user.getSetting('squigs'))
                window.setTimeout(function() {
                    for (var i in Prompt.dataItem.get('character').models) {
                        var stroke = Prompt.dataItem.get('character').models[i];
                        Rune.canvas.tweenShape('background', stroke.getUserSprite(), stroke.getInflatedSprite());
                    }
                    Rune.canvas.setLayerAlpha('stroke', 0.3);
                    Rune.canvas.injectLayer('background', Prompt.gradeColorHex[Prompt.gradingButtons.grade()]);
                }, 50);
            this.load();
        },
        /**
         * @method handleDoubleTap
         */
        handleDoubleTap: function() {
            if (!Prompt.finished) {
                Prompt.gradingButtons.select(1).collapse();
                Rune.canvas.drawContainer('hint', Prompt.dataItem.get('character').targets[Prompt.dataItem.get('character').getVariationIndex()]
                        .getCharacterSprite(Prompt.dataItem.get('character').getExpectedStroke().get('position'), 'grey'), 0.3);
                // ISSUE #132: Also flash next stroke when full-character hint is requested.
                var nextStroke = Prompt.dataItem.get('character').getExpectedStroke();
                if (nextStroke)
                    Rune.canvas.drawShape('hint', nextStroke.getInflatedSprite('#87cefa'));
            }
        },
        /**
         * @method handleGradeSelected
         * @param {Number} grade
         */
        handleGradeSelected: function(grade) {
            Prompt.dataItem.review().set('score', Prompt.gradingButtons.grade());
            Rune.canvas.injectLayer('stroke', Prompt.gradeColorHex[grade]);
        },
        /**
         * @method handleInputDown
         */
        handleInputDown: function() {
            //ISSUE #60: thinking timer should stop when the first stroke is attempted
            skritter.timer.stopThinking();
            //fade hints when a new stroke is started
            Rune.canvas.fadeLayer('hint');
        },
        /**
         * @method handleInputUp
         * @param {Arrau} points
         * @param {CreateJS.Shape} shape
         */
        handleInputUp: function(points, shape) {
            this.process(points, shape);
        },
        /**
         * @method handleStrokeDrawn
         * @param {Backbone.Model} result
         */
        handleStrokeDrawn: function(result) {
            //prevents multiple simultaneous strokes from firing the character complete event
            result.set('isTweening', false);
            //check if the character has been completed yet or not with enforced tween checks
            if (Prompt.dataItem.get('character').getStrokeCount(true) >= Prompt.dataItem.get('character').getTargetStrokeCount() && !Rune.teaching)
                this.handleCharacterComplete();
        },
        /**
         * @method handleHold
         */
        handleHold: function() {
            Prompt.this.reset();
            Prompt.this.load();
            Rune.canvas.enableInput();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished())
                Prompt.this.next();
        },
        /**
         * @method handleTeachComplete
         */
        handleTeachComplete: function() {
            hammer(Prompt.this.$('#canvas-container')[0]).off('tap', Prompt.this.handleTeachComplete);
            Prompt.this.reset();
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.show.definition();
            Prompt.data.show.reading();
            Prompt.data.show.style();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                Rune.canvas.disableInput();
                Prompt.gradingButtons.select(Prompt.dataItem.getGrade()).collapse();
                if (Prompt.data.isLast()) {
                    Prompt.data.hide.question();
                    Prompt.data.show.sentence();
                }
                Prompt.data.show.writingAt(1);
                if (skritter.user.get('audio') && Prompt.dataItem.has('vocab'))
                    Prompt.dataItem.get('vocab').play();
                window.setTimeout(function() {
                    hammer(Prompt.this.$('#canvas-container')[0]).on('tap', Prompt.this.handleTap);
                }, 500);
            } else {
                hammer(Prompt.this.$('#canvas-container')[0]).off('tap', Prompt.this.handleTap);
                skritter.timer.start();
                Rune.canvas.enableInput();
                Prompt.data.show.question("How do you write it?");
                Prompt.data.show.sentenceMasked();
                Prompt.data.show.writingAt();
                if (skritter.user.get('audio') && Prompt.data.isFirst())
                    Prompt.data.vocab.play();
                if (Rune.teaching)
                    this.teach();
                    
            }
        },
        /**
         * @method process
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         * @param {Boolean} ignoreCheck
         * @param {Boolean} enforceOrder
         */
        process: function(points, shape, ignoreCheck, enforceOrder) {
            if (points.length > 0 && skritter.fn.getDistance(points[0], points[points.length - 1]) > Rune.minStrokeDistance) {
                //create the stroke from the points to analyze
                var stroke = new CanvasStroke().set('points', points);
                //recognize a stroke based on user input and targets
                var result = new Recognizer(Prompt.dataItem.get('character'),
                        stroke, Prompt.dataItem.get('character').targets).recognize(ignoreCheck, enforceOrder);
                //check if a result exists and that it's not a duplicate
                if (result && !Prompt.dataItem.get('character').containsStroke(result)) {
                    //get the expected stroke based on accepted stroke orders
                    var expected = Prompt.dataItem.get('character').getExpectedStroke(result);
                    //add the stroke to the users character
                    Prompt.dataItem.get('character').add(stroke);
                    //reset the failed attempts counter
                    Rune.failedAttempts = 0;
                    //choose whether to draw the stroke normally or using raw squigs
                    if (skritter.user.getSetting('squigs')) {
                        Rune.canvas.drawShape('stroke', shape);
                        this.handleStrokeDrawn(result);
                    } else {
                        //display feedback if it exists
                        if (result.get('feedback'))
                            Rune.canvas.showMessage(result.get('feedback').toUpperCase());
                        //mark the result as tweening and snap it
                        result.set('isTweening', true);
                        Rune.canvas.tweenShape('stroke', result.getUserSprite(), result.getInflatedSprite(), null, function() {
                            Prompt.this.handleStrokeDrawn(result);
                        });
                        //show a hint if the stroke wasn't in the expected order
                        if (expected && result.get('id') !== expected.get('id'))
                            Rune.canvas.drawShapePhantom('hint', Prompt.dataItem.get('character').getExpectedStroke().getInflatedSprite());
                    }
                    //ISSUE #63: show the grading buttons and grade color preemptively
                    if (Prompt.dataItem.get('character').getStrokeCount(false) >= Prompt.dataItem.get('character').getTargetStrokeCount() && !Rune.teaching) {
                        Rune.canvas.injectLayer('stroke', Prompt.gradeColorHex[Prompt.gradingButtons.grade()]);
                        Prompt.gradingButtons.select().collapse();
                    }
                    //display the next stroke when teaching mode is enabled
                    if (Rune.teaching)
                        this.teach();
                } else {
                    Rune.failedAttempts++;
                    //if failed too many times show a hint
                    if (Rune.failedAttempts > Rune.maxFailedAttempts) {
                        //ISSUE #64: display grading buttons immediately when failed
                        Prompt.gradingButtons.select(1).collapse();
                        //ISSUE #28: if the find the next stroke then don't try to show a hint
                        var nextStroke = Prompt.dataItem.get('character').getNextStroke();
                        if (nextStroke)
                            Rune.canvas.drawShapePhantom('hint', nextStroke.getInflatedSprite('#87cefa'));
                    }
                }
            }
        },
        /**
         * @method redraw
         */
        redraw: function() {
            Prompt.prototype.redraw.call(this);
            Prompt.this.clear();
            if (Prompt.dataItem.isFinished()) {
                Rune.canvas.drawContainer('stroke', Prompt.dataItem.get('character').getCharacterSprite(null, Prompt.gradeColorHex[Prompt.dataItem.getGrade()]));
            } else {
                Rune.canvas.drawContainer('stroke', Prompt.dataItem.get('character').getCharacterSprite());
            }
        },
        /**
         * @method reset
         */
        reset: function() {
            Prompt.gradingButtons.hide(true);
            Prompt.dataItem.get('character').reset();
            Prompt.dataItem.set('finished', false);
            this.clear();
        },
        /**
         * @method teach
         */
        teach: function() {
            Rune.teaching = true;
            Rune.canvas.clear('overlay');
            Prompt.gradingButtons.grade(1);
            var nextStroke = Prompt.dataItem.get('character').getNextStroke(true);
            if (nextStroke) {
                Rune.canvas.drawShape('overlay', nextStroke.getInflatedSprite('#87cefa'), 1);
            } else {
                Rune.canvas.showMessage('Click to try it from memory.', false);
                hammer(Prompt.this.$('#canvas-container')[0]).on('tap', this.handleTeachComplete);
            }
        }
    });

    return Rune;
});
define('require.text!templates/prompt-tone.html',[],function () { return '<div id="tone" class="prompt">\r\n    <div class="row">\r\n        <div id="info-container" class="col-md-4">\r\n            <!--<h4 class="prompt-question"></h4>-->\r\n            <div id="prompt-writing-box" class="prompt-box pull-left">\r\n                <div class="prompt-writing-buffer pull-left"></div>\r\n                <div class="font-size-large prompt-writing"></div>\r\n            </div>\r\n            <div id="prompt-reading-box" class="prompt-box pull-left">\r\n                <div class="font-size-normal prompt-reading"></div>\r\n            </div>\r\n            <div id="prompt-definition-box" class=" prompt-box">\r\n                <div class="prompt-heisig"></div>\r\n                <div class="prompt-definition"></div>\r\n            </div>\r\n            <div id="prompt-sentence-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-sentence"></span>\r\n            </div>\r\n            <div id="prompt-mnemonic-box" class="font-size-normal prompt-box">\r\n                <span class="prompt-mnemonic"></span>\r\n            </div>\r\n        </div>\r\n        <div id="input-container" class="col-md-8">\r\n            <div id="prompt-previous" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-left"></span></div>\r\n            <div id="prompt-next" class="prompt-nav-arrow"><span class="fa fa-3x fa-chevron-right"></span></div>\r\n            <div class="prompt-style"></div>\r\n            <div id="canvas-container"></div>\r\n            <div id="grading-container"></div>\r\n        </div>\r\n    </div>  \r\n</div>';});

/**
 * @module Skritter
 * @param templateTone
 * @param Canvas
 * @param CanvasStroke
 * @param LeapController
 * @param Prompt
 * @param Recognizer
 * @author Joshua McFarland
 */
define('views/prompts/PromptTone',[
    'require.text!templates/prompt-tone.html',
    'views/prompts/Canvas',
    'models/CanvasStroke',
    'models/LeapController',
    'views/prompts/Prompt',
    'Recognizer'
], function(templateTone, Canvas, CanvasStroke, LeapController, Prompt, Recognizer) {
    /**
     * @class PromptTone
     */
    var Tone = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(15);
            skritter.timer.setThinkingLimit(10);
            Tone.canvas = new Canvas();
            Tone.failedAttempts = 0;
            Tone.leap = new LeapController();
            Tone.maxFailedAttempts = 3;
            Tone.minStrokeDistance = 10;
            Tone.result = null;
            this.listenTo(Tone.canvas, 'input:down', this.handleInputDown);
            this.listenTo(Tone.canvas, 'input:up', this.handleInputUp);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTone);
            Tone.canvas.setElement(this.$('#canvas-container')).render();
            hammer(this.$('#canvas-container')[0]).on('hold', this.handleHold);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         */
        clear: function() {
            Tone.canvas.clear('background');
            Tone.canvas.clear('hint');
            Tone.canvas.clear('stroke');
            Tone.canvas.clear('feedback');
            Tone.canvas.setLayerAlpha('background', 1);
        },
        /**
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            //sets the item as finished and initial review values
            Prompt.dataItem.set('finished', true);
            Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
            //checks if we should snap or just glow the result
            if (skritter.user.getSetting('squigs')) {
                window.setTimeout(function() {
                    for (var i in Prompt.dataItem.get('character').models) {
                        var stroke = Prompt.dataItem.get('character').models[i];
                        console.log('stroke', stroke);
                        Tone.canvas.tweenShape('background', stroke.getUserSprite(), stroke.getInflatedSprite());
                    }
                    Tone.canvas.setLayerAlpha('stroke', 0.3);
                    Tone.canvas.injectLayer('background', Prompt.gradeColorHex[Prompt.gradingButtons.grade()]);
                }, 100);
            } else {
                Tone.canvas.injectLayer('stroke', Prompt.gradeColorHex[Prompt.gradingButtons.grade()]);
            }
            this.load();
        },
        /**
         * @method handleGradeSelected
         * @param {Number} grade
         */
        handleGradeSelected: function(grade) {
            Prompt.dataItem.review().set('score', Prompt.gradingButtons.grade());
            Tone.canvas.injectLayer('stroke', Prompt.gradeColorHex[grade]);
        },
        /**
         * @method handleInputDown
         */
        handleInputDown: function() {
            //ISSUE #60: thinking timer should stop when the first stroke is attempted
            skritter.timer.stopThinking();
            //fade hints when a new stroke is started
            Tone.canvas.fadeLayer('hint');
            //fade the background character to emphasize tone stroke
            if (!Prompt.dataItem.isFinished())
                Tone.canvas.setLayerAlpha('background', 0.7);
        },
        /**
         * @method handleInputUp
         * @param {Arrau} points
         * @param {CreateJS.Shape} shape
         */
        handleInputUp: function(points, shape) {
            this.process(points, shape);
        },
        /**
         * @method handleStrokeDrawn
         * @param {Backbone.Model} result
         */
        handleStrokeDrawn: function(result) {
            //prevents multiple simultaneous strokes from firing the character complete event
            result.set('isTweening', false);
            //check if the character has been completed yet or not with enforced tween checks
            if (Prompt.dataItem.get('character').getStrokeCount(true) >= Prompt.dataItem.get('character').getTargetStrokeCount())
                this.handleCharacterComplete();
        },
        /**
         * @method handleHold
         */
        handleHold: function() {
            Prompt.this.reset();
            Prompt.this.load();
            Tone.canvas.enableInput();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished())
                Prompt.this.next();
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Tone.canvas.clear('background');
            Tone.canvas.drawCharacterFromFont('background', Prompt.data.vocab.getCharacters()[Prompt.data.position - 1], Prompt.data.vocab.getFontName(), 1, '#000000');
            Prompt.data.show.definition();
            Prompt.data.show.style();
            Prompt.data.show.writing();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                Tone.canvas.disableInput();
                Prompt.gradingButtons.select(Prompt.dataItem.getGrade()).collapse();
                if (Prompt.data.isLast())
                    Prompt.data.hide.question();
                Prompt.data.show.readingAt(0, true);
                if (skritter.user.get('audio') && Prompt.data.isLast()) {
                    Prompt.data.vocab.play();
                } else if (skritter.user.get('audio')) {
                    Prompt.dataItem.get('vocab').play();
                }
                window.setTimeout(function() {
                    hammer(Prompt.this.$('#canvas-container')[0]).on('tap', Prompt.this.handleTap);
                }, 500);
            } else {
                hammer(Prompt.this.$('#canvas-container')[0]).off('tap', Prompt.this.handleTap);
                skritter.timer.start();
                Tone.canvas.enableInput();
                Prompt.data.show.question("Which tone is it?");
                Prompt.data.show.readingAt();
            }
        },
        /**
         * @method process
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         * @param {Boolean} ignoreCheck
         * @param {Boolean} enforceOrder
         */
        process: function(points, shape, ignoreCheck, enforceOrder) {
            if (points.length > 0 && skritter.fn.getDistance(points[0], points[points.length - 1]) > Tone.minStrokeDistance) {
                //check that a minimum distance is met
                if (skritter.fn.getDistance(points[0], points[points.length - 1]) > Tone.minStrokeDistance) {
                    //create the stroke from the points to analyze
                    var stroke = new CanvasStroke().set('points', points);
                    //recognize a stroke based on user input and targets
                    var result = new Recognizer(Prompt.dataItem.get('character'), stroke, Prompt.dataItem.get('character').targets).recognize(ignoreCheck, enforceOrder);
                    //check if a result exists and that it's not a duplicate
                    if (result && !Prompt.dataItem.get('character').containsStroke(result)) {
                        //store the result for resizing later if needed
                        Tone.result = result;
                        //select the grade as 3 for a corrent answer
                        Prompt.gradingButtons.select(3);
                        //add the stroke to the users character
                        Prompt.dataItem.get('character').add(result);
                        //draw the stroke on the canvas without tweening
                        Tone.canvas.tweenShape('stroke', result.getUserSprite(), result.getInflatedSprite());

                    } else {
                        //store the result for resizing later if needed
                        Tone.result = Prompt.dataItem.get('character').targets[0].at(0);
                        Prompt.dataItem.get('character').add(Tone.result);
                        //markes the incorrect answer as grade 1
                        Prompt.gradingButtons.select(1).collapse();
                        //fade incorrect strokes out
                        Tone.canvas.fadeShape('background', shape);
                        //select the first possible tone and display it as wrong
                        Tone.canvas.drawShape('stroke', Tone.result.getInflatedSprite());
                    }
                }
            } else {
                //ISSUE #69: count clicks as a neutral fifth tone
                var index = _.pluck(Prompt.dataItem.get('character').targets, 'name').indexOf('tone5');
                if (index >= 0) {
                    Prompt.gradingButtons.select(3).collapse();
                    Tone.result = Prompt.dataItem.get('character').targets[index].at(0);
                    Prompt.dataItem.get('character').add(Tone.result);
                    Tone.canvas.drawShape('stroke', Tone.result.getInflatedSprite());
                } else {
                    Prompt.gradingButtons.select(1).collapse();
                    Tone.result = Prompt.dataItem.get('character').targets[0].at(0);
                    Prompt.dataItem.get('character').add(Tone.result);
                    Tone.canvas.drawShape('stroke', Tone.result.getInflatedSprite());
                }
            }
            this.handleCharacterComplete();
        },
        /**
         * @method redraw
         */
        redraw: function() {
            Prompt.prototype.redraw.call(this);
            Prompt.this.clear();
            Tone.canvas.drawCharacterFromFont('background', Prompt.data.vocab.getCharacters()[Prompt.data.position - 1], Prompt.data.vocab.getFontName(), 1, '#000000');
            if (Prompt.dataItem.isFinished()) {
                Tone.canvas.drawContainer('stroke', Prompt.dataItem.get('character').getCharacterSprite(null, Prompt.gradeColorHex[Prompt.dataItem.getGrade()]));
            } else {
                Tone.canvas.drawContainer('stroke', Prompt.dataItem.get('character').getCharacterSprite());
            }
        },
        /**
         * @method reset
         */
        reset: function() {
            Prompt.gradingButtons.hide(true);
            Prompt.dataItem.get('character').reset();
            this.clear();
        }
    });

    return Tone;
});
/**
 * @module Skritter
 * @param templateStudy
 * @param PromptDefn
 * @param PromptRdng
 * @param PromptRune
 * @param PromptTone
 * @author Joshua McFarland
 */
define('views/Study',[
    'require.text!templates/study.html',
    'views/prompts/PromptDefn',
    'views/prompts/PromptRdng',
    'views/prompts/PromptRune',
    'views/prompts/PromptTone'
], function(templateStudy, PromptDefn, PromptRdng, PromptRune, PromptTone) {
    /**
     * @class StudyView
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Study.this = this;
            Study.history = [];
            Study.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            //skritter.scheduler.filter({ids: ['mcfarljwtest3-ja-～ヶ月-0-rune']});
            //skritter.scheduler.filter({parts: ['rdng']});
            skritter.timer.setElement(this.$('#timer')).render();
            this.updateDueCount();
            if (skritter.scheduler.getItemCount() === 0) {
                console.log(skritter);
                skritter.router.navigate('/', {trigger: true});
            } else {
                if (Study.prompt) {
                    this.loadPrompt();
                } else {
                    this.nextPrompt();
                }
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #study-view #add-button': 'handleAddClicked',
            'click.Study #study-view #audio-button': 'playAudio',
            'click.Study #study-view #info-button': 'navigateVocabsInfo'
        },
        /**
         * @method checkAutoSync
         */
        checkAutoSync: function() {
            if (skritter.user.get('autoSync') && (skritter.user.get('autoSyncThreshold') < skritter.data.reviews.getCount()))
                skritter.user.sync();
        },
        /**
         * @method clearPrompt
         * @returns {Backbone.View}
         */
        clearPrompt: function() {
            Study.prompt = null;
            return this;
        },
        /**
         * @method handleAddClicked
         * @param {Object} event
         */
        handleAddClicked: function(event) {
            event.preventDefault();
            skritter.modal.show('add-items').setTitle('How many items would you like to add?');
            this.listenToOnce(skritter.modal, 'addItemsClicked', function(quantity) {
                skritter.modal.show('progress').setTitle('Adding Items').setProgress(100);
                skritter.user.addItems(quantity, function() {
                    skritter.modal.setProgress(100, 'Rescheduling');
                    skritter.scheduler.loadAll(function() {
                        Study.this.updateDueCount();
                        skritter.modal.hide();
                    });
                });
            });
        },
        /**
         * @method handlePromptComplete
         */
        handlePromptComplete: function() {
            Study.history.push(Study.prompt);
            Study.this.updateDueCount();
            this.nextPrompt();
        },
        loadPrompt: function() {
            Study.prompt.setElement(this.$('#prompt-container'));
            Study.prompt.render().load();
        },
        /**
         * @method navigateVocabsInfo
         * @param {Object} event
         */
        navigateVocabsInfo: function(event) {
            if (Study.prompt)
                skritter.router.navigate('vocab/' + Study.prompt.data().vocab.get('lang') + '/' + Study.prompt.data().vocab.get('writing'), {trigger: true});
            event.preventDefault();
        },
        nextPrompt: function() {
            if (!Study.prompt || Study.prompt.data().isLast()) {
                this.checkAutoSync();
                skritter.scheduler.getNext(function(item) {
                    switch (item.get('part')) {
                        case 'defn':
                            Study.prompt = new PromptDefn();
                            break;
                        case 'rdng':
                            Study.prompt = new PromptRdng();
                            break;
                        case 'rune':
                            Study.prompt = new PromptRune();
                            break;
                        case 'tone':
                            Study.prompt = new PromptTone();
                            break;
                    }
                    Study.prompt.set(item.getPromptData());
                    Study.this.listenToOnce(Study.prompt, 'complete', Study.this.handlePromptComplete);
                    Study.this.listenToOnce(Study.prompt, 'previous', Study.this.previousPrompt);
                    Study.this.toggleAudioButton();
                    Study.this.loadPrompt();
                });
            } else {
                Study.prompt.next();
            }
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            Study.prompt.data().vocab.play();
            event.preventDefault();
        },
        previousPrompt: function() {
            if (Study.prompt)
                if (Study.history.length > 0) {
                    console.log('historic prompts exist');
                    /*Study.prompt = Study.history[0];
                    Study.this.loadPrompt();*/
                } else {
                    console.log('no historic prompt');
                }
        },
        /**
         * @method toggleAudioButton
         */
        toggleAudioButton: function() {
            if (Study.prompt.data().vocab.has('audio')) {
                Study.this.$('#audio-button span').removeClass('fa fa-volume-off');
                Study.this.$('#audio-button span').addClass('fa fa-volume-up');
            } else {
                Study.this.$('#audio-button span').removeClass('fa fa-volume-up');
                Study.this.$('#audio-button span').addClass('fa fa-volume-off');
            }
        },
        updateDueCount: function() {
            Study.this.$('#items-due').text(skritter.scheduler.getDueCount());
        }
    });
    
    return Study;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('views/Tests',[],function() {
    /**
     * @class Tests
     */
    var Tests = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Tests.jasmineEnv = jasmine.getEnv();
            Tests.htmlReporter = new jasmine.HtmlReporter();
            Tests.specs = [
                'spec/Functions',
                'spec/PinyinConverter',
                'spec/models/Api',
                'spec/models/Assets',
                'spec/models/study/Decomp',
            ];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            Tests.jasmineEnv.updateInterval = 1000;
            Tests.jasmineEnv.addReporter(Tests.htmlReporter);
            Tests.jasmineEnv.specFilter = this.filterSpec;
            requirejs(Tests.specs, function() {
                Tests.jasmineEnv.execute();
            });
            return this;
        },
        /**
         * @method filterSpec
         * @param {Object} spec
         * @returns {Boolean}
         */
        filterSpec: function(spec) {
            return Tests.htmlReporter.specFilter(spec);
        }
    });

    return Tests;
});
define('require.text!templates/component-contained-table.html',[],function () { return '<table id="contained-table" class="table table-hover">\r\n    <tbody></tbody>\r\n</table>';});

/**
 * @module Skritter
 * @param templateContainedTable
 * @author Joshua McFarland
 */
define('views/components/ContainedTable',[
    'require.text!templates/component-contained-table.html'
], function(templateContainedTable) {
    /**
     * @class ContainedTable
     */
    var ContainedTable = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            ContainedTable.vocabs = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.append(templateContainedTable);
            this.$('tbody').html('');
            if (ContainedTable.vocabs && ContainedTable.vocabs.length > 1) {
                for (var i in ContainedTable.vocabs) {
                    var containedVocab = ContainedTable.vocabs[i];
                    var divA = "<tr id='" + containedVocab.get('id') + "' class='contained-row cursor'>";
                    divA += "<td class='writing'>" + containedVocab.get('writing') + "</td>";
                    divA += "<td class='reading'>" + containedVocab.getReading() + ": </td>";
                    divA += "<td class='definition'>" + containedVocab.getDefinition() + "</td>";
                    divA += "</tr>";
                    this.$('tbody').append(divA);
                }
            } else {
                this.$el.hide();
            }
            return this;
        },
        /**
         * @method set
         * @param {Array} containedVocabs
         * @returns {Backbone.View}
         */
        set: function(containedVocabs) {
            ContainedTable.vocabs = containedVocabs;
            return this;
        }
    });
    
    return ContainedTable;
});
define('require.text!templates/component-decomp-table.html',[],function () { return '<table id="decomp-table" class="table table-hover">\r\n    <tbody></tbody>\r\n</table>';});

/**
 * @module Skritter
 * @param templateDecompTable
 * @author Joshua McFarland
 */
define('views/components/DecompTable',[
    'require.text!templates/component-decomp-table.html'
], function(templateDecompTable) {
    /**
     * @class DecompTable
     */
    var DecompTable = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            DecompTable.decomps = [];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.append(templateDecompTable);
            this.$('tbody').html('');
            if (DecompTable.decomps.length > 0) {
                for (var i in DecompTable.decomps) {
                    var decomp = DecompTable.decomps[i];
                    var divB = "<tr class='cursor decomp-item'>";
                    divB += "<td class='writing'>" + decomp.writing + "</td>";
                    divB += "<td class='reading'>" + decomp.reading+ "</td>";
                    divB += "<td class='definition'>" + decomp.definitions.en + "</td>";
                    divB += "</tr>";
                    this.$('tbody').append(divB);
                }
            } else {
                this.$el.hide();
            }
            
            return this;
        },
        /**
         * @method set
         * @param {Array} decomps
         * @returns {Backbone.View}
         */
        set: function(decomps) {
            DecompTable.decomps = decomps;
            return this;
        }
    });

    return DecompTable;
});
/**
 * @module Skritter
 * @class SimpTradMap
 * @author Joshua McFarland
 */
define('SimpTradMap',[],function() {
    /**
     * @property {Object} map
     */
    var map = {
        "怀": "懷",
        "挂": "掛",
        "瞩": "矚",
        "谈": "談",
        "厍": "厙",
        "随": "隨",
        "锎": "鐦",
        "馑": "饉",
        "鲓": "鮳",
        "徕": "徠",
        "芗": "薌",
        "贞": "貞",
        "钣": "鈑",
        "嘤": "嚶",
        "骧": "驤",
        "悫": "愨慤",
        "弪": "弳",
        "戬": "戩",
        "欲": "欲慾",
        "临": "臨",
        "犷": "獷",
        "电": "電",
        "场": "場",
        "宽": "寬",
        "线": "線綫",
        "盏": "盞",
        "镎": "鎿",
        "㧑": "撝",
        "弹": "彈",
        "鳓": "鰳",
        "鹔": "鷫",
        "麸": "麩",
        "话": "話",
        "滟": "灧",
        "赞": "贊讚",
        "铣": "銑",
        "卢": "盧",
        "饦": "飥",
        "巩": "鞏",
        "惫": "憊",
        "扬": "揚",
        "闹": "鬧",
        "驼": "駝",
        "绿": "綠緑",
        "沈": "瀋",
        "辊": "輥",
        "阏": "閼",
        "颐": "頤",
        "缕": "縷",
        "应": "應",
        "戗": "戧",
        "浅": "淺",
        "颛": "顓",
        "涞": "淶",
        "吣": "唚",
        "厢": "廂",
        "鲨": "鯊",
        "薮": "藪",
        "谳": "讞",
        "讲": "講",
        "纟": "糹",
        "爷": "爺",
        "锹": "鍬",
        "咸": "咸鹹",
        "砻": "礱",
        "鸿": "鴻",
        "胀": "脹",
        "视": "視",
        "赉": "賚",
        "飐": "颭",
        "录": "錄録",
        "绔": "絝",
        "跞": "躒",
        "靥": "靨",
        "荭": "葒",
        "䙓": "襬",
        "诲": "誨",
        "轵": "軹",
        "凶": "凶兇",
        "铸": "鑄",
        "须": "須鬚",
        "广": "广廣",
        "哔": "嗶",
        "缪": "繆",
        "殇": "殤",
        "渊": "淵",
        "后": "后後",
        "频": "頻",
        "暂": "暫",
        "缔": "締",
        "㻘": "𤪺",
        "蒙": "蒙矇懞",
        "辟": "辟闢",
        "谞": "諝",
        "箧": "篋",
        "鲩": "鯇",
        "鸪": "鴣",
        "鲳": "鯧",
        "亵": "褻",
        "妈": "媽",
        "钹": "鈸",
        "锸": "鍤",
        "离": "離",
        "笼": "籠",
        "胁": "脅",
        "诇": "詗",
        "浈": "湞",
        "飑": "颮",
        "绕": "繞",
        "䁖": "瞜",
        "赋": "賦",
        "槛": "檻",
        "虚": "虛",
        "迟": "遲",
        "鹪": "鷦",
        "荬": "蕒",
        "潴": "瀦",
        "号": "號",
        "铹": "鐒",
        "啸": "嘯",
        "筼": "篔",
        "鱾": "魢",
        "态": "態",
        "节": "節",
        "瘘": "瘺瘻",
        "构": "構",
        "袆": "褘",
        "刍": "芻",
        "厌": "厭",
        "璎": "瓔",
        "堑": "塹",
        "馐": "饈",
        "骒": "騍",
        "褛": "褸",
        "伟": "偉",
        "䲞": "𩶘",
        "锣": "鑼",
        "劢": "勱",
        "颦": "顰",
        "纪": "紀",
        "术": "術",
        "贳": "貰",
        "鲾": "鰏",
        "硷": "礆",
        "裆": "襠",
        "汉": "漢",
        "牍": "牘",
        "双": "雙",
        "坏": "壞",
        "铎": "鐸",
        "嫒": "嬡",
        "鹕": "鶘",
        "雏": "雛",
        "诜": "詵",
        "泞": "濘",
        "几": "几幾",
        "镣": "鐐",
        "㱩": "殰",
        "兽": "獸",
        "廪": "廩",
        "卷": "卷捲",
        "闸": "閘",
        "饻": "餏",
        "驽": "駑",
        "导": "導",
        "齿": "齒",
        "辉": "輝",
        "咏": "詠",
        "库": "庫",
        "尔": "爾",
        "悮": "悞",
        "沟": "溝",
        "伞": "傘",
        "删": "刪",
        "嚣": "囂",
        "颧": "顴",
        "鸨": "鴇",
        "戆": "戇",
        "讱": "訒",
        "谴": "譴",
        "锺": "鍾",
        "岿": "巋",
        "讴": "謳",
        "摄": "攝",
        "么": "麼麽幺",
        "勋": "勛",
        "赊": "賒",
        "铏": "鉶",
        "篑": "簣",
        "结": "結",
        "与": "與",
        "学": "學",
        "鹨": "鷚",
        "诱": "誘",
        "践": "踐",
        "秽": "穢",
        "胫": "脛",
        "撄": "攖",
        "标": "標",
        "琏": "璉",
        "骐": "騏",
        "馒": "饅",
        "鲔": "鮪",
        "镮": "鐶",
        "袜": "襪",
        "谟": "謨",
        "辞": "辭",
        "猡": "玀",
        "锥": "錐",
        "咤": "吒",
        "箦": "簀",
        "缩": "縮",
        "纨": "紈",
        "悬": "懸",
        "贵": "貴",
        "圹": "壙",
        "䍁": "繸",
        "识": "識",
        "惧": "懼",
        "筑": "筑築",
        "鹓": "鵷",
        "鳔": "鰾",
        "䝙": "貙",
        "连": "連",
        "癣": "癬",
        "镥": "鑥",
        "铤": "鋌",
        "绨": "綈",
        "扫": "掃",
        "腭": "齶",
        "惬": "愜",
        "峄": "嶧",
        "赵": "趙",
        "叶": "葉",
        "驻": "駐",
        "闺": "閨",
        "饽": "餑",
        "宫": "宮",
        "鱿": "魷",
        "忾": "愾",
        "怂": "慫",
        "榇": "櫬",
        "争": "爭",
        "压": "壓",
        "谊": "誼",
        "阎": "閻",
        "骑": "騎",
        "鲕": "鮞",
        "帮": "幫",
        "涟": "漣",
        "务": "務",
        "钥": "鑰",
        "唤": "喚",
        "毂": "轂",
        "纩": "纊",
        "缨": "纓",
        "馆": "館",
        "悭": "慳",
        "贴": "貼",
        "制": "制製",
        "礼": "禮",
        "鸾": "鸞",
        "苁": "蓯",
        "䍀": "繿",
        "聂": "聶",
        "觇": "覘",
        "鳕": "鱈",
        "诛": "誅",
        "占": "占佔",
        "㓥": "劏",
        "镤": "鏷",
        "绩": "績",
        "惭": "慚",
        "虮": "蟣",
        "迳": "逕",
        "赇": "賕",
        "寻": "尋",
        "饼": "餅",
        "鹾": "鹺",
        "搅": "攪",
        "辈": "輩",
        "册": "冊",
        "锏": "鐧",
        "缓": "緩",
        "颒": "頮",
        "昙": "曇",
        "负": "負",
        "圣": "聖",
        "窦": "竇",
        "鸩": "鴆",
        "粪": "糞",
        "骜": "驁",
        "樱": "櫻",
        "记": "記",
        "谵": "譫",
        "状": "狀",
        "婵": "嬋",
        "钺": "鉞",
        "纾": "紓",
        "权": "權",
        "摅": "攄",
        "碍": "礙",
        "义": "義",
        "迈": "邁",
        "里": "里裡裏",
        "镏": "鎦",
        "穑": "穡",
        "当": "當噹",
        "飒": "颯",
        "赟": "贇",
        "滞": "滯",
        "叠": "疊",
        "饧": "餳",
        "鹩": "鷯",
        "荫": "蔭",
        "蛮": "蠻",
        "橱": "櫥",
        "诰": "誥",
        "轳": "轤",
        "铕": "銪",
        "铺": "鋪",
        "顽": "頑",
        "绾": "綰",
        "搀": "攙",
        "肃": "肅",
        "莅": "蒞",
        "榉": "櫸",
        "栈": "棧",
        "钋": "釙",
        "阌": "閿",
        "颓": "頹頽",
        "缒": "縋",
        "暗": "暗闇",
        "挚": "摯",
        "东": "東",
        "疡": "瘍",
        "级": "級",
        "妩": "嫵",
        "枭": "梟",
        "趱": "趲",
        "谰": "讕",
        "讵": "詎",
        "锶": "鍶",
        "鲻": "鯔",
        "区": "區",
        "鸼": "鵃",
        "杂": "雜",
        "浆": "漿",
        "觉": "覺",
        "铋": "鉍",
        "飓": "颶",
        "归": "歸",
        "钸": "鈽",
        "荚": "莢",
        "违": "違",
        "面": "面麵",
        "继": "繼",
        "孪": "孿",
        "虬": "虯",
        "轲": "軻",
        "毵": "毿",
        "镶": "鑲",
        "系": "系係繫",
        "饾": "餖",
        "怃": "憮",
        "缥": "縹",
        "万": "萬",
        "眍": "瞘",
        "鲐": "鮐",
        "笕": "筧",
        "骔": "騌",
        "谛": "諦",
        "躜": "躦",
        "锡": "錫",
        "钠": "鈉",
        "鸧": "鶬",
        "箪": "簞",
        "蚬": "蜆",
        "戯": "戱",
        "贱": "賤",
        "玺": "璽",
        "纼": "紖",
        "镴": "鑞",
        "裈": "褌",
        "诊": "診",
        "鳐": "鰩",
        "唢": "嗩",
        "嫔": "嬪",
        "䗖": "螮",
        "觞": "觴",
        "镡": "鐔",
        "铠": "鎧",
        "鹧": "鷓",
        "饩": "餼",
        "飨": "饗",
        "闶": "閌",
        "兹": "茲",
        "郸": "鄲",
        "类": "類",
        "综": "綜",
        "驿": "驛",
        "秾": "穠",
        "奥": "奧",
        "辇": "輦",
        "谆": "諄",
        "弃": "棄",
        "鲑": "鮭",
        "馓": "饊",
        "䢂": "𨋢",
        "骕": "驌",
        "笔": "筆",
        "涛": "濤",
        "匮": "匱",
        "钡": "鋇",
        "锠": "錩",
        "贰": "貳",
        "点": "點",
        "纽": "紐",
        "砾": "礫",
        "担": "擔",
        "过": "過",
        "鳑": "鰟",
        "鹒": "鶊",
        "黪": "黲",
        "潜": "潛",
        "诟": "詬",
        "铡": "鍘",
        "镠": "鏐",
        "卤": "鹵滷",
        "忧": "憂",
        "屦": "屨",
        "饨": "飩",
        "瑶": "瑤",
        "牺": "犧",
        "绽": "綻",
        "寿": "壽",
        "顾": "顧",
        "搁": "擱",
        "蚂": "螞",
        "栉": "櫛",
        "榈": "櫚",
        "锋": "鋒",
        "誊": "謄",
        "阍": "閽",
        "蜗": "蝸",
        "抚": "撫",
        "丝": "絲",
        "澜": "瀾",
        "疠": "癘",
        "岚": "嵐",
        "鳇": "鰉",
        "缧": "縲",
        "鲦": "鰷",
        "媪": "媼",
        "肮": "骯",
        "谱": "譜",
        "亲": "親",
        "殴": "毆",
        "钶": "鈳",
        "鸽": "鴿",
        "潇": "瀟",
        "览": "覽",
        "镋": "鎲",
        "协": "協",
        "鼍": "鼉",
        "绒": "絨",
        "赛": "賽",
        "远": "遠",
        "团": "團糰",
        "剥": "剝",
        "峦": "巒",
        "药": "藥葯",
        "惮": "憚",
        "浒": "滸",
        "说": "說説",
        "征": "徵征",
        "银": "銀",
        "极": "极極",
        "蔂": "虆",
        "怄": "慪",
        "同": "同衕",
        "猎": "獵",
        "帐": "帳",
        "骓": "騅",
        "馕": "饢",
        "战": "戰",
        "脚": "腳",
        "涝": "澇",
        "谜": "謎",
        "锢": "錮",
        "鲧": "鯀",
        "缦": "縵",
        "箩": "籮",
        "断": "斷",
        "悯": "憫",
        "丰": "丰豐",
        "飔": "颸",
        "贲": "賁",
        "钷": "鉕",
        "纻": "紵",
        "㶽": "煱",
        "笾": "籩",
        "踊": "踴",
        "潆": "瀠",
        "诉": "訴",
        "郏": "郟",
        "华": "華",
        "鹐": "鵮",
        "托": "托託",
        "镢": "钁鐝",
        "彦": "彥",
        "饪": "飪",
        "惯": "慣",
        "据": "據",
        "买": "買",
        "铷": "銣",
        "叹": "嘆",
        "绻": "綣",
        "籼": "秈",
        "签": "簽籤",
        "蚀": "蝕",
        "氇": "氌",
        "辆": "輛",
        "阋": "鬩",
        "锍": "鋶",
        "钌": "釕",
        "缑": "緱",
        "庐": "廬",
        "颔": "頷",
        "丛": "叢",
        "荮": "葤",
        "贝": "貝",
        "霡": "霢",
        "尧": "堯",
        "蹰": "躕",
        "骝": "騮",
        "妪": "嫗",
        "龟": "龜",
        "犸": "獁",
        "帻": "幘",
        "鲼": "鱝",
        "宾": "賓",
        "汇": "匯彙滙",
        "觊": "覬",
        "镍": "鎳",
        "铌": "鈮",
        "灏": "灝",
        "网": "网網",
        "绐": "紿",
        "浏": "瀏",
        "荙": "薘",
        "赝": "贗贋",
        "诞": "誕",
        "㛠": "𡢃",
        "虫": "虫蟲",
        "鱼": "魚",
        "轱": "軲",
        "瑷": "璦",
        "矶": "磯",
        "顿": "頓",
        "蚁": "蟻",
        "踪": "蹤",
        "誉": "譽",
        "栊": "櫳",
        "钍": "釷",
        "锌": "鋅",
        "庑": "廡",
        "箓": "籙",
        "颕": "頴",
        "斗": "斗鬥鬦鬪鬭",
        "蘖": "櫱",
        "氢": "氫",
        "䲝": "䱽",
        "厣": "厴",
        "傥": "儻",
        "谇": "誶",
        "带": "帶",
        "枫": "楓",
        "讳": "諱",
        "氲": "氳",
        "褴": "襤",
        "喷": "噴",
        "阶": "階",
        "犹": "猶",
        "债": "債",
        "鲽": "鰈",
        "杀": "殺",
        "获": "獲穫",
        "响": "響",
        "镌": "鐫鎸",
        "减": "減",
        "绑": "綁",
        "齐": "齊",
        "篓": "簍",
        "飕": "颼",
        "晖": "暉",
        "进": "進",
        "赜": "賾",
        "槟": "檳",
        "弑": "弒",
        "鹦": "鸚",
        "轰": "轟",
        "诳": "誑",
        "闷": "悶",
        "驾": "駕",
        "郁": "郁鬱",
        "范": "範",
        "怅": "悵",
        "了": "了瞭",
        "鬓": "鬢",
        "鲒": "鮚",
        "堕": "墮",
        "馔": "饌",
        "伛": "傴",
        "谝": "諞",
        "椟": "櫝",
        "钢": "鋼",
        "紧": "緊",
        "台": "台檯臺颱",
        "箨": "籜",
        "粜": "糶",
        "锷": "鍔",
        "赈": "賑",
        "刹": "剎",
        "邺": "鄴",
        "尽": "儘盡",
        "痴": "痴癡",
        "祷": "禱",
        "浇": "澆",
        "仆": "仆僕",
        "诈": "詐",
        "鹑": "鶉",
        "鳒": "鰜",
        "硕": "碩",
        "铢": "銖",
        "遥": "遙",
        "凤": "鳳",
        "绦": "絛縧",
        "乱": "亂",
        "彻": "徹",
        "图": "圖",
        "鱽": "魛",
        "饿": "餓",
        "䦁": "𨧜",
        "栀": "梔",
        "辅": "輔",
        "颋": "頲",
        "铙": "鐃",
        "钓": "釣",
        "缂": "緙",
        "阔": "闊",
        "谘": "諮",
        "厮": "廝",
        "鲣": "鰹",
        "鸤": "鳲",
        "吨": "噸",
        "训": "訓",
        "躯": "軀",
        "贮": "貯",
        "尸": "尸屍",
        "邻": "鄰",
        "强": "強",
        "锾": "鍰",
        "见": "見",
        "苇": "葦",
        "摈": "擯",
        "经": "經",
        "渌": "淥",
        "凑": "湊",
        "铓": "鋩",
        "鸻": "鴴",
        "鳣": "鱣",
        "鹤": "鶴",
        "酦": "醱",
        "闩": "閂",
        "周": "周週",
        "语": "語",
        "饶": "饒",
        "叽": "嘰",
        "㛿": "𡠹",
        "椁": "槨",
        "调": "調",
        "验": "驗",
        "帏": "幃",
        "吓": "嚇",
        "䴙": "鷿",
        "辚": "轔",
        "挝": "撾",
        "芜": "蕪",
        "绪": "緒",
        "颠": "顛",
        "弥": "彌瀰",
        "纤": "纖縴",
        "锩": "錈",
        "钨": "鎢",
        "踯": "躑",
        "脱": "脫",
        "莲": "蓮",
        "鲸": "鯨",
        "逻": "邏",
        "瘿": "癭",
        "轴": "軸",
        "检": "檢",
        "诂": "詁",
        "髌": "髕",
        "鹏": "鵬",
        "兑": "兌",
        "郐": "鄶",
        "呓": "囈",
        "赙": "賻",
        "捝": "挩",
        "齑": "齏",
        "绤": "綌",
        "剧": "劇",
        "镩": "鑹",
        "铨": "銓",
        "韪": "韙",
        "蛴": "蠐",
        "驷": "駟",
        "偻": "僂",
        "闾": "閭",
        "溅": "濺",
        "怆": "愴",
        "蒉": "蕢",
        "馋": "饞",
        "骍": "騂",
        "划": "划劃",
        "栖": "棲",
        "䴘": "鷈",
        "业": "業",
        "挜": "掗",
        "颡": "顙",
        "纥": "紇",
        "缤": "繽",
        "逦": "邐",
        "钩": "鉤鈎",
        "锨": "杴鍁",
        "瘪": "癟",
        "谮": "譖",
        "朴": "樸",
        "鲹": "鰺",
        "冻": "凍",
        "鸺": "鵂",
        "棁": "梲",
        "跃": "躍",
        "仅": "僅",
        "雠": "讎",
        "䙊": "𧜵",
        "忏": "懺",
        "郑": "鄭",
        "雕": "雕鵰彫琱",
        "诗": "詩",
        "赘": "贅",
        "钎": "釺",
        "荜": "蓽",
        "绥": "綏",
        "铩": "鎩",
        "镨": "鐠",
        "亏": "虧",
        "豮": "豶",
        "顶": "頂",
        "击": "擊",
        "矿": "礦",
        "䦀": "𨦫",
        "辄": "輒",
        "镭": "鐳",
        "缏": "緶",
        "鲎": "鱟",
        "锓": "鋟",
        "阕": "闋",
        "谙": "諳",
        "䯅": "䯀",
        "亚": "亞",
        "骢": "驄",
        "鸥": "鷗",
        "驳": "駁",
        "昵": "昵暱",
        "嬷": "嬤",
        "纺": "紡",
        "刽": "劊",
        "钾": "鉀",
        "赃": "贓贜",
        "胆": "膽",
        "奋": "奮",
        "蛊": "蠱",
        "鳎": "鰨",
        "镓": "鎵",
        "陕": "陝",
        "滚": "滾",
        "擞": "擻",
        "鹥": "鷖",
        "卧": "臥",
        "烦": "煩",
        "㑩": "儸",
        "门": "門",
        "诬": "誣",
        "软": "軟",
        "谩": "謾",
        "壶": "壺",
        "养": "養",
        "绺": "綹",
        "链": "鏈",
        "殁": "歿",
        "溃": "潰",
        "谄": "諂",
        "骋": "騁",
        "馍": "饃",
        "鲏": "鮍",
        "缎": "緞",
        "玑": "璣",
        "搂": "摟",
        "辙": "轍",
        "抛": "拋",
        "怜": "憐",
        "审": "審",
        "纣": "紂",
        "傧": "儐",
        "匦": "匭",
        "垩": "堊",
        "锪": "鍃",
        "莱": "萊",
        "舰": "艦",
        "鸸": "鴯",
        "钿": "鈿",
        "毁": "毀",
        "荆": "荊",
        "髋": "髖",
        "种": "種",
        "鳏": "鰥",
        "发": "發髮",
        "剐": "剮",
        "这": "這",
        "赚": "賺",
        "蓟": "薊",
        "绣": "繡綉",
        "祢": "禰",
        "烧": "燒",
        "韩": "韓",
        "陨": "隕",
        "镪": "鏹",
        "衬": "襯",
        "轮": "輪",
        "扰": "擾",
        "蛳": "螄",
        "幸": "幸倖",
        "铿": "鏗",
        "复": "復複",
        "颌": "頜",
        "阓": "闠",
        "锕": "錒",
        "钔": "鍆",
        "栗": "栗慄",
        "亘": "亙",
        "枞": "樅",
        "骠": "驃",
        "鸣": "鳴",
        "粤": "粵",
        "厦": "廈",
        "粝": "糲",
        "椭": "橢",
        "谯": "譙",
        "鼹": "鼴",
        "纸": "紙",
        "炼": "煉",
        "观": "觀",
        "赅": "賅",
        "蝉": "蟬",
        "镕": "鎔",
        "铔": "錏",
        "诖": "詿",
        "余": "余餘",
        "胜": "勝",
        "鹣": "鶼",
        "峤": "嶠",
        "痪": "瘓",
        "闪": "閃",
        "赓": "賡",
        "䇲": "筴",
        "顷": "頃",
        "绸": "綢",
        "酽": "釅",
        "矾": "礬",
        "较": "較",
        "舆": "輿",
        "颍": "潁",
        "递": "遞",
        "钕": "釹",
        "锔": "鋦",
        "优": "優",
        "谚": "諺",
        "诡": "詭",
        "嗫": "囁",
        "骡": "騾",
        "鲥": "鰣",
        "讫": "訖",
        "袭": "襲",
        "谲": "譎",
        "撵": "攆",
        "纹": "紋",
        "炽": "熾",
        "瘾": "癮",
        "资": "資",
        "蝈": "蟈",
        "摊": "攤",
        "鹎": "鵯",
        "哕": "噦",
        "镔": "鑌",
        "馎": "餺",
        "峥": "崢",
        "牦": "氂",
        "岽": "崬",
        "诫": "誡",
        "贼": "賊",
        "瞒": "瞞",
        "蕴": "蘊藴",
        "驶": "駛",
        "绹": "綯",
        "闿": "闓",
        "滪": "澦",
        "谅": "諒",
        "笋": "筍",
        "馌": "饁",
        "厐": "龎",
        "吕": "呂",
        "辘": "轆",
        "挛": "攣",
        "宠": "寵",
        "缣": "縑",
        "颢": "顥",
        "钪": "鈧",
        "贯": "貫",
        "舱": "艙",
        "鸹": "鴰",
        "医": "醫",
        "鲺": "鯴",
        "锿": "鎄",
        "难": "難",
        "诀": "訣",
        "棂": "欞",
        "跄": "蹌",
        "铍": "鈹",
        "铗": "鋏",
        "绎": "繹",
        "剑": "劍",
        "珐": "琺",
        "靓": "靚",
        "呕": "嘔",
        "约": "約",
        "还": "還",
        "荛": "蕘",
        "臜": "臢",
        "险": "險",
        "韨": "韍",
        "铪": "鉿",
        "饷": "餉",
        "长": "長",
        "雾": "霧",
        "谀": "諛",
        "鲋": "鮒",
        "骏": "駿",
        "琐": "瑣",
        "邓": "鄧",
        "厕": "廁厠",
        "䴖": "鶄",
        "痫": "癇",
        "抟": "摶",
        "缢": "縊",
        "锦": "錦",
        "猪": "豬",
        "踬": "躓",
        "纷": "紛",
        "钻": "鑽",
        "笺": "箋",
        "势": "勢",
        "诅": "詛",
        "坠": "墜",
        "鳋": "鰠",
        "鹌": "鵪",
        "祎": "禕",
        "呐": "吶",
        "郓": "鄆",
        "钏": "釧",
        "滗": "潷",
        "赖": "賴",
        "拟": "擬",
        "罢": "罷",
        "镦": "鐓",
        "俭": "儉",
        "绷": "繃綳",
        "姹": "奼",
        "顸": "頇",
        "铻": "鋙",
        "韫": "韞",
        "酾": "釃",
        "洁": "潔",
        "辂": "輅",
        "鳀": "鯷",
        "脉": "脈",
        "缍": "綞",
        "镬": "鑊",
        "锑": "銻",
        "钐": "釤",
        "鞒": "鞽",
        "猕": "獼",
        "渗": "滲",
        "阘": "闒",
        "殚": "殫",
        "鲠": "鯁",
        "骤": "驟",
        "储": "儲",
        "谫": "譾謭",
        "樯": "檣",
        "鸷": "鷙",
        "㶶": "燶",
        "夹": "夾",
        "刿": "劌",
        "阅": "閱閲",
        "赁": "賃",
        "䅉": "稏",
        "绌": "絀",
        "镑": "鎊",
        "铐": "銬",
        "单": "單",
        "诚": "誠",
        "萤": "螢",
        "鳠": "鱯",
        "陧": "隉",
        "烨": "燁",
        "只": "只隻祇",
        "轭": "軛",
        "们": "們",
        "辩": "辯",
        "恳": "懇",
        "表": "表錶",
        "饹": "餎",
        "壸": "壼",
        "贪": "貪",
        "螀": "螿",
        "㺍": "獱",
        "缌": "緦",
        "钑": "鈒",
        "锐": "銳鋭",
        "阒": "闃",
        "辗": "輾",
        "谖": "諼",
        "訚": "誾",
        "蚝": "蚝蠔",
        "鲡": "鱺",
        "鸢": "鳶",
        "窥": "窺",
        "傩": "儺",
        "溆": "漵",
        "讯": "訊",
        "夸": "誇",
        "隽": "雋",
        "县": "縣",
        "倾": "傾",
        "异": "異",
        "赀": "貲",
        "觃": "覎",
        "摆": "擺",
        "绍": "紹",
        "哑": "啞",
        "镐": "鎬",
        "鳡": "鱤",
        "渑": "澠",
        "鹢": "鷁",
        "韧": "韌",
        "烩": "燴",
        "转": "轉",
        "误": "誤",
        "衮": "袞",
        "数": "數",
        "㲿": "瀇",
        "惨": "慘",
        "祸": "禍",
        "闻": "聞",
        "驺": "騶",
        "国": "國",
        "灾": "災",
        "谁": "誰",
        "龌": "齷",
        "颎": "熲",
        "众": "眾衆",
        "镰": "鐮",
        "挟": "挾",
        "红": "紅",
        "钦": "欽",
        "贫": "貧",
        "侬": "儂",
        "莴": "萵",
        "锻": "鍛",
        "诵": "誦",
        "浊": "濁",
        "评": "評",
        "蝇": "蠅",
        "鹍": "鵾",
        "风": "風",
        "㱮": "殨",
        "敛": "斂",
        "柜": "櫃",
        "荟": "薈",
        "屡": "屢",
        "饣": "飠",
        "绢": "絹",
        "铦": "銛",
        "麦": "麥",
        "葱": "蔥",
        "蛲": "蟯",
        "项": "項",
        "辁": "輇",
        "鲁": "魯",
        "榅": "榲",
        "蒇": "蕆",
        "颏": "頦",
        "鞑": "韃",
        "阐": "闡",
        "锒": "鋃",
        "挞": "撻",
        "羡": "羨",
        "鸱": "鴟",
        "骣": "驏",
        "钧": "鈞",
        "眦": "眥",
        "厩": "廄",
        "谬": "謬",
        "袯": "襏",
        "鲷": "鯛",
        "御": "御禦",
        "夺": "奪",
        "喽": "嘍",
        "琼": "瓊",
        "錾": "鏨",
        "迁": "遷",
        "赂": "賂",
        "觅": "覓",
        "杆": "桿",
        "绋": "紼",
        "隶": "隶隸",
        "飏": "颺",
        "镒": "鎰",
        "莸": "蕕",
        "诙": "詼",
        "鲿": "鱨",
        "荞": "蕎",
        "鹠": "鶹",
        "铧": "鏵",
        "迩": "邇",
        "蕲": "蘄",
        "对": "對",
        "驸": "駙",
        "饺": "餃",
        "闽": "閩",
        "涂": "塗",
        "袄": "襖",
        "芈": "羋",
        "鲌": "鮊",
        "墙": "牆墻",
        "焕": "煥",
        "铯": "銫",
        "谗": "讒",
        "辖": "轄",
        "䘛": "𧝞",
        "缡": "縭",
        "纠": "糾",
        "稣": "穌",
        "颤": "顫",
        "垦": "墾",
        "动": "動",
        "购": "購",
        "议": "議",
        "朱": "朱硃",
        "肴": "餚",
        "锽": "鍠",
        "钼": "鉬",
        "摇": "搖",
        "苈": "藶",
        "鹋": "鶓",
        "鳌": "鰲",
        "睑": "瞼",
        "盐": "鹽",
        "痒": "癢",
        "骥": "驥",
        "槚": "檟",
        "绠": "綆",
        "饥": "飢饑",
        "韦": "韋",
        "诮": "誚",
        "蛰": "蟄",
        "艳": "豔艷",
        "筹": "籌",
        "铼": "錸",
        "灿": "燦",
        "谂": "諗",
        "袅": "裊",
        "昆": "昆崑",
        "龋": "齲",
        "鲍": "鮑",
        "馏": "餾",
        "税": "稅",
        "皑": "皚",
        "纡": "紆",
        "张": "張",
        "颥": "顬",
        "辫": "辮",
        "鹲": "鸏",
        "贬": "貶",
        "莳": "蒔",
        "鸶": "鷥",
        "砺": "礪",
        "钽": "鉭",
        "锼": "鎪",
        "诃": "訶",
        "装": "裝",
        "鳍": "鰭",
        "荣": "榮",
        "监": "監",
        "睐": "睞",
        "呒": "嘸",
        "蓝": "藍",
        "黡": "黶",
        "饤": "飣",
        "俫": "倈",
        "觯": "觶",
        "蛱": "蛺",
        "杰": "傑",
        "并": "并並併幷竝",
        "隐": "隱",
        "顺": "順",
        "铽": "鋱",
        "凿": "鑿",
        "糁": "糝",
        "栅": "柵",
        "榄": "欖",
        "鼋": "黿",
        "鹜": "鶩",
        "骎": "駸",
        "阑": "闌",
        "幂": "冪",
        "䴗": "鶪",
        "啴": "嘽",
        "萝": "蘿",
        "鸡": "雞鷄",
        "鲢": "鰱",
        "锧": "鑕",
        "厨": "廚",
        "伫": "佇",
        "谭": "譚",
        "颜": "顏顔",
        "纶": "綸",
        "儿": "兒",
        "顼": "頊",
        "衅": "釁",
        "规": "規",
        "惊": "驚",
        "铒": "鉺",
        "赗": "賵",
        "诘": "詰",
        "钤": "鈐",
        "鹡": "鶺",
        "铑": "銠",
        "鳢": "鱧",
        "镧": "鑭",
        "轫": "軔",
        "致": "致緻",
        "絷": "縶",
        "绶": "綬",
        "驹": "駒",
        "闼": "闥",
        "酿": "釀",
        "冁": "囅",
        "垅": "壠",
        "阄": "鬮",
        "骇": "駭",
        "㶉": "鸂",
        "缊": "縕",
        "辕": "轅",
        "渔": "漁",
        "焖": "燜",
        "碛": "磧",
        "宝": "寶",
        "废": "廢",
        "挢": "撟",
        "枥": "櫪",
        "涩": "澀",
        "谨": "謹",
        "伪": "偽僞",
        "刬": "剗",
        "键": "鍵",
        "岳": "岳嶽",
        "鸴": "鷽",
        "脶": "腡",
        "机": "機",
        "讽": "諷",
        "亿": "億",
        "贾": "賈",
        "峡": "峽",
        "铃": "鈴",
        "蛏": "蟶",
        "觑": "覷",
        "乔": "喬",
        "兖": "兗",
        "员": "員",
        "坚": "堅",
        "寝": "寢",
        "统": "統",
        "蓣": "蕷",
        "换": "換",
        "烫": "燙",
        "轪": "軑",
        "啮": "嚙",
        "鹴": "鸘",
        "诽": "誹",
        "橼": "櫞",
        "试": "試",
        "炀": "煬",
        "厂": "厂廠",
        "娇": "嬌",
        "妆": "妝",
        "鲈": "鱸",
        "龊": "齪",
        "谓": "謂",
        "殒": "殞",
        "错": "錯",
        "钘": "鈃",
        "窜": "竄",
        "鸟": "鳥",
        "肠": "腸",
        "会": "會",
        "䜥": "𧩙",
        "蕰": "薀",
        "贩": "販",
        "侪": "儕",
        "疮": "瘡",
        "缵": "纘",
        "纴": "紝",
        "户": "戶",
        "蔹": "蘞",
        "撸": "擼",
        "参": "參",
        "秆": "稈",
        "鳈": "鰁",
        "恋": "戀",
        "苌": "萇",
        "虏": "虜",
        "诒": "詒",
        "饸": "餄",
        "镙": "鏍",
        "铘": "鋣",
        "埚": "堝",
        "筝": "箏",
        "鹟": "鶲",
        "来": "來",
        "触": "觸",
        "注": "注註",
        "俪": "儷",
        "獭": "獺",
        "独": "獨",
        "问": "問",
        "饱": "飽",
        "声": "聲",
        "维": "維",
        "偾": "僨",
        "湿": "濕",
        "鲉": "鮋",
        "咙": "嚨",
        "锘": "鍩",
        "阚": "闞",
        "窝": "窩",
        "羟": "羥",
        "愠": "慍",
        "讧": "訌",
        "沩": "溈潙",
        "质": "質",
        "个": "個箇",
        "猬": "蝟",
        "鞯": "韉",
        "碱": "鹼",
        "娲": "媧",
        "纵": "縱",
        "缴": "繳",
        "掷": "擲",
        "烁": "爍",
        "捡": "撿",
        "剂": "劑",
        "鳉": "鱂",
        "鹊": "鵲",
        "苍": "蒼",
        "蟏": "蠨",
        "哙": "噲",
        "镘": "鏝",
        "筜": "簹",
        "属": "屬",
        "胡": "胡鬍衚",
        "诧": "詫",
        "桦": "樺",
        "凫": "鳧鳬",
        "狭": "狹",
        "埯": "垵",
        "饰": "飾",
        "驲": "馹",
        "绵": "綿",
        "罴": "羆",
        "恶": "惡",
        "歼": "殲",
        "锃": "鋥",
        "瘅": "癉",
        "垄": "壟",
        "领": "領",
        "缗": "緡",
        "岖": "嶇",
        "舍": "舍捨",
        "树": "樹",
        "䴓": "鳾",
        "辔": "轡",
        "炖": "燉",
        "唛": "嘜",
        "缟": "縞",
        "鲞": "鯗鮝",
        "抢": "搶",
        "欧": "歐",
        "梦": "夢",
        "氩": "氬",
        "涨": "漲",
        "刭": "剄",
        "钮": "鈕",
        "鸵": "鴕",
        "䌷": "紬",
        "讼": "訟",
        "净": "淨凈",
        "镃": "鎡",
        "际": "際",
        "魇": "魘",
        "屉": "屜",
        "绊": "絆",
        "才": "才纔",
        "觐": "覲",
        "浓": "濃",
        "㻏": "𤫩",
        "呙": "咼",
        "济": "濟",
        "鳞": "鱗",
        "拢": "攏",
        "仪": "儀",
        "哓": "嘵",
        "铮": "錚",
        "称": "稱",
        "屿": "嶼",
        "胶": "膠",
        "旸": "暘",
        "诼": "諑",
        "轿": "轎",
        "泾": "涇",
        "颇": "頗",
        "龉": "齬",
        "师": "師",
        "气": "气氣",
        "嘘": "噓",
        "骛": "騖",
        "锚": "錨",
        "砜": "碸",
        "鲟": "鱘",
        "缞": "縗",
        "妇": "婦",
        "侩": "儈",
        "娆": "嬈",
        "钯": "鈀",
        "纳": "納",
        "尴": "尷",
        "䌶": "䊷",
        "蔺": "藺",
        "掴": "摑",
        "叁": "叄",
        "剀": "剴",
        "酂": "酇",
        "鹈": "鵜",
        "苋": "莧",
        "峣": "嶢",
        "译": "譯",
        "仓": "倉",
        "卖": "賣",
        "埙": "塤",
        "镚": "鏰",
        "画": "畫",
        "鳟": "鱒",
        "窑": "窯",
        "拧": "擰",
        "俩": "倆",
        "赪": "赬",
        "凭": "憑",
        "偬": "傯",
        "瓯": "甌",
        "篱": "籬",
        "驰": "馳",
        "绳": "繩",
        "饲": "飼",
        "籴": "糴",
        "轾": "輊",
        "阃": "閫",
        "锅": "鍋",
        "𡒄": "壈",
        "淀": "澱",
        "缉": "緝",
        "戋": "戔",
        "脍": "膾",
        "专": "專",
        "䴕": "鴷",
        "碜": "磣",
        "䯄": "騧",
        "挡": "擋",
        "抠": "摳",
        "讦": "訐",
        "别": "別彆",
        "邬": "鄔",
        "启": "啟啓",
        "鸳": "鴛",
        "鲴": "鯝",
        "莶": "薟",
        "梼": "檮",
        "达": "達",
        "畅": "暢",
        "铄": "鑠",
        "终": "終",
        "赕": "賧",
        "遗": "遺",
        "静": "靜",
        "盘": "盤",
        "锤": "錘鎚",
        "荡": "蕩盪",
        "桧": "檜",
        "详": "詳",
        "轩": "軒",
        "滨": "濱",
        "烬": "燼",
        "鹳": "鸛",
        "匀": "勻",
        "适": "適",
        "钅": "釒",
        "锄": "鋤",
        "馇": "餷",
        "稆": "穭",
        "缈": "緲",
        "输": "輸",
        "䴔": "鵁",
        "额": "額",
        "抡": "掄",
        "挠": "撓",
        "枣": "棗",
        "耢": "耮",
        "亩": "畝",
        "谪": "謫",
        "疯": "瘋",
        "㔉": "劚",
        "鲵": "鯢",
        "损": "損",
        "讻": "訩",
        "携": "攜",
        "瓒": "瓚",
        "举": "舉",
        "铅": "鉛",
        "镄": "鐨",
        "绉": "縐",
        "届": "屆",
        "浔": "潯",
        "鹞": "鷂",
        "荠": "薺",
        "蓥": "鎣",
        "滩": "灘",
        "轨": "軌",
        "热": "熱",
        "闯": "闖",
        "嫱": "嬙",
        "读": "讀",
        "楼": "樓",
        "湾": "灣",
        "备": "備",
        "骆": "駱",
        "龈": "齦",
        "鲊": "鮓",
        "漓": "灕",
        "谕": "諭",
        "鲘": "鮜",
        "阙": "闕",
        "钚": "鈈",
        "庞": "龐",
        "䜣": "訢",
        "营": "營",
        "温": "溫",
        "侨": "僑",
        "猫": "貓",
        "沪": "滬",
        "锯": "鋸",
        "娱": "娛",
        "黉": "黌",
        "缳": "繯",
        "撺": "攛",
        "贿": "賄",
        "烂": "爛",
        "鹉": "鵡",
        "鳊": "鯿",
        "聍": "聹",
        "蛎": "蠣",
        "诐": "詖",
        "体": "體",
        "埘": "塒",
        "筛": "篩",
        "铚": "銍",
        "姜": "姜薑",
        "绞": "絞",
        "浍": "澮",
        "俨": "儼",
        "卫": "衛",
        "泪": "淚",
        "灭": "滅",
        "镯": "鐲",
        "驱": "驅",
        "咛": "嚀",
        "赔": "賠",
        "羁": "羈",
        "厅": "廳",
        "馉": "餶",
        "蒋": "蔣",
        "䞍": "䝼",
        "窃": "竊",
        "谐": "諧",
        "锖": "錆",
        "写": "寫",
        "禅": "禪",
        "鲛": "鮫",
        "帜": "幟",
        "骟": "騸",
        "产": "產産",
        "账": "賬",
        "钫": "鈁",
        "垭": "埡",
        "缲": "繰",
        "娴": "嫻",
        "耸": "聳",
        "䌺": "䋙",
        "辽": "遼",
        "哒": "噠",
        "烃": "烴",
        "坂": "阪",
        "织": "織",
        "苏": "蘇甦",
        "毕": "畢",
        "盗": "盜",
        "镖": "鏢",
        "铥": "銩",
        "鳛": "鰼",
        "总": "總",
        "䌽": "綵",
        "铫": "銚",
        "狯": "獪",
        "黩": "黷",
        "壳": "殼殻",
        "婴": "嬰",
        "恸": "慟",
        "泻": "瀉",
        "喾": "嚳",
        "锁": "鎖",
        "岗": "崗",
        "颈": "頸",
        "戏": "戲",
        "辒": "轀",
        "瘗": "瘞",
        "疖": "癤",
        "玚": "瑒",
        "缝": "縫",
        "组": "組",
        "枢": "樞",
        "挥": "揮",
        "护": "護",
        "丧": "喪",
        "润": "潤",
        "讪": "訕",
        "霭": "靄",
        "鲰": "鯫",
        "莺": "鶯",
        "镁": "鎂",
        "铀": "鈾",
        "鹇": "鷳",
        "鸠": "鳩",
        "浑": "渾",
        "濒": "瀕",
        "痖": "瘂",
        "彝": "彞",
        "络": "絡",
        "蓠": "蘺",
        "荥": "滎",
        "诪": "譸",
        "时": "時",
        "载": "載",
        "销": "銷",
        "阂": "閡",
        "龇": "齜",
        "将": "將",
        "颉": "頡",
        "斋": "齋",
        "焘": "燾",
        "刚": "剛",
        "缜": "縝",
        "报": "報",
        "挤": "擠",
        "侧": "側",
        "谦": "謙",
        "横": "橫",
        "眬": "矓",
        "环": "環",
        "鲱": "鯡",
        "鸲": "鴝",
        "脸": "臉",
        "访": "訪",
        "栾": "欒",
        "铁": "鐵",
        "镀": "鍍",
        "浐": "滻",
        "蹒": "蹣",
        "呖": "嚦",
        "绝": "絕絶",
        "拥": "擁",
        "荤": "葷",
        "闫": "閆",
        "园": "園",
        "干": "干乾幹榦",
        "跻": "躋",
        "艺": "藝",
        "轼": "軾",
        "诿": "諉",
        "吁": "吁籲",
        "缇": "緹",
        "鲆": "鮃",
        "馈": "饋",
        "骊": "驪",
        "䞌": "𧵳",
        "茏": "蘢",
        "谑": "謔",
        "钖": "鍚",
        "颞": "顳",
        "伧": "傖",
        "沦": "淪",
        "锫": "錇",
        "邮": "郵",
        "纲": "綱",
        "贻": "貽",
        "丽": "麗",
        "梾": "棶",
        "腊": "臘",
        "穷": "窮",
        "鳆": "鰒",
        "诔": "誄",
        "块": "塊",
        "铖": "鋮",
        "勚": "勩",
        "鹝": "鷊",
        "飞": "飛",
        "无": "無",
        "轧": "軋",
        "桩": "樁",
        "镫": "鐙",
        "骦": "驦",
        "韬": "韜",
        "饳": "飿",
        "绲": "緄",
        "驵": "駔",
        "恹": "懨",
        "阀": "閥",
        "鲪": "鮶",
        "内": "內",
        "鲇": "鯰鮎",
        "缆": "纜",
        "娈": "孌",
        "茎": "莖",
        "辑": "輯",
        "渐": "漸",
        "洒": "灑",
        "钗": "釵",
        "刘": "劉",
        "鸭": "鴨",
        "颟": "顢",
        "沧": "滄",
        "伦": "倫",
        "让": "讓",
        "疭": "瘲",
        "听": "聽",
        "献": "獻",
        "鸰": "鴒",
        "撷": "擷",
        "莹": "瑩",
        "捞": "撈",
        "梿": "槤",
        "镂": "鏤",
        "糇": "餱",
        "窍": "竅",
        "濑": "瀨",
        "乐": "樂",
        "赒": "賙",
        "衔": "銜",
        "哗": "嘩",
        "叙": "敘",
        "绛": "絳",
        "党": "黨",
        "桤": "榿",
        "拣": "揀",
        "恤": "恤卹",
        "车": "車",
        "诩": "詡",
        "闭": "閉",
        "鹰": "鷹",
        "霁": "霽",
        "喂": "喂餵",
        "龆": "齠",
        "骈": "駢",
        "馊": "餿",
        "蒌": "蔞",
        "鲙": "鱠",
        "吗": "嗎",
        "鲜": "鮮",
        "实": "實",
        "蜡": "蠟",
        "舣": "艤",
        "肤": "膚",
        "谧": "謐",
        "侦": "偵",
        "瘫": "癱",
        "锭": "錠",
        "钬": "鈥",
        "玮": "瑋",
        "缱": "繾",
        "纰": "紕",
        "稳": "穩",
        "䌹": "絅",
        "芸": "蕓",
        "贽": "贄",
        "设": "設",
        "睁": "睜",
        "忆": "憶",
        "魉": "魎",
        "晋": "晉",
        "呗": "唄",
        "鹛": "鶥",
        "嵝": "嶁",
        "鳜": "鱖",
        "伤": "傷",
        "条": "條",
        "扣": "扣釦",
        "俦": "儔",
        "癫": "癲",
        "啭": "囀",
        "铬": "鉻",
        "灯": "燈",
        "绰": "綽",
        "婳": "嫿",
        "饵": "餌",
        "泼": "潑",
        "课": "課",
        "骉": "驫",
        "云": "雲云",
        "殓": "殮",
        "谒": "謁",
        "疗": "療",
        "阖": "闔",
        "龛": "龕",
        "鲝": "鮺",
        "愤": "憤",
        "涧": "澗",
        "檩": "檁",
        "垫": "墊",
        "垆": "壚",
        "钭": "鈄",
        "锬": "錟",
        "冯": "馮",
        "刮": "刮颳",
        "纱": "紗",
        "缰": "韁繮",
        "头": "頭",
        "䌸": "縳",
        "洼": "窪",
        "唝": "嗊",
        "鹆": "鵒",
        "敌": "敵",
        "仑": "侖崙",
        "诓": "誆",
        "鳝": "鱔",
        "㧟": "擓",
        "杠": "槓",
        "书": "書",
        "矫": "矯",
        "铭": "銘",
        "啬": "嗇",
        "凯": "凱",
        "绱": "緔鞝",
        "饴": "飴",
        "旷": "曠",
        "苹": "蘋",
        "恺": "愷",
        "泽": "澤",
        "阁": "閣",
        "猃": "獫",
        "庆": "慶",
        "颊": "頰",
        "脏": "髒臟",
        "丑": "丑醜",
        "辐": "輻",
        "锗": "鍺",
        "则": "則",
        "厘": "厘釐",
        "缛": "縟",
        "尝": "嘗嚐",
        "够": "夠",
        "骞": "騫",
        "挣": "掙",
        "垒": "壘",
        "货": "貨",
        "讨": "討",
        "疬": "癧",
        "銮": "鑾",
        "帱": "幬",
        "鲲": "鯤",
        "蔷": "薔",
        "掸": "撣",
        "铂": "鉑",
        "凄": "淒",
        "细": "細",
        "苎": "苧",
        "蹑": "躡",
        "运": "運",
        "镗": "鏜",
        "盖": "蓋",
        "变": "變",
        "竞": "競",
        "柠": "檸",
        "捣": "搗",
        "滦": "灤",
        "诨": "諢",
        "闬": "閈",
        "狮": "獅",
        "鹱": "鸌",
        "页": "頁",
        "轻": "輕",
        "黾": "黽",
        "䥿": "𨯅",
        "馁": "餒",
        "砀": "碭",
        "鲃": "䰾",
        "龅": "齙",
        "躏": "躪",
        "膑": "臏",
        "骗": "騙",
        "尘": "塵",
        "缚": "縛",
        "锞": "錁",
        "沣": "灃",
        "欢": "歡",
        "侥": "僥",
        "两": "兩",
        "愦": "憒",
        "斩": "斬",
        "萨": "薩",
        "纯": "純",
        "钳": "鉗",
        "阴": "陰",
        "础": "礎",
        "鳃": "鰓",
        "鹄": "鵠",
        "痉": "痙",
        "词": "詞",
        "赎": "贖",
        "懑": "懣",
        "晔": "曄",
        "奖": "獎奬",
        "烛": "燭",
        "罚": "罰",
        "㛟": "𡞵",
        "镞": "鏃",
        "桠": "椏",
        "苧": "薴",
        "马": "馬",
        "绯": "緋",
        "铳": "銃",
        "职": "職",
        "韵": "韻",
        "跹": "躚",
        "轺": "軺",
        "揽": "攬",
        "颀": "頎",
        "缅": "緬",
        "庄": "莊",
        "锉": "銼",
        "针": "針",
        "栋": "棟",
        "脑": "腦",
        "蜕": "蛻",
        "岘": "峴",
        "龚": "龔",
        "岛": "島",
        "队": "隊",
        "㖞": "喎",
        "谣": "謠謡",
        "订": "訂",
        "伥": "倀",
        "枪": "槍",
        "嗳": "噯",
        "鸯": "鴦",
        "费": "費",
        "耻": "恥",
        "挽": "輓掇",
        "奁": "奩",
        "屃": "屓",
        "黄": "黃",
        "准": "准準",
        "镉": "鎘",
        "铈": "鈰",
        "慑": "懾",
        "鳘": "鰵",
        "询": "詢",
        "佥": "僉",
        "滤": "濾",
        "执": "執",
        "鹯": "鸇",
        "酱": "醬",
        "珲": "琿",
        "围": "圍",
        "泸": "瀘",
        "恻": "惻",
        "虿": "蠆",
        "颁": "頒",
        "缄": "緘",
        "钉": "釘",
        "锈": "鏽銹",
        "阊": "閶",
        "辏": "輳",
        "谎": "謊",
        "脐": "臍",
        "斓": "斕",
        "蚕": "蠶",
        "砖": "磚",
        "岙": "嶴",
        "军": "軍",
        "劝": "勸",
        "径": "徑",
        "椠": "槧",
        "涣": "渙",
        "漤": "灠",
        "妫": "媯嬀",
        "窭": "窶",
        "哜": "嚌",
        "讷": "訥",
        "贸": "貿",
        "为": "為爲",
        "䌼": "綐",
        "绅": "紳",
        "铉": "鉉",
        "镈": "鎛",
        "觋": "覡",
        "藓": "蘚",
        "婶": "嬸",
        "硖": "硤",
        "鳙": "鱅",
        "嵘": "嶸",
        "凛": "凜",
        "鹚": "鶿鷀",
        "狝": "獮",
        "卜": "卜蔔",
        "滥": "濫",
        "帼": "幗",
        "兰": "蘭",
        "闳": "閎",
        "囵": "圇",
        "请": "請",
        "码": "碼",
        "禀": "稟",
        "崃": "崍",
        "骂": "罵駡",
        "帅": "帥",
        "龄": "齡",
        "颖": "穎",
        "篮": "籃",
        "钞": "鈔",
        "责": "責",
        "严": "嚴",
        "茧": "繭",
        "悦": "悅",
        "赆": "贐",
        "弯": "彎",
        "粮": "糧",
        "锳": "鍈",
        "劲": "勁",
        "阵": "陣",
        "垴": "堖",
        "趸": "躉",
        "掼": "摜",
        "硁": "硜",
        "鹅": "鵝",
        "升": "升昇",
        "痈": "癰",
        "诌": "謅",
        "晕": "暈",
        "飖": "颻",
        "绚": "絢",
        "坟": "墳",
        "铞": "銱",
        "桡": "橈",
        "槠": "櫧",
        "赣": "贛",
        "荧": "熒",
        "侄": "姪",
        "饫": "飫",
        "驭": "馭",
        "镳": "鑣",
        "狲": "猻",
        "偿": "償",
        "汹": "洶",
        "跸": "蹕",
        "腻": "膩",
        "板": "板闆",
        "宁": "寧",
        "开": "開",
        "阈": "閾",
        "锊": "鋝",
        "栌": "櫨",
        "缯": "繒",
        "颗": "顆",
        "龙": "龍",
        "帘": "簾",
        "鲮": "鯪",
        "钟": "鐘",
        "计": "計",
        "谤": "謗",
        "挦": "撏",
        "阆": "閬",
        "鲯": "鯕",
        "缮": "繕",
        "玱": "瑲",
        "吴": "吳",
        "聋": "聾",
        "游": "游遊",
        "贺": "賀",
        "怼": "懟",
        "练": "練",
        "奂": "奐",
        "巅": "巔",
        "陈": "陳",
        "镊": "鑷",
        "觍": "覥",
        "飗": "飀",
        "鹘": "鶻",
        "嵚": "嶔",
        "哟": "喲",
        "坞": "塢",
        "毡": "氈",
        "汤": "湯",
        "胧": "朧",
        "荦": "犖",
        "莼": "蓴蒓",
        "雳": "靂",
        "闵": "閔",
        "桨": "槳",
        "迹": "跡蹟",
        "恼": "惱",
        "松": "松鬆",
        "骀": "駘",
        "布": "布佈",
        "馂": "餕",
        "鲄": "魺",
        "历": "曆歷",
        "㖊": "噚",
        "浃": "浹",
        "谏": "諫",
        "辎": "輜",
        "茑": "蔦",
        "砗": "硨",
        "缙": "縉",
        "创": "創",
        "炜": "煒",
        "败": "敗",
        "沤": "漚",
        "耧": "耬",
        "咝": "噝",
        "㨫": "㩜",
        "阳": "陽",
        "冲": "沖衝",
        "锵": "鏘",
        "钴": "鈷",
        "样": "樣",
        "讶": "訝",
        "亸": "嚲",
        "舻": "艫",
        "驴": "驢",
        "鹃": "鵑",
        "鳄": "鱷鰐",
        "缠": "纏",
        "毙": "斃",
        "𨱏": "鎝",
        "晓": "曉",
        "懒": "懶",
        "硗": "磽",
        "绘": "繪",
        "酝": "醞醖",
        "杩": "榪",
        "饭": "飯",
        "狰": "猙",
        "镵": "鑱",
        "铴": "鐋",
        "诶": "誒",
        "轹": "轢",
        "腽": "膃",
        "骁": "驍",
        "龃": "齟",
        "鲅": "鮁",
        "崄": "嶮",
        "岭": "嶺",
        "残": "殘",
        "渎": "瀆",
        "庙": "廟",
        "缘": "緣",
        "玛": "瑪",
        "炝": "熗",
        "疟": "瘧",
        "侣": "侶",
        "沥": "瀝",
        "贤": "賢",
        "箫": "簫",
        "掳": "擄",
        "鸮": "鴞",
        "励": "勵",
        "钵": "缽鉢",
        "锴": "鍇",
        "显": "顯",
        "鳅": "鰍",
        "采": "采採埰",
        "诋": "詆",
        "荐": "薦",
        "恒": "恆",
        "䓕": "薳",
        "姗": "姍",
        "给": "給",
        "癞": "癩",
        "俣": "俁",
        "桢": "楨",
        "杨": "楊",
        "郦": "酈",
        "饬": "飭",
        "巯": "巰",
        "狱": "獄",
        "铵": "銨",
        "畴": "疇",
        "痨": "癆",
        "轸": "軫",
        "腼": "靦",
        "虾": "蝦",
        "简": "簡",
        "缃": "緗",
        "颂": "頌",
        "阗": "闐",
        "阉": "閹",
        "钊": "釗",
        "䯃": "𩣑",
        "于": "於",
        "镅": "鎇",
        "骖": "驂",
        "鲚": "鱭",
        "农": "農",
        "锟": "錕",
        "讠": "訁",
        "伣": "俔",
        "谥": "謚",
        "涤": "滌",
        "芦": "蘆",
        "螨": "蟎",
        "纮": "紘",
        "爱": "愛",
        "现": "現",
        "疴": "痾",
        "唡": "啢",
        "陉": "陘",
        "铊": "鉈",
        "觌": "覿",
        "赏": "賞",
        "从": "從",
        "扑": "撲",
        "竖": "豎竪",
        "鹙": "鶖",
        "翘": "翹",
        "鳚": "䲁",
        "镟": "鏇",
        "诠": "詮",
        "佣": "傭",
        "裢": "褳",
        "帧": "幀",
        "拦": "攔",
        "绮": "綺",
        "珰": "璫",
        "间": "間",
        "泺": "濼",
        "恽": "惲",
        "颃": "頏",
        "宪": "憲",
        "娄": "婁",
        "锆": "鋯",
        "辍": "輟",
        "踌": "躊",
        "钛": "鈦",
        "㟆": "㠏",
        "涡": "渦",
        "谠": "讜",
        "讥": "譏",
        "暧": "曖",
        "哝": "噥",
        "鲫": "鯽",
        "鸬": "鸕",
        "疱": "皰",
        "贶": "貺",
        "昼": "晝",
        "绡": "綃",
        "罂": "罌",
        "镆": "鏌",
        "凉": "涼",
        "乌": "烏",
        "绗": "絎",
        "铛": "鐺",
        "筚": "篳",
        "噜": "嚕",
        "裣": "襝",
        "掺": "摻",
        "该": "該",
        "荪": "蓀",
        "鹬": "鷸",
        "饮": "飲",
        "闱": "闈",
        "鉴": "鑒鑑",
        "价": "價",
        "赶": "趕",
        "柽": "檉",
        "腾": "騰",
        "鲀": "魨",
        "龂": "齗",
        "骄": "驕",
        "阇": "闍",
        "谋": "謀",
        "茕": "煢",
        "题": "題",
        "贡": "貢",
        "缭": "繚",
        "纬": "緯",
        "锱": "錙",
        "钰": "鈺",
        "垲": "塏",
        "论": "論",
        "兴": "興",
        "殡": "殯",
        "陇": "隴",
        "潍": "濰",
        "觎": "覦",
        "鹗": "鶚",
        "飘": "飄",
        "呛": "嗆",
        "坝": "壩",
        "赡": "贍",
        "赑": "贔",
        "档": "檔",
        "胨": "腖",
        "绬": "緓",
        "驯": "馴",
        "镱": "鐿",
        "铰": "鉸",
        "跶": "躂",
        "诺": "諾",
        "岁": "歲",
        "馃": "餜",
        "骅": "驊",
        "辀": "輈",
        "炉": "爐",
        "趋": "趨",
        "栎": "櫟",
        "撑": "撐",
        "岂": "豈",
        "茔": "塋",
        "簖": "籪",
        "颙": "顒",
        "禄": "祿",
        "没": "沒",
        "贠": "貟",
        "丢": "丟",
        "欤": "歟",
        "枧": "梘",
        "萦": "縈",
        "纭": "紜",
        "缬": "纈",
        "钱": "錢",
        "锰": "錳",
        "决": "決",
        "谶": "讖",
        "缋": "繢",
        "鳁": "鰮",
        "秃": "禿",
        "鹂": "鸝",
        "髅": "髏",
        "呆": "呆獃騃",
        "诏": "詔",
        "边": "邊",
        "晒": "曬",
        "志": "志誌",
        "飙": "飆",
        "窎": "窵",
        "坜": "壢",
        "钙": "鈣",
        "赠": "贈",
        "惩": "懲",
        "扪": "捫",
        "续": "續",
        "确": "確",
        "铱": "銥",
        "啰": "囉",
        "钒": "釩",
        "却": "卻",
        "蝼": "螻",
        "揿": "撳",
        "证": "證",
        "娅": "婭",
        "钆": "釓",
        "选": "選",
        "冈": "岡",
        "犊": "犢",
        "渍": "漬",
        "辌": "輬",
        "萑": "萑雈",
        "脓": "膿",
        "鼗": "鞀",
        "鲖": "鮦",
        "锛": "錛",
        "骚": "騷",
        "谡": "謖",
        "涠": "潿",
        "认": "認",
        "䜧": "譅",
        "席": "席蓆",
        "皲": "皸",
        "办": "辦",
        "昽": "曨",
        "肾": "腎",
        "籁": "籟",
        "祃": "禡",
        "绂": "紱",
        "铆": "鉚",
        "测": "測",
        "罗": "羅",
        "鳖": "鱉",
        "硙": "磑",
        "镛": "鏞",
        "珑": "瓏",
        "滢": "瀅",
        "橥": "櫫",
        "诤": "諍",
        "蓦": "驀",
        "聩": "聵",
        "鹭": "鷺",
        "壮": "壯",
        "闰": "閏",
        "关": "關",
        "牵": "牽",
        "轷": "軤",
        "泶": "澩",
        "虽": "雖",
        "龁": "齕",
        "骃": "駰",
        "崂": "嶗",
        "馅": "餡",
        "钇": "釔",
        "圆": "圓",
        "厉": "厲",
        "焊": "焊銲",
        "谌": "諶",
        "攒": "攢",
        "鲗": "鰂",
        "编": "編",
        "财": "財",
        "纫": "紉",
        "垱": "壋",
        "劳": "勞",
        "锲": "鍥",
        "况": "況",
        "铟": "銦",
        "讹": "訛",
        "肿": "腫",
        "䌾": "䋻",
        "鹀": "鵐",
        "铇": "鉋",
        "蹿": "躥",
        "联": "聯",
        "鳗": "鰻",
        "呜": "嗚",
        "烟": "煙菸",
        "习": "習",
        "赢": "贏",
        "郧": "鄖",
        "绫": "綾",
        "邝": "鄺",
        "镲": "鑔",
        "泷": "瀧",
        "轶": "軼",
        "诹": "諏",
        "缁": "緇",
        "预": "預",
        "瞆": "瞶",
        "栏": "欄",
        "骘": "騭",
        "阛": "闤",
        "锝": "鍀",
        "钜": "鉅",
        "萧": "蕭",
        "艰": "艱",
        "鸫": "鶇",
        "崭": "嶄",
        "鲬": "鯒",
        "枨": "棖",
        "谷": "谷穀",
        "怿": "懌",
        "绀": "紺",
        "唠": "嘮",
        "狈": "狽",
        "释": "釋",
        "赍": "齎賫",
        "诎": "詘",
        "孙": "孫",
        "镝": "鏑",
        "铜": "銅",
        "滠": "灄",
        "裤": "褲",
        "荩": "藎",
        "拨": "撥",
        "鹫": "鷲",
        "鸦": "鴉",
        "困": "困睏",
        "闲": "閒閑",
        "蝾": "蠑",
        "揾": "搵",
        "缀": "綴",
        "颅": "顱",
        "处": "處",
        "瘆": "瘮",
        "辋": "輞",
        "逊": "遜",
        "谔": "諤",
        "锂": "鋰",
        "脔": "臠",
        "骙": "騤",
        "砚": "硯",
        "钝": "鈍",
        "锜": "錡",
        "传": "傳",
        "讣": "訃",
        "谢": "謝",
        "椤": "欏",
        "鲭": "鯖",
        "皱": "皺",
        "狞": "獰",
        "蔼": "藹",
        "绁": "紲",
        "层": "層",
        "症": "癥",
        "陆": "陸",
        "餍": "饜",
        "赌": "賭",
        "觏": "覯",
        "邹": "鄒",
        "鹖": "鶡",
        "桥": "橋",
        "铝": "鋁",
        "镜": "鏡",
        "满": "滿",
        "诣": "詣",
        "裥": "襇",
        "啧": "嘖",
        "旧": "舊",
        "择": "擇",
        "荨": "蕁",
        "聪": "聰",
        "积": "積",
        "驮": "馱",
        "囱": "囪",
        "煴": "熅",
        "跷": "蹺",
        "币": "幣",
        "龀": "齔",
        "笃": "篤",
        "鲂": "魴",
        "馄": "餛",
        "锇": "鋨",
        "谍": "諜",
        "涌": "湧",
        "䞐": "賰",
        "祯": "禎",
        "颚": "顎",
        "奸": "奸姦",
        "侠": "俠",
        "缫": "繅",
        "嘱": "囑",
        "钲": "鉦",
        "贷": "貸",
        "许": "許",
        "愿": "願",
        "鹁": "鵓",
        "鳂": "鰃",
        "镇": "鎮",
        "潋": "瀲",
        "虑": "慮",
        "懔": "懍",
        "绖": "絰",
        "坛": "壇罈",
        "飚": "飈",
        "鲤": "鯉",
        "乡": "鄉",
        "补": "補",
        "赐": "賜",
        "扩": "擴",
        "胪": "臚",
        "饯": "餞",
        "即": "即卽",
        "铲": "鏟",
        "灵": "靈",
        "橹": "櫓",
        "诸": "諸"
    };
    
    /**
     * @method getSimplifiedBase
     * @param {String} word
     * @returns {String}
     */
    var getSimplifiedBase = function(word) {
        var mappedRunes = [];
        var multiple = false;
        var runes = word.split('');
        var style = 'simp';
        var variation = 0;
        //cycle through each rune in a word
        for (var i in runes) {
            //get the mapped information for the rune
            for (var key in map) {
                //check the map values for the rune
                var valueIndex = map[key].indexOf(runes[i]) + 1;
                if (valueIndex > 0) {
                    //flag trad varients that map to multiple runes
                    mappedRunes.push(key);
                    variation = (variation < valueIndex) ? valueIndex : variation;
                    if (key !== runes[i])
                        style = 'trad';
                    if (map[key].split('').length > 1) {
                        multiple = true;
                        break;
                    }
                }
            }
            //push the simp rune if no match was found
            if (!mappedRunes[i])
                mappedRunes.push(runes[i]);
        }
        //determines the variation based on mapping results
        if (runes.length === 1) {
            if (style === 'simp') {
                variation = 0;
            } else {
                if (multiple) {
                    variation = variation + 1;
                } else {
                    variation = 1;
                }
            }
        } else {
            if (style === 'simp') {
                variation = 0;
            } else {
                if (multiple) {
                    variation = 2;
                } else {
                    variation = 1;
                }
            }
        }
        return {rune: mappedRunes.join(''), variation: variation};
    };
    
    var getVocabBase = function(word, lang) {
        var base = getSimplifiedBase(word);
        return lang + '-' + base.rune + '-' + base.variation;
    };
    
    /**
     * @method getWritingFromBase
     * @param {String} simplifiedBase
     * @returns {String}
     */
    var getWritingFromBase = function(simplifiedBase) {
        var splitBase = simplifiedBase.split('-');
        var baseRune = splitBase[1];
        var baseVariation = splitBase[2];
        var matchedRune = map[baseRune];
        if (matchedRune) {
            var matchedVariations = matchedRune.split('');
            matchedRune = matchedVariations[baseVariation - 1];
            return matchedRune;
        }
        return baseRune;
    };
    
    return {
        getFromBase: getWritingFromBase,
        getSimplifiedBase: getSimplifiedBase,
        getVocabBase: getVocabBase
    };
});
define('require.text!templates/vocab-info.html',[],function () { return '<div id="vocab-info-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li id="back-button"><a href="#"><span class="fa fa-navbar fa-arrow-left"></span></a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container content">\r\n        <div class="row">\r\n            <h1 id="writing" class="col-xs-12 col-sm-6 col-md-6 writing"></h1>\r\n            <div id="definition-reading" class="col-xs-12 col-sm-6 col-md-6">\r\n                <h2>\r\n                    <span id="reading"></span> :\r\n                    <span id="definition"></span>\r\n                </h2>\r\n            </div>\r\n        </div>\r\n        <div class="row">\r\n            <div class="col-md-6"></div>\r\n            <div id="sentence" class="col-md-6">\r\n                <h4 id="sentence-writing"></h4>\r\n                <h4 id="sentence-reading"></h4>\r\n                <h4 id="sentence-definition"></h4>\r\n            </div>\r\n        </div>\r\n        <div id="contained"  class="row">\r\n            <div class="col-md-12">\r\n                <h4>Characters in <span class="writing"></span></h4>\r\n            </div>\r\n        </div>\r\n        <div id="decompositions"  class="row">\r\n            <div class="col-md-12">\r\n                <h4>Decompositions in <span class="writing"></span></h4>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>';});

/**
 * @module Skritter
 * @param ContainedTable
 * @param DecompTable
 * @param SimpTradMap
 * @param templateVocabInfo
 * @author Joshua McFarland
 */
define('views/vocabs/VocabInfo',[
    'views/components/ContainedTable',
    'views/components/DecompTable',
    'SimpTradMap',
    'require.text!templates/vocab-info.html'
], function(ContainedTable, DecompTable, SimpTradMap, templateVocabInfo) {
    /**
     * @class VocabInfoView
     * @type @exp;Backbone@pro;View@call;extend
     */
    var VocabInfo = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabInfo.this = this;
            VocabInfo.contained = [];
            VocabInfo.containedTable = new ContainedTable();
            VocabInfo.decompTable = new DecompTable();
            VocabInfo.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabInfo);
            this.$('#writing').addClass(VocabInfo.vocab.getTextStyleClass());
            this.$('#writing').html(VocabInfo.vocab.get('writing'));
            this.$('#reading').html(VocabInfo.vocab.getReading());
            this.$('#definition').html(VocabInfo.vocab.getDefinition());
            var sentence = VocabInfo.vocab.getSentence();
            if (sentence) {
                this.$('#sentence-writing').html(sentence.getWriting());
                this.$('#sentence-reading').html(sentence.getReading());
                this.$('#sentence-definition').html(sentence.getDefinition());
            }
            VocabInfo.containedTable.set(VocabInfo.contained);
            VocabInfo.containedTable.setElement(this.$('#contained')).render();
            VocabInfo.decompTable.set(VocabInfo.vocab.getDecomps());
            VocabInfo.decompTable.setElement(this.$('#decompositions')).render();
            return this;
        },
        events: {
            'click.VocabInfo #vocab-info-view #back-button': 'handleBackClicked'
        },
        /**
         * @method handleBackClicked
         * @param {Object} event
         */
        handleBackClicked: function(event) {
            event.preventDefault();
            skritter.router.back();
        },
        /**
         * @method load
         * @param {String} lang
         * @param {String} writing
         * @param {Function} callback
         */
        load: function(lang, writing, callback) {
            var vocabId = SimpTradMap.getVocabBase(writing, lang);
            skritter.data.vocabs.load(vocabId, function(vocab) {
                VocabInfo.vocab = vocab;
                if (vocab.has('containedVocabIds')) {
                    vocab.loadContainedVocabs(function(contained) {
                        VocabInfo.contained = contained;
                        VocabInfo.this.render();
                    });
                } else {
                    VocabInfo.this.render();
                }
                if (typeof callback === 'function')
                    callback();
            });
        }
    });
    
    return VocabInfo;
});
define('require.text!templates/vocab-list.html',[],function () { return '<div id="vocabs-lists-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a href="#"><span class="fa fa-navbar fa-arrow-left"></span></a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container content">\r\n        <div id="vocab-list-sections-table-container"></div>\r\n    </div>\r\n</div>';});

define('require.text!templates/vocab-list-sections-table.html',[],function () { return '<table id="vocab-list-section-table" class="table table-hover">\r\n    <thead>\r\n        <tr>\r\n            <th>Section Name</th>\r\n            <th>Word Count</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody></tbody>\r\n</table>\r\n<div id="message" class="text-center" style="display: none;"></div>\r\n<div id="loader" class="text-center"><img src="images/ajax-loader.gif" alt=""></div>';});

/**
 * @module Skritter
 * @param templateVocabListSectionsTable
 * @author Joshua McFarland
 */
define('views/vocabs/VocabListSectionsTable',[
    'require.text!templates/vocab-list-sections-table.html'
], function(templateVocabListSectionsTable) {
    /**
     * @class VocabListSectionsTable
     */
    var VocabListSectionsTable = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabListSectionsTable.currentSection = null;
            VocabListSectionsTable.list = null;
            VocabListSectionsTable.sections = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListSectionsTable);
            this.$('#message').text('');
            this.$('#loader').show();
            var div = '';
            for (var a in VocabListSectionsTable.sections) {
                var section = VocabListSectionsTable.sections[a];
                div += "<tr id='section-" + section.id + "'>";
                div += "<td>" + section.name + "</td>";
                div += "<td>" + section.rows.length + "</td>";
                div += "<td>" + "</td>";
                div += "</tr>";
            }
            this.$('table tbody').html(div);
            this.$('table tbody #section-' + VocabListSectionsTable.currentSection).addClass('active');
            this.$('#loader').hide();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.VocabListSectionsTable #vocab-list-section-table tr': 'selectSection'
        },
        /**
         * @method selectSection
         * @param {Object} event
         */
        selectSection: function(event) {
            var sectionId = event.currentTarget.id.replace('section-', '');
            skritter.router.navigate('vocab/list/' + VocabListSectionsTable.list.id + '/' + sectionId, {trigger: true});
            event.preventDefault();
        },
        /**
         * @method load
         * @param {Backbone.Model} list
         */
        set: function(list) {
            VocabListSectionsTable.currentSection = list.get('currentSection');
            VocabListSectionsTable.list = list;
            VocabListSectionsTable.sections = list.get('sections');
            this.render();
        }
    });
    
    return VocabListSectionsTable;
});
/**
 * @module Skritter
 * @param templateVocabList
 * @param VocabListSectionsTable
 * @author Joshua McFarland
 */
define('views/vocabs/VocabList',[
    'require.text!templates/vocab-list.html',
    'views/vocabs/VocabListSectionsTable'
], function(templateVocabList, VocabListSectionsTable) {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.this = this;
            VocabList.list = null;
            VocabList.sections = new VocabListSectionsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            VocabList.sections.setElement(this.$('#vocab-list-sections-table-container')).set(VocabList.list);
            return this;
        },
        /**
         * @method listId
         * @param {String} listId
         */
        load: function(listId) {
            var list = skritter.lists.get(listId);
            if (list) {
                list.load(function(list) {
                    VocabList.list = list;
                    VocabList.this.render();
                });
            } else {
                skritter.lists.add({id: listId}, {merge: true}).load(function(list) {
                    VocabList.list = list;
                    VocabList.this.render();
                });
            }
        }
    });
    
    return VocabList;
});
define('require.text!templates/vocab-list-section.html',[],function () { return '<div id="vocabs-lists-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a href="#"><span class="fa fa-navbar fa-arrow-left"></span></a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container content">\r\n        <div id="vocab-list-rows-table-container"></div>\r\n    </div>\r\n</div>';});

define('require.text!templates/vocab-list-rows-table.html',[],function () { return '<table id="vocab-list-rows-table" class="table table-hover">\r\n    <thead>\r\n        <tr>\r\n            <th>Writing</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody></tbody>\r\n</table>\r\n<div id="message" class="text-center" style="display: none;"></div>\r\n<div id="loader" class="text-center"><img src="images/ajax-loader.gif" alt=""></div>';});

/**
 * @module Skritter
 * @param templateVocabListRowsTable
 * @author Joshua McFarland
 */
define('views/vocabs/VocabListRowsTable',[
    'require.text!templates/vocab-list-rows-table.html'
], function(templateVocabListRowsTable) {
    /**
     * @class VocabListRowsTable
     */
    var VocabListRowsTable = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabListRowsTable.rows = [];
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListRowsTable);
            this.$('#message').text('');
            this.$('#loader').show();
            var div = '';
            for (var a in VocabListRowsTable.rows) {
                var row = VocabListRowsTable.rows[a];
                div += "<tr id='row-" + row.vocabId + "'>";
                div += "<td>" + row.vocabId + "</td>";
                div += "<td>" + "</td>";
                div += "</tr>";
                if (row.vocabId !== row.tradVocabId) {
                    div += "<tr id='row-" + row.tradVocabId + "'>";
                    div += "<td>" + row.tradVocabId + "</td>";
                    div += "<td>" + "</td>";
                    div += "</tr>";
                }
            }
            this.$('table tbody').html(div);
            this.$('#loader').hide();
            return this;
        },
        /**
         * @method set
         * @param {Object} section
         */
        set: function(section) {
            VocabListRowsTable.rows = section.rows;
            this.render();
        }
    });
    
    return VocabListRowsTable;
});
/**
 * @module Skritter
 * @param templateVocabListSection
 * @param VocabListRowsTable
 * @author Joshua McFarland
 */
define('views/vocabs/VocabListSection',[
    'require.text!templates/vocab-list-section.html',
    'views/vocabs/VocabListRowsTable'
], function(templateVocabListSection, VocabListRowsTable) {
    /**
     * @class VocabListSection
     */
    var VocabListSection = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabListSection.this = this;
            VocabListSection.rows = new VocabListRowsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListSection);
            VocabListSection.rows.setElement(this.$('#vocab-list-rows-table-container')).render();
            return this;
        },
        /**
         * @method load
         * @param {String} listId
         * @param {String} sectionId
         * @param {Function} callback
         */
        load: function(listId, sectionId, callback) {
            var list = skritter.lists.get(listId);
            if (list) {
                console.log('list exists');
                VocabListSection.this.render();
            } else {
                skritter.api.getVocabList(listId, function(list) {
                    skritter.lists.add(list, {merge: true});
                    VocabListSection.rows.set(_.find(list.sections, {id: sectionId}));
                    VocabListSection.this.render();
                });
            }
        }
    });
    
    return VocabListSection;
});
define('require.text!templates/vocab-lists.html',[],function () { return '<div id="vocabs-lists-view" class="view">\r\n    <div class="navbar navbar-default navbar-fixed-top" role="navigation">\r\n        <div class="container">\r\n            <div class="navbar-header">\r\n                <!--<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\r\n                    <span class="sr-only">Toggle navigation</span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                    <span class="icon-bar"></span>\r\n                </button>-->\r\n                <a class="navbar-brand" href="#">Skritter</a>\r\n                <div class="navbar-text">   \r\n                    <ul class="navbar-nav list-inline">\r\n                        <li><a href="#"><span class="fa fa-navbar fa-arrow-left"></span></a></li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <!--<div class="navbar-collapse collapse">\r\n                <ul class="nav navbar-nav">\r\n                    <li><a href="../navbar/">Default</a></li>\r\n                    <li><a href="../navbar-static-top/">Static top</a></li>\r\n                    <li class="active"><a href="./">Fixed top</a></li>\r\n                </ul>\r\n            </div>-->\r\n        </div>\r\n    </div>\r\n    <div class="container content">\r\n        <div id="vocab-lists-table-container"></div>\r\n    </div>\r\n</div>';});

/**
 * @module Skritter
 * @param templateVocabLists
 * @param VocabListsTable
 * @author Joshua McFarland
 */
define('views/vocabs/VocabLists',[
    'require.text!templates/vocab-lists.html',
    'views/vocabs/VocabListsTable'
], function(templateVocabLists, VocabListsTable) {
    /**
     * @class VocabListsView
     */
    var VocabLists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabLists.lists = new VocabListsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            VocabLists.lists.setElement(this.$('#vocab-lists-table-container')).load('studying', {
                'name': 'Name',
                'studyingMode': 'Status'
            }).render();
            return this;
        },
        /**
         * @method load
         * @param {String} listId
         */
        load: function(listId) {
            this.render();
        }
    });
    
    return VocabLists;
});
/**
 * @module Skritter
 * @param Home
 * @param Options
 * @param Reviews
 * @param Study
 * @param Tests
 * @param VocabInfo
 * @param VocabList
 * @param VocabListSection
 * @param VocabLists
 * @author Joshua McFarland
 */
define('Router',[
    'views/Home',
    'views/Options',
    'views/Reviews',
    'views/Study',
    'views/Tests',
    'views/vocabs/VocabInfo',
    'views/vocabs/VocabList',
    'views/vocabs/VocabListSection',
    'views/vocabs/VocabLists'
], function(Home, Options, Reviews, Study, Tests, VocabInfo, VocabList, VocabListSection, VocabLists) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //creates the namespace for accessing views in this router
            Router.view = {};
            //creates the namespace for accessing views directly
            skritter.view = {};
            //stop the timer when the view has moved from study
            this.on('route', function(route) {
                if (route !== 'showStudy')
                    skritter.timer.stop();
            });
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHome',
            'options': 'showOptions',
            'vocab/list': 'showVocabLists',
            'vocab/list/:id': 'showVocabList',
            'vocab/list/:listId/:sectionId': 'showVocabListSection',
            'vocab/:lang/:writing': 'showVocabInfo',
            'review': 'showReviews',
            'study': 'showStudy',
            'tests': 'showTests'
        },
        /**
         * @method back
         */
        back: function() {
            window.history.back();
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (!Router.view.home) {
                Router.view.home = new Home({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.home.setElement($(skritter.settings.get('container')));
            }
            Router.view.home.render();
        },
        /**
         * @method showOptions
         */
        showOptions: function() {
            if (!Router.view.options) {
                Router.view.options = new Options({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.options.setElement($(skritter.settings.get('container')));
            }
            Router.view.options.render();
        },
        /**
         * @method showReviews
         */
        showReviews: function() {
            if (!Router.view.reviews) {
                Router.view.reviews = new Reviews({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.reviews.setElement($(skritter.settings.get('container')));
            }
            Router.view.reviews.render();
        },
        /**
         * @method showStudy
         */
        showStudy: function() {
            if (!Router.view.study) {
                Router.view.study = new Study({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.study.setElement($(skritter.settings.get('container')));
            }
            Router.view.study.render();
        },
        /**
         * @method showTests
         */
        showTests: function() {
            if (!Router.view.tests) {
                Router.view.tests = new Tests({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.tests.setElement($(skritter.settings.get('container')));
            }
            Router.view.tests.render();
        },
        /**
         * @method showVocabInfo
         * @param {String} lang
         * @param {String} writing
         */
        showVocabInfo: function(lang, writing) {
            if (!Router.view.vocabInfo) {
                Router.view.vocabInfo = new VocabInfo({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabInfo.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabInfo.load(lang, writing);
        },
        /**
         * @method showVocabList
         * @param {String} listId
         */
        showVocabList: function(listId) {
            if (!Router.view.vocabList) {
                Router.view.vocabList = new VocabList({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabList.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabList.load(listId);
        },
        /**
         * @method showVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         */
        showVocabListSection: function(listId, sectionId) {
            if (!Router.view.vocabListSection) {
                Router.view.vocabListSection = new VocabListSection({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabListSection.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabListSection.load(listId, sectionId);
        },
        /**
         * @method showVocabLists
         */
        showVocabLists: function() {
            if (!Router.view.vocabLists) {
                Router.view.vocabLists = new VocabLists({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabLists.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabLists.render();
        }
    });

    /**
     * @method initialize
     */
    var initialize = function() {
        skritter.router = new Router();
        Backbone.history.start(skritter.fn.isLocal() ? {} : {pushState: true});
    };

    return {
        initialize: initialize
    };
});
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/Settings',[],function() {
    /**
     * @class Settings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Settings.this = this;
            //triggers an event when the window is resized
            $(window).resize(this.handleResize);
            //forces the window to resize onload
            this.handleResize();
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            appHeight: 0,
            appWidth: 0,
            date: null,
            canvasMaxSize: 600,
            canvasSize: 600,
            container: '#skritter-container',
            orientation: null,
            strokeFormat: 'vector',
            transitionSpeed: 200,
            version: '0.0.334'
        },
        /**
         * Checks the version against a non-cached version json file that isn't included in
         * the appcache. The intended use is to warn people whose browsers are hard caching
         * the application when a new version is available.
         * 
         * @method checkVersion
         * @param {Function} callback
         */
        checkVersion: function(callback) {
            var promise = $.getJSON('version.json');
            var currentVersion = this.get('version');
            promise.done(function(data) {
                if (currentVersion === data.version) {
                    callback(true, data);
                } else {
                    callback(false, currentVersion, data.version);
                }
            });
            promise.fail(function() {
                callback();
            });
        },
        /**
         * Calculates various font sizes based on the canvas size and return a css ready pixel value.
         * 
         * @property {Object} fontSize
         */
        fontSize: {
            large: function(offset) {
                offset = (offset) ? offset : 0;
                return Math.round((Settings.this.get('canvasSize') * 0.07) + offset) + 'px';
            },
            normal: function(offset) {
                offset = (offset) ? offset : 0;
                return Math.round((Settings.this.get('canvasSize') * 0.03) + offset) + 'px';
            }
        },
        /**
         * @method handleResize
         */
        handleResize: function() {
            //sets the max boundaries of the application
            Settings.this.set('appWidth', $('#skritter-container').width());
            Settings.this.set('appHeight', $('#skritter-container').height());
            //sets the orientation of the application area
            if (Settings.this.get('appWidth') > Settings.this.get('appHeight')) {
                Settings.this.set('orientation', 'horizontal');
                //sets max dimensions of the canvas element
                var offsetHeight = Settings.this.get('appHeight') - 45;
                if (offsetHeight > Settings.this.get('canvasMaxSize')) {
                    Settings.this.set('canvasSize', Settings.this.get('canvasMaxSize'));
                } else {
                    Settings.this.set('canvasSize', offsetHeight);
                }
            } else {
                Settings.this.set('orientation', 'vertical');
                //sets max dimensions of the canvas element
                if (Settings.this.get('appWidth') > Settings.this.get('canvasMaxSize')) {
                    Settings.this.set('canvasSize', Settings.this.get('canvasMaxSize'));
                } else {
                    Settings.this.set('canvasSize', Settings.this.get('appWidth'));
                }
            }
            Settings.this.triggerResize();
        },
        /**
         * @method refreshDate
         * @param {String} callback
         */
        refreshDate: function(callback) {
            skritter.api.getDateInfo(function(date) {
                if (date.today) {
                    Settings.this.set('date', date.today);
                } else {
                    Settings.this.set('date', skritter.moment().format('YYYY[-]MM[-]DD'));
                }
                callback();
            });
        },
        /**
         * @method triggerResize
         */
        triggerResize: function() {
            Settings.this.trigger('resize', {
                width: Settings.this.get('appWidth'),
                height: Settings.this.get('appHeight'),
                canvas: Settings.this.get('canvasSize'),
                navbar: 45
            });
        }
    });

    return Settings;
});
/**
 * @module Skritter
 * @submodule Component
 * @author Joshua McFarland
 */
define('views/components/Timer',[],function() {
    /**
     * Used to start, stop and calculate accurate durations of time.     .
     * @class Stopwatch
     * @param {Number} offset
     */
    var Stopwatch = function(offset) {
        offset = (offset) ? offset : 0;
        var startAt = 0;
        var lapTime = 0 + offset;
        var now = function() {
            var date = new Date();
            return date.getTime();
        };
        this.start = function() {
            startAt = startAt ? startAt : now();
        };
        this.stop = function() {
            lapTime = startAt ? lapTime + now() - startAt : lapTime;
            startAt = 0;
        };
        this.reset = function() {
            lapTime = startAt = 0;
        };
        this.time = function() {
            return lapTime + (startAt ? now() - startAt : 0);
        };
    };
    /**
     * @class Timer
     */
    var Timer = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Timer.interval = null;
            Timer.getLapTime = function() {
                return Timer.lapStartAt ? Timer.lapTime + skritter.fn.getUnixTime(true) - Timer.lapStartAt : Timer.lapTime;
            };
            Timer.lapStartAt = 0;
            Timer.lapTime = 0;
            Timer.reviewLimit = 30;
            Timer.reviewStart = null;
            Timer.reviewStop = null;
            Timer.offset = 0;
            Timer.stopwatch = new Stopwatch();
            Timer.thinkingLimit = 15;
            Timer.thinkingStop = null;
            Timer.time = 0;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            var time = (time) ? time : Timer.time;
            //adjusts the rendered time for the offset
            time += Timer.offset;
            //switched to bitwise operations for better performance across browsers
            var hours = (time / (3600 * 1000)) >> 0;
            time = time % (3600 * 1000);
            var minutes = (time / (60 * 1000)) >> 0;
            time = time % (60 * 1000);
            var seconds = (time / 1000) >> 0;
            //var milliseconds = time % 1000;
            if (hours > 0) {
                this.$el.html(hours + ':' + skritter.fn.pad(minutes, 0, 2) + ':' + skritter.fn.pad(seconds, 0, 2));
            } else {
                this.$el.html(minutes + ':' + skritter.fn.pad(seconds, 0, 2));
            }
            return this;
        },
        /**
         * @method getReviewTime
         * @returns {Number}
         */
        getReviewTime: function() {
            var lapTime = Timer.getLapTime() / 1000;
            if (lapTime >= Timer.reviewLimit)
                return Timer.reviewLimit;
            return lapTime;
        },
        /**
         * @method getStartTime
         * @returns {Number}
         */
        getStartTime: function() {
            return parseInt(Timer.reviewStart / 1000, 10);
        },
        /**
         * @method getThinkingTime
         * @returns {Number}
         */
        getThinkingTime: function() {
            var lapTime = Timer.getLapTime() / 1000;
            if (Timer.thinkingStop) {
                var thinkingTime = (Timer.thinkingStop - Timer.reviewStart) / 1000;
                if (thinkingTime >= Timer.thinkingLimit)
                    return Timer.thinkingLimit;
                return thinkingTime;
            }
            if (lapTime >= Timer.thinkingLimit)
                return Timer.thinkingLimit;
            return lapTime;
        },
        /**
         * @method isReviewLimitReached
         * @returns {Boolean}
         */
        isReviewLimitReached: function() {
            if (Timer.getLapTime() >= Timer.reviewLimit * 1000)
                return true;
            return false;
        },
        /**
         * @method isRunning
         * @returns {Boolean}
         */
        isRunning: function() {
            if (Timer.interval)
                return true;
            return false;
        },
        /**
         * @method isThinkingLimitReached
         * @returns {Boolean}
         */
        isThinkingLimitReached: function() {

        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            if (!this.isRunning()) {
                Timer.lapStartAt = 0;
                Timer.lapTime = 0;
                Timer.reviewStart = null;
                Timer.reviewStop = null;
                Timer.thinkingStop = null;
            }
            return this;
        },
        /**
         * @method setReviewLimit
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setReviewLimit: function(value) {
            Timer.reviewLimit = value;
            return this;
        },
        /**
         * @method setOffset
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setOffset: function(value) {
            Timer.offset = value;
            return this;
        },
        /**
         * @method setThinkingLimit
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setThinkingLimit: function(value) {
            Timer.thinkingLimit = value;
            return this;
        },
        /**
         * @method start
         */
        start: function() {
            if (!Timer.reviewStart)
                Timer.reviewStart = skritter.fn.getUnixTime(true);
            if (!this.isRunning() && !this.isReviewLimitReached()) {
                Timer.interval = setInterval(this.update, 10, this);
                Timer.lapStartAt = Timer.lapStartAt ? Timer.lapStartAt : skritter.fn.getUnixTime(true);
                Timer.stopwatch.start();
            }
        },
        /**
         * @method stop
         */
        stop: function() {
            if (this.isRunning()) {
                Timer.lapTime = Timer.lapStartAt ? Timer.lapTime + skritter.fn.getUnixTime(true) - Timer.lapStartAt : Timer.lapTime;
                Timer.lapStartAt = 0;
                Timer.reviewStop = skritter.fn.getUnixTime(true);
                Timer.stopwatch.stop();
                clearInterval(Timer.interval);
                Timer.interval = null;
            }
        },
        /**
         * @method stopThinking
         * @returns {Backbone.View}
         */
        stopThinking: function() {
            if (!Timer.thinkingStop)
                Timer.thinkingStop = skritter.fn.getUnixTime(true);
            return this;
        },
        /**
         * Updates the offset based on the gathered total study time for the day.
         * 
         * @method sync
         * @param {Boolean} includeServer
         */
        sync: function(includeServer) {
            Timer.offset = skritter.data.reviews.getTotalTime();
            if (includeServer) {
                skritter.api.getProgressStats({
                    start: skritter.settings.get('date')
                }, function(data) {
                    Timer.offset += data[0].timeStudied.day * 1000;
                });
            }
        },
        /**
         * @method update
         * @param {Backbone.View} self
         */
        update: function(self) {
            //get the new time to check in milliseconds and seconds
            var time = Timer.stopwatch.time();
            var seconds = (time / 1000) >> 0;
            //only check and update things when a full second has elapsed
            if ((Timer.time / 1000) >> 0 !== seconds) {
                Timer.time = time;
                self.render();
                //stop the review timer if exceeds the set limit
                if (self.isReviewLimitReached())
                    self.stop();
            }
        }
    });

    return Timer;
});
/**
 * This is a utility class used to convert between number and tone mark pinyin notation.
 * 
 * @module Skritter
 * @class PinyinConverter
 * @author Joshua McFarland
 */
define('PinyinConverter',[],function() {

    /**
     * The object that contains the direct mapping of pinyin using numbers to tone.
     * 
     * @property mapping
     * @type Object
     */
    var mapping = {
        'ang1': 'āng',
        'ang2': 'áng',
        'ang3': 'ǎng',
        'ang4': 'àng',
        'eng1': 'ēng',
        'eng2': 'éng',
        'eng3': 'ěng',
        'eng4': 'èng',
        'ing1': 'īng',
        'ing2': 'íng',
        'ing3': 'ǐng',
        'ing4': 'ìng',
        'ong1': 'ōng',
        'ong2': 'óng',
        'ong3': 'ǒng',
        'ong4': 'òng',
        'an1': 'ān',
        'an2': 'án',
        'an3': 'ǎn',
        'an4': 'àn',
        'en1': 'ēn',
        'en2': 'én',
        'en3': 'ěn',
        'en4': 'èn',
        'in1': 'īn',
        'in2': 'ín',
        'in3': 'ǐn',
        'in4': 'ìn',
        'un1': 'ūn',
        'un2': 'ún',
        'un3': 'ǔn',
        'un4': 'ùn',
        'er2': 'ér',
        'er3': 'ěr',
        'er4': 'èr',
        'ao1': 'āo',
        'ao2': 'áo',
        'ao3': 'ǎo',
        'ao4': 'ào',
        'ou1': 'ōu',
        'ou2': 'óu',
        'ou3': 'ǒu',
        'ou4': 'òu',
        'ai1': 'āi',
        'ai2': 'ái',
        'ai3': 'ǎi',
        'ai4': 'ài',
        'ei1': 'ēi',
        'ei2': 'éi',
        'ei3': 'ěi',
        'ei4': 'èi',
        'a1': 'ā',
        'a2': 'á',
        'a3': 'ǎ',
        'a4': 'à',
        'e1': 'ē',
        'e2': 'é',
        'e3': 'ě',
        'e4': 'è',
        'i1': 'ī',
        'i2': 'í',
        'i3': 'ǐ',
        'i4': 'ì',
        'o1': 'ō',
        'o2': 'ó',
        'o3': 'ǒ',
        'o4': 'ò',
        'u1': 'ū',
        'u2': 'ú',
        'u3': 'ǔ',
        'u4': 'ù',
        'v1': 'ǖ',
        'v2': 'ǘ',
        'v3': 'ǚ',
        'v4': 'ǜ',
        'v': 'ü'
    };

    /**
     * Uses regex to and loops through the string replacing all of the matching tones with numbers.
     * 
     * @method number
     * @param {String} text The text that needs to be converted
     * @returns {String} The string with replaced values
     */
    var number = function(text) {
        text = text.toLowerCase();
        for (var key in mapping)
        {
            var expression = new RegExp(mapping[key], 'g');
            text = text.replace(expression, key);
        }
        return text;
    };
    
    /**
     * Uses regex to and loops through the string replacing all of the matching numbers with tones.
     * 
     * @method tone
     * @param {String} text The text that needs to be converted
     * @returns {String} The string with replaced values
     */
    var tone = function(text) {
        text = text.replace('5', '').toLowerCase();
        for (var key in mapping)
        {
            var expression = new RegExp(key, 'g');
            text = text.replace(expression, mapping[key]);
        }
        return text;
    };

    return {
        toNumber: number,
        toTone: tone
    };
});
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/study/Decomp',[
    'PinyinConverter'
], function(PinyinConverter) {
    /**
     * @class Decomp
     */
    var Decomp = Backbone.Model.extend({
	/**
         * @property {String} idAttribute
         */
        idAttribute: 'writing',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('decomps', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return PinyinConverter.toTone(this.get('reading'));
        }
    });
    
    return Decomp;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param Decomp
 * @author Joshua McFarland
 */
define('collections/study/Decomps',[
    'models/study/Decomp'
], function(Decomp) {
    /**
     * @class Decomps
     */
    var Decomps = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(decomp) {
                decomp.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Decomp,
        /**
         * @method insert
         * @param {Array} decomps
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(decomps, callback) {
            if (decomps) {
                skritter.data.decomps.add(decomps, {merge: true, silent: true});
                skritter.storage.setItems('decomps', decomps, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('decomps', function(decomps) {
                skritter.data.decomps.add(decomps, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Decomps;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param CanvasStroke
 * @author Joshua McFarland
 */
define('collections/CanvasCharacter',[
    'models/CanvasStroke'
], function(CanvasStroke) {
    /**
     * @class CanvasCharacter
     */
    var CanvasCharacter = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.targets = [];
        },
        /**
         * @property {CanvasStroke} model
         */
        model: CanvasStroke,
        /**
         * @method comparator
         * @param {CanvasStroke} stroke
         * @returns {CanvasStroke}
         */
        comparator: function(stroke) {
            return stroke.get('position');
        },
        /**
         * Checks the character to see if the stroke already exists either directly or indirectly as
         * a contained double stroke.
         * 
         * @method containsStroke
         * @param {CanvasStroke} stroke
         * @returns {Boolean} Returns true if the character contains the stroke
         */
        containsStroke: function(stroke) {
            var strokeId = stroke.get('id');
            var strokeContains = stroke.getContainedStrokeIds();
            for (var i in this.models) {
                var id = this.models[i].get('id');
                var contains = this.models[i].getContainedStrokeIds();
                //directly check for strokes position
                if (strokeId === id)
                    return true;
                //checks for existing contained strokes
                if (contains)
                    for (i in contains) {
                        var contained = contains[i];
                        if (_.contains(strokeContains, contained))
                            return true;
                    }
            }
            return false;
        },
        /**
         * Gets a container with all of the child stroke that character is comprised of and
         * returns them in a single container.
         * 
         * @method getCharacterSprite
         * @param {Number} excludeStrokePosition
         * @param {String} color
         * @returns {Container} A container of sprites contained in the character
         */
        getCharacterSprite: function(excludeStrokePosition, color) {
            color = (color) ? color : '#000000';
            var spriteContainer = new createjs.Container();
            spriteContainer.name = 'character';
            for (var i = 0; i < this.models.length; i++) {
                if (i !== (excludeStrokePosition - 1))
                    spriteContainer.addChild(this.models[i].getInflatedSprite(color).clone());
            }
            return spriteContainer;
        },
        /**
         * The number of strokes in a row starting from the first that are in the correct order.s
         * 
         * @method getConsecutiveStrokeCount
         * @returns {Number}
         */
        getConsecutiveStrokeCount: function() {
            var strokeCount = 0;
            for (var i in this.models) {
                var stroke = this.models[i];
                var expected = strokeCount + 1;
                if (stroke.get('position') !== expected)
                    break;
                strokeCount += (stroke.has('contains')) ? 2 : 1;
            }
            return strokeCount;
        },
        /**
         * Returns a flattened array of the inflated params.
         * 
         * @method getCorners
         * @returns {Array}
         */
        getParams: function() {
            var corners = [];
            for (var i in this.models)
                corners.push(this.models[i].getInflatedParams()[0].get('corners'));
            return _.flatten(corners, true);
        },
        /**
         * Returns the next expected stroke based on the next stroke.
         * 
         * @method getExpectedStroke
         * @param {CanvasStroke} nextStroke
         * @returns {CanvasStroke}
         */
        getExpectedStroke: function(nextStroke) {
            var position;
            //emulate the next stroke in the character to better predict the variation
            var character = this.clone();
            character.add(nextStroke);
            character.targets = this.targets;
            var index = character.getVariationIndex();
            var consecutive = this.getConsecutiveStrokeCount();
            //select a position based on consecutive strokes
            if (consecutive === 0) {
                position = 1;
            } else {
                position = consecutive + 1;
            }
            //find the expected stroke and return it
            var stroke = character.targets[index].findWhere({position: position});
            if (stroke)
                return stroke;
        },
        /**
         * Returns the next stroke based on the predicted variation.
         * 
         * @method getNextStroke
         * @param {Boolean} forceLast
         * @returns {CanvasStroke}
         */
        getNextStroke: function(forceLast) {
            var index;
            if (forceLast) {
                index = this.targets.length - 1;
            } else {
                index = this.getVariationIndex();
            }
            var position = this.getConsecutiveStrokeCount() + 1;
            var stroke = this.targets[index].findWhere({position: position});
            if (stroke)
                return stroke;
        },
        /**
         * Returns the index of the variation that matches the currently input character.
         * 
         * @method getVariationIndex
         * @returns {Number}
         */
        getVariationIndex: function() {
            var scores = [];
            if (this.targets.length === 0)
                return 0;
            //sizes and sets the scores array
            for (var i = 0; i < this.targets.length; i++)
                scores[i] = 0;
            //score each variation based on if it exists in the character
            for (var a in this.models) {
                var strokeId = this.models[a].get('id');
                for (var b in this.targets) {
                    var variation = this.targets[b];
                    if (variation.findWhere({id: strokeId}))
                        scores[b]++;
                }
            }
            return scores.indexOf(Math.max.apply(Math, scores));
        },
        /**
         * Returns a count of the total number of strokes in the character including the broken
         * down double strokes.
         * 
         * @method getStrokeCount
         * @param {Boolean} ignoreTweening
         * @returns {Number} The total number of stroke in the character
         */
        getStrokeCount: function(ignoreTweening) {
            var strokeCount = 0;
            for (var i in this.models) {
                var stroke = this.models[i];
                if (ignoreTweening) {
                    if (!stroke.get('isTweening')) {
                        if (stroke.has('contains')) {
                            strokeCount += stroke.get('contains').length;
                        } else {
                            strokeCount++;
                        }
                    }
                } else {
                    if (stroke.has('contains')) {
                        strokeCount += stroke.get('contains').length;
                    } else {
                        strokeCount++;
                    }

                }
            }
            return strokeCount;
        },
        /**
         * Returns the stroke highest possible stroke count out of all of the targets.
         * 
         * @method getTargetStrokeCount
         * @returns {Number}
         */
        getTargetStrokeCount: function() {
            var strokeCount = 0;
            for (var a in this.targets)
            {
                if (this.targets[a].getStrokeCount() > strokeCount) {
                    strokeCount = this.targets[a].getStrokeCount();
                }
            }
            return strokeCount;
        },
        /**
         * Returns true if the character contains all of the completed strokes.
         * 
         * @method isComplete
         * @returns {Boolean}
         */
        isComplete: function() {
            if (this.getStrokeCount() >= this.getTargetStrokeCount())
                return true;
            return false;
        }
    });

    return CanvasCharacter;
});
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/study/Review',[],function() {
    /**
     * @class Review
     */
    var Review = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('reviews', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        defaults: {
            score: 3,
            bearTime: false,
            submitTime: 0,
            reviewTime: 0,
            thinkingTime: 0,
            currentInterval: 0,
            actualInterval: 0,
            newInterval: 0,
            previousInterval: 0,
            previousSuccess: false
        }
    });

    return Review;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/study/PromptItem',[],function() {
    /**
     * @class PromptItem
     */
    var PromptItem = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'position',
        /**
         * @property {Object} defaults
         */
        defaults: {
            character: null,
            finished: false,
            item: null,
            position: 0,
            review: null
        },
        /**
         * @method getGrade
         * @returns {Number}
         */
        getGrade: function() {
            return this.get('review').get('score');
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            if (this.get('finished'))
                return true;
            return false;
        },
        item: function() {
            return this.get('item');
        },
        review: function() {
            return this.get('review');
        },
        setReview: function(grade, reviewTime, thinkingTime, submitTime) {
            var now = skritter.fn.getUnixTime();
            var review = this.review().set({
                score: grade,
                submitTime: submitTime ? submitTime : now,
                reviewTime: reviewTime,
                thinkingTime: thinkingTime,
                currentInterval: (this.item().get('interval')) ? this.item().get('interval') : 0,
                actualInterval: this.item().has('last') ? now - this.item().get('last') : 0,
                newInterval: skritter.scheduler.getInterval(this.item(), grade),
                previousInterval: this.item().has('previousInterval') ? this.item().get('previousInterval') : 0,
                previousSuccess: this.item().has('previousSuccess') ? this.item().get('previousSuccess') : false
            });
            this.item().set({
                changed: now,
                last: now,
                next: now + review.get('newInterval'),
                interval: review.get('newInterval'),
                previousInterval: review.get('currentInterval'),
                previousSuccess: (grade > 1) ? true : false,
                reviews: this.item().get('reviews') + 1,
                successes: (grade > 1) ? this.item().get('successes') + 1 : this.item().get('successes')
            });
        },
        updateReview: function(grade) {
            this.review().set('score', grade);
        }
    });
    
    return PromptItem;
});
/**
 * @module Skritter
 * @param PromptItem
 * @author Joshua McFarland
 */
define('collections/study/PromptData',[
    'models/study/PromptItem'
], function(PromptItem) {
    /**
     * @class PromptData
     */
    var PromptData = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            PromptData.this = this;
            this.id = null;
            this.item = null;
            this.position = 1;
            this.vocab =  null;
        },
        /**
         * @property {Backbone.Model} model
         */
        model: PromptItem,
        /**
         * @method getContainedItems
         * @param {Boolean} includeBase
         * @returns {Array}
         */
        getContainedItems: function(includeBase) {
            var contained = [];
            for (var i in this.models)
                if (this.models[i].id > 0 || includeBase)
                    contained.push(this.models[i].item());
            return contained;
        },
        /**
         * @method getContainedReviews
         * @param {Boolean} includeBase
         * @returns {Array}
         */
        getContainedReviews: function(includeBase) {
            var contained = [];
            for (var i in this.models)
                if (this.models[i].id > 0 || includeBase)
                    contained.push(this.models[i].review());
            return contained;
        },
        /**
         * @method getDataItem
         * @returns {Backbone.Model}
         */
        getDataItem: function() {
            return this.get(this.position);
        },
        /**
         * @method getTotalGrade
         * @returns {Number}
         */
        getFinalGrade: function() {
            var finalGrade = 3;
            var contained = this.getContainedReviews();
            if (contained.length === 1) {
                finalGrade = contained[0].get('score');
            } else {
                var totalGrade = this.getTotalGrade();
                var totalWrong = this.getTotalWrong();
                if (this.getMaxPosition() === 2 && totalWrong === 1) {
                    finalGrade = 1;
                } else if (totalWrong >= 2) {
                    finalGrade = 1;
                } else {
                    finalGrade = Math.floor(totalGrade / this.getMaxPosition());
                }
            }
            return finalGrade;
        },
        /**
         * @method getMaxPosition
         * @returns {Number}
         */
        getMaxPosition: function() {
            var maxCount = 0;
            for (var i in this.models)
                if (this.models[i].get('position') > 0)
                    maxCount++;
            return maxCount;
        },
        /**
         * @method getStartTime
         * @returns {Number}
         */
        getStartTime: function() {
            return this.get(1).review().get('submitTime');
        },
        /**
         * @method getTotalGrade
         * @returns {Number}
         */
        getTotalGrade: function() {
            var totalGrade = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                totalGrade += contained[i].get('score');
            return totalGrade;
        },
        /**
         * @method getTotalReviewTime
         * @returns {Number}
         */
        getTotalReviewTime: function() {
            var totalReviewTime = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                totalReviewTime += contained[i].get('reviewTime');
            return totalReviewTime;
        },
        /**
         * @method getTotalThinkingTime
         * @returns {Number}
         */
        getTotalThinkingTime: function() {
            var totalThinkingTime = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                totalThinkingTime += contained[i].get('thinkingTime');
            return totalThinkingTime;
        },
        /**
         * @method getTotalWrong
         * @returns {Number}
         */
        getTotalWrong: function() {
            var totalWrong = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                if (contained[i].get('score') < 2)
                    totalWrong++;
            return totalWrong;
        },
        /**
         * @property {Object} hide
         */
        hide: {
            definition: function() {
                $('.prompt-definition').hide();
            },
            mnemonic: function() {
                $('.prompt-mnemonic').hide();
            },
            question: function() {
                $('.prompt-question').hide(100);
            },
            reading: function() {
                $('.prompt-reading').hide();
            },
            sentence: function() {
                $('.prompt-sentence').hide();
            },
            style: function() {
                $('.prompt-style').hide();
            },
            tip: function() {
                $('.prompt-tip').hide();
            },
            writing: function() {
                $('.prompt-writing').hide();
            }
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            if (this.position <= 1)
                return true;
            return false;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            if (this.position >= this.getMaxPosition())
                return true;
            return false;
        },
        /**
         * @method next
         * @returns {Number}
         */
        next: function() {
            if (!this.isLast())
                this.position++;
            return this.position;
        },
        /**
         * @method previous
         * @returns {Number}
         */
        previous: function() {
            if (!this.isFirst())
                this.position--;
            return this.position;
        },
        /**
         * @method save
         * @returns {Backbone.Collection}
         */
        save: function() {
            if (this.get(0))
                this.get(0).setReview(this.getFinalGrade(), this.getTotalReviewTime(), this.getTotalThinkingTime(), this.getStartTime());
            skritter.data.items.add(this.getContainedItems(true), {merge: true});
            skritter.data.reviews.add(this.getContainedReviews(true), {merge: true});
            return this;
        },
        /**
         * @property {Object} show
         */
        show: {
            definition: function() {
                $('.prompt-definition').html(PromptData.this.vocab.getDefinition());
                $('.prompt-definition').show();
            },
            mnemonic: function() {
                $('.prompt-mnemonic').html(PromptData.this.vocab.get('mnemonic').text + ' (' + PromptData.this.vocab.get('mnemonic').creator + ')');
                $('.prompt-mnemonic').show();
            },
            question: function(text) {
                $('.prompt-question').html(text);
                $('.prompt-question').show();
            },
            reading: function() {
                $('.prompt-reading').html(PromptData.this.vocab.getReading());
                $('.prompt-reading').show();
            },
            readingAt: function(offset, reveal) {
                offset = (offset) ? offset : 0;
                $('.prompt-reading').html(PromptData.this.vocab.getReadingDisplay(PromptData.this.position + offset, reveal));
                $('.prompt-reading').show();
            },
            sentence: function() {
                if (PromptData.this.vocab.getSentence()) {
                    $('.prompt-sentence').html(PromptData.this.vocab.getSentence().getWriting());
                    $('.prompt-sentence').show();
                } else {
                    PromptData.this.hide.sentence();
                }
            },
            sentenceMasked: function() {
                if (PromptData.this.vocab.getSentence()) {
                    $('.prompt-sentence').html(skritter.fn.maskCharacters(PromptData.this.vocab.getSentence().getWriting(), PromptData.this.vocab.get('writing'), '__'));
                    $('.prompt-sentence').show();
                } else {
                    PromptData.this.hide.sentence();
                }
            },
            style: function() {
                var style = PromptData.this.vocab.get('style');
                if (style === 'simp') {
                    $('.prompt-style').html(style.toUpperCase());
                    $('.prompt-style').addClass('prompt-style-simp');
                    $('.prompt-style').show();
                } else if (style === 'trad') {
                    $('.prompt-style').html(style.toUpperCase());
                    $('.prompt-style').addClass('prompt-style-trad');
                    $('.prompt-style').show();
                } else {
                    PromptData.this.hide.style();
                }
            },
            tip: function(text) {
                $('.prompt-tip').html(text);
                $('.prompt-tip').show();
            },
            writing: function() {
                $('.prompt-writing').html(PromptData.this.vocab.get('writing'));
                $('.prompt-writing').show();
            },
            writingAt: function(offset) {
                offset = (offset) ? offset : 0;
                $('.prompt-writing').html(PromptData.this.vocab.getWritingDisplay(PromptData.this.position + offset));
                $('.prompt-writing').show();
            }
        }
    });
    
    return PromptData;
}); 
/**
 * @module Skritter
 * @submodule Model
 * @param CanvasCharacter
 * @param Review
 * @param PromptData
 * @author Joshua McFarland
 */
define('models/study/Item',[
    'collections/CanvasCharacter',
    'models/study/Review',
    'collections/study/PromptData'
], function(CanvasCharacter, Review, PromptData) {
    /**
     * @class Item
     */
    var Item = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * Returns an array of items contained in multi-character items, but only for
         * rune and tone prompts.
         * 
         * @method getContainedItems
         * @returns {Array}
         */
        getContainedItems: function() {
            var containedItems = [];
            var part = this.get('part');
            var vocab = this.getVocab();
            if (vocab && _.contains(['rune', 'tone'], part))
                return vocab.getContainedItems(part);
            return containedItems;
        },
        /**
         * @method getRelatedItemIds
         * @returns {Array}
         */
        getRelatedItemIds: function() {
            var relatedItemIds = [];
            var part = this.get('part');
            var parts = ['defn', 'rdng', 'rune', 'tone'];
            for (var i in parts)
                if (parts[i] !== part)
                    relatedItemIds.push(this.id.replace(part, parts[i]));
            return relatedItemIds;
        },
        /**
         * Returns an object used to fuel the prompt view and stores data pertaining to it.
         * TODO: add more comments once this is ironed out
         * 
         * @method getPromptData
         * @returns {Object}
         */
        getPromptData: function() {
            var data = new PromptData();
            var character = null;
            var containedItems = this.getContainedItems();
            var id = this.get('id');
            var now = skritter.fn.getUnixTime();
            var part = this.get('part');
            var vocab = this.getVocab();
            var wordGroup = now + '_' + id;
            //generates data for defn, rdng and items without contained
            if (_.contains(['defn', 'rdng'], part) || containedItems.length === 0) {
                if (_.contains(['rune', 'tone'], part)) {
                    character = new CanvasCharacter();
                    character.targets = vocab.getCanvasCharacters(1, part);
                }
                data.add({
                    character: character,
                    finished: false,
                    id: this.get('id'),
                    item: this.clone(),
                    position: 1,
                    review: new Review({
                        id: now + '_0_' + this.get('id'),
                        itemId: id,
                        bearTime: true,
                        wordGroup: wordGroup
                    })
                });
            } else {
                //extract contained kana from japanese writing prompts
                var filteredContainedItems = [];
                for (var k = 0; k < containedItems.length; k++) {
                    if (!containedItems[k].isKana())
                        filteredContainedItems.push(containedItems[k]);
                }
                //generates data for rune and tone items with contained
                filteredContainedItems.unshift(this);
                for (var i = 0; i < filteredContainedItems.length; i++) {
                    var item = filteredContainedItems[i];
                    var itemId = item.get('id');
                    if (i !== 0) {
                        character = new CanvasCharacter();
                        character.targets = vocab.getCanvasCharacters(i, part);
                    }
                    data.add({
                        character: character,
                        finished: false,
                        id: itemId,
                        item: item.clone(),
                        position: i,
                        review: new Review({
                            id: now + '_' + i + '_' + itemId,
                            itemId: item.get('id'),
                            bearTime: (i === 0) ? true : false,
                            wordGroup: wordGroup
                        }),
                        vocab: item.getVocab()
                    });
                }
            }
            //appends the vocab to the end of the object
            data.id = id;
            data.item = this;
            data.vocab = vocab;
            return data;
        },
        /**
         * @method getVocab
         * @returns {Backbone.Model}
         */
        getVocab: function() {
            var vocabId = this.getVocabId();
            if (vocabId) {
                var vocab = skritter.data.vocabs.get(vocabId);
                if (vocab)
                    return vocab;
            }
            return null;
        },
        /**
         * @method getVocabId
         * @returns {String}
         */
        getVocabId: function() {
            var vocabIds = this.get('vocabIds');
            if (vocabIds.length > 0)
                return vocabIds[this.get('reviews') % vocabIds.length];
            return null;
        },
        /**
         * Returns true if the item is a single kana character. Since we don't currently support kana
         * and writing prompts it needs to be excluded.
         * 
         * @method isKana
         * @returns {Boolean}
         */
        isKana: function() {
            if (this.get('lang') === 'ja') {
                var writing = this.id.split('-')[2];
                if (writing.split('').length === 1 && skritter.fn.isKana(writing))
                    return true;
            }
            return false;
        }
    });

    return Item;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param Item
 * @author Joshua McFarland
 */
define('collections/study/Items',[
    'models/study/Item'
], function(Item) {
    /**
     * @class Items
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('add change', function(item) {
                skritter.scheduler.update(item);
                item.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method insert
         * @param {Array} items
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(items, callback) {
            if (items) {
                skritter.data.items.add(items, {merge: true, silent: true});
                skritter.storage.setItems('items', items, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method load
         * @param {String} id
         * @param {Function} callback
         */
        load: function(id, callback) {
            var item = this.get(id);
            if (item) {
                callback(item);
            } else {
                skritter.storage.getItems('items', id, _.bind(function(item) {
                    callback(this.add(item, {merge: true, silent: true})[0]);
                }, this));
            }
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', function(items) {
                skritter.data.items.add(items, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Items;
});
/*
 * 
 * Module: Params
 * 
 * Created By: Joshua McFarland
 * 
 */
define('ParamList',[],function() {

    var params = [
        {"bitmapId": 0, "corners": [{"x": 26, "y": 51}, {"x": 356, "y": 12}], "deviations": [{"x": 162, "y": 39}]},
        {"bitmapId": 1, "corners": [{"x": 19, "y": 46}, {"x": 270, "y": 15}], "deviations": [{"x": 159, "y": 25}]},
        {"bitmapId": 2, "corners": [{"x": 22, "y": 43}, {"x": 207, "y": 8}], "deviations": [{"x": 83, "y": 29}]},
        {"bitmapId": 3, "corners": [{"x": 20, "y": 47}, {"x": 172, "y": 12}], "deviations": [{"x": 103, "y": 32}]},
        {"bitmapId": 4, "corners": [{"x": 14, "y": 28}, {"x": 159, "y": 9}], "deviations": [{"x": 139, "y": 15}]},
        {"bitmapId": 5, "corners": [{"x": 16, "y": 40}, {"x": 154, "y": 7}], "deviations": [{"x": 106, "y": 22}]},
        {"bitmapId": 6, "corners": [{"x": 15, "y": 31}, {"x": 109, "y": 6}], "deviations": [{"x": 78, "y": 10}]},
        {"bitmapId": 7, "corners": [{"x": 14, "y": 29}, {"x": 86, "y": 8}], "deviations": [{"x": 73, "y": 11}]},
        {"bitmapId": 8, "corners": [{"x": 8, "y": 20}, {"x": 69, "y": 8}], "deviations": [{"x": 36, "y": 17}]},
        {"bitmapId": 9, "corners": [{"x": 28, "y": 13}, {"x": 21, "y": 383}], "deviations": [{"x": 28, "y": 317}]},
        {"bitmapId": 10, "corners": [{"x": 25, "y": 24}, {"x": 25, "y": 295}], "deviations": [{"x": 28, "y": 129}]},
        {"bitmapId": 11, "corners": [{"x": 25, "y": 23}, {"x": 25, "y": 265}], "deviations": [{"x": 25, "y": 258.95}]},
        {"bitmapId": 12, "corners": [{"x": 25, "y": 18}, {"x": 45, "y": 272}], "deviations": [{"x": 36, "y": 92}]},
        {"bitmapId": 13, "corners": [{"x": 19, "y": 17}, {"x": 22, "y": 207}], "deviations": [{"x": 22, "y": 116}]},
        {"bitmapId": 14, "corners": [{"x": 19, "y": 19}, {"x": 30, "y": 167}], "deviations": [{"x": 29, "y": 104}]},
        {"bitmapId": 15, "corners": [{"x": 40, "y": 16}, {"x": 14, "y": 220}], "deviations": [{"x": 21, "y": 187}]},
        {"bitmapId": 16, "corners": [{"x": 16, "y": 10}, {"x": 20, "y": 110}], "deviations": [{"x": 19, "y": 61}]},
        {"bitmapId": 17, "corners": [{"x": 19, "y": 14}, {"x": 18, "y": 212}], "deviations": [{"x": 18, "y": 14}]},
        {"bitmapId": 18, "corners": [{"x": 27, "y": 19}, {"x": 27, "y": 391}], "deviations": [{"x": 27, "y": 316.6}]},
        {"bitmapId": 19, "corners": [{"x": 32, "y": 25}, {"x": 34, "y": 327}], "deviations": [{"x": 34, "y": 45}]},
        {"bitmapId": 20, "corners": [{"x": 20, "y": 17}, {"x": 18, "y": 232}], "deviations": [{"x": 20, "y": 189}]},
        {"bitmapId": 21, "corners": [{"x": 30, "y": 22}, {"x": 22, "y": 181}], "deviations": [{"x": 31, "y": 88}]},
        {"bitmapId": 22, "corners": [{"x": 21, "y": 13}, {"x": 15, "y": 186}], "deviations": [{"x": 21, "y": 115}]},
        {"bitmapId": 23, "corners": [{"x": 22, "y": 17}, {"x": 32, "y": 177}], "deviations": [{"x": 26, "y": 138}]},
        {"bitmapId": 24, "corners": [{"x": 24, "y": 12}, {"x": 18, "y": 120}], "deviations": [{"x": 20, "y": 31}]},
        {"bitmapId": 25, "corners": [{"x": 16, "y": 12}, {"x": 20, "y": 107}], "deviations": [{"x": 16, "y": 70}]},
        {"bitmapId": 26, "corners": [{"x": 16, "y": 10}, {"x": 41, "y": 140}], "deviations": [{"x": 32, "y": 55}]},
        {"bitmapId": 27, "corners": [{"x": 17, "y": 9}, {"x": 27, "y": 54}], "deviations": [{"x": 24, "y": 27}]},
        {"bitmapId": 28, "corners": [{"x": 7, "y": 9}, {"x": 14, "y": 43}], "deviations": [{"x": 7, "y": 19}]},
        {"bitmapId": 29, "corners": [{"x": 67, "y": 25}, {"x": 9, "y": 260}], "deviations": [{"x": 58, "y": 48}]},
        {"bitmapId": 30, "corners": [{"x": 48, "y": 20}, {"x": 9, "y": 162}], "deviations": [{"x": 41, "y": 51}]},
        {"bitmapId": 31, "corners": [{"x": 76, "y": 18}, {"x": 8, "y": 345}], "deviations": [{"x": 64, "y": 200}]},
        {"bitmapId": 32, "corners": [{"x": 103, "y": 15}, {"x": 10, "y": 350}], "deviations": [{"x": 91, "y": 256}]},
        {"bitmapId": 33, "corners": [{"x": 149, "y": 22}, {"x": 6, "y": 342}], "deviations": [{"x": 131, "y": 258}]},
        {"bitmapId": 34, "corners": [{"x": 181, "y": 18}, {"x": 15, "y": 388}], "deviations": [{"x": 153, "y": 242}]},
        {"bitmapId": 35, "corners": [{"x": 169, "y": 20}, {"x": 17, "y": 377}], "deviations": [{"x": 140, "y": 264}]},
        {"bitmapId": 36, "corners": [{"x": 147, "y": 22}, {"x": 16, "y": 335}], "deviations": [{"x": 100, "y": 237}]},
        {"bitmapId": 37, "corners": [{"x": 108, "y": 18}, {"x": 11, "y": 290}], "deviations": [{"x": 86, "y": 198}]},
        {"bitmapId": 38, "corners": [{"x": 98, "y": 18}, {"x": 13, "y": 306}], "deviations": [{"x": 82, "y": 155}]},
        {"bitmapId": 39, "corners": [{"x": 219, "y": 23}, {"x": 10, "y": 388}], "deviations": [{"x": 156, "y": 223}]},
        {"bitmapId": 40, "corners": [{"x": 238, "y": 24}, {"x": 18, "y": 306}], "deviations": [{"x": 183, "y": 217}]},
        {"bitmapId": 41, "corners": [{"x": 219, "y": 26}, {"x": 12, "y": 313}], "deviations": [{"x": 140, "y": 210}]},
        {"bitmapId": 42, "corners": [{"x": 254, "y": 13}, {"x": 15, "y": 279}], "deviations": [{"x": 135, "y": 171}]},
        {"bitmapId": 43, "corners": [{"x": 242, "y": 23}, {"x": 16, "y": 257}], "deviations": [{"x": 145, "y": 158}]},
        {"bitmapId": 44, "corners": [{"x": 203, "y": 15}, {"x": 16, "y": 235}], "deviations": [{"x": 126, "y": 151}]},
        {"bitmapId": 45, "corners": [{"x": 145, "y": 25}, {"x": 12, "y": 196}], "deviations": [{"x": 111, "y": 139}]},
        {"bitmapId": 46, "corners": [{"x": 109, "y": 15}, {"x": 10, "y": 203}], "deviations": [{"x": 80, "y": 145}]},
        {"bitmapId": 47, "corners": [{"x": 33, "y": 12}, {"x": 11, "y": 168}], "deviations": [{"x": 37, "y": 103}]},
        {"bitmapId": 48, "corners": [{"x": 56, "y": 15}, {"x": 16, "y": 151}], "deviations": [{"x": 56, "y": 88}]},
        {"bitmapId": 49, "corners": [{"x": 25, "y": 12}, {"x": 12, "y": 96}], "deviations": [{"x": 25, "y": 70}]},
        {"bitmapId": 50, "corners": [{"x": 121, "y": 11}, {"x": 8, "y": 214}], "deviations": [{"x": 83, "y": 123}]},
        {"bitmapId": 51, "corners": [{"x": 145, "y": 26}, {"x": 13, "y": 220}], "deviations": [{"x": 102, "y": 112}]},
        {"bitmapId": 52, "corners": [{"x": 199, "y": 18}, {"x": 8, "y": 200}], "deviations": [{"x": 137, "y": 105}]},
        {"bitmapId": 53, "corners": [{"x": 199, "y": 14}, {"x": 11, "y": 205}], "deviations": [{"x": 145, "y": 102}]},
        {"bitmapId": 54, "corners": [{"x": 161, "y": 19}, {"x": 12, "y": 160}], "deviations": [{"x": 106, "y": 107}]},
        {"bitmapId": 55, "corners": [{"x": 108, "y": 15}, {"x": 10, "y": 151}], "deviations": [{"x": 79, "y": 93}]},
        {"bitmapId": 56, "corners": [{"x": 146, "y": 15}, {"x": 11, "y": 124}], "deviations": [{"x": 104, "y": 63}]},
        {"bitmapId": 57, "corners": [{"x": 110, "y": 12}, {"x": 13, "y": 94}], "deviations": [{"x": 85, "y": 51}]},
        {"bitmapId": 58, "corners": [{"x": 76, "y": 21}, {"x": 13, "y": 164}], "deviations": [{"x": 55, "y": 90}]},
        {"bitmapId": 59, "corners": [{"x": 63, "y": 18}, {"x": 12, "y": 106}], "deviations": [{"x": 44, "y": 74}]},
        {"bitmapId": 60, "corners": [{"x": 32, "y": 11}, {"x": 9, "y": 87}], "deviations": [{"x": 32, "y": 49}]},
        {"bitmapId": 61, "corners": [{"x": 112, "y": 22}, {"x": 17, "y": 96}], "deviations": [{"x": 93, "y": 41}]},
        {"bitmapId": 62, "corners": [{"x": 76, "y": 17}, {"x": 9, "y": 111}], "deviations": [{"x": 44, "y": 70}]},
        {"bitmapId": 63, "corners": [{"x": 56, "y": 21}, {"x": 10, "y": 101}], "deviations": [{"x": 46, "y": 45}]},
        {"bitmapId": 64, "corners": [{"x": 58, "y": 16}, {"x": 15, "y": 70}], "deviations": [{"x": 40, "y": 42}]},
        {"bitmapId": 65, "corners": [{"x": 54, "y": 19}, {"x": 17, "y": 41}], "deviations": [{"x": 28, "y": 32}]},
        {"bitmapId": 66, "corners": [{"x": 161, "y": 22}, {"x": 26, "y": 75}], "deviations": [{"x": 57, "y": 66}]},
        {"bitmapId": 67, "corners": [{"x": 174, "y": 16}, {"x": 15, "y": 134}], "deviations": [{"x": 128, "y": 70}]},
        {"bitmapId": 68, "corners": [{"x": 22, "y": 12}, {"x": 258, "y": 227}], "deviations": [{"x": 100, "y": 107}]},
        {"bitmapId": 69, "corners": [{"x": 16, "y": 8}, {"x": 234, "y": 271}], "deviations": [{"x": 180, "y": 235}]},
        {"bitmapId": 70, "corners": [{"x": 14, "y": 6}, {"x": 276, "y": 172}], "deviations": [{"x": 77, "y": 30}]},
        {"bitmapId": 71, "corners": [{"x": 21, "y": 8}, {"x": 167, "y": 181}], "deviations": [{"x": 147, "y": 166}]},
        {"bitmapId": 72, "corners": [{"x": 15, "y": 11}, {"x": 162, "y": 146}], "deviations": [{"x": 120, "y": 117}]},
        {"bitmapId": 73, "corners": [{"x": 7, "y": 5}, {"x": 174, "y": 194}], "deviations": [{"x": 105, "y": 130}]},
        {"bitmapId": 74, "corners": [{"x": 10, "y": 9}, {"x": 214, "y": 125}], "deviations": [{"x": 104, "y": 70}]},
        {"bitmapId": 75, "corners": [{"x": 8, "y": 5}, {"x": 148, "y": 124}], "deviations": [{"x": 75, "y": 80}]},
        {"bitmapId": 76, "corners": [{"x": 18, "y": 27}, {"x": 335, "y": 82}], "deviations": [{"x": 141, "y": 17}]},
        {"bitmapId": 77, "corners": [{"x": 13, "y": 9}, {"x": 253, "y": 66}], "deviations": [{"x": 78, "y": 9}]},
        {"bitmapId": 78, "corners": [{"x": 11, "y": 8}, {"x": 58, "y": 56}], "deviations": [{"x": 39, "y": 34}]},
        {"bitmapId": 79, "corners": [{"x": 1, "y": 0}, {"x": 24, "y": 16}], "deviations": [{"x": 6, "y": 2}]},
        {"bitmapId": 80, "corners": [{"x": 4, "y": 5}, {"x": 113, "y": 113}], "deviations": [{"x": 56, "y": 47}]},
        {"bitmapId": 81, "corners": [{"x": 5, "y": 6}, {"x": 107, "y": 66}], "deviations": [{"x": 69, "y": 38}]},
        {"bitmapId": 82, "corners": [{"x": 8, "y": 9}, {"x": 71, "y": 99}], "deviations": [{"x": 10, "y": 15}]},
        {"bitmapId": 83, "corners": [{"x": 39, "y": 12}, {"x": 15, "y": 100}], "deviations": [{"x": 31, "y": 46}]},
        {"bitmapId": 84, "corners": [{"x": 61, "y": 10}, {"x": 13, "y": 70}], "deviations": [{"x": 41, "y": 41}]},
        {"bitmapId": 85, "corners": [{"x": 31, "y": 24}, {"x": 15, "y": 110}], "deviations": [{"x": 31, "y": 35}]},
        {"bitmapId": 86, "corners": [{"x": 39, "y": 20}, {"x": 15, "y": 80}], "deviations": [{"x": 40, "y": 29}]},
        {"bitmapId": 87, "corners": [{"x": 28, "y": 61}, {"x": 189, "y": 9}], "deviations": [{"x": 153, "y": 25}]},
        {"bitmapId": 88, "corners": [{"x": 22, "y": 114}, {"x": 161, "y": 13}], "deviations": [{"x": 90, "y": 62}]},
        {"bitmapId": 89, "corners": [{"x": 29, "y": 74}, {"x": 146, "y": 9}], "deviations": [{"x": 51, "y": 56}]},
        {"bitmapId": 90, "corners": [{"x": 22, "y": 57}, {"x": 87, "y": 11}], "deviations": [{"x": 29, "y": 55}]},
        {"bitmapId": 91, "corners": [{"x": 28, "y": 118}, {"x": 106, "y": 10}], "deviations": [{"x": 40, "y": 108}]},
        {"bitmapId": 92, "corners": [{"x": 22, "y": 141}, {"x": 94, "y": 9}], "deviations": [{"x": 41, "y": 101}]},
        {"bitmapId": 93, "corners": [{"x": 10, "y": 48}, {"x": 48, "y": 11}], "deviations": [{"x": 23, "y": 39}]},
        {"bitmapId": 94, "corners": [{"x": 17, "y": 49}, {"x": 283.07038623570236, "y": 9.2324034410744}, {"x": 258, "y": 55}], "deviations": [{"x": 207, "y": 15}, {"x": 269, "y": 40}]},
        {"bitmapId": 94, "corners": [{"x": 11, "y": 48}, {"x": 271, "y": 11}], "deviations": [{"x": 72, "y": 42}], "feedback": "hook"},
        {"bitmapId": 95, "corners": [{"x": 16, "y": 35}, {"x": 232.0877613281261, "y": 15}, {"x": 211, "y": 55}], "deviations": [{"x": 127, "y": 18}, {"x": 234, "y": 17}]},
        {"bitmapId": 95, "corners": [{"x": 17, "y": 38}, {"x": 219, "y": 10}], "deviations": [{"x": 53, "y": 28}], "feedback": "hook"},
        {"bitmapId": 96, "corners": [{"x": 26, "y": 40}, {"x": 147.7431614223769, "y": 11}, {"x": 110, "y": 74}], "deviations": [{"x": 86, "y": 22}, {"x": 145, "y": 22}]},
        {"bitmapId": 97, "corners": [{"x": 19, "y": 44}, {"x": 167.46209380980034, "y": 22}, {"x": 142, "y": 72}], "deviations": [{"x": 39, "y": 44}, {"x": 164, "y": 33}]},
        {"bitmapId": 98, "corners": [{"x": 11, "y": 41}, {"x": 158, "y": 15.038874595270153}, {"x": 146, "y": 46}], "deviations": [{"x": 94, "y": 20}, {"x": 158, "y": 18}]},
        {"bitmapId": 98, "corners": [{"x": 8, "y": 43}, {"x": 159, "y": 11}], "deviations": [{"x": 45, "y": 31}], "feedback": "hook"},
        {"bitmapId": 99, "corners": [{"x": 9, "y": 39}, {"x": 156.71626701455978, "y": 21}, {"x": 153, "y": 324}], "deviations": [{"x": 98, "y": 26}, {"x": 162, "y": 143}]},
        {"bitmapId": 100, "corners": [{"x": 6, "y": 38}, {"x": 117.18145569497398, "y": 18.637088610052054}, {"x": 114, "y": 284}], "deviations": [{"x": 82, "y": 19}, {"x": 119, "y": 120}]},
        {"bitmapId": 101, "corners": [{"x": 7, "y": 21}, {"x": 73.97538080876987, "y": 12.01230959561507}, {"x": 70, "y": 160}], "deviations": [{"x": 32, "y": 21}, {"x": 76, "y": 52}]},
        {"bitmapId": 102, "corners": [{"x": 20, "y": 38}, {"x": 214, "y": 19.701944955764244}, {"x": 150, "y": 285}], "deviations": [{"x": 144, "y": 20}, {"x": 175, "y": 147}]},
        {"bitmapId": 103, "corners": [{"x": 20, "y": 32}, {"x": 153.6106847411587, "y": 14}, {"x": 120, "y": 224}], "deviations": [{"x": 127, "y": 14}, {"x": 141, "y": 109}]},
        {"bitmapId": 104, "corners": [{"x": 13, "y": 17}, {"x": 83.93900629068163, "y": 18.121987418636724}, {"x": 38, "y": 198}], "deviations": [{"x": 84, "y": 16}, {"x": 70, "y": 61}]},
        {"bitmapId": 105, "corners": [{"x": 18, "y": 15}, {"x": 79, "y": 16.217788322200853}, {"x": 43, "y": 137}], "deviations": [{"x": 49, "y": 15}, {"x": 79, "y": 21}]},
        {"bitmapId": 106, "corners": [{"x": 8, "y": 36}, {"x": 169.34480595472274, "y": 17}, {"x": 174, "y": 208}], "deviations": [{"x": 35, "y": 36}, {"x": 170, "y": 131}]},
        {"bitmapId": 107, "corners": [{"x": 6, "y": 40}, {"x": 173, "y": 25.375163415570867}, {"x": 140, "y": 161}], "deviations": [{"x": 116, "y": 25}, {"x": 163, "y": 56}]},
        {"bitmapId": 108, "corners": [{"x": 20, "y": 36}, {"x": 147, "y": 18.425028853721358}, {"x": 113, "y": 172}], "deviations": [{"x": 94, "y": 20}, {"x": 129, "y": 111}]},
        {"bitmapId": 109, "corners": [{"x": 9, "y": 32}, {"x": 131.75753238422908, "y": 19}, {"x": 133, "y": 140}], "deviations": [{"x": 36, "y": 32}, {"x": 133, "y": 19}]},
        {"bitmapId": 110, "corners": [{"x": 11, "y": 16}, {"x": 54, "y": 7.324170873518842}, {"x": 55, "y": 71}], "deviations": [{"x": 31, "y": 10}, {"x": 54, "y": 66}]},
        {"bitmapId": 111, "corners": [{"x": 8, "y": 41}, {"x": 145, "y": 23.700580596523217}, {"x": 122, "y": 111}], "deviations": [{"x": 85, "y": 25}, {"x": 126, "y": 85}]},
        {"bitmapId": 112, "corners": [{"x": 8, "y": 36}, {"x": 101, "y": 17.188159788041734}, {"x": 91, "y": 74}], "deviations": [{"x": 64, "y": 23}, {"x": 96, "y": 38}]},
        {"bitmapId": 113, "corners": [{"x": 10, "y": 18}, {"x": 50, "y": 10.302535954120046}, {"x": 38, "y": 53}], "deviations": [{"x": 32, "y": 12}, {"x": 46, "y": 33}]},
        {"bitmapId": 114, "corners": [{"x": 24, "y": 44}, {"x": 240, "y": 15.580464243417946}, {"x": 203, "y": 176}], "deviations": [{"x": 136, "y": 27}, {"x": 240, "y": 29}]},
        {"bitmapId": 115, "corners": [{"x": 10, "y": 39}, {"x": 238, "y": 32.246854488978826}, {"x": 195, "y": 139}], "deviations": [{"x": 155, "y": 28}, {"x": 226, "y": 56}]},
        {"bitmapId": 116, "corners": [{"x": 9, "y": 50}, {"x": 275.1753147651547, "y": 17}, {"x": 254, "y": 110}], "deviations": [{"x": 147, "y": 24}, {"x": 268, "y": 68}]},
        {"bitmapId": 117, "corners": [{"x": 15, "y": 37}, {"x": 169, "y": 21.11308443430777}, {"x": 153, "y": 106}], "deviations": [{"x": 139, "y": 21}, {"x": 168, "y": 40}]},
        {"bitmapId": 118, "corners": [{"x": 3, "y": 32}, {"x": 141, "y": 10.382411370992937}, {"x": 126, "y": 53}], "deviations": [{"x": 105, "y": 10}, {"x": 137, "y": 28}]},
        {"bitmapId": 119, "corners": [{"x": 11, "y": 38}, {"x": 188, "y": 18.762763241765796}, {"x": 174, "y": 68}], "deviations": [{"x": 58, "y": 38}, {"x": 180, "y": 52}]},
        {"bitmapId": 120, "corners": [{"x": 13, "y": 26}, {"x": 109.81573672074498, "y": 23}, {"x": 54, "y": 217}], "deviations": [{"x": 53, "y": 23}, {"x": 110, "y": 36}]},
        {"bitmapId": 121, "corners": [{"x": 215, "y": 28}, {"x": 317.5873412453205, "y": 21.412658754679548}, {"x": 12, "y": 321}], "deviations": [{"x": 314, "y": 19}, {"x": 186, "y": 187}]},
        {"bitmapId": 122, "corners": [{"x": 158, "y": 30}, {"x": 253, "y": 21.706003355963986}, {"x": 11, "y": 249}], "deviations": [{"x": 206, "y": 23}, {"x": 175, "y": 133}]},
        {"bitmapId": 123, "corners": [{"x": 135, "y": 29}, {"x": 243.28814056179232, "y": 20}, {"x": 10, "y": 231}], "deviations": [{"x": 201, "y": 27}, {"x": 180, "y": 134}]},
        {"bitmapId": 124, "corners": [{"x": 166, "y": 21}, {"x": 236.99291055423177, "y": 14.021268337304667}, {"x": 13, "y": 168}], "deviations": [{"x": 216, "y": 13}, {"x": 148, "y": 109}]},
        {"bitmapId": 125, "corners": [{"x": 95, "y": 44}, {"x": 247, "y": 23.346284008082378}, {"x": 14, "y": 311}], "deviations": [{"x": 172, "y": 30}, {"x": 185, "y": 219}]},
        {"bitmapId": 126, "corners": [{"x": 79, "y": 49}, {"x": 248.31423089842082, "y": 23}, {"x": 17, "y": 305}], "deviations": [{"x": 200, "y": 26}, {"x": 150, "y": 229}]},
        {"bitmapId": 127, "corners": [{"x": 113, "y": 26}, {"x": 189.76554387744852, "y": 12}, {"x": 13, "y": 243}], "deviations": [{"x": 132, "y": 26}, {"x": 101, "y": 160}]},
        {"bitmapId": 128, "corners": [{"x": 154, "y": 35}, {"x": 251, "y": 26.733828343372416}, {"x": 5, "y": 310}], "deviations": [{"x": 251, "y": 22}, {"x": 140, "y": 214}]},
        {"bitmapId": 129, "corners": [{"x": 127, "y": 19}, {"x": 207.14406753244518, "y": 23.855932467554812}, {"x": 15, "y": 193}], "deviations": [{"x": 207, "y": 21}, {"x": 139, "y": 112}]},
        {"bitmapId": 130, "corners": [{"x": 67, "y": 38}, {"x": 184.12542760492005, "y": 19}, {"x": 18, "y": 229}], "deviations": [{"x": 123, "y": 33}, {"x": 130, "y": 158}]},
        {"bitmapId": 131, "corners": [{"x": 95, "y": 22}, {"x": 193, "y": 21.387760539701805}, {"x": 17, "y": 209}], "deviations": [{"x": 192, "y": 17}, {"x": 121, "y": 142}]},
        {"bitmapId": 132, "corners": [{"x": 79, "y": 19}, {"x": 155, "y": 14.781891025951657}, {"x": 16, "y": 133}], "deviations": [{"x": 130, "y": 18}, {"x": 104, "y": 100}]},
        {"bitmapId": 133, "corners": [{"x": 41, "y": 27}, {"x": 135, "y": 16.928357780328348}, {"x": 15, "y": 205}], "deviations": [{"x": 101, "y": 16}, {"x": 97, "y": 122}]},
        {"bitmapId": 134, "corners": [{"x": 30, "y": 46}, {"x": 129.4308590585468, "y": 17}, {"x": 13, "y": 193}], "deviations": [{"x": 115, "y": 23}, {"x": 74, "y": 125}]},
        {"bitmapId": 135, "corners": [{"x": 30, "y": 36}, {"x": 152.7379813918456, "y": 13}, {"x": 12, "y": 162}], "deviations": [{"x": 104, "y": 18}, {"x": 90, "y": 104}]},
        {"bitmapId": 136, "corners": [{"x": 23, "y": 33}, {"x": 127, "y": 17.052505047322544}, {"x": 17, "y": 182}], "deviations": [{"x": 51, "y": 31}, {"x": 96, "y": 110}]},
        {"bitmapId": 137, "corners": [{"x": 28, "y": 26}, {"x": 115, "y": 15.349158856922562}, {"x": 16, "y": 134}], "deviations": [{"x": 112, "y": 14}, {"x": 79, "y": 97}]},
        {"bitmapId": 138, "corners": [{"x": 29, "y": 47}, {"x": 187.36601499450256, "y": 22}, {"x": 122, "y": 162}], "deviations": [{"x": 71, "y": 47}, {"x": 176, "y": 60}]},
        {"bitmapId": 139, "corners": [{"x": 69, "y": 19}, {"x": 132, "y": 12.16936134658754}, {"x": 12, "y": 156}], "deviations": [{"x": 96, "y": 17}, {"x": 90, "y": 86}]},
        {"bitmapId": 140, "corners": [{"x": 26, "y": 63}, {"x": 244.22193287065, "y": 23}, {"x": 33, "y": 163}], "deviations": [{"x": 155, "y": 34}, {"x": 171, "y": 87}]},
        {"bitmapId": 141, "corners": [{"x": 28, "y": 44}, {"x": 191.1532405219484, "y": 20}, {"x": 133, "y": 99}], "deviations": [{"x": 166, "y": 20}, {"x": 166, "y": 58}]},
        {"bitmapId": 142, "corners": [{"x": 23, "y": 40}, {"x": 153.96993979068304, "y": 20.060120418633904}, {"x": 109, "y": 96}], "deviations": [{"x": 120, "y": 22}, {"x": 120, "y": 71}]},
        {"bitmapId": 143, "corners": [{"x": 20, "y": 31}, {"x": 123.68036396555597, "y": 15}, {"x": 80, "y": 67}], "deviations": [{"x": 35, "y": 31}, {"x": 118, "y": 20}]},
        {"bitmapId": 144, "corners": [{"x": 13, "y": 30}, {"x": 95.18945319705531, "y": 13}, {"x": 54, "y": 83}], "deviations": [{"x": 71, "y": 20}, {"x": 89, "y": 27}]},
        {"bitmapId": 145, "corners": [{"x": 16, "y": 25}, {"x": 81.47221488338111, "y": 16.527785116618897}, {"x": 27, "y": 99}], "deviations": [{"x": 61, "y": 21}, {"x": 38, "y": 74}]},
        {"bitmapId": 146, "corners": [{"x": 11, "y": 43}, {"x": 95.85561346129425, "y": 17}, {"x": 65, "y": 109}], "deviations": [{"x": 44, "y": 35}, {"x": 93, "y": 41}]},
        {"bitmapId": 147, "corners": [{"x": 8, "y": 35}, {"x": 90.43256495113388, "y": 9.567435048866114}, {"x": 71, "y": 73}], "deviations": [{"x": 39, "y": 28}, {"x": 73, "y": 63}]},
        {"bitmapId": 148, "corners": [{"x": 11, "y": 38}, {"x": 106.52680291972565, "y": 20}, {"x": 83, "y": 76}], "deviations": [{"x": 40, "y": 38}, {"x": 88, "y": 68}]},
        {"bitmapId": 149, "corners": [{"x": 85, "y": 16}, {"x": 75.95469833372987, "y": 367}, {"x": 21, "y": 331}], "deviations": [{"x": 81, "y": 363}, {"x": 33, "y": 335}]},
        {"bitmapId": 149, "corners": [{"x": 83, "y": 20}, {"x": 91, "y": 361}], "deviations": [{"x": 78, "y": 254}], "feedback": "hook"},
        {"bitmapId": 150, "corners": [{"x": 77, "y": 24}, {"x": 70.96767480603364, "y": 241.03232519396636}, {"x": 18, "y": 208}], "deviations": [{"x": 77, "y": 144}, {"x": 64, "y": 242}]},
        {"bitmapId": 150, "corners": [{"x": 78, "y": 20}, {"x": 80, "y": 238}], "deviations": [{"x": 79, "y": 34}], "feedback": "hook"},
        {"bitmapId": 151, "corners": [{"x": 57, "y": 18}, {"x": 54, "y": 133.85954460885313}, {"x": 17, "y": 111}], "deviations": [{"x": 57, "y": 112}, {"x": 30, "y": 116}]},
        {"bitmapId": 151, "corners": [{"x": 58, "y": 15}, {"x": 54, "y": 138}], "deviations": [{"x": 58, "y": 123}], "feedback": "hook"},
        {"bitmapId": 152, "corners": [{"x": 45, "y": 14}, {"x": 46, "y": 84.80197802518316}, {"x": 16, "y": 67}], "deviations": [{"x": 45, "y": 53}, {"x": 19, "y": 71}]},
        {"bitmapId": 152, "corners": [{"x": 46, "y": 9}, {"x": 45, "y": 75}], "deviations": [{"x": 45, "y": 36}], "feedback": "hook"},
        {"bitmapId": 153, "corners": [{"x": 29, "y": 21}, {"x": 18.61582275728056, "y": 359.76835448543886}, {"x": 88, "y": 305}], "deviations": [{"x": 30, "y": 293}, {"x": 23, "y": 353}]},
        {"bitmapId": 154, "corners": [{"x": 45, "y": 22}, {"x": 19, "y": 292.3671750294021}, {"x": 117, "y": 239}], "deviations": [{"x": 44, "y": 125}, {"x": 18, "y": 296}]},
        {"bitmapId": 155, "corners": [{"x": 52, "y": 20}, {"x": 31, "y": 258.564740632088}, {"x": 140, "y": 197}], "deviations": [{"x": 53, "y": 157}, {"x": 44, "y": 248}]},
        {"bitmapId": 156, "corners": [{"x": 37, "y": 19}, {"x": 31, "y": 187.77102392093067}, {"x": 153, "y": 81}], "deviations": [{"x": 33, "y": 177}, {"x": 112, "y": 124}]},
        {"bitmapId": 157, "corners": [{"x": 37, "y": 17}, {"x": 27, "y": 174.88718348448256}, {"x": 96, "y": 129}], "deviations": [{"x": 36, "y": 137}, {"x": 70, "y": 141}]},
        {"bitmapId": 158, "corners": [{"x": 40, "y": 20}, {"x": 35, "y": 146.48772377314444}, {"x": 126, "y": 92}], "deviations": [{"x": 41, "y": 117}, {"x": 118, "y": 98}]},
        {"bitmapId": 159, "corners": [{"x": 34, "y": 17}, {"x": 35, "y": 150.93050372311586}, {"x": 124, "y": 112}], "deviations": [{"x": 39, "y": 49}, {"x": 73, "y": 130}]},
        {"bitmapId": 160, "corners": [{"x": 19, "y": 17}, {"x": 22, "y": 147.61309015412363}, {"x": 91, "y": 99}], "deviations": [{"x": 19, "y": 117}, {"x": 38, "y": 139}]},
        {"bitmapId": 161, "corners": [{"x": 45, "y": 22}, {"x": 34, "y": 345.36683401222035}, {"x": 319, "y": 324}], "deviations": [{"x": 46, "y": 212}, {"x": 37, "y": 349}]},
        {"bitmapId": 162, "corners": [{"x": 26, "y": 15}, {"x": 43.50991818934711, "y": 277.74504090532645}, {"x": 258, "y": 251}], "deviations": [{"x": 37, "y": 278}, {"x": 153, "y": 258}]},
        {"bitmapId": 163, "corners": [{"x": 32, "y": 21}, {"x": 28, "y": 305.0594159864779}, {"x": 167, "y": 272}], "deviations": [{"x": 36, "y": 121}, {"x": 28, "y": 308}]},
        {"bitmapId": 164, "corners": [{"x": 22, "y": 10}, {"x": 25.05404418657408, "y": 155}, {"x": 137, "y": 139}], "deviations": [{"x": 23, "y": 155}, {"x": 44, "y": 149}]},
        {"bitmapId": 165, "corners": [{"x": 17, "y": 14}, {"x": 26, "y": 221.49490630228613}, {"x": 119, "y": 207}], "deviations": [{"x": 23, "y": 50}, {"x": 29, "y": 223}]},
        {"bitmapId": 166, "corners": [{"x": 86, "y": 25}, {"x": 28, "y": 269.22527964162646}, {"x": 300, "y": 277}], "deviations": [{"x": 54, "y": 187}, {"x": 232, "y": 262}]},
        {"bitmapId": 167, "corners": [{"x": 90, "y": 24}, {"x": 38.05084397153728, "y": 216}, {"x": 287, "y": 223}], "deviations": [{"x": 87, "y": 24}, {"x": 230, "y": 214}]},
        {"bitmapId": 168, "corners": [{"x": 32, "y": 18}, {"x": 39.70223561628606, "y": 143}, {"x": 310, "y": 97}], "deviations": [{"x": 38, "y": 50}, {"x": 162, "y": 112}]},
        {"bitmapId": 169, "corners": [{"x": 31, "y": 18}, {"x": 25.054225043423827, "y": 106}, {"x": 274, "y": 65}], "deviations": [{"x": 33, "y": 51}, {"x": 152, "y": 77}]},
        {"bitmapId": 170, "corners": [{"x": 32, "y": 11}, {"x": 22.275683470047817, "y": 75}, {"x": 258, "y": 43}], "deviations": [{"x": 23, "y": 58}, {"x": 121, "y": 65}]},
        {"bitmapId": 171, "corners": [{"x": 29, "y": 15}, {"x": 30.54302627967627, "y": 104}, {"x": 208, "y": 74}], "deviations": [{"x": 29, "y": 103}, {"x": 187, "y": 74}]},
        {"bitmapId": 172, "corners": [{"x": 36, "y": 17}, {"x": 20, "y": 76.18282102658914}, {"x": 207, "y": 50}], "deviations": [{"x": 23, "y": 71}, {"x": 46, "y": 79}]},
        {"bitmapId": 173, "corners": [{"x": 21, "y": 9}, {"x": 17.198548553429184, "y": 62}, {"x": 103, "y": 36}], "deviations": [{"x": 20, "y": 36}, {"x": 68, "y": 43}]},
        {"bitmapId": 174, "corners": [{"x": 31, "y": 17}, {"x": 31, "y": 144.24111462102175}, {"x": 150, "y": 112}], "deviations": [{"x": 31, "y": 82.814369631563}, {"x": 99, "y": 118}]},
        {"bitmapId": 175, "corners": [{"x": 26, "y": 12}, {"x": 11.862294297708242, "y": 123}, {"x": 113, "y": 115}], "deviations": [{"x": 26, "y": 62}, {"x": 38, "y": 123}]},
        {"bitmapId": 176, "corners": [{"x": 26, "y": 20}, {"x": 40.28424446290882, "y": 186.1421222314544}, {"x": 103, "y": 195}], "deviations": [{"x": 27, "y": 152}, {"x": 61, "y": 194}]},
        {"bitmapId": 177, "corners": [{"x": 30, "y": 19}, {"x": 37.019228326256425, "y": 122}, {"x": 102, "y": 131}], "deviations": [{"x": 27, "y": 105}, {"x": 58, "y": 129}]},
        {"bitmapId": 178, "corners": [{"x": 20, "y": 15}, {"x": 28.959005578564284, "y": 65.95900557856429}, {"x": 176, "y": 61}], "deviations": [{"x": 20, "y": 37}, {"x": 131, "y": 73}]},
        {"bitmapId": 179, "corners": [{"x": 83, "y": 24}, {"x": 21.776193494807544, "y": 254.1642902422113}, {"x": 210, "y": 367}], "deviations": [{"x": 21, "y": 237}, {"x": 117, "y": 299}]},
        {"bitmapId": 180, "corners": [{"x": 68, "y": 26}, {"x": 13, "y": 262.4411078958435}, {"x": 129, "y": 338}], "deviations": [{"x": 60, "y": 87}, {"x": 42, "y": 288}]},
        {"bitmapId": 181, "corners": [{"x": 65, "y": 25}, {"x": 13.31291499744991, "y": 159.68708500255008}, {"x": 84, "y": 230}], "deviations": [{"x": 57, "y": 56}, {"x": 42, "y": 179}]},
        {"bitmapId": 182, "corners": [{"x": 48, "y": 18}, {"x": 13, "y": 88.40991331121197}, {"x": 57, "y": 130}], "deviations": [{"x": 32, "y": 40}, {"x": 46, "y": 116}]},
        {"bitmapId": 183, "corners": [{"x": 38, "y": 17}, {"x": 14.501993808258533, "y": 98.25099690412927}, {"x": 145, "y": 173}], "deviations": [{"x": 13, "y": 95}, {"x": 53, "y": 115}]},
        {"bitmapId": 184, "corners": [{"x": 119, "y": 17}, {"x": 19, "y": 250.12440990787903}, {"x": 217, "y": 234}], "deviations": [{"x": 110, "y": 56}, {"x": 47, "y": 252}]},
        {"bitmapId": 185, "corners": [{"x": 221, "y": 22}, {"x": 27.77441236033469, "y": 254.22558763966532}, {"x": 249, "y": 223}], "deviations": [{"x": 172, "y": 93}, {"x": 119, "y": 234}]},
        {"bitmapId": 186, "corners": [{"x": 170, "y": 26}, {"x": 20.072227974050502, "y": 194.9277720259495}, {"x": 293, "y": 155}], "deviations": [{"x": 90, "y": 106}, {"x": 171, "y": 170}]},
        {"bitmapId": 187, "corners": [{"x": 111, "y": 21}, {"x": 33.345669870261446, "y": 159.96299038921566}, {"x": 212, "y": 129}], "deviations": [{"x": 79, "y": 73}, {"x": 114, "y": 141}]},
        {"bitmapId": 188, "corners": [{"x": 123, "y": 21}, {"x": 39.75284482413547, "y": 153.24715517586452}, {"x": 229, "y": 112}], "deviations": [{"x": 65, "y": 120}, {"x": 171, "y": 129}]},
        {"bitmapId": 189, "corners": [{"x": 108, "y": 18}, {"x": 35, "y": 119.43846196206465}, {"x": 228, "y": 93}], "deviations": [{"x": 95, "y": 42}, {"x": 91, "y": 116}]},
        {"bitmapId": 190, "corners": [{"x": 143, "y": 30}, {"x": 28, "y": 211.71831900445486}, {"x": 169, "y": 199}], "deviations": [{"x": 108, "y": 98}, {"x": 66, "y": 213}]},
        {"bitmapId": 191, "corners": [{"x": 85, "y": 22}, {"x": 24.156136655579097, "y": 207}, {"x": 142, "y": 185}], "deviations": [{"x": 75, "y": 75}, {"x": 99, "y": 189}]},
        {"bitmapId": 192, "corners": [{"x": 85, "y": 21}, {"x": 17.110774738774694, "y": 150}, {"x": 93, "y": 132}], "deviations": [{"x": 37, "y": 105}, {"x": 32, "y": 150}]},
        {"bitmapId": 193, "corners": [{"x": 68, "y": 17}, {"x": 28, "y": 143.76114962040964}, {"x": 118, "y": 112}], "deviations": [{"x": 53, "y": 82}, {"x": 83, "y": 129}]},
        {"bitmapId": 194, "corners": [{"x": 72, "y": 16}, {"x": 20.41811219111986, "y": 112}, {"x": 97, "y": 112}], "deviations": [{"x": 65, "y": 37}, {"x": 59, "y": 111}]},
        {"bitmapId": 195, "corners": [{"x": 80, "y": 12}, {"x": 32.06729609447371, "y": 123}, {"x": 176, "y": 92}], "deviations": [{"x": 70, "y": 48}, {"x": 75, "y": 110}]},
        {"bitmapId": 196, "corners": [{"x": 175, "y": 23}, {"x": 26, "y": 146.23471698875312}, {"x": 205, "y": 129}], "deviations": [{"x": 150, "y": 54}, {"x": 34, "y": 148}]},
        {"bitmapId": 197, "corners": [{"x": 144, "y": 22}, {"x": 17.16516780858318, "y": 125}, {"x": 174, "y": 105}], "deviations": [{"x": 96, "y": 72}, {"x": 126, "y": 108}]},
        {"bitmapId": 198, "corners": [{"x": 116, "y": 15}, {"x": 19, "y": 167.31488237748752}, {"x": 102, "y": 137}], "deviations": [{"x": 49, "y": 113}, {"x": 32, "y": 158}]},
        {"bitmapId": 199, "corners": [{"x": 103, "y": 20}, {"x": 18.262635602454573, "y": 142.47472879509084}, {"x": 152, "y": 105}], "deviations": [{"x": 29, "y": 122}, {"x": 89, "y": 119}]},
        {"bitmapId": 200, "corners": [{"x": 89, "y": 18}, {"x": 24.38252803905029, "y": 122}, {"x": 152, "y": 92}], "deviations": [{"x": 73, "y": 52}, {"x": 88, "y": 113}]},
        {"bitmapId": 201, "corners": [{"x": 90, "y": 28}, {"x": 19.22342771383248, "y": 82.88828614308377}, {"x": 105, "y": 95}], "deviations": [{"x": 43, "y": 62}, {"x": 26, "y": 87}]},
        {"bitmapId": 202, "corners": [{"x": 20, "y": 13}, {"x": 21.314802332371084, "y": 103}, {"x": 121, "y": 50}], "deviations": [{"x": 20, "y": 103}, {"x": 52, "y": 83}]},
        {"bitmapId": 203, "corners": [{"x": 15, "y": 8}, {"x": 16, "y": 82.46875638015537}, {"x": 60, "y": 50}], "deviations": [{"x": 15, "y": 83}, {"x": 42, "y": 61}]},
        {"bitmapId": 204, "corners": [{"x": 23, "y": 19}, {"x": 23, "y": 85.67635450442683}, {"x": 86, "y": 52}], "deviations": [{"x": 23, "y": 58.08613884742259}, {"x": 45, "y": 67}]},
        {"bitmapId": 205, "corners": [{"x": 23, "y": 21}, {"x": 192.6425252468284, "y": 387.64252524682837}, {"x": 204, "y": 343}], "deviations": [{"x": 73, "y": 266}, {"x": 200, "y": 370}]},
        {"bitmapId": 206, "corners": [{"x": 22, "y": 21}, {"x": 153.82299473608126, "y": 265.8229947360813}, {"x": 166, "y": 207}], "deviations": [{"x": 65, "y": 181}, {"x": 156, "y": 247}]},
        {"bitmapId": 207, "corners": [{"x": 28, "y": 9}, {"x": 225.39757253179482, "y": 198}, {"x": 222, "y": 156}], "deviations": [{"x": 107, "y": 136}, {"x": 224, "y": 168}]},
        {"bitmapId": 208, "corners": [{"x": 14, "y": 14}, {"x": 37.287936304037096, "y": 328}, {"x": 13, "y": 306}], "deviations": [{"x": 68, "y": 101}, {"x": 32, "y": 321}]},
        {"bitmapId": 209, "corners": [{"x": 67, "y": 17}, {"x": 55.908156290546856, "y": 358.95407814527346}, {"x": 19, "y": 330}], "deviations": [{"x": 89, "y": 249}, {"x": 24, "y": 336}]},
        {"bitmapId": 210, "corners": [{"x": 8, "y": 6}, {"x": 65.98873871702868, "y": 235}, {"x": 20, "y": 212}], "deviations": [{"x": 87, "y": 95}, {"x": 57, "y": 233}]},
        {"bitmapId": 211, "corners": [{"x": 70, "y": 14}, {"x": 72.64771297613271, "y": 202.82385648806635}, {"x": 27, "y": 169}], "deviations": [{"x": 85, "y": 90}, {"x": 59, "y": 191}]},
        {"bitmapId": 212, "corners": [{"x": 45, "y": 11}, {"x": 64.8247272605026, "y": 179}, {"x": 18, "y": 155}], "deviations": [{"x": 71, "y": 53}, {"x": 28, "y": 162}]},
        {"bitmapId": 213, "corners": [{"x": 31, "y": 8}, {"x": 43.98078831672929, "y": 143}, {"x": 8, "y": 120}], "deviations": [{"x": 52, "y": 37}, {"x": 31, "y": 139}]},
        {"bitmapId": 214, "corners": [{"x": 18, "y": 10}, {"x": 65, "y": 156.4312858757338}, {"x": 24, "y": 142}], "deviations": [{"x": 72, "y": 79}, {"x": 63, "y": 158}]},
        {"bitmapId": 215, "corners": [{"x": 23, "y": 8}, {"x": 64.08495431689092, "y": 104}, {"x": 15, "y": 82}], "deviations": [{"x": 62, "y": 50}, {"x": 52, "y": 100}]},
        {"bitmapId": 216, "corners": [{"x": 36, "y": 9}, {"x": 63, "y": 81.86579312561075}, {"x": 19, "y": 74}], "deviations": [{"x": 57, "y": 41}, {"x": 53, "y": 84}]},
        {"bitmapId": 217, "corners": [{"x": 12, "y": 12}, {"x": 245.9593811920934, "y": 127}, {"x": 200, "y": 52}], "deviations": [{"x": 79, "y": 122}, {"x": 245, "y": 120}]},
        {"bitmapId": 218, "corners": [{"x": 8, "y": 5}, {"x": 210, "y": 91.86673069459982}, {"x": 187, "y": 32}], "deviations": [{"x": 62, "y": 85}, {"x": 211, "y": 86}]},
        {"bitmapId": 219, "corners": [{"x": 9, "y": 7}, {"x": 234, "y": 92.48417686631883}, {"x": 189, "y": 33}], "deviations": [{"x": 90, "y": 95}, {"x": 212, "y": 70}]},
        {"bitmapId": 220, "corners": [{"x": 3, "y": 5}, {"x": 151, "y": 74.9629787103277}, {"x": 128, "y": 16}], "deviations": [{"x": 62, "y": 60}, {"x": 142, "y": 62}]},
        {"bitmapId": 221, "corners": [{"x": 8, "y": 52}, {"x": 246, "y": 22.580923162103772}, {"x": 260.232830261199, "y": 381}, {"x": 209, "y": 352}], "deviations": [{"x": 178, "y": 26}, {"x": 259, "y": 250}, {"x": 236, "y": 363}]},
        {"bitmapId": 222, "corners": [{"x": 12, "y": 45}, {"x": 268.624409882519, "y": 32.45853003916034}, {"x": 277.37229126942105, "y": 369.5292184520658}, {"x": 237, "y": 341}], "deviations": [{"x": 109, "y": 34}, {"x": 280, "y": 146}, {"x": 242, "y": 343}]},
        {"bitmapId": 223, "corners": [{"x": 12, "y": 42}, {"x": 226.38760928451723, "y": 19.775218569034465}, {"x": 233.98442106191007, "y": 369.99221053095505}, {"x": 162, "y": 337}], "deviations": [{"x": 200, "y": 19}, {"x": 234, "y": 63}, {"x": 222, "y": 363}]},
        {"bitmapId": 224, "corners": [{"x": 14, "y": 49}, {"x": 258, "y": 29.189447374997876}, {"x": 265.03383067058144, "y": 336.96616932941856}, {"x": 208, "y": 313}], "deviations": [{"x": 141, "y": 28}, {"x": 267, "y": 107}, {"x": 254, "y": 336}]},
        {"bitmapId": 225, "corners": [{"x": 6, "y": 48}, {"x": 205.37387893333613, "y": 21}, {"x": 208.35817284442567, "y": 264}, {"x": 152, "y": 247}], "deviations": [{"x": 72, "y": 31}, {"x": 209, "y": 78}, {"x": 199, "y": 263}]},
        {"bitmapId": 226, "corners": [{"x": 8, "y": 38}, {"x": 165.75004305525124, "y": 18}, {"x": 113, "y": 386.08930249318956}, {"x": 68, "y": 359}], "deviations": [{"x": 131, "y": 18}, {"x": 167, "y": 207}, {"x": 108, "y": 387}]},
        {"bitmapId": 227, "corners": [{"x": 19, "y": 33}, {"x": 144.74309891982585, "y": 20}, {"x": 157.2287026635626, "y": 389}, {"x": 100, "y": 344}], "deviations": [{"x": 49, "y": 33}, {"x": 154, "y": 49}, {"x": 147, "y": 384}]},
        {"bitmapId": 228, "corners": [{"x": 6, "y": 41}, {"x": 180.0761795924941, "y": 22.304718369976364}, {"x": 192.21086491430694, "y": 348.6054324571535}, {"x": 148, "y": 313}], "deviations": [{"x": 125, "y": 22}, {"x": 196, "y": 117}, {"x": 184, "y": 344}]},
        {"bitmapId": 229, "corners": [{"x": 15, "y": 23}, {"x": 103.84689081491868, "y": 19}, {"x": 108.72405481271512, "y": 328}, {"x": 55, "y": 310}], "deviations": [{"x": 55, "y": 19}, {"x": 115, "y": 68}, {"x": 104, "y": 328}]},
        {"bitmapId": 230, "corners": [{"x": 8, "y": 36}, {"x": 130, "y": 20.635484542437457}, {"x": 140, "y": 266.8765054406953}, {"x": 88, "y": 241}], "deviations": [{"x": 42, "y": 35}, {"x": 140, "y": 155}, {"x": 128, "y": 265}]},
        {"bitmapId": 231, "corners": [{"x": 12, "y": 60}, {"x": 322.3810179108045, "y": 26.563502985134082}, {"x": 292, "y": 280.58478336123545}, {"x": 238, "y": 257}], "deviations": [{"x": 183, "y": 31}, {"x": 328, "y": 31}, {"x": 286, "y": 282}]},
        {"bitmapId": 232, "corners": [{"x": 11, "y": 60}, {"x": 318, "y": 33.19703704226673}, {"x": 297.19932815448703, "y": 242}, {"x": 270, "y": 221}], "deviations": [{"x": 203, "y": 29}, {"x": 307, "y": 193}, {"x": 293, "y": 241}]},
        {"bitmapId": 233, "corners": [{"x": 9, "y": 57}, {"x": 285.8161910541067, "y": 26}, {"x": 248.25010393078253, "y": 260}, {"x": 223, "y": 219}], "deviations": [{"x": 192, "y": 26}, {"x": 286, "y": 61}, {"x": 241, "y": 251}]},
        {"bitmapId": 234, "corners": [{"x": 10, "y": 57}, {"x": 335, "y": 33.34928252554787}, {"x": 294.9578219881523, "y": 208.95782198815232}, {"x": 254, "y": 174}], "deviations": [{"x": 113, "y": 37}, {"x": 305, "y": 188}, {"x": 281, "y": 195}]},
        {"bitmapId": 235, "corners": [{"x": 10, "y": 50}, {"x": 296.80070073688256, "y": 19}, {"x": 290.43179561822654, "y": 204.56820438177346}, {"x": 224, "y": 182}], "deviations": [{"x": 251, "y": 20}, {"x": 297, "y": 182}, {"x": 239, "y": 184}]},
        {"bitmapId": 236, "corners": [{"x": 16, "y": 43}, {"x": 280.7041629158495, "y": 21}, {"x": 229.56572493496867, "y": 177}, {"x": 188, "y": 138}], "deviations": [{"x": 197, "y": 18}, {"x": 260, "y": 114}, {"x": 199, "y": 143}]},
        {"bitmapId": 237, "corners": [{"x": 17, "y": 42}, {"x": 222, "y": 16.83363509871001}, {"x": 199, "y": 99.84191391768978}, {"x": 152, "y": 77}], "deviations": [{"x": 178, "y": 16}, {"x": 201, "y": 96}, {"x": 173, "y": 90}]},
        {"bitmapId": 238, "corners": [{"x": 21, "y": 57}, {"x": 253, "y": 22.177142706393585}, {"x": 209.14047325298804, "y": 198.5785802410358}, {"x": 150, "y": 169}], "deviations": [{"x": 142, "y": 33}, {"x": 247, "y": 83}, {"x": 201, "y": 199}]},
        {"bitmapId": 239, "corners": [{"x": 14, "y": 50}, {"x": 243.79134298119342, "y": 24.417314037613153}, {"x": 207, "y": 176.8247869348205}, {"x": 183, "y": 164}], "deviations": [{"x": 167, "y": 23}, {"x": 231, "y": 64}, {"x": 206, "y": 178}]},
        {"bitmapId": 240, "corners": [{"x": 7, "y": 51}, {"x": 217, "y": 19.910869931183072}, {"x": 186.9794722846835, "y": 140.98631485645566}, {"x": 161, "y": 122}], "deviations": [{"x": 154, "y": 17}, {"x": 214, "y": 57}, {"x": 170, "y": 127}]},
        {"bitmapId": 241, "corners": [{"x": 12, "y": 45}, {"x": 209, "y": 25.378557732998583}, {"x": 189.51738002850453, "y": 156.75869001425227}, {"x": 162, "y": 139}], "deviations": [{"x": 130, "y": 27}, {"x": 209, "y": 45}, {"x": 166, "y": 139}]},
        {"bitmapId": 242, "corners": [{"x": 9, "y": 47}, {"x": 204.50182487023685, "y": 17}, {"x": 207, "y": 222.70183087407935}, {"x": 172, "y": 197}], "deviations": [{"x": 168, "y": 19}, {"x": 207, "y": 17}, {"x": 204, "y": 225}]},
        {"bitmapId": 243, "corners": [{"x": 10, "y": 48}, {"x": 211.4272990168189, "y": 20}, {"x": 195.0098338749882, "y": 194}, {"x": 163, "y": 164}], "deviations": [{"x": 81, "y": 32}, {"x": 215, "y": 57}, {"x": 167, "y": 165}]},
        {"bitmapId": 244, "corners": [{"x": 14, "y": 43}, {"x": 206.21014822930076, "y": 24.420296458601513}, {"x": 213.4211599244557, "y": 151.71057996222785}, {"x": 173, "y": 138}], "deviations": [{"x": 166, "y": 23}, {"x": 215, "y": 130}, {"x": 188, "y": 141}]},
        {"bitmapId": 245, "corners": [{"x": 8, "y": 37}, {"x": 215, "y": 22.280766075463298}, {"x": 198.1954827826234, "y": 120.39849426087447}, {"x": 172, "y": 106}], "deviations": [{"x": 146, "y": 19}, {"x": 202, "y": 119}, {"x": 177, "y": 106}]},
        {"bitmapId": 246, "corners": [{"x": 10, "y": 27}, {"x": 178, "y": 14.082304535811385}, {"x": 159.69429499444755, "y": 67}, {"x": 134, "y": 51}], "deviations": [{"x": 60, "y": 28}, {"x": 176, "y": 27}, {"x": 145, "y": 57}]},
        {"bitmapId": 247, "corners": [{"x": 17, "y": 37}, {"x": 148, "y": 21.587967022274604}, {"x": 110.6268062885925, "y": 127}, {"x": 80, "y": 105}], "deviations": [{"x": 75, "y": 27}, {"x": 131, "y": 95}, {"x": 101, "y": 125}]},
        {"bitmapId": 248, "corners": [{"x": 11, "y": 40}, {"x": 197, "y": 29.554803195266132}, {"x": 167.43588071193284, "y": 238.43588071193284}, {"x": 143, "y": 220}], "deviations": [{"x": 196, "y": 27}, {"x": 189, "y": 168}, {"x": 152, "y": 225}]},
        {"bitmapId": 249, "corners": [{"x": 5, "y": 46}, {"x": 197.64278603182828, "y": 18}, {"x": 179.6192059299158, "y": 222}, {"x": 141, "y": 198}], "deviations": [{"x": 77, "y": 32}, {"x": 192, "y": 162}, {"x": 171, "y": 220}]},
        {"bitmapId": 250, "corners": [{"x": 17, "y": 52}, {"x": 251.7844158164897, "y": 20}, {"x": 207.76988047960288, "y": 263}, {"x": 145, "y": 242}], "deviations": [{"x": 180, "y": 25}, {"x": 256, "y": 106}, {"x": 202, "y": 264}]},
        {"bitmapId": 251, "corners": [{"x": 35, "y": 41}, {"x": 229, "y": 21.61186408760127}, {"x": 149.02790965634864, "y": 347}, {"x": 99, "y": 313}], "deviations": [{"x": 164, "y": 20}, {"x": 197, "y": 254}, {"x": 115, "y": 320}]},
        {"bitmapId": 252, "corners": [{"x": 13, "y": 33}, {"x": 183.7415075150705, "y": 24.258492484929505}, {"x": 133.75681691009117, "y": 230}, {"x": 100, "y": 203}], "deviations": [{"x": 93, "y": 24}, {"x": 171, "y": 134}, {"x": 119, "y": 221}]},
        {"bitmapId": 253, "corners": [{"x": 12, "y": 39}, {"x": 134.03838947318425, "y": 14}, {"x": 111.76976414502256, "y": 196.8848820725113}, {"x": 69, "y": 160}], "deviations": [{"x": 65, "y": 24}, {"x": 130, "y": 126}, {"x": 88, "y": 173}]},
        {"bitmapId": 254, "corners": [{"x": 19, "y": 46}, {"x": 173, "y": 27.842560670294308}, {"x": 113.66806119544357, "y": 234}, {"x": 69, "y": 206}], "deviations": [{"x": 171, "y": 23}, {"x": 154, "y": 137}, {"x": 109, "y": 236}]},
        {"bitmapId": 255, "corners": [{"x": 21, "y": 41}, {"x": 170.28641560408772, "y": 22}, {"x": 116.47390180610684, "y": 188.7369509030534}, {"x": 91, "y": 161}], "deviations": [{"x": 38, "y": 36}, {"x": 156, "y": 113}, {"x": 93, "y": 162}]},
        {"bitmapId": 256, "corners": [{"x": 20, "y": 37}, {"x": 142.01004804013024, "y": 19}, {"x": 99.39275442240397, "y": 272}, {"x": 63, "y": 257}], "deviations": [{"x": 97, "y": 22}, {"x": 129, "y": 191}, {"x": 76, "y": 264}]},
        {"bitmapId": 257, "corners": [{"x": 7, "y": 36}, {"x": 116.24255414199234, "y": 17}, {"x": 126, "y": 220.83857782389305}, {"x": 85, "y": 204}], "deviations": [{"x": 24, "y": 35}, {"x": 127, "y": 92}, {"x": 120, "y": 223}]},
        {"bitmapId": 258, "corners": [{"x": 11, "y": 34}, {"x": 96, "y": 16.28715416814739}, {"x": 98.80930149780038, "y": 199}, {"x": 62, "y": 176}], "deviations": [{"x": 93, "y": 14}, {"x": 100, "y": 95}, {"x": 92, "y": 196}]},
        {"bitmapId": 259, "corners": [{"x": 14, "y": 38}, {"x": 150, "y": 19.93846587846126}, {"x": 152.85806493705996, "y": 227}, {"x": 125, "y": 193}], "deviations": [{"x": 88, "y": 23}, {"x": 153, "y": 37}, {"x": 149, "y": 227}]},
        {"bitmapId": 260, "corners": [{"x": 2, "y": 32}, {"x": 139, "y": 19.888979992712514}, {"x": 139.1543423379353, "y": 155}, {"x": 117, "y": 147}], "deviations": [{"x": 69, "y": 31}, {"x": 139, "y": 120}, {"x": 132, "y": 155}]},
        {"bitmapId": 261, "corners": [{"x": 8, "y": 33}, {"x": 111, "y": 20.692380241722145}, {"x": 95.4199823904062, "y": 198.5800176095938}, {"x": 71, "y": 180}], "deviations": [{"x": 63, "y": 29}, {"x": 110, "y": 135}, {"x": 92, "y": 199}]},
        {"bitmapId": 262, "corners": [{"x": 7, "y": 27}, {"x": 92.31970702026689, "y": 16}, {"x": 82.76428451546131, "y": 253}, {"x": 64, "y": 236}], "deviations": [{"x": 53, "y": 20}, {"x": 93, "y": 128}, {"x": 78, "y": 253}]},
        {"bitmapId": 263, "corners": [{"x": 9, "y": 25}, {"x": 93, "y": 14.876544819424602}, {"x": 86.62840936096345, "y": 159.8142046804817}, {"x": 62, "y": 136}], "deviations": [{"x": 38, "y": 23}, {"x": 90, "y": 33}, {"x": 78, "y": 154}]},
        {"bitmapId": 264, "corners": [{"x": 9, "y": 37}, {"x": 135.3741537314827, "y": 19}, {"x": 123.61178149017768, "y": 113}, {"x": 106, "y": 104}], "deviations": [{"x": 54, "y": 26}, {"x": 136, "y": 57}, {"x": 116, "y": 111}]},
        {"bitmapId": 265, "corners": [{"x": 7, "y": 25}, {"x": 71.48234110558344, "y": 13}, {"x": 73.09742543288328, "y": 124}, {"x": 52, "y": 108}], "deviations": [{"x": 27, "y": 24}, {"x": 75, "y": 77}, {"x": 61, "y": 118}]},
        {"bitmapId": 266, "corners": [{"x": 7, "y": 37}, {"x": 130, "y": 21.551838731581256}, {"x": 96.99078289826373, "y": 132.66359429942122}, {"x": 79, "y": 119}], "deviations": [{"x": 70, "y": 23}, {"x": 114, "y": 85}, {"x": 84, "y": 121}]},
        {"bitmapId": 267, "corners": [{"x": 12, "y": 19}, {"x": 76, "y": 21.72312592794416}, {"x": 54.16643168979278, "y": 118.83356831020723}, {"x": 34, "y": 106}], "deviations": [{"x": 57, "y": 19}, {"x": 58, "y": 94}, {"x": 50, "y": 118}]},
        {"bitmapId": 268, "corners": [{"x": 8, "y": 33}, {"x": 119.17677357964222, "y": 13}, {"x": 104.63573064313984, "y": 126}, {"x": 72, "y": 105}], "deviations": [{"x": 68, "y": 20}, {"x": 121, "y": 42}, {"x": 93, "y": 123}]},
        {"bitmapId": 269, "corners": [{"x": 11, "y": 34}, {"x": 110.05284715769751, "y": 13}, {"x": 86.69305594296084, "y": 112}, {"x": 52, "y": 95}], "deviations": [{"x": 57, "y": 20}, {"x": 105, "y": 83}, {"x": 84, "y": 112}]},
        {"bitmapId": 270, "corners": [{"x": 11, "y": 37}, {"x": 108, "y": 22.565506192268806}, {"x": 66.14327917328781, "y": 142.5716395866439}, {"x": 40, "y": 123}], "deviations": [{"x": 29, "y": 36}, {"x": 96, "y": 90}, {"x": 50, "y": 129}]},
        {"bitmapId": 271, "corners": [{"x": 27, "y": 7}, {"x": 145, "y": 24.0961829007521}, {"x": 63.657876449467054, "y": 226}, {"x": 20, "y": 192}], "deviations": [{"x": 120, "y": 17}, {"x": 116, "y": 136}, {"x": 29, "y": 202}]},
        {"bitmapId": 272, "corners": [{"x": 44, "y": 12}, {"x": 133, "y": 39.49138927666331}, {"x": 65.10849301710277, "y": 212}, {"x": 11, "y": 181}], "deviations": [{"x": 59, "y": 19}, {"x": 108, "y": 146}, {"x": 55, "y": 209}]},
        {"bitmapId": 273, "corners": [{"x": 56, "y": 9}, {"x": 105, "y": 23.236639530872672}, {"x": 43.91674781900948, "y": 179}, {"x": 7, "y": 151}], "deviations": [{"x": 69, "y": 10}, {"x": 79, "y": 118}, {"x": 18, "y": 158}]},
        {"bitmapId": 274, "corners": [{"x": 33, "y": 9}, {"x": 109, "y": 28.066271772815824}, {"x": 47.551359876913146, "y": 161.55135987691315}, {"x": 20, "y": 129}], "deviations": [{"x": 69, "y": 15}, {"x": 76, "y": 117}, {"x": 25, "y": 135}]},
        {"bitmapId": 275, "corners": [{"x": 24, "y": 143}, {"x": 307, "y": 12.131595593131793}, {"x": 270, "y": 163.76005576600014}, {"x": 241, "y": 145}], "deviations": [{"x": 138, "y": 97}, {"x": 274, "y": 139}, {"x": 267, "y": 164}]},
        {"bitmapId": 276, "corners": [{"x": 22, "y": 114}, {"x": 230, "y": 18.66870690500215}, {"x": 206, "y": 150.5453250968367}, {"x": 168, "y": 132}], "deviations": [{"x": 140, "y": 56}, {"x": 214, "y": 120}, {"x": 200, "y": 151}]},
        {"bitmapId": 277, "corners": [{"x": 19, "y": 46}, {"x": 120.17268545308198, "y": 20.413657273459005}, {"x": 106, "y": 198.9892365324689}, {"x": 175, "y": 151}], "deviations": [{"x": 49, "y": 43}, {"x": 116, "y": 46}, {"x": 121, "y": 182}]},
        {"bitmapId": 278, "corners": [{"x": 11, "y": 30}, {"x": 62.29328717819362, "y": 14}, {"x": 64, "y": 124.3448935923812}, {"x": 110, "y": 75}], "deviations": [{"x": 26, "y": 28}, {"x": 64, "y": 14}, {"x": 101, "y": 84}]},
        {"bitmapId": 279, "corners": [{"x": 10, "y": 36}, {"x": 116, "y": 19.28628214264874}, {"x": 117.8479906919841, "y": 131.8479906919841}, {"x": 198, "y": 139}], "deviations": [{"x": 59, "y": 25}, {"x": 110, "y": 114}, {"x": 128, "y": 137}]},
        {"bitmapId": 280, "corners": [{"x": 32, "y": 28}, {"x": 51.83929883656983, "y": 365.4196494182849}, {"x": 238, "y": 361.0726437884156}, {"x": 238, "y": 299}], "deviations": [{"x": 25, "y": 309}, {"x": 185, "y": 378}, {"x": 239, "y": 361}]},
        {"bitmapId": 281, "corners": [{"x": 35, "y": 21}, {"x": 38.07576330867518, "y": 321}, {"x": 190.13773997622576, "y": 333}, {"x": 196, "y": 251}], "deviations": [{"x": 31, "y": 308}, {"x": 75, "y": 337}, {"x": 193, "y": 332}]},
        {"bitmapId": 282, "corners": [{"x": 32, "y": 29}, {"x": 57.15985554854505, "y": 290.15985554854507}, {"x": 279.6461407879463, "y": 286.53078881808057}, {"x": 282, "y": 225}], "deviations": [{"x": 38, "y": 226}, {"x": 223, "y": 306}, {"x": 282, "y": 265}], "contains": [121, 179]},
        {"bitmapId": 283, "corners": [{"x": 15, "y": 15}, {"x": 29.98246116650804, "y": 199.9649223330161}, {"x": 327.0004196177853, "y": 193.9995803822147}, {"x": 333, "y": 148}], "deviations": [{"x": 13, "y": 151}, {"x": 236, "y": 229}, {"x": 333, "y": 166}], "contains": [121, 179]},
        {"bitmapId": 284, "corners": [{"x": 29, "y": 17}, {"x": 40, "y": 198.35230961767027}, {"x": 324, "y": 221.51201165376727}, {"x": 325, "y": 167}], "deviations": [{"x": 30, "y": 169}, {"x": 150, "y": 239}, {"x": 324, "y": 188}], "contains": [249, 60]},
        {"bitmapId": 285, "corners": [{"x": 17, "y": 22}, {"x": 27.3957637896545, "y": 163.3957637896545}, {"x": 232.8808704328404, "y": 171.55956478357982}, {"x": 239, "y": 124}], "deviations": [{"x": 13, "y": 130}, {"x": 102, "y": 189}, {"x": 239, "y": 152}], "contains": [249, 61]},
        {"bitmapId": 286, "corners": [{"x": 22, "y": 28}, {"x": 39.021492965260805, "y": 167.5053732413152}, {"x": 200.67827659523041, "y": 169}, {"x": 206, "y": 96}], "deviations": [{"x": 18, "y": 140}, {"x": 80, "y": 178}, {"x": 205, "y": 148}], "contains": [118, 60]},
        {"bitmapId": 287, "corners": [{"x": 15, "y": 22}, {"x": 28.834617589225807, "y": 102}, {"x": 169.60969210970887, "y": 94.39030789029114}, {"x": 168, "y": 31}], "deviations": [{"x": 16, "y": 72}, {"x": 119, "y": 110}, {"x": 171, "y": 31}], "contains": [70, 35]},
        {"bitmapId": 288, "corners": [{"x": 14, "y": 15}, {"x": 26, "y": 92.34332083240749}, {"x": 125.20646995838717, "y": 99.79353004161283}, {"x": 131, "y": 54}], "deviations": [{"x": 14, "y": 62}, {"x": 62, "y": 106}, {"x": 130, "y": 78}]},
        {"bitmapId": 289, "corners": [{"x": 17, "y": 13}, {"x": 22.851468520778106, "y": 169.85146852077813}, {"x": 128.46799606491888, "y": 171.06400787016224}, {"x": 130, "y": 135}], "deviations": [{"x": 11, "y": 153}, {"x": 59, "y": 180}, {"x": 130, "y": 170}], "contains": [50, 172]},
        {"bitmapId": 290, "corners": [{"x": 25, "y": 17}, {"x": 13, "y": 138.1936624296488}, {"x": 71.36973314082864, "y": 138.63026685917134}, {"x": 51, "y": 274}], "deviations": [{"x": 22, "y": 19}, {"x": 13, "y": 139}, {"x": 55, "y": 224}], "contains": [162, 159]},
        {"bitmapId": 291, "corners": [{"x": 24, "y": 18}, {"x": 15, "y": 118.62208310505868}, {"x": 112, "y": 109.91257111585712}, {"x": 96, "y": 152}], "deviations": [{"x": 21, "y": 79}, {"x": 30, "y": 123}, {"x": 110, "y": 118}], "contains": [162, 167]},
        {"bitmapId": 292, "corners": [{"x": 20, "y": 12}, {"x": 33.94833891537602, "y": 74.94833891537601}, {"x": 102, "y": 64.1784580446039}, {"x": 100, "y": 113}], "deviations": [{"x": 27, "y": 36}, {"x": 76, "y": 63}, {"x": 100, "y": 90}], "contains": [165, 169]},
        {"bitmapId": 293, "corners": [{"x": 61, "y": 25}, {"x": 17, "y": 270.6373325021897}, {"x": 134.44976502026103, "y": 253}, {"x": 84, "y": 355}], "deviations": [{"x": 42, "y": 182}, {"x": 64, "y": 260}, {"x": 100, "y": 331}], "contains": [165, 169]},
        {"bitmapId": 294, "corners": [{"x": 17, "y": 35}, {"x": 98.94566381928456, "y": 18}, {"x": 106, "y": 166}], "deviations": [{"x": 38, "y": 34}, {"x": 86, "y": 103}]},
        {"bitmapId": 295, "corners": [{"x": 8, "y": 56}, {"x": 213.658084835276, "y": 20}, {"x": 305.4160757277176, "y": 346.4160757277176}, {"x": 317, "y": 278}], "deviations": [{"x": 119, "y": 30}, {"x": 216, "y": 225}, {"x": 312, "y": 349}], "contains": [165, 169]},
        {"bitmapId": 296, "corners": [{"x": 16, "y": 45}, {"x": 147.1303260733646, "y": 21}, {"x": 218.88060001787494, "y": 312}, {"x": 232, "y": 252}], "deviations": [{"x": 135, "y": 26}, {"x": 141, "y": 221}, {"x": 231, "y": 270}]},
        {"bitmapId": 297, "corners": [{"x": 9, "y": 47}, {"x": 129.57524402236717, "y": 25.474918659210935}, {"x": 134.59063901492138, "y": 326}, {"x": 284.4467375458711, "y": 321}, {"x": 285, "y": 275}], "deviations": [{"x": 77, "y": 39}, {"x": 111, "y": 285}, {"x": 224, "y": 336}, {"x": 286, "y": 321}]},
        {"bitmapId": 298, "corners": [{"x": 4, "y": 44}, {"x": 101, "y": 17.77410892824584}, {"x": 204.58293285775738, "y": 273}, {"x": 209, "y": 230}], "deviations": [{"x": 90, "y": 16}, {"x": 83, "y": 223}, {"x": 207, "y": 273}]},
        {"bitmapId": 299, "corners": [{"x": 27, "y": 63}, {"x": 217.7936095451139, "y": 20}, {"x": 346.3130840873614, "y": 286.37383182527714}, {"x": 349, "y": 235}], "deviations": [{"x": 115, "y": 35}, {"x": 220, "y": 223}, {"x": 348, "y": 274}]},
        {"bitmapId": 300, "corners": [{"x": 29, "y": 73}, {"x": 243.8843216830884, "y": 25.115678316911588}, {"x": 231, "y": 249.36716881844538}, {"x": 380.18624185240077, "y": 263.81375814759923}, {"x": 390, "y": 209}], "deviations": [{"x": 70, "y": 70}, {"x": 214, "y": 144}, {"x": 297, "y": 276}, {"x": 384, "y": 261}]},
        {"bitmapId": 301, "corners": [{"x": 19, "y": 60}, {"x": 240.88762737377712, "y": 17}, {"x": 354, "y": 230.82614042330698}, {"x": 356, "y": 177}], "deviations": [{"x": 135, "y": 33}, {"x": 227, "y": 177}, {"x": 354, "y": 200}]},
        {"bitmapId": 302, "corners": [{"x": 15, "y": 54}, {"x": 168.94312865211776, "y": 18.94312865211775}, {"x": 278, "y": 234.59546822419125}, {"x": 278, "y": 195}], "deviations": [{"x": 128, "y": 33}, {"x": 163, "y": 163}, {"x": 278, "y": 196}]},
        {"bitmapId": 303, "corners": [{"x": 22, "y": 41}, {"x": 190.13602367531078, "y": 19}, {"x": 184, "y": 116.24070997838791}, {"x": 294, "y": 137.96064727854895}, {"x": 296, "y": 90}], "deviations": [{"x": 73, "y": 30}, {"x": 172, "y": 52}, {"x": 225, "y": 139}, {"x": 296, "y": 123}]},
        {"bitmapId": 304, "corners": [{"x": 12, "y": 31}, {"x": 95.12036552766185, "y": 17}, {"x": 109.40305000096939, "y": 157.4030500009694}, {"x": 232.78115175171524, "y": 157.0875392993139}, {"x": 235, "y": 111}], "deviations": [{"x": 36, "y": 30}, {"x": 85, "y": 110}, {"x": 194, "y": 165}, {"x": 235, "y": 157}]},
        {"bitmapId": 305, "corners": [{"x": 13, "y": 33}, {"x": 95.43869889334387, "y": 15}, {"x": 162.5728858591285, "y": 204}, {"x": 173, "y": 156}], "deviations": [{"x": 52, "y": 29}, {"x": 96, "y": 154}, {"x": 166, "y": 196}]},
        {"bitmapId": 306, "corners": [{"x": 8, "y": 47}, {"x": 129, "y": 21.900465923890287}, {"x": 204.0176915375054, "y": 183}, {"x": 209, "y": 129}], "deviations": [{"x": 128, "y": 19}, {"x": 117, "y": 122}, {"x": 211, "y": 159}]},
        {"bitmapId": 307, "corners": [{"x": 25, "y": 41}, {"x": 186.882399507992, "y": 25}, {"x": 11.270492360699848, "y": 297.27049236069985}, {"x": 316.8033445244534, "y": 307.1966554755466}, {"x": 308, "y": 239}], "deviations": [{"x": 121, "y": 35}, {"x": 51, "y": 180}, {"x": 87, "y": 338}, {"x": 311, "y": 240}]},
        {"bitmapId": 308, "corners": [{"x": 17, "y": 34}, {"x": 133.9178312560648, "y": 21}, {"x": 19.738377595416303, "y": 228.9535103816652}, {"x": 242.02863098123876, "y": 256.19427380375225}, {"x": 245, "y": 206}], "deviations": [{"x": 124, "y": 24}, {"x": 38, "y": 150}, {"x": 84, "y": 274}, {"x": 245, "y": 255}]},
        {"bitmapId": 309, "corners": [{"x": 18, "y": 40}, {"x": 102, "y": 17.572813654888584}, {"x": 33.810838003301335, "y": 193.20722533553422}, {"x": 247, "y": 184.26433093389508}, {"x": 247, "y": 118}], "deviations": [{"x": 29, "y": 40}, {"x": 32, "y": 126}, {"x": 145, "y": 212}, {"x": 247, "y": 119}]},
        {"bitmapId": 310, "corners": [{"x": 22, "y": 19}, {"x": 14.017230693847065, "y": 190}, {"x": 258, "y": 181.45345877428662}, {"x": 218, "y": 348.88811251600333}, {"x": 179, "y": 325}], "deviations": [{"x": 21, "y": 122}, {"x": 141, "y": 182}, {"x": 256, "y": 232}, {"x": 214, "y": 350}]},
        {"bitmapId": 311, "corners": [{"x": 45, "y": 10}, {"x": 27.018418477049106, "y": 147.9815815229509}, {"x": 221.58027525050736, "y": 129}, {"x": 188.27793652886479, "y": 309.72206347113524}, {"x": 116, "y": 271}], "deviations": [{"x": 25, "y": 144}, {"x": 153, "y": 129}, {"x": 207, "y": 262}, {"x": 181, "y": 310}]},
        {"bitmapId": 312, "corners": [{"x": 18, "y": 14}, {"x": 19.887598608032434, "y": 169}, {"x": 188.07117154054913, "y": 169.07117154054913}, {"x": 149.4921171647042, "y": 320.0157656705916}, {"x": 89, "y": 287}], "deviations": [{"x": 16, "y": 163}, {"x": 188, "y": 169}, {"x": 187, "y": 190}, {"x": 146, "y": 323}]},
        {"bitmapId": 313, "corners": [{"x": 20, "y": 16}, {"x": 18, "y": 141.5016959655128}, {"x": 196, "y": 131.3352411638544}, {"x": 151.88313476346727, "y": 329.94156738173365}, {"x": 110, "y": 302}], "deviations": [{"x": 18, "y": 23}, {"x": 128, "y": 126}, {"x": 157, "y": 326}, {"x": 113, "y": 302}]},
        {"bitmapId": 314, "corners": [{"x": 17, "y": 7}, {"x": 20.179959991908014, "y": 132}, {"x": 115.15638022795572, "y": 116}, {"x": 82.95770254710757, "y": 289}, {"x": 44, "y": 263}], "deviations": [{"x": 17, "y": 131}, {"x": 60, "y": 120}, {"x": 110, "y": 202}, {"x": 57, "y": 275}]},
        {"bitmapId": 315, "corners": [{"x": 70, "y": 23}, {"x": 26, "y": 129.07969167357547}, {"x": 152, "y": 119.62291615588929}, {"x": 82.60499448264127, "y": 309.1975027586794}, {"x": 38, "y": 281}], "deviations": [{"x": 70, "y": 27}, {"x": 111, "y": 116}, {"x": 140, "y": 214}, {"x": 78, "y": 311}]},
        {"bitmapId": 316, "corners": [{"x": 34, "y": 14}, {"x": 25.274082406959945, "y": 76}, {"x": 124.76805663205684, "y": 65.76805663205684}, {"x": 76.84170041524129, "y": 265}, {"x": 44, "y": 244}], "deviations": [{"x": 35, "y": 34}, {"x": 79, "y": 66}, {"x": 115, "y": 138}, {"x": 70, "y": 262}]},
        {"bitmapId": 317, "corners": [{"x": 40, "y": 19}, {"x": 23.285051595772952, "y": 97}, {"x": 120, "y": 96.54030598873884}, {"x": 70.19216647960252, "y": 252}, {"x": 28, "y": 227}], "deviations": [{"x": 38, "y": 41}, {"x": 80, "y": 93}, {"x": 100, "y": 193}, {"x": 62, "y": 249}]},
        {"bitmapId": 318, "corners": [{"x": 54, "y": 23}, {"x": 30.836718653684734, "y": 94}, {"x": 145.39628969146057, "y": 74}, {"x": 108.09293339406975, "y": 214}, {"x": 71, "y": 195}], "deviations": [{"x": 47, "y": 53}, {"x": 73, "y": 84}, {"x": 139, "y": 145}, {"x": 78, "y": 196}]},
        {"bitmapId": 319, "corners": [{"x": 23, "y": 16}, {"x": 22.48581313822596, "y": 82.25709343088702}, {"x": 208, "y": 70.32176974313936}, {"x": 172, "y": 193.9280112270105}, {"x": 134, "y": 179}], "deviations": [{"x": 19, "y": 83}, {"x": 87, "y": 71}, {"x": 196, "y": 123}, {"x": 166, "y": 196}]},
        {"bitmapId": 320, "corners": [{"x": 33, "y": 13}, {"x": 16, "y": 68.83211099670224}, {"x": 181, "y": 49.2003435624534}, {"x": 125.98278765595865, "y": 167}, {"x": 88, "y": 147}], "deviations": [{"x": 17, "y": 58}, {"x": 73, "y": 51}, {"x": 167, "y": 108}, {"x": 121, "y": 166}]},
        {"bitmapId": 321, "corners": [{"x": 32, "y": 18}, {"x": 26, "y": 83.0186733726407}, {"x": 278.1348899507889, "y": 52}, {"x": 251.88234951398374, "y": 172.11765048601626}, {"x": 212, "y": 141}], "deviations": [{"x": 32, "y": 51}, {"x": 171, "y": 57}, {"x": 274, "y": 87}, {"x": 230, "y": 150}]},
        {"bitmapId": 322, "corners": [{"x": 30, "y": 13}, {"x": 18.191495468021174, "y": 72}, {"x": 312.19001093049934, "y": 38.619978139001375}, {"x": 279.1052692001438, "y": 115}, {"x": 242, "y": 94}], "deviations": [{"x": 27, "y": 35}, {"x": 236, "y": 38}, {"x": 301, "y": 59}, {"x": 269, "y": 113}]},
        {"bitmapId": 323, "corners": [{"x": 25, "y": 44}, {"x": 206.91604019757324, "y": 23.33583920970699}, {"x": 149, "y": 140.1787037715095}, {"x": 231, "y": 150.93672723035633}, {"x": 63, "y": 346}], "deviations": [{"x": 189, "y": 19}, {"x": 162, "y": 103}, {"x": 188, "y": 148}, {"x": 165, "y": 274}], "contains": [359, 360]},
        {"bitmapId": 324, "corners": [{"x": 31, "y": 45}, {"x": 159.32098046561032, "y": 12}, {"x": 114.15733441017464, "y": 137.38577813672487}, {"x": 175, "y": 141.21661191804188}, {"x": 18, "y": 337}], "deviations": [{"x": 46, "y": 44}, {"x": 119, "y": 99}, {"x": 175, "y": 139}, {"x": 135, "y": 251}], "contains": [359, 260]},
        {"bitmapId": 325, "corners": [{"x": 18, "y": 31}, {"x": 66, "y": 14.181493120428478}, {"x": 39, "y": 121.95440747212686}, {"x": 82, "y": 125.52216724216521}, {"x": 13, "y": 271}], "deviations": [{"x": 37, "y": 29}, {"x": 65, "y": 38}, {"x": 39, "y": 123}, {"x": 44, "y": 224}], "contains": [361, 362]},
        {"bitmapId": 326, "corners": [{"x": 11, "y": 43}, {"x": 108.49353805031492, "y": 21.506461949685082}, {"x": 63.1718343652262, "y": 107.8281656347738}, {"x": 104, "y": 269.88147368075914}, {"x": 42, "y": 234}], "deviations": [{"x": 55, "y": 30}, {"x": 93, "y": 47}, {"x": 114, "y": 192}, {"x": 99, "y": 270}], "contains": [146, 214]},
        {"bitmapId": 327, "corners": [{"x": 6, "y": 35}, {"x": 100, "y": 18.33733389953487}, {"x": 68, "y": 75.2062396583169}, {"x": 102.06582222259826, "y": 178}, {"x": 55, "y": 150}], "deviations": [{"x": 62, "y": 18}, {"x": 93, "y": 35}, {"x": 104, "y": 125}, {"x": 95, "y": 176}], "contains": [147, 215]},
        {"bitmapId": 328, "corners": [{"x": 9, "y": 40}, {"x": 106.31523164893949, "y": 16}, {"x": 74.1614027630305, "y": 90.75789585545425}, {"x": 105.5348138135144, "y": 156.2325930932428}, {"x": 50, "y": 157}], "deviations": [{"x": 24, "y": 40}, {"x": 80, "y": 62}, {"x": 87, "y": 100}, {"x": 104, "y": 157}], "contains": [148, 216]},
        {"bitmapId": 329, "corners": [{"x": 18, "y": 23}, {"x": 125.63988821594548, "y": 13.680055892027267}, {"x": 25.116021484580564, "y": 150}, {"x": 205.54374702134467, "y": 131.684379467983}, {"x": 133.36089576207075, "y": 366}, {"x": 93, "y": 318}], "deviations": [{"x": 31, "y": 24}, {"x": 129, "y": 13}, {"x": 142, "y": 127}, {"x": 174, "y": 286}, {"x": 129, "y": 366}]},
        {"bitmapId": 330, "corners": [{"x": 20, "y": 24}, {"x": 90, "y": 12.101674096837607}, {"x": 27.51392417534025, "y": 91.48607582465975}, {"x": 173, "y": 104.75014235084787}, {"x": 120.1834537394768, "y": 212.90827313026162}, {"x": 104, "y": 186}], "deviations": [{"x": 90, "y": 8}, {"x": 70, "y": 45}, {"x": 44, "y": 98}, {"x": 141, "y": 183}, {"x": 119, "y": 214}]},
        {"bitmapId": 331, "corners": [{"x": 12, "y": 45}, {"x": 162.48488616021604, "y": 15.147175382795423}, {"x": 124, "y": 129.47415180146828}, {"x": 188, "y": 134.17669906137718}, {"x": 131.42678197186228, "y": 307.5732180281377}, {"x": 98, "y": 284}], "deviations": [{"x": 128, "y": 20}, {"x": 165, "y": 22}, {"x": 188, "y": 130}, {"x": 180, "y": 213}, {"x": 114, "y": 300}]},
        {"bitmapId": 332, "corners": [{"x": 18, "y": 44}, {"x": 147.04227690288621, "y": 8}, {"x": 116.44174246176992, "y": 74}, {"x": 188, "y": 77.85015386202394}, {"x": 131.1183137276768, "y": 183.9408431361616}, {"x": 112, "y": 156}], "deviations": [{"x": 57, "y": 39}, {"x": 114, "y": 72}, {"x": 184, "y": 74}, {"x": 141, "y": 171}, {"x": 131, "y": 186}]},
        {"bitmapId": 333, "corners": [{"x": 8, "y": 38}, {"x": 128.5332913697257, "y": 16}, {"x": 128.27557952153808, "y": 188}, {"x": 232.344415258474, "y": 187}, {"x": 206.5369566295252, "y": 367}, {"x": 173, "y": 328}], "deviations": [{"x": 61, "y": 24}, {"x": 125, "y": 127}, {"x": 222, "y": 188}, {"x": 220, "y": 323}, {"x": 190, "y": 353}]},
        {"bitmapId": 334, "corners": [{"x": 30, "y": 46}, {"x": 191, "y": 24.991886928590233}, {"x": 112, "y": 111.07572210208522}, {"x": 91.65120236383285, "y": 384.3487976361671}, {"x": 51, "y": 338}], "deviations": [{"x": 78, "y": 31}, {"x": 172, "y": 49}, {"x": 116, "y": 277}, {"x": 82, "y": 379}], "contains": [141, 209]},
        {"bitmapId": 335, "corners": [{"x": 23, "y": 37}, {"x": 132.5965826528119, "y": 19.8068346943762}, {"x": 84.46735610115604, "y": 87}, {"x": 75.35999117760555, "y": 306}, {"x": 33, "y": 274}], "deviations": [{"x": 49, "y": 36}, {"x": 121, "y": 40}, {"x": 100, "y": 239}, {"x": 56, "y": 289}], "contains": [143, 211]},
        {"bitmapId": 336, "corners": [{"x": 16, "y": 34}, {"x": 110.56703897833037, "y": 12.432961021669623}, {"x": 75, "y": 65.00563242140743}, {"x": 65, "y": 194.61180581000195}, {"x": 14, "y": 178}], "deviations": [{"x": 40, "y": 32}, {"x": 105, "y": 30}, {"x": 81, "y": 152}, {"x": 55, "y": 196}], "contains": [143, 211]},
        {"bitmapId": 337, "corners": [{"x": 14, "y": 38}, {"x": 112, "y": 20.203640274878836}, {"x": 88, "y": 89.87449747262646}, {"x": 92.03536735228975, "y": 184.96463264771026}, {"x": 41.30003087383408, "y": 201}, {"x": 314, "y": 244}], "deviations": [{"x": 72, "y": 31}, {"x": 111, "y": 33}, {"x": 106, "y": 132}, {"x": 84, "y": 190}, {"x": 159, "y": 207}], "contains": [294, 76]},
        {"bitmapId": 338, "corners": [{"x": 11, "y": 30}, {"x": 89.92810752319701, "y": 18}, {"x": 69, "y": 62.28518564475437}, {"x": 78.03750718006671, "y": 143.4437392298999}, {"x": 30.49640112458686, "y": 154}, {"x": 219, "y": 191}], "deviations": [{"x": 71, "y": 23}, {"x": 72, "y": 41}, {"x": 84, "y": 100}, {"x": 63, "y": 152}, {"x": 93, "y": 157}]},
        {"bitmapId": 339, "corners": [{"x": 85, "y": 71}, {"x": 298.756092167179, "y": 21.48781566564195}, {"x": 11.28829077982476, "y": 212.71170922017524}, {"x": 343, "y": 266}], "deviations": [{"x": 125, "y": 66}, {"x": 242, "y": 71}, {"x": 135, "y": 202}], "contains": [140, 76]},
        {"bitmapId": 340, "corners": [{"x": 24, "y": 69}, {"x": 186.34472117017128, "y": 33.37888468068518}, {"x": 87.10325871483612, "y": 219.8967412851639}, {"x": 75, "y": 227}], "deviations": [{"x": 163, "y": 33}, {"x": 164, "y": 132}, {"x": 78, "y": 226}], "contains": [46, 87]},
        {"bitmapId": 341, "corners": [{"x": 272, "y": 21}, {"x": 104.43286602424911, "y": 86.92785566262515}, {"x": 15, "y": 341}], "deviations": [{"x": 232, "y": 44}, {"x": 69, "y": 270}], "contains": [66, 37]},
        {"bitmapId": 342, "corners": [{"x": 165, "y": 22}, {"x": 78.32825258873731, "y": 82.67174741126269}, {"x": 11, "y": 357}], "deviations": [{"x": 148, "y": 42}, {"x": 52, "y": 272}], "contains": [66, 31]},
        {"bitmapId": 343, "corners": [{"x": 143, "y": 27}, {"x": 36, "y": 117.71289362745304}, {"x": 26, "y": 302.33051829431906}, {"x": 85, "y": 255}], "deviations": [{"x": 55, "y": 99}, {"x": 27, "y": 231}, {"x": 50, "y": 288}], "contains": [61, 155]},
        {"bitmapId": 344, "corners": [{"x": 103, "y": 19}, {"x": 28, "y": 88.70840613304804}, {"x": 24.187104810769682, "y": 220}, {"x": 98, "y": 175}], "deviations": [{"x": 80, "y": 45}, {"x": 24, "y": 95}, {"x": 73, "y": 197}], "contains": [61, 160]},
        {"bitmapId": 345, "corners": [{"x": 106, "y": 22}, {"x": 23.22055529734347, "y": 74.77944470265653}, {"x": 22, "y": 150.34653101776735}, {"x": 100, "y": 115}], "deviations": [{"x": 83, "y": 39}, {"x": 24, "y": 131}, {"x": 55, "y": 133}]},
        {"bitmapId": 346, "corners": [{"x": 142, "y": 25}, {"x": 28.64222653997493, "y": 205}, {"x": 164.9977699305232, "y": 203.0022300694768}, {"x": 219.58815353923154, "y": 135.23553938230535}, {"x": 33.34955925632072, "y": 342.3008814873586}, {"x": 259, "y": 323}], "deviations": [{"x": 102, "y": 99}, {"x": 156, "y": 207}, {"x": 200, "y": 163}, {"x": 97, "y": 256}, {"x": 157, "y": 342}]},
        {"bitmapId": 347, "corners": [{"x": 101, "y": 22}, {"x": 30.419166677945313, "y": 90}, {"x": 116.62364999113859, "y": 93.37635000886141}, {"x": 174.6326272073994, "y": 52.1836863963003}, {"x": 36.018497531494035, "y": 158.990751234253}, {"x": 183, "y": 132}], "deviations": [{"x": 42, "y": 74}, {"x": 105, "y": 96}, {"x": 161, "y": 64}, {"x": 98, "y": 102}, {"x": 109, "y": 139}], "contains": [201, 196]},
        {"bitmapId": 348, "corners": [{"x": 85, "y": 20}, {"x": 16.030618479058667, "y": 145.908144562824}, {"x": 98, "y": 134.27368011418955}, {"x": 139, "y": 81.05525128861761}, {"x": 26.420866604410172, "y": 231.57913339558982}, {"x": 115, "y": 202}], "deviations": [{"x": 61, "y": 76}, {"x": 71, "y": 136}, {"x": 121, "y": 113}, {"x": 99, "y": 147}, {"x": 90, "y": 207}], "contains": [192, 198]},
        {"bitmapId": 349, "corners": [{"x": 94, "y": 26}, {"x": 24.193040590659496, "y": 156.42087822802154}, {"x": 102.38610811934824, "y": 153.30694594032587}, {"x": 142, "y": 94.59090592218703}, {"x": 46.08755963847365, "y": 229}, {"x": 136, "y": 204}], "deviations": [{"x": 94, "y": 33}, {"x": 46, "y": 158}, {"x": 111, "y": 150}, {"x": 121, "y": 133}, {"x": 70, "y": 225}], "contains": [192, 198]},
        {"bitmapId": 350, "corners": [{"x": 56, "y": 13}, {"x": 14.403408086166953, "y": 86}, {"x": 67.0970735066301, "y": 83.9029264933699}, {"x": 109, "y": 40.040601547931686}, {"x": 19.848375567106135, "y": 147}, {"x": 86, "y": 132}], "deviations": [{"x": 24, "y": 64}, {"x": 36, "y": 85}, {"x": 83, "y": 71}, {"x": 71, "y": 91}, {"x": 29, "y": 147}], "contains": [192, 198]},
        {"bitmapId": 351, "corners": [{"x": 63, "y": 16}, {"x": 19, "y": 120.48783445170388}, {"x": 70.03890404238871, "y": 114}, {"x": 105, "y": 77.86895250284937}, {"x": 19.151769116554036, "y": 208}, {"x": 105, "y": 179}], "deviations": [{"x": 49, "y": 60}, {"x": 48, "y": 114}, {"x": 90, "y": 97}, {"x": 93, "y": 102}, {"x": 25, "y": 209}], "contains": [192, 198]},
        {"bitmapId": 352, "corners": [{"x": 18, "y": 15}, {"x": 22, "y": 171}], "deviations": [{"x": 22, "y": 31}]},
        {"bitmapId": 353, "corners": [{"x": 8, "y": 7}, {"x": 19, "y": 122}], "deviations": [{"x": 16, "y": 44}]},
        {"bitmapId": 354, "corners": [{"x": 18, "y": 20}, {"x": 109, "y": 20.212612203576313}, {"x": 70.455420985004, "y": 167.455420985004}, {"x": 50, "y": 141}], "deviations": [{"x": 109, "y": 20}, {"x": 81, "y": 139}, {"x": 59, "y": 151}]},
        {"bitmapId": 355, "corners": [{"x": 14, "y": 50}, {"x": 237.6427632497172, "y": 21}, {"x": 212.00076543405942, "y": 187.99923456594058}, {"x": 37, "y": 224}], "deviations": [{"x": 113, "y": 34}, {"x": 240, "y": 53}, {"x": 115, "y": 212}], "contains": [377, 378]},
        {"bitmapId": 356, "corners": [{"x": 9, "y": 37}, {"x": 89.80876218099775, "y": 18}, {"x": 85.10842957527841, "y": 102.89157042472159}, {"x": 30, "y": 126}], "deviations": [{"x": 35, "y": 33}, {"x": 92, "y": 68}, {"x": 41, "y": 122}], "contains": [111, 370]},
        {"bitmapId": 357, "corners": [{"x": 24, "y": 42}, {"x": 209, "y": 14.115591451029973}, {"x": 158, "y": 132}], "deviations": [{"x": 47, "y": 42}, {"x": 192, "y": 60}]},
        {"bitmapId": 358, "corners": [{"x": 148, "y": 21}, {"x": 215.38092016828432, "y": 23.61907983171568}, {"x": 22, "y": 218}], "deviations": [{"x": 191, "y": 21}, {"x": 162, "y": 135}]},
        {"bitmapId": 359, "corners": [{"x": 12, "y": 32}, {"x": 59.583461315760296, "y": 13}, {"x": 22, "y": 128}], "deviations": [{"x": 47, "y": 17}, {"x": 46, "y": 50}]},
        {"bitmapId": 360, "corners": [{"x": 40, "y": 10}, {"x": 74.90108701072153, "y": 11.901087010721527}, {"x": 9, "y": 153}], "deviations": [{"x": 65, "y": 10}, {"x": 52, "y": 98}]},
        {"bitmapId": 361, "corners": [{"x": 13, "y": 47}, {"x": 125.40256526922118, "y": 24.40256526922119}, {"x": 121, "y": 152.6018262739719}, {"x": 209, "y": 139}], "deviations": [{"x": 45, "y": 39}, {"x": 121, "y": 71}, {"x": 169, "y": 141}]},
        {"bitmapId": 362, "corners": [{"x": 28, "y": 23}, {"x": 17, "y": 208}], "deviations": [{"x": 31, "y": 94}]},
        {"bitmapId": 363, "corners": [{"x": 15, "y": 41}, {"x": 265.2165007577314, "y": 10.78349924226859}, {"x": 208, "y": 215.8309625507448}, {"x": 166, "y": 190}], "deviations": [{"x": 193, "y": 11}, {"x": 257, "y": 83}, {"x": 206, "y": 217}]},
        {"bitmapId": 364, "corners": [{"x": 19, "y": 15}, {"x": 15, "y": 187}], "deviations": [{"x": 19, "y": 112}]},
        {"bitmapId": 365, "corners": [{"x": 7, "y": 29}, {"x": 114, "y": 22.670168916139325}, {"x": 79.9555717587139, "y": 169.9555717587139}, {"x": 53, "y": 143}], "deviations": [{"x": 95, "y": 21}, {"x": 105, "y": 89}, {"x": 59, "y": 146}], "contains": [117, 370]},
        {"bitmapId": 366, "corners": [{"x": 23, "y": 15}, {"x": 19, "y": 108}], "deviations": [{"x": 21, "y": 28}]},
        {"bitmapId": 367, "corners": [{"x": 12, "y": 32}, {"x": 176, "y": 15.806362447998719}, {"x": 144.50322974568255, "y": 139.50322974568255}, {"x": 108, "y": 122}], "deviations": [{"x": 147, "y": 15}, {"x": 170, "y": 74}, {"x": 130, "y": 130}]},
        {"bitmapId": 368, "corners": [{"x": 11, "y": 31}, {"x": 180, "y": 18.982455378686645}, {"x": 174, "y": 59.31075390601886}, {"x": 28, "y": 96}], "deviations": [{"x": 64, "y": 31}, {"x": 179, "y": 35}, {"x": 46, "y": 95}], "contains": [119, 1]},
        {"bitmapId": 369, "corners": [{"x": 14, "y": 34}, {"x": 154, "y": 19.28887037693616}, {"x": 139.01124955283785, "y": 103}, {"x": 38, "y": 124}], "deviations": [{"x": 116, "y": 18}, {"x": 145, "y": 65}, {"x": 124, "y": 103}], "contains": [117, 370]},
        {"bitmapId": 370, "corners": [{"x": 14, "y": 31}, {"x": 119, "y": 13}], "deviations": [{"x": 68, "y": 19}]},
        {"bitmapId": 371, "corners": [{"x": 13, "y": 35}, {"x": 154.05620392967344, "y": 16}, {"x": 143.2578778628892, "y": 97.8710610685554}, {"x": 19, "y": 129}], "deviations": [{"x": 116, "y": 18}, {"x": 150, "y": 69}, {"x": 60, "y": 123}], "contains": [117, 370]},
        {"bitmapId": 372, "corners": [{"x": 12, "y": 9}, {"x": 57, "y": 61}], "deviations": [{"x": 15, "y": 52}]},
        {"bitmapId": 373, "corners": [{"x": 24, "y": 13}, {"x": 14, "y": 80.74197953834812}, {"x": 167.18757312877034, "y": 63}, {"x": 154, "y": 118}], "deviations": [{"x": 15, "y": 64}, {"x": 97, "y": 63}, {"x": 167, "y": 73}]},
        {"bitmapId": 374, "corners": [{"x": 29, "y": 11}, {"x": 32, "y": 144.71222092722414}, {"x": 321, "y": 111}], "deviations": [{"x": 34, "y": 51}, {"x": 72, "y": 133}]},
        {"bitmapId": 375, "corners": [{"x": 22, "y": 41}, {"x": 126.64564157863207, "y": 17.645641578632066}, {"x": 127.29730425719602, "y": 97}, {"x": 166.50741243696137, "y": 101.74629378151931}, {"x": 169, "y": 76}], "deviations": [{"x": 68, "y": 28}, {"x": 119, "y": 82}, {"x": 135, "y": 102}, {"x": 169, "y": 100}]},
        {"bitmapId": 376, "corners": [{"x": 18, "y": 22}, {"x": 28.340278189759562, "y": 161.34027818975957}, {"x": 211, "y": 177}], "deviations": [{"x": 20, "y": 142}, {"x": 68, "y": 174}]},
        {"bitmapId": 377, "corners": [{"x": 14, "y": 46}, {"x": 240, "y": 24.735078749843204}, {"x": 208, "y": 188}], "deviations": [{"x": 192, "y": 25}, {"x": 225, "y": 88}]},
        {"bitmapId": 378, "corners": [{"x": 18, "y": 37}, {"x": 191, "y": 13}], "deviations": [{"x": 150, "y": 16}]},
        {"bitmapId": 379, "corners": [{"x": 6, "y": 19}, {"x": 61, "y": 12.562117732263495}, {"x": 53, "y": 49.291810095175244}, {"x": 19, "y": 60}], "deviations": [{"x": 36, "y": 18}, {"x": 61, "y": 18}, {"x": 53, "y": 51}], "contains": [112, 8]},
        {"bitmapId": 380, "corners": [{"x": 5, "y": 39}, {"x": 222, "y": 13.96413803786999}, {"x": 212, "y": 64.35768231791121}, {"x": 28, "y": 101}], "deviations": [{"x": 104, "y": 24}, {"x": 215, "y": 40}, {"x": 148, "y": 86}], "contains": [381, 1]},
        {"bitmapId": 381, "corners": [{"x": 9, "y": 36}, {"x": 227.75663985851367, "y": 13.48672028297267}, {"x": 211, "y": 64}], "deviations": [{"x": 176, "y": 13}, {"x": 216, "y": 43}]},
        {"bitmapId": 382, "corners": [{"x": 9, "y": 19}, {"x": 131, "y": 26.800071699225004}, {"x": 18, "y": 169}], "deviations": [{"x": 45, "y": 26}, {"x": 68, "y": 125}]},
        {"bitmapId": 383, "corners": [{"x": 34, "y": 27}, {"x": 304, "y": 26}], "deviations": [{"x": 160, "y": 22}]},
        {"bitmapId": 384, "corners": [{"x": 23, "y": 312}, {"x": 255, "y": 27}], "deviations": [{"x": 61, "y": 250}]},
        {"bitmapId": 385, "corners": [{"x": 36, "y": 24}, {"x": 171.3501888811492, "y": 252.13358517486557}, {"x": 302, "y": 30}], "deviations": [{"x": 108, "y": 172}, {"x": 199, "y": 195}]},
        {"bitmapId": 386, "corners": [{"x": 25, "y": 24}, {"x": 289, "y": 289}], "deviations": [{"x": 112, "y": 177}]},
        {"bitmapId": 387, "corners": [{"x": 26, "y": 15}, {"x": 56, "y": 55}], "deviations": [{"x": 29, "y": 14}]}
    ];

    return params;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param ParamList
 * @param Param
 * @author Joshua McFarland
 */
define('collections/study/Params',[
    'ParamList',
    'models/study/Param'
], function(ParamList, Param) {
    /**
     * @class Params
     */
    var Params = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(ParamList);
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Param
    });

    return Params;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param Review
 * @author Joshua McFarland
 */
define('collections/study/Reviews',[
    'models/study/Review'
], function(Review) {
    /**
     * @class Reviews
     */
    var Reviews = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('add change', function(review) {
                review.cache();
            });
            this.on('remove', function(review) {
                skritter.storage.removeItems('reviews', review.id);
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Review,
        /**
         * @method comparator
         * @param {Backbone.Model} review
         */
        comparator: function(review) {
            return -review.get('id');
        },
        /**
         * @method includeContained
         * @param {Boolean} includContained
         * @returns {Number}
         */
        getCount: function(includContained) {
            if (includContained)
                return this.length;
            return this.where({bearTime: true}).length;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('reviews', function(reviews) {
                skritter.data.reviews.add(reviews, {merge:true, silent: true});
                callback();
            });
        },
        /**
         * @method post
         * @param {Function} callback
         */
        post: function(callback) {
            if (this.length > 0) {
                skritter.api.postReviews(this.toJSON(), function(reviews) {
                    reviews = (reviews) ? reviews : [];
                    console.log('POSTED REVIEWS', reviews);
                    skritter.data.reviews.remove(reviews);
                    callback(reviews.length);
                });
            } else {
                callback(0);
            }
        }
    });

    return Reviews;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/Scheduler',[],function() {
    /**
     * @class Scheduler
     */
    var Scheduler = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Scheduler.this = this;
            this.on('change:schedule', this.sort);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            history: [],
            schedule: []
        },
        /**
         * @method filter
         * @param {Object} attributes
         * @returns {Backbone.Model}
         */
        filter: function(attributes) {
            var parts = (attributes && attributes.parts) ? attributes.parts : skritter.user.getActiveParts();
            var styles = (attributes && attributes.styles) ? attributes.styles : skritter.user.getStyle();
            var ids = (attributes && attributes.ids) ? attributes.ids : null;
            var filteredSchedule = this.get('schedule').filter(function(item) {
                if (item.vocabIds.length === 0)
                    return false;
                if (ids) {
                    if (!_.contains(ids, item.id))
                        return false;
                } else {
                    if (!_.contains(parts, item.part))
                        return false;
                    if (styles.length > 0 && !_.contains(styles, item.style))
                        return false;
                }
                return true;
            });
            this.set('schedule', filteredSchedule, {silent: true});
            return this;
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            return this.get('schedule').filter(function(item) {
                if (item.readiness >= 1.0)
                    return true;
                return false;
            });
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
        },
        /**
         * Returns a calculated interval based on the grade and other details about the item.
         * 
         * @method getInterval
         * @param {StudyItem} item
         * @param {Number} grade
         * @returns {Number}
         */
        getInterval: function(item, grade) {
            var config = skritter.data.srsconfigs.findWhere({part: item.get('part')});
            var newInterval;
            var getRandomizedInterval = function(interval) {
                return Math.round(interval * (0.925 + (Math.random() * 0.15)));
            };
            //return new items with randomized default config values
            if (!item.has('last')) {
                switch (grade) {
                    case 1:
                        newInterval = config.get('initialWrongInterval');
                        break;
                    case 2:
                        newInterval = config.get('initialRightInterval') / 5;
                        break;
                    case 3:
                        newInterval = config.get('initialRightInterval');
                        break;
                    case 4:
                        newInterval = config.get('initialRightInterval') * 4;
                        break;
                }
                return getRandomizedInterval(newInterval);
            }
            //set values for further calculations
            var actualInterval = skritter.fn.getUnixTime() - item.get('last');
            var factor;
            var pctRight = item.get('successes') / item.get('reviews');
            var scheduledInterval = item.get('next') - item.get('last');
            //get the factor 
            if (grade === 2) {
                factor = 0.9;
            } else if (grade === 4) {
                factor = 3.5;
            } else {
                var factorsList = (grade === 1) ? config.get('wrongFactors') : config.get('rightFactors');
                var divisions = [2, 1200, 18000, 691200];
                var index;
                for (var i in divisions)
                {
                    if (item.get('interval') > divisions[i]) {
                        index = i;
                    }
                }
                factor = factorsList[index];
            }
            //adjust the factor based on readiness
            if (grade > 2) {
                factor -= 1;
                factor *= actualInterval / scheduledInterval;
                factor += 1;
            }
            //accelerate new items that appear to be known
            if (item.get('successes') === item.get('reviews') && item.get('reviews') < 5) {
                factor *= 1.5;
            }
            //decelerate hard items consistently marked wrong
            if (item.get('reviews') > 8) {
                if (pctRight < 0.5)
                    factor *= Math.pow(pctRight, 0.7);
            }
            //multiple by the factor and randomize the interval
            newInterval = getRandomizedInterval(item.get('interval') * factor);
            //bound the interval
            if (grade === 1) {
                if (newInterval > 604800) {
                    newInterval = 604800;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            } else {
                if (newInterval > 315569260) {
                    newInterval = 315569260;
                } else if (grade === 2 && newInterval < 300) {
                    newInterval = 300;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            }
            return newInterval;
        },
        /**
         * @method getNext
         * @param {Function} callback
         */
        getNext: function(callback) {
            loadItem();
            function loadItem() {
                //return nothing when no items have been loaded into the scheduler
                if (Scheduler.this.getItemCount() === 0) {
                    callback();
                    return;
                }
                var item = Scheduler.this.sort().get('schedule')[0];
                async.waterfall([
                    //load the base item
                    function(callback) {
                        skritter.data.items.load(item.id, function(item) {
                            if (item) {
                                callback(null, item);
                            } else {
                                callback("Base item doesn't exist.", null, null, []);
                            }
                        });
                    },
                    //load the associated vocab
                    function(item, callback) {
                        skritter.data.vocabs.load(item.getVocabId(), function(vocab) {
                            if (item) {
                                callback(null, item, vocab);
                            } else {
                                callback("Associated vocab doesn't exist.", null, null, []);
                            }
                        });
                    },
                    //load contained items for rune and tone
                    function(item, vocab, callback) {
                        var part = item.get('part');
                        if (part === 'rune' || part === 'tone') {
                            vocab.loadContainedItems(part, function(containedItems) {
                                callback(null, item, vocab, containedItems);
                            });
                        } else {
                            callback(null, item, vocab, []);
                        }
                    },
                    //load contained item vocabs
                    function(item, vocab, containedItems, callback) {
                        if (containedItems) {
                            var containedVocabIds = [];
                            for (var i in containedItems)
                                containedVocabIds.push(containedItems[i].getVocabId());
                            skritter.data.vocabs.load(containedVocabIds, function(containedVocabs) {
                                callback(null, item, vocab, containedItems, containedVocabs);
                            });
                        } else {
                            callback(null, item, vocab, containedItems);
                        }
                    },
                    //check for missing data and other possible errors
                    function(item, vocab, contained, containedVocabs, callback) {
                        var error = null;
                        if (item.get('part') === 'rune') {
                                var characters = vocab.getCharacters();
                                for (var i in characters)
                                    if (!skritter.data.strokes.get(characters[i]))
                                        error = "Missing stroke data.";
                        }
                        callback(error, item, vocab, contained);
                    }
                ], function(error, item, vocab, containedItems, containedVocabs) {
                    if (error) {
                        console.log(error, item);
                        Scheduler.this.remove(item.id);
                        loadItem();
                    } else {
                        callback(item, vocab, containedItems, containedVocabs);
                    }
                });
            }
        },
        /**
         * @method getItemCount
         * @returns {Number}
         */
        getItemCount: function() {
            return this.get('schedule').length;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getSchedule(function(schedule) {
                Scheduler.this.set('schedule', schedule).filter();
                callback();
            });
        },
        /**
         * @method remove
         * @param {String} id
         * @returns {Backbone.Model}
         */
        remove: function(id) {
            var index = _.findIndex(this.get('schedule'), {id: id});
            if (index > -1)
                this.get('schedule').splice(index, 1);
            return this;
        },
        /**
         * @method sort
         * @returns {Backbone.Model}
         */
        sort: function() {
            var now = skritter.fn.getUnixTime();
            var daysInSecond = 1 / 86400;
            //sort the schedule based on readiness value
            var sortedSchedule = _.sortBy(this.get('schedule'), function(item) {
                if (item.held && item.held > now) {
                    item.readiness = 1.0 + (now / item.held) * 0.1;
                    return -item.readiness;
                }
                if (!item.last && (item.next - now) > 600) {
                    item.readiness = 0.2;
                    return -item.readiness;
                }
                if (!item.last || (item.next - item.last) === 1) {
                    item.readiness = 90019001;
                    return -item.readiness;
                }
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                if (readiness > 0 && seenAgo > 9000) {
                    var dayBonus = 1;
                    var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * daysInSecond);
                    var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                    ageBonus *= readiness2 * readiness2;
                    readiness += ageBonus;
                }
                item.readiness = readiness;
                return -item.readiness;
            });
            this.set('schedule', sortedSchedule, {silent: true});
            return this;
        },
        /**
         * @method update
         * @param {Backbone.Model} item
         * @returns {Backbone.Model}
         */
        update: function(item) {
            var now = skritter.fn.getUnixTime();
            var id = item.get('id');
            var splitId = id.split('-');
            var condensedItem = {
                base: splitId[1] + '-' + splitId[2] + '-' + splitId[3],
                held: item.get('held'),
                id: id,
                last: item.get('last'),
                next: item.get('next'),
                part: item.get('part'),
                style: item.get('style'),
                vocabIds: item.get('vocabIds')
            };
            //updates the the direct item
            var index = _.findIndex(this.get('schedule'), {id: id});
            this.get('schedule')[index] = condensedItem;
            //updates indirect related items
            var relatedItemIds = item.getRelatedItemIds();
            for (var i in relatedItemIds) {
                var relatedIndex = _.findIndex(this.get('schedule'), {id: relatedItemIds[i]});
                if (relatedIndex > -1) {
                    var relatedItem = this.get('schedule')[relatedIndex];
                    relatedItem.held = now + 4 * 60 * 60;
                    this.get('schedule')[index] = relatedItem;
                }
            }
            return this;
        }
    });

    return Scheduler;
}); 
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/study/Sentence',[
    'PinyinConverter'
], function(PinyinConverter) {
    /**
     * @class Sentence
     */
    var Sentence = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('sentence', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getDefinition
         * @returns {String}
         */
        getDefinition: function() {
            var definition = this.get('definitions')[skritter.user.getSetting('sourceLang')];
            if (typeof definition === 'undefined')
                return this.get('definitions').en;
            if (definition)
                return definition;
            return null;
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return PinyinConverter.toTone(this.get('reading'));
        },
        /**
         * @method getWriting
         * @param {Booolean} whitespaces
         * @returns {String}
         */
        getWriting: function(whitespaces) {
            if (whitespaces)
                return this.get('writing');
            return this.get('writing').replace(/\s/g, '');
        }
    });

    return Sentence;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param Sentence
 * @author Joshua McFarland
 */
define('collections/study/Sentences',[
    'models/study/Sentence'
], function(Sentence) {
    /**
     * @class Sentences
     */
    var Sentences = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(sentence) {
                sentence.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Sentence,
        /**
         * @method insert
         * @param {Array} sentences
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(sentences, callback) {
            if (sentences) {
                skritter.data.sentences.add(sentences, {merge: true, silent: true});
                skritter.storage.setItems('sentences', sentences, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('sentences', function(sentences) {
                skritter.data.sentences.add(sentences, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Sentences;
});
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/study/SRSConfig',[],function() {
    /**
     * @class SRSConfigs
     */
    var SRSConfigs = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('srsconfigs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return SRSConfigs;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param {Model} SRSConfig
 * @author Joshua McFarland
 */
define('collections/study/SRSConfigs',[
    'models/study/SRSConfig'
], function(SRSConfig) {
    /**
     * @class SRSConfigs
     */
    var SRSConfigs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(srsconfig) {
                srsconfig.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: SRSConfig,
        /**
         * @method insert
         * @param {Array} srsconfigs
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(srsconfigs, callback) {
            if (srsconfigs) {
                skritter.data.srsconfigs.add(srsconfigs, {merge: true, silent: true});
                skritter.storage.setItems('srsconfigs', srsconfigs, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('srsconfigs', function(srsconfigs) {
                skritter.data.srsconfigs.add(srsconfigs, {merge:true, silent: true});
                callback();
            });
        }
    });

    return SRSConfigs;
});
/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define('models/study/Stroke',[],function() {
    /**
     * @class Stroke
     */
    var Stroke = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'rune',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('stroke', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return Stroke;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param Stroke
 * @author Joshua McFarland
 */
define('collections/study/Strokes',[
    'models/study/Stroke'
], function(Stroke) {
    /**
     * @class Strokes
     */
    var Strokes = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(stroke) {
                stroke.cache();
            });
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone1',
                strokes: [
                    [383, 0.20, 0.20, 0.6, 0.1, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone2',
                strokes: [
                    [384, 0.25, 0.25, 0.5, 0.5, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone3',
                strokes: [
                    [385, 0.15, 0.20, 0.7, 0.6, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone4',
                strokes: [
                    [386, 0.25, 0.25, 0.5, 0.5, 0.0]
                ]
            }));
            this.add(new Stroke().set({
                lang: 'zh',
                rune: 'tone5',
                strokes: [
                    [387, 0.40, 0.40, 0.20, 0.20, 0.0]
                ]
            }));
        },
        /**
         * @property {Stroke} model
         */
        model: Stroke,
        /**
         * @method insert
         * @param {Array} strokes
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(strokes, callback) {
            if (strokes) {
                skritter.data.strokes.add(strokes, {merge: true, silent: true});
                skritter.storage.setItems('strokes', strokes, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('strokes', function(strokes) {
                skritter.data.strokes.add(strokes, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Strokes;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/Sync',[],function() {
    /**
     * @class Sync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Sync.this = this;
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            active: false,
            addOffset: 0
        },
        /**
         * @method addItems
         * @param {Number} offset
         * @param {Number} limit
         * @param {Function} callback
         */
        addItems: function(offset, limit, callback) {
            var batchId = null;
            var requests = [
                {
                    path: 'api/v' + skritter.api.get('version') + '/items/add',
                    method: 'POST',
                    cache: false,
                    params: {
                        limit: limit,
                        offset: this.get('addOffset')
                    }
                }
            ];
            async.series([
                //request the new items using a batch request
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch) {
                        batchId = batch.id;
                        callback();
                    });
                },
                //start fetching the new items as they are completed
                function(callback) {
                    skritter.modal.setProgress(100, 'Getting Items');
                    getNext();
                    function getNext() {
                        skritter.api.getBatch(batchId, function(result) {
                            if (result) {
                                if (result.Items)
                                    console.log('ADDED ITEMS', result.Items);
                                window.setTimeout(function() {
                                    getNext();
                                }, 2000);
                            } else {
                                callback();
                            }
                        });
                    }
                },
                //run a fresh sync to get the new items and update
                function(callback) {
                    Sync.this.set('addOffset', Sync.this.get('addOffset') + 1);
                    if (Sync.this.isSyncing()) {
                        Sync.this.listenToOnce(Sync.this, 'complete', startSync);
                    } else {
                        startSync();
                    }
                    function startSync() {
                        Sync.this.full(offset, callback);
                    }
                },
                //reload the scheduler data
                function(callback) {
                    skritter.scheduler.loadAll(callback);
                }
            ], function(error) {
                if (error) {
                    if (typeof callback === 'function')
                        callback(error);
                } else {
                    if (typeof callback === 'function')
                        callback();
                }
            });
        },
        /**
         * @method full
         * @param {Number} offset
         * @param {Function} callback
         */
        full: function(offset, callback) {
            var batchId = null;
            this.set('active', true);
            var requests = [
                {
                    path: 'api/v' + skritter.api.get('version') + '/items',
                    method: 'GET',
                    params: {
                        sort: 'changed',
                        offset: offset,
                        include_vocabs: 'true',
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                },
                {
                    path: 'api/v' + skritter.api.get('version') + '/srsconfigs',
                    method: 'GET'
                }
            ];
            async.series([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch) {
                        batchId = batch.id;
                        callback();
                    });
                },
                function(callback) {
                    var totalSize = 0;
                    getNext();
                    function getNext() {
                        skritter.api.getBatch(batchId, function(result) {
                            if (result) {
                                async.series([
                                    async.apply(skritter.data.decomps.insert, result.Decomps),
                                    async.apply(skritter.data.items.insert, result.Items),
                                    async.apply(skritter.data.srsconfigs.insert, result.SRSConfigs),
                                    async.apply(skritter.data.sentences.insert, result.Sentences),
                                    async.apply(skritter.data.strokes.insert, result.Strokes),
                                    async.apply(skritter.data.vocabs.insert, result.Vocabs)
                                ], function() {
                                    totalSize += result.responseSize;
                                    if (totalSize > 1024)
                                        skritter.modal.setProgress(null, skritter.fn.bytesToSize(totalSize));
                                    window.setTimeout(function() {
                                        getNext();
                                    }, 2000);
                                });
                            } else {
                                callback();
                            }
                        });
                    }
                },
                function(callback) {
                    skritter.data.reviews.post(callback);
                }
            ], function() {
                Sync.this.set('active', false);
                Sync.this.triggerComplete();
                callback();
            });
        },
        /**
         * @method isSyncing
         */
        isSyncing: function() {
            if (this.get('active'))
                return true;
            return false;
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            this.trigger('complete');
        }
    });

    return Sync;
});
/**
 * @module Skritter
 * @submodule Model
 * @param CanvasCharacter
 * @param CanvasStroke
 * @param PinyinConverter
 * @author Joshua McFarland
 */
define('models/study/Vocab',[
    'collections/CanvasCharacter',
    'models/CanvasStroke',
    'PinyinConverter'
], function(CanvasCharacter, CanvasStroke, PinyinConverter) {
    /**
     * @class Vocab
     */
    var Vocab = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getCanvasCharacters
         * @param {Number} index
         * @param {String} part
         * @return {Array}
         */
        getCanvasCharacters: function(index, part) {
            var characters = [];
            var variations = [];
            var tones = null;
            var rune = this.getCharacters()[index - 1];
            if (part === 'tone') {
                tones = this.getReadingAt(index).tones;
                if (tones)
                    for (var i in tones)
                        variations.push(skritter.data.strokes.get('tone' + tones[i]).get('strokes'));
            } else {
                var strokeData = skritter.data.strokes.get(rune);
                if (strokeData)
                    variations = strokeData.get('strokes');
            }
            for (var v in variations) {
                var character = new CanvasCharacter();
                var strokes = variations[v];
                var position = 1;
                for (var s in strokes) {
                    var stroke = new CanvasStroke();
                    var bitmapId = parseInt(strokes[s][0], 10);
                    var params = skritter.data.params.findWhere({bitmapId: bitmapId});
                    character.name = (part === 'rune') ? rune : 'tone' + tones[v];
                    stroke.set({
                        bitmapId: bitmapId,
                        data: strokes[s],
                        id: position + '|' + bitmapId,
                        part: part,
                        position: position,
                        sprite: skritter.assets.getStroke(bitmapId)
                    });
                    if (params.has('contains')) {
                        stroke.set('contains', params.get('contains'));
                        position++;
                    }
                    position++;
                    character.add(stroke);
                }
                characters.push(character);
            }
            return characters;
        },
        getCharacterCount: function() {
            return this.getCharacters().length;
        },
        getCharacters: function(includeSpecial) {
            return this.get('writing').split('').filter(function(character) {
                if (includeSpecial)
                    return character;
                return !skritter.fn.isKana(character);
            });
        },
        getContainedItems: function(part) {
            var containedItems = [];
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds) {
                for (var i in containedVocabIds) {
                    var containedItemId = null;
                    if (part === 'rune') {
                        containedItemId = skritter.user.get('user_id') + '-' + containedVocabIds[i] + '-' + part;
                    } else {
                        containedItemId = skritter.user.get('user_id') + '-' + containedVocabIds[i] + '-' + part;
                        containedItemId =  containedItemId.split('-');
                        containedItemId[3] = '0';
                        containedItemId = containedItemId.join('-');
                    }
                    var containedItem = skritter.data.items.get(containedItemId);
                    if (containedItem)
                        containedItems.push(containedItem);
                }
            }
            return containedItems;
        },
        getDecomps: function(returnDuplicates) {
            if (this.getCharacterCount() > 1)
                return false;
            var writings = [];
            var decomp = skritter.data.decomps.get(this.getCharacters()[0]);
            if (decomp && decomp.has('atomic')) {
                var children = decomp.get('Children');
                if (returnDuplicates)
                    return children;
                return children.filter(function(child) {
                    for (var i in writings)
                        if (writings[i] === child.writing)
                            return false;
                    writings.push(child.writing);
                    return true;
                });
            }
        },
        getDefinition: function() {
            //TODO: allow for definition images with proper css styling
            //.replace(/img:(http:\/\/\S+)/gi, '<img src="$1"/>')
            //.replace(/_([^ _][^_]*)_(?!\S{4})/gi, '<em>$1</em>')
            //.replace(/\n/gi, '<br/>')
            //.replace(/\*([^*]+)\*/gi, '<b>$1</b>');
            var definition = this.get('definitions')[skritter.user.getSetting('sourceLang')];
            if (typeof definition === undefined)
                definition = this.get('definitions').en;
            if (definition)
                return definition.replace(/img:(http:\/\/\S+)/gi, '');
            return null;
        },
        /**
         * @method getFontName
         * @returns {String}
         */
        getFontName: function() {
            if (this.get('lang') === 'zh')
                return 'simkai';
            return 'kaisho';
        },
        getReading: function() {
            return PinyinConverter.toTone(this.get('reading'));
        },
        /**
         * Gets a broken down reading object based on its position in the character if its
         * more than a single character item.
         * 
         * @method getReadingAt
         * @param {Number} position
         * @returns {Object}
         */
        getReadingAt: function(position) {
            var reading, syllable, tones;
            position = (position > 1) ? position - 1 : 0;
            reading = this.get('reading').toLowerCase().replace(' ... ', '').replace("'", '');
            if (this.getCharacterCount() === 1) {
                syllable = reading.replace(/[0-9]+/g, '').replace(/\s/g, '').split(',');
                tones = reading.replace(/[a-z]+/g, '').replace(/\s/g, '').split(',').map(function(tone) {
                    return parseInt(tone, 10);
                });
                return {reading: reading, syllable: syllable, tones: tones};
            }
            syllable = _.without(reading.split(/[0-9]+/g), '')[position].split(',');
            tones = _.without(reading.split(/[a-z]+/g), '')[position].split(',').map(function(tone) {
                return parseInt(tone, 10);
            });
            return {reading: syllable + tones, syllable: syllable, tones: tones};
        },
        /**
         * @method getReadingHTML
         * @param {Number} position
         * @param {Boolean} reveal
         * @param {Boolean} hidden
         * @returns {DOMElement}
         */
        getReadingDisplay: function(position, reveal, hidden) {
            var element = '';
            var characterCount = this.getCharacterCount();
            element += "<div class='prompt-reading-display'>";
            for (var i = 1; i <= characterCount; i++) {
                if (hidden) {
                    if (position > i) {
                        element += "<span id='reading-" + i + "' class='prompt-reading-show'>" + PinyinConverter.toTone(this.getReadingAt(i).reading) + "</span>";
                    } else {
                        element += "<span id='reading-" + i + "' class='btn btn-default btn-xs hidden-reading'>show</span>";
                        break;
                    }
                } else {
                    if (position > i) {
                        element += "<span id='reading-" + i + "' class='prompt-reading-show'>" + PinyinConverter.toTone(this.getReadingAt(i).reading) + "</span>";
                    } else if (position === i && reveal) {
                        element += "<span id='reading-" + i + "' class='prompt-reading-hide'>" + PinyinConverter.toTone(this.getReadingAt(i).reading) + "</span>";
                    } else if (position === i) {
                        element += "<span id='reading-" + i + "' class='prompt-reading-hide'>" + this.getReadingAt(i).syllable + "</span>";
                    } else {
                        element += "<span id='reading-" + i + "' class='prompt-reading-show'>" + this.getReadingAt(i).syllable + "</span>";
                    }
                }
            }
            element += "</div>";
            return element;
        },
        getSentence: function() {
            var sentence = skritter.data.sentences.findWhere({id: this.get('sentenceId')});
            return (sentence) ? sentence : null;
        },
        /**
         * @method getTextStyleClass
         * @returns {String}
         */
        getTextStyleClass: function() {
            if (this.get('lang') === 'zh')
                return 'chinese-text';
            return 'japanese-text';
        },
        /**
         * @method getWritingHTML
         * @param {Number} position
         * @returns {DOMElement}
         */
        getWritingDisplay: function(position) {
            position = (position) ? position - 1 : 0;
            var element = '';
            var characterPosition = 0;
            var characters = this.getCharacters(true);
            element += "<div class='prompt-writing-display'>";
            for (var i = 0; i < characters.length; i++) {
                if (skritter.fn.isKana(characters[i])) {
                    element += "<span id='writing-" + i + "' class='prompt-writing-show'>" + characters[i] + "</span>";
                } else {
                    if (position > characterPosition) {
                        element += "<span id='writing-" + i + "' class='prompt-writing-show'>" + characters[i] + "</span>";
                    } else {
                        element += "<span class='prompt-underline'><span id='writing-" + i + "' class='prompt-writing-hide'>" + characters[i] + "</span></span>";
                    }
                    characterPosition++;
                }
            }
            element += "</div>";
            return element;
        },
        /**
         * Loads and returns the contained items as a callback based on the specified 
         * part and contained vocab ids.
         * 
         * @method loadContainedItems
         * @param {String} part
         * @param {Function} callback
         */
        loadContainedItems: function(part, callback) {
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds) {
                var containedItemIds = [];
                for (var i in containedVocabIds)
                    if (part === 'rune') {
                        containedItemIds.push(skritter.user.get('user_id') + '-' + containedVocabIds[i] + '-' + part);
                    } else {
                        var containedItemId = null;
                        containedItemId = skritter.user.get('user_id') + '-' + containedVocabIds[i] + '-' + part;
                        containedItemId = containedItemId.split('-');
                        containedItemId[3] = '0';
                        containedItemId = containedItemId.join('-');
                        containedItemIds.push(containedItemId);
                    }
                skritter.storage.getItems('items', containedItemIds, function(items) {
                    callback(skritter.data.items.add(items, {merge: true, silent: true}));
                });
            } else {
                callback([]);
            }
        },
        /**
         * @method loadContainedVocabs
         * @param {Function} callback
         */
        loadContainedVocabs: function(callback) {
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds) {
                skritter.storage.getItems('vocabs', containedVocabIds, function(vocabs) {
                    callback(skritter.data.vocabs.add(vocabs, {merge: true, silent: true}));
                });
            } else {
                callback([]);
            }
        },
        /**
         * @method play
         */
        play: function() {
            if (this.has('audio'))
                skritter.assets.getAudio(this.get('audio').replace('/sounds?file=', ''));
        },
        /**
         * @method spawnVirtualItems
         * @param {Array} parts
         * @returns {Backbone.Collection}
         */
        spawnVirtualItems: function(parts) {
            if (this.get('lang') === 'zh') {
                parts = (parts) ? parts : ['defn', 'rdng', 'rune', 'tone'];
            } else {
                parts = (parts) ? parts : ['defn', 'rdng', 'rune'];
            }
            var items = [];
            var vocabId = this.get('id');
            for (var i in parts)
                items.push(new StudyItem({
                    id: skritter.user.get('user_id') + '-' + vocabId + '-' + parts[i],
                    part: parts[i],
                    reviews: 0,
                    vocabIds: [vocabId]
                }));
            return items;
        }
    });

    return Vocab;
}); 
/**
 * @module Skritter
 * @submodule Collection
 * @param Vocab
 * @author Joshua McFarland
 */
define('collections/study/Vocabs',[
    'models/study/Vocab'
], function(Vocab) {
    /**
     * @class Vocabs
     */
    var Vocabs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Vocabs.this = this;
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property {Vocab} model
         */
        model: Vocab,
        /**
         * @method insert
         * @param {Array} vocabs
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(vocabs, callback) {
            if (vocabs) {
                skritter.data.vocabs.add(vocabs, {merge: true, silent: true});
                skritter.storage.setItems('vocabs', vocabs, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method load
         * @param {String} id
         * @param {Function} callback
         */
        load: function(id, callback) {
            var vocab = this.get(id);
            if (vocab) {
                callback(vocab);
            } else {
                skritter.storage.getItems('vocabs', id, function(item) {
                    callback(Vocabs.this.add(item, {merge: true, silent: true})[0]);
                });
            }
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocabs', function(vocabs) {
                skritter.data.vocabs.add(vocabs, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Vocabs;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('models/VocabList',[],function() {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.this = this;
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            skritter.api.getVocabList(this.id, function(list) {
                list = VocabList.this.set(list);
                if (typeof callback === 'function')
                    callback(list);
            });
        }
    });
    
    return VocabList;
});
/**
 * @module Skritter
 * @param VocabList
 * @author Joshua McFarland
 */
define('collections/VocabLists',[
    'models/VocabList'
], function(VocabList) {
    /**
     * class VocabLists
     */
    var VocabLists = Backbone.Collection.extend({
        initialize: function() {
            VocabLists.this = this;
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList,
        /**
         * @method load
         * @param {String} sort
         * @param {Object} fieldNameMap
         * @param {Function} callback
         */
        load: function(sort, fieldNameMap, callback) {
            var fieldNames = Object.keys(fieldNameMap);
            if (fieldNames.indexOf('id'))
                fieldNames.push('id');
            skritter.api.getVocabLists(sort, fieldNames, function(lists) {
                if (lists.status === 404) {
                    if (typeof callback === 'function')
                        callback();
                } else {
                    lists = VocabLists.this.add(lists, {merge: true});
                    if (typeof callback === 'function')
                        callback(lists);
                }
            });
        }
    });
    
    return VocabLists;
});
/**
 * @module Skritter
 * @submodule Model
 * @param Decomps
 * @param Items
 * @param Params
 * @param Reviews
 * @param Scheduler
 * @param Sentences
 * @param SRSConfigs
 * @param Strokes
 * @param Sync
 * @param Vocabs
 * @author Joshua McFarland
 */
define('models/User',[
    'collections/study/Decomps',
    'collections/study/Items',
    'collections/study/Params',
    'collections/study/Reviews',
    'models/Scheduler',
    'collections/study/Sentences',
    'collections/study/SRSConfigs',
    'collections/study/Strokes',
    'models/Sync',
    'collections/study/Vocabs',
    'collections/VocabLists'
], function(Decomps, Items, Params, Reviews, Scheduler, Sentences, SRSConfigs, Strokes, Sync, Vocabs, VocabLists) {
    /**
     * @class User
     */
    var User = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            User.this = this;
            //initializes all of the required data collections
            skritter.data = {
                decomps: new Decomps(),
                items: new Items(),
                params: new Params(),
                reviews: new Reviews(),
                srsconfigs: new SRSConfigs(),
                sentences: new Sentences(),
                strokes: new Strokes(),
                vocabs: new Vocabs()
            };
            //initialize the user lists separate from study data
            skritter.lists = new VocabLists();
            //loads the user from localStorage if exists
            if (localStorage.getItem('activeUser')) {
                try {
                    this.set(JSON.parse(localStorage.getItem(localStorage.getItem('activeUser'))));
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        localStorage.removeItem(localStorage.getItem('activeUser'));
                        localStorage.removeItem('activeUser');
                    }
                }
            }
            //performs special loading tasks when user is logged in
            if (this.isLoggedIn()) {
                skritter.api.set('token', this.get('access_token'));
                skritter.scheduler = new Scheduler();
                skritter.sync = new Sync();
            }
            //stores user settings to localStorage as they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            access_token: null,
            audio: false,
            autoSync: true,
            autoSyncThreshold: 10,
            expires_in: null,
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune'],
            lastLogin: null,
            lastSyncChinese: null,
            lastSyncJapanese: null,
            refresh_token: null,
            settings: {},
            token_type: null,
            user_id: 'guest'
        },
        /**
         * @method cache
         */
        cache: function() {
            if (this.isLoggedIn())
                localStorage.setItem(this.get('user_id'), JSON.stringify(this));
        },
        /**
         * @method addItems
         * @param {Number} limit
         * @param {Function} callback
         */
        addItems: function(limit, callback) {
            limit = (limit) ? limit : 1;
            skritter.sync.addItems(this.getLastSync(), limit, callback);
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            if (this.isLoggedIn())
                skritter.api.getUser(this.get('user_id'), function(data) {
                    User.this.set('settings', data);
                    callback(data);
                });
        },
        /**
         * Returns an array of active parts based on the current language being studied.
         * 
         * @method getActiveParts
         * @returns {Array}
         */
        getActiveParts: function() {
            if (this.isChinese())
                return this.get('filterChineseParts');
            return this.get('filterJapaneseParts');
        },
        /**
         * Gets the users current avatar and returns it as an image tag using base64 data.
         * 
         * @method getAvatar
         * @param {String} classes
         * @returns {Image} Returns a base64 image tag
         */
        getAvatar: function(classes) {
            if (classes)
                return "<img src='data:image/png;base64," + this.getSetting('avatar') + "' + class='" + classes + "' />";
            return "<img src='data:image/png;base64," + this.getSetting('avatar') + "' />";
        },
        /**
         * Mainly used on tone prompts to determine which font to draw the character from, but
         * it returns the name of the font based on the current target language.
         * 
         * @method getFontName
         * @returns {String}
         */
        getFontName: function() {
            if (this.isChinese())
                return 'simkai';
            return 'kaisho';
        },
        getLastSync: function() {
            var lastSync = (this.isChinese()) ? this.get('lastSyncChinese') : this.get('lastSyncJapanese');
            if (lastSync)
                return lastSync;
            return 0;
        },
        /**
         * A shortcut method for getting user server settings.
         * 
         * @method getSetting
         * @param {String} name
         * @return {Object}
         */
        getSetting: function(name) {
            return this.get('settings')[name];
        },
        /**
         * Returns the current style which really only applies to Chinese as both,
         * simplified or traditional.
         * 
         * @method getStyle
         * @returns {Array}
         */
        getStyle: function() {
            if (this.isJapanese()) {
                return [];
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && this.getSetting('reviewTraditional')) {
                return ['both', 'simp', 'trad'];
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && !this.getSetting('reviewTraditional')) {
                return ['both', 'simp'];
            } else {
                return ['both', 'trad'];
            }
        },
        /**
         * @method getStyleString
         * @returns {String}
         */
        getStyleString: function() {
            if (this.isJapanese()) {
                return 'all';
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && this.getSetting('reviewTraditional')) {
                return 'both';
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && !this.getSetting('reviewTraditional')) {
                return 'simp';
            } else {
                return 'trad';
            }
        },
        /**
         * @method getTextStyle
         * @returns {String}
         */
        getTextStyle: function() {
            if (this.isChinese())
                return 'chinese-text';
            return 'japanese-text';
        },
        /**
         * Returns true if the target language is set to Chinese.
         * 
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            if (this.getSetting('targetLang') === 'zh')
                return true;
            return false;
        },
        /**
         * Returns true if the target language is set to Japanese.
         * 
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            if (this.getSetting('targetLang') === 'ja')
                return true;
            return false;
        },
        /**
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            if (this.get('access_token'))
                return true;
            return false;
        },
        loadData: function(callback) {
            async.series([
                async.apply(skritter.data.decomps.loadAll),
                async.apply(skritter.data.reviews.loadAll),
                async.apply(skritter.scheduler.loadAll),
                async.apply(skritter.data.sentences.loadAll),
                async.apply(skritter.data.srsconfigs.loadAll),
                async.apply(skritter.data.strokes.loadAll)
            ], function() {
                callback();
            });
        },
        login: function(username, password, callback) {
            skritter.api.authenticateUser(username, password, function(result) {
                if (result.statusCode === 200) {
                    User.this.set(result);
                    skritter.api.set('token', result.access_token);
                    User.this.fetch(function() {
                        skritter.storage.openDatabase(skritter.user.get('user_id'), function() {
                            localStorage.setItem('activeUser', result.user_id);
                            User.this.set('lastLogin', skritter.fn.getUnixTime());
                            callback(result);
                        });
                    });
                } else {
                    callback(result);
                }
            });
        },
        logout: function() {
            if (this.isLoggedIn()) {
                skritter.modal.show().setBody('Logging Out').noHeader();
                skritter.storage.deleteDatabase(function() {
                    localStorage.removeItem('activeUser');
                    document.location.reload(true);
                });
            }
        },
        /**
         * @method setActiveParts
         * @param {Array} parts
         */
        setActiveParts: function(parts) {
            if (skritter.user.isChinese()) {
                this.set('filterChineseParts', parts);
            } else {
                this.set('filterJapaneseParts', parts);
            }
        },
        /**
         * @method setLastSync
         * @param {Number} time
         * @returns {Number}
         */
        setLastSync: function(time) {
            time = (time) ? time : skritter.fn.getUnixTime();
            if (this.isChinese()) {
                this.set('lastSyncChinese', time);
            } else {
                this.set('lastSyncJapanese', time);
            }
            return time;
        },
        /**
         * A shortcut method for changing user server settings.
         * 
         * @method setSetting
         * @param {String} name
         * @param {String} value
         * @return {Backbone.Model}
         */
        setSetting: function(name, value) {
            var settings = this.get('settings');
            settings[name] = value;
            this.set('settings', settings);
            return this;
        },
        /**
         * @method sync
         * @param {Function} callback
         * @returns {Backbone.Model}
         */
        sync: function(callback) {
            if (!skritter.sync.isSyncing()) {
                skritter.sync.full(this.getLastSync(), function(error) {
                    if (!error)
                        User.this.setLastSync();
                    if (typeof callback === 'function')
                        callback(error);
                });
            } else {
                if (typeof callback === 'function')
                    callback();
            }
        },
        /**
         * A shortcut method for removing user server settings.
         * 
         * @method unsetSetting
         * @param {String} name
         * return {Object}
         */
        unsetSetting: function(name) {
            var settings = this.get('settings');
            delete settings[name];
            this.set('settings', settings);
            return settings;
        }
    });

    return User;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define('Application',[
    'models/Api',
    'models/Assets',
    'Functions',
    'models/storage/IndexedDBAdapter',
    'Log',
    'views/components/Modal',
    'Router',
    'models/Settings',
    'views/components/Timer',
    'models/User'
], function(Api, Assets, Functions, IndexedDBAdapter, Log, Modal, Router, Settings, Timer, User) {
    /**
     * Creates the global skritter namescape.
     * @param skritter
     */
    window.skritter = (function(skritter) {
        return skritter;
    })(window.skritter || {});    
    /**
     * @method initialize
     */
    var initialize = function() {
        async.series([
            async.apply(loadApi),
            async.apply(loadAssets),
            async.apply(loadFunctions),
            async.apply(loadLog),
            async.apply(loadModal),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadTimer),
            async.apply(loadUser),
            async.apply(loadRouter)
        ], function() {
            console.log('application initialized');
        });
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadApi = function(callback) {
        skritter.api = new Api();
        callback();
    };
    /**
     * @method loadAssets
     * @param {Function} callback
     */
    var loadAssets = function(callback) {
        skritter.assets = new Assets();
        callback();
    };
    /**
     * @method loadFunctions
     * @param {Function} callback
     */
    var loadFunctions = function(callback) {
        skritter.fn = Functions;
        callback();
    };
    /**
     * @method loadLog
     * @param {Function} callback
     */
    var loadLog = function(callback) {
        skritter.log = new Log();
        callback();
    };
    /**
     * @method loadModal
     * @param {Function} callback
     */
    var loadModal = function(callback) {
        skritter.modal = new Modal().render();
        callback();
    };
    /**
     * @method loadRouter
     * @param {Function} callback
     */
    var loadRouter = function(callback) {
        Router.initialize();
        callback();
    };
    /**
     * @method loadSettings
     * @param {Function} callback
     */
    var loadSettings = function(callback) {
        skritter.settings = new Settings();
        callback();
    };
    /**
     * @method loadStorage
     * @param {Function} callback
     */
    var loadStorage = function(callback) {
        skritter.storage = new IndexedDBAdapter();
        callback();
    };
    /**
     * @method timer
     * @param {Function} callback
     */
    var loadTimer = function(callback) {
        skritter.timer = new Timer();
        callback();
    };
    /**
     * @method loadUser
     * @param {Function} callback
     */
    var loadUser = function(callback) {
        skritter.user = new User();
        if (skritter.user.isLoggedIn()) {
            skritter.modal.show('progress').setTitle('Loading Data').setProgress(100, '');
            async.series([
                async.apply(skritter.storage.openDatabase, skritter.user.get('user_id')),
                async.apply(skritter.user.loadData),
                function(callback) {
                    if (skritter.user.getLastSync() === 0) {
                        skritter.modal.setTitle('Initial Download').setProgress(100, '');
                        skritter.user.sync(function() {
                            skritter.scheduler.loadAll(function() {
                                callback();
                            });
                        });
                    } else {
                        skritter.user.sync();
                        callback();
                    }
                }
            ], function() {
                window.setTimeout(function() {
                    skritter.modal.hide();
                }, 500);
                callback();
            });
        } else {
            callback();
        }
    };
    
    return {
        initialize: initialize
    };
});