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
            VocabListsTable.fields = (fields) ? fields : [];
            VocabListsTable.sort = (sort) ? sort : 'studying';
            this.render();
            this.loadLists();
        },
        loadLists: function(callback) {
            var fieldNames = ['id'];
            for (var field in VocabListsTable.fields)
                fieldNames.push(field);
            skritter.api.getVocabLists(VocabListsTable.sort, _.uniq(fieldNames.join(',')), function(lists) {
                var divHead = '';
                var divBody = '';
                VocabListsTable.this.$('#lists-message').hide();
                VocabListsTable.this.$('.loader').show();
                VocabListsTable.this.$('thead').html(divHead);
                VocabListsTable.this.$('tbody').html(divBody);
                if (lists.status === 404) {
                    VocabListsTable.this.$('#lists-message').show().text("Unable to load lists due to being offline.");
                } else if (lists.length > 0) {
                    var activeCount = 0;
                    //create the html for column header
                    divHead += "<tr>";
                    for (var a in VocabListsTable.fields)
                        divHead += "<th>" + VocabListsTable.fields[a] + "</th>";
                    divHead += "</tr>";
                    //create the html for the table rows
                    for (var b in lists) {
                        var list = lists[b];
                        if (list.studyingMode) {
                            if (list.studyingMode === 'adding' || list.studyingMode === 'reviewing') {
                                divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                                for (var c in VocabListsTable.fields) {
                                    if (c === 'studyingMode') {
                                        if (list.studyingMode === 'adding') {
                                            divBody += "<td class='vocablist-studyingMode'>Adding</td>";
                                        } else {
                                            divBody += "<td class='vocablist-studyingMode'>Paused</td>";
                                        }
                                    } else {
                                        divBody += "<td class='vocablist-field-" + c + "'>" + list[c] + "</td>";
                                    }
                                }
                                divBody += "</tr>";
                                activeCount++;
                            }
                        }
                    }
                    if (activeCount === 0)
                        VocabListsTable.this.$('#lists-message').show().text("All of your lists have been added into your studies.");
                } else {
                    VocabListsTable.this.$('#lists-message').show().text("You haven't added any lists yet!");
                }
                VocabListsTable.this.$('thead').html(divHead);
                VocabListsTable.this.$('tbody').html(divBody);
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