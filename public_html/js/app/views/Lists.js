/**
 * @module Skritter
 * @submodule Views
 * @param PinyinConverter
 * @param templateLists
 * @param templateList
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'require.text!templates/lists.html',
    'require.text!templates/lists-list.html',
    'backbone'
], function(PinyinConverter, templateLists, templateList) {
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
            if (Lists.listId) {
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
            'click.Lists #lists-view #textbooks-button': 'handleSortSelected',
            'click.Lists #lists-view .panel-section': 'loadSection',
            'click.Lists #lists-view #lists-table tbody tr': 'selectList'
        },
        /**
         * @method handleSortSelected
         * @param {Object} event
         */
        handleSortSelected: function(event) {
            this.loadLists('custom');
            return false;
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
                    div += "<a id='section-" + section.id + "' class='collapse-" + a + " panel-section' data-toggle='collapse' data-parent='#accordion' href=''>";
                    div += section.name + "  <span class='fa fa-times pull-right'></span>  <span class='fa fa-pencil pull-right'></span>";
                    div += "</a>";
                    div += "</h4>";
                    div += "</div>";
                    //panel body
                    div += "<div id='collapse-" + a + "' class='panel-collapse collapse'>";
                    div += "<div class='panel-body'>";
                    //section rows
                    div += "<table class='table table-hover'>";
                    div += "<thead><th>Writing</th><th>Reading</th><th>Definition</th></thead>";
                    div += "<tbody>";
                    for (var b in section.rows) {
                        var row = section.rows[b];
                        div += "<tr id='vocab-" + row.vocabId + "'><td class='writing'></td><td class='reading'></td><td class='definition'></td></tr>";
                        if (row.vocabId !== row.tradVocabId)
                            div += "<tr id='vocab-" + row.tradVocabId + "'><td class='writing'></td><td class='reading'></td><td class='definition'></td></tr>";
                    }
                    div += "</tbody>";
                    div += "</table>";
                    div += "</div>";
                    div += "</div>";
                    div += "</div>";
                }
                div += "</div>";
                this.$('#list-sections').html(div);
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
         * @method loadSection
         * @param {Object} event
         */
        loadSection: function(event) {
            var self = this;
            var collapseId = event.currentTarget.classList[0].replace('collapse-', '');
            var missingVocabIds = [];
            this.$('#list-sections #collapse-' + collapseId + ' tbody tr').each(function(i, row) {
                var vocabId = self.$(row)[0].id.replace('vocab-', '');
                var vocab = skritter.data.vocabs.findWhere({id: vocabId});
                if (vocab) {
                    self.$('#vocab-' + vocabId + ' .writing').text(vocab.get('writing'));
                    self.$('#vocab-' + vocabId + ' .reading').text(PinyinConverter.toTone(vocab.get('reading')));
                    self.$('#vocab-' + vocabId + ' .definition').text(vocab.getDefinition());
                } else {
                    missingVocabIds.push(vocabId);
                }
            });
            if (missingVocabIds.length > 0) {
                skritter.api.getVocabs(missingVocabIds, function(data) {
                    for (var i in data.Vocabs) {
                        var vocab = data.Vocabs[i];
                        self.$('#vocab-' + vocab.id + ' .writing').text(vocab.writing);
                    }
                    self.$('#list-sections #collapse-' + collapseId).collapse('toggle');
                });
            } else {
                this.$('#list-sections #collapse-' + collapseId).collapse('toggle');
            }
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