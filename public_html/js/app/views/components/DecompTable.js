/**
 * @module Skritter
 * @param templateDecompTable
 * @author Joshua McFarland
 */
define([
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
                    var divB = "<tr class='decomp-item'>";
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