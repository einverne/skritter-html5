/**
 * @module Skritter
 * @param templateVocabListsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/component-vocablists-table.html'
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
            VocabListsTable.fields = null;
            VocabListsTable.sort = 'studying';
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListsTable);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.VocabListsTable #vocablists-table-view tbody tr': 'toggleList'
        },
        /**
         * @method load
         * @param {String} sort
         * @param {String} fields
         */
        load: function(sort, fields) {
            VocabListsTable.fields = (fields) ? fields : null;
            VocabListsTable.sort = (sort) ? sort : 'studying';
            this.loadLists();
        },
        loadLists: function(callback) {
            skritter.api.getVocabLists('studying', 'id,name,studyingMode', function(lists) {
                var div = '';
                VocabListsTable.this.$('#lists-message').hide();
                VocabListsTable.this.$('.loader').show();
                VocabListsTable.this.$('tbody').html(div);
                if (lists.status === 404) {
                    VocabListsTable.this.$('#lists-message').show().text("Unable to load lists due to being offline.");
                } else if (lists.length > 0) {
                    var activeCount = 0;
                    for (var i in lists) {
                        var list = lists[i];
                        if (list.studyingMode) {
                            if (list.studyingMode === 'adding' || list.studyingMode === 'reviewing') {
                                div += "<tr id='list-" + list.id + "' class='cursor'>";
                                div += "<td>" + list.name + "</td>";
                                if (list.studyingMode === 'adding') {
                                    div += "<td class='vocablist-status'>Adding</td>";
                                } else {
                                    div += "<td class='vocablist-status'>Paused</td>";
                                }
                                div += "</tr>";
                                activeCount++;
                            }
                        }
                    }
                    if (activeCount === 0)
                        VocabListsTable.this.$('#lists-message').show().text("All of your lists have been added into your studies.");
                } else {
                    VocabListsTable.this.$('#lists-message').show().text("You haven't added any lists yet!");
                }
                VocabListsTable.this.$('tbody').html(div);
                VocabListsTable.this.$('.loader').hide();
                if (typeof callback === 'function')
                    callback(lists);
            });
        },
        /**
         * @method toggleList
         * @param {type} event
         * @returns {undefined}
         */
        toggleList: function(event) {
            var listId = event.currentTarget.id.replace('list-', '');
            var status = (event.currentTarget.children[1].innerText === 'Adding') ? 'reviewing' : 'adding';
            VocabListsTable.this.$('.loader').show();
            VocabListsTable.this.$('tbody').html('');
            skritter.api.updateVocabList({
                id: listId,
                studyingMode: status
            }, function() {
                VocabListsTable.this.loadLists();
            });
        }
    });
    
    return VocabListsTable;
});