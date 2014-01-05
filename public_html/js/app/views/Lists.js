/**
 * @module Skritter
 * @submodule Views
 * @param templateLists
 * @param templateList
 * @param templateSection
 * @author Joshua McFarland
 */
define([
    'require.text!templates/lists.html',
    'require.text!templates/lists-list.html',
    'require.text!templates/lists-section.html',
    'backbone'
], function(templateLists, templateList, templateSection) {
    /**
     * @class Lists
     */
    var Lists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Lists.defaultSort = 'studying';
            Lists.listId = null;
            Lists.sectionId = null;
        },
        /**
         * @method render
         * @return {Backbone.View}
         */
        render: function() {
            if (Lists.listId && Lists.sectionId) {
                //render specific section of a list
                this.$el.html(templateSection);
                this.loadSection();
            } else if (Lists.listId) {
                //render list information and section overview
                this.$el.html(templateList);
                this.loadList(Lists.listId);
            } else {
                //render high level overview of lists
                this.$el.html(templateLists);
                this.loadLists();
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Lists #lists-table tbody tr': 'selectList'
        },
        /**
         * @method loadListSections
         * @param {String} listId
         */
        loadList: function(listId) {
            skritter.modal.show().setBody('Loading List').noHeader();
            skritter.api.getVocabList(listId, function(list) {
                this.$('#name').text(list.name);
                this.$('#description').text(list.description);
                var div = '';
                div += "<div class='panel-group' id='accordion'>";
                for (var a in list.sections) {
                    var section = list.sections[a];
                    div += "<div class='panel panel-default'>";
                    //panel heading
                    div += "<div class='panel-heading'>";
                    div += "<h4 class='panel-title'>";
                    div += "<a data-toggle='collapse' data-parent='#accordion' href='#collapse" + a + "'>";
                    div += section.name;
                    div += "</a>";
                    div += "</h4>";
                    div += "</div>";
                    //panel body
                    div += "<div id='collapse" + a + "' class='panel-collapse collapse in'>";
                    div += "<div class='panel-body'>";
                    //section rows
                    for (var b in section.rows) {
                        var row = section.rows[b];
                        div += "<h6>";
                        div += row.vocabId;
                        div += "</h6>";
                    }
                    div += "</div>";
                    div += "</div>";
                    div += "</div>";
                }
                div += "</div>";
                this.$('#list-sections').html(div);
                this.$("#list-sections .collapse").collapse();
                skritter.modal.hide();
            });
        },
        /**
         * @method loadLists
         * @param {String} sort
         */
        loadLists: function(sort) {
            sort = (sort) ? sort : Lists.defaultSort;
            skritter.modal.show().setBody('Loading Lists').noHeader();
            skritter.api.getVocabLists(sort, 'id,name,peopleStudying', function(lists) {
                lists = skritter.fn.sortAlphabetically(lists, 'name');
                this.$('#lists-table tbody').html('');
                var div = '';
                for (var i in lists) {
                    var list = lists[i];
                    div += "<tr id='" + list.id + "' class='cursor'>";
                    div += "<td>" + list.name + "</td>";
                    div += "<td>" + list.peopleStudying + "</td>";
                    div += "</tr>";
                }
                this.$('#lists-table tbody').html(div);
                skritter.modal.hide();
            });
        },
        /**
         * @method selectList
         * @param {Object} event
         */
        selectList: function(event) {
            skritter.router.navigate('lists/' + event.currentTarget.id, {trigger: true});
        },
        /**
         * @method set
         * @param {String} listId
         * @param {String} sectionId
         */
        set: function(listId, sectionId) {
            Lists.listId = listId;
            Lists.sectionId = sectionId;
        }
    });

    return Lists;
});