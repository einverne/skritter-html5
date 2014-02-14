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
            VocabListsTable.filterByAttribute = null;
            VocabListsTable.lists = [];
            VocabListsTable.loading = false;
            VocabListsTable.sortByAttribute = null;
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
            var lists = (VocabListsTable.lists.length > 0) ? VocabListsTable.lists.clone() : VocabListsTable.lists;
            if (VocabListsTable.filterByAttribute) {
                var filterByAttribute = VocabListsTable.filterByAttribute;
                lists = VocabListsTable.lists.filterByAttribute(filterByAttribute.attribute, filterByAttribute.value);
            }
            if (VocabListsTable.sortByAttribute) {
                var sortByAttribute = VocabListsTable.sortByAttribute;
                lists = lists.sortByAttribute(sortByAttribute.attribute, sortByAttribute.order);
            }
            VocabListsTable.this.$('#message').text('');
            VocabListsTable.this.$('table thead').html(divHead);
            VocabListsTable.this.$('table tbody').html(divBody);
            //generates the header section of the table
            divHead += "<tr>";
            for (var a in VocabListsTable.fieldNameMap)
                divHead += "<th>" + VocabListsTable.fieldNameMap[a] + "</th>";
            divHead += "</tr>";
            //checks whether lists were returned and if any of them were active
            if (!lists && !VocabListsTable.loading) {
                VocabListsTable.this.$('#message').show().text("Unable to load lists due to being offline.");
            } else if (lists && lists.length === 0 && !VocabListsTable.loading) {
                VocabListsTable.this.$('#message').show().text("You haven't added any lists yet!");
            } else {
                //generates the body section of the table
                for (var b in lists.models) {
                    var list = lists.at(b);
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
         * @method filterByAttribute
         * @param {String} attribute
         * @param {String} value
         * @returns {undefined}
         */
        filterByAttribute: function(attribute, value) {
            VocabListsTable.filterByAttribute = {
                attribute: attribute,
                value: value
            };
            return this;
        },
        /**
         * @method load
         * @param {String} sortType
         * @param {Array} fieldNameMap
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        load: function(sortType, fieldNameMap, callback) {
            VocabListsTable.fieldNameMap = fieldNameMap;
            VocabListsTable.sortType = sortType;
            VocabListsTable.lists = [];
            VocabListsTable.loading = true;
            VocabListsTable.this.$('#loader').show();
            VocabListsTable.this.render();
            skritter.lists.load(sortType, fieldNameMap, function(lists) {
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
        },
        /**
         * @method sortByAttribute
         * @param {String} attribute
         * @param {String} order
         * @returns {Backbone.View}
         */
        sortByAttribute: function(attribute, order) {
            VocabListsTable.sortByAttribute = {
                attribute: attribute,
                order: order
            };
            return this;
        }
    });

    return VocabListsTable;
});