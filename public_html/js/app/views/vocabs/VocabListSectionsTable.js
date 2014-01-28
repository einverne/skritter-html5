/**
 * @module Skritter
 * @param templateVocabListSectionsTable
 * @author Joshua McFarland
 */
define([
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