/**
 * @module Skritter
 * @param templateContainedTable
 * @author Joshua McFarland
 */
define([
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