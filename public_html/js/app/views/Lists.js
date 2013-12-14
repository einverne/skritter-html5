/**
 * @module Skritter
 * @submodule Views
 * @param templateList
 * @param templateSection
 * @param templateLists
 * @author Joshua McFarland
 */
define([
    'require.text!templates/lists-list.html',
    'require.text!templates/lists-section.html',
    'require.text!templates/lists.html',
    'backbone'
], function(templateList, templateSection, templateLists) {
    /**
     * @class Lists
     */
    var Lists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Lists.default = 'studying';
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
            'click.Lists #lists-table tbody tr': 'handleListClicked',
            'click.Lists #mylists-button': 'handleSortClicked',
            'click.Lists #official-button': 'handleSortClicked',
            'click.Lists #published-button': 'handleSortClicked',
            'click.Lists #custom-button': 'handleSortClicked'
        },
        /**
         * @method handleListClicked
         * @param {Object} event
         */
        handleListClicked: function(event) {
            skritter.router.navigate('lists/' + event.currentTarget.id, {trigger: true});
        },
        /**
         * @method handleSortClicked
         * @param {Object} event
         */
        handleSortClicked: function(event) {
            switch (event.currentTarget.id) {
                case 'mylists-button':
                    this.loadLists('studying');
                    break;
                case 'official-button':
                    this.loadLists('official');
                    break;
                case 'published-button':
                    this.loadLists('published');
                    break;
                case 'custom-button':
                    this.loadLists('custom');
                    break;
            }
        },
        /**
         * @method loadList
         * @param {String} listId
         */
        loadList: function(listId) {
            skritter.modal.show().setBody('Loading List').noHeader();
            skritter.api.getVocabList(listId, function(list) {
                this.$('#title').text(list.name);
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
                this.$('#sections').append(div);
                this.$("#sections .collapse").collapse();
                skritter.modal.hide();
            });
        },
        /**
         * @method loadLists
         * @param {String} sort
         */
        loadLists: function(sort) {
            sort = (sort) ? sort : Lists.default;
            skritter.modal.show().setBody('Loading Lists').noHeader();
            skritter.api.getVocabLists(sort, function(lists) {
                this.$('#lists-table tbody').html('');
                for (var i in lists) {
                    var list = lists[i];
                    var div = '';
                    div += "<tr id='" + list.id + "'>";
                    div += "<td>" + list.name + "</td>";
                    div += "<td>" + list.description + "</td>";
                    div += "</tr>";
                    this.$('#lists-table tbody').append(div);
                }
                skritter.modal.hide();
            });
        },
        /**
         * @method loadSection
         * @param {String} listId
         * @param {String} sectionId
         */
        loadSection: function(listId, sectionId) {
            //TODO: add this functionality
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