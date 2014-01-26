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
            VocabListsTable.filterStatus = null;
            VocabListsTable.sort = 'studying';
            VocabListsTable.sortByField = null;
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
            'click.VocabListsTable #vocablists-table-view tbody .vocablist-field-name': 'selectList',
            'click.VocabListsTable #vocablists-table-view tbody .vocablist-studyingMode': 'toggleListStatus'
        },
        /**
         * @method load
         * @param {String} sort
         * @param {String} fields
         * @param {String} sortByField
         * @param {Array} filterStatus
         */
        load: function(sort, fields, sortByField, filterStatus) {
            VocabListsTable.fields = (fields) ? fields : [];
            VocabListsTable.filterStatus = (filterStatus) ? filterStatus : null;
            VocabListsTable.sort = (sort) ? sort : 'studying';
            VocabListsTable.sortByField = (sortByField) ? sortByField : null;
            this.render();
            this.loadLists();
        },
        /**
         * @method loadLists
         * @param {Function} callback
         */
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
                    if (VocabListsTable.sortByField)
                        lists = _.sortBy(lists, VocabListsTable.sortByField);
                    //create the html for column header
                    divHead += "<tr>";
                    for (var a in VocabListsTable.fields)
                        divHead += "<th>" + VocabListsTable.fields[a] + "</th>";
                    divHead += "</tr>";
                    //create the html for the table rows
                    for (var b in lists) {
                        var list = lists[b];
                        if (list.studyingMode) {
                            if (!VocabListsTable.filterStatus || _.contains(VocabListsTable.filterStatus, list.studyingMode)) {
                                divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                                for (var c in VocabListsTable.fields) {
                                    if (c === 'studyingMode') {
                                        switch (list.studyingMode) {
                                            case 'adding':
                                                divBody += "<td class='vocablist-studyingMode'>Adding</td>";
                                                break;
                                            case 'reviewing':
                                                divBody += "<td class='vocablist-studyingMode'>Paused</td>";
                                                break;
                                            case 'finished':
                                                divBody += "<td class='vocablist-studyingMode'>Finished</td>";
                                                break;
                                            case 'not studying':
                                                divBody += "<td class='vocablist-studyingMode'>Not Studying</td>";
                                                break;
                                        }
                                        if (list.studyingMode === 'adding') {
                                            
                                        } else {
                                            
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
         * @method selectList
         * @param {Object} event
         */
        selectList: function(event) {
            event.preventDefault();
            var listId = event.currentTarget.parentElement.id.replace('list-', '');
            skritter.router.navigate('vocabs/lists/' + listId, {trigger: true});
        },
        /**
         * @method toggleListStatus
         * @param {type} event
         */
        toggleListStatus: function(event) {
            console.log(event);
            var listId = event.currentTarget.parentElement.id.replace('list-', '');
            var status = (event.currentTarget.parentElement.children[1].innerText === 'Adding') ? 'reviewing' : 'adding';
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