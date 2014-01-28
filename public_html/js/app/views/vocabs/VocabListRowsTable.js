/**
 * @module Skritter
 * @param templateVocabListRowsTable
 * @author Joshua McFarland
 */
define([
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