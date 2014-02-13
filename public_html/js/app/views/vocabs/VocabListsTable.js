/**
 * @module Skritter
 * @param templateVocabListsTable
 * @author Joshua McFarland
 */
define([
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
            VocabListsTable.loading = false;
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
            VocabListsTable.this.$('table thead').html(divHead);
            VocabListsTable.this.$('table tbody').html(divBody);
            //generates the header section of the table
            divHead += "<tr>";
            for (var a in VocabListsTable.fieldNameMap)
                divHead += "<th>" + VocabListsTable.fieldNameMap[a] + "</th>";
            divHead += "</tr>";
            //checks whether lists were returned and if any of them were active
            if (!VocabListsTable.lists && !VocabListsTable.loading) {
                VocabListsTable.this.$('#message').show().text("Unable to load lists due to being offline.");
            } else if (VocabListsTable.lists && VocabListsTable.lists.length === 0 && !VocabListsTable.loading) {
                VocabListsTable.this.$('#message').show().text("You haven't added any lists yet!");
            } else {
                //generates the body section of the table
                for (var b in VocabListsTable.lists) {
                    var list = VocabListsTable.lists[b];
                    divBody += "<tr id='list-" + list.id + "' class='cursor'>";
                    for (var field in VocabListsTable.fieldNameMap) {
                        var fieldValue = list.get(field);
                        if (field === 'studyingMode') {
                            if (fieldValue === 'not studying') {
                                divBody += "<td class='list-field-" + field + "'><span class='fa fa-circle-o'></span></td>";
                            } else if (fieldValue === 'finished') {
                                divBody += "<td class='list-field-" + field + "'><span class='fa fa-circle'></span></td>";
                            } else {
                                divBody += "<td class='list-field-" + field + "'><span class='fa fa-dot-circle-o'></span></td>";
                            }
                        } else {
                            divBody += "<td class='list-field-" + field + "'>" + fieldValue + "</td>";
                        }
                    }
                    divBody += "</tr>";
                }
            }
            VocabListsTable.this.$('table thead').html(divHead);
            VocabListsTable.this.$('table tbody').html(divBody);
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
            VocabListsTable.lists = [];
            VocabListsTable.loading = true;
            VocabListsTable.this.$('#loader').show();
            VocabListsTable.this.render();
            skritter.lists.load(sortType, fieldNameMap, function(lists) {
                lists = lists.filter(function(list) {
                    if (!filterStatus || _.contains(filterStatus, list.get('studyingMode')))
                        return true;
                });
                VocabListsTable.lists = lists;
                VocabListsTable.loading = false;
                VocabListsTable.this.render();
                VocabListsTable.this.$('#loader').hide();
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