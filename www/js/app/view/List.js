/*
 * 
 * View: List
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/list-view.html',
    'view/Grid',
    'view/Toolbar',
    'backbone'
], function(templateList, GridView, ToolbarView) {
    
    var ListView = Backbone.View.extend({
	
	initialize: function() {
	    ListView.grid = new GridView();
	    ListView.toolbar = new ToolbarView();
	    
	    ListView.listId;
	    ListView.sectionId;
	    ListView.sort;
	},
	
	template: templateList,
	
	render: function() {
	    this.$el.html(this.template);
	    
	    ListView.toolbar.setElement($('#toolbar-container')).render();
	    ListView.toolbar.addOption('{back}', 'back-button', ['button']);
	    
	    ListView.grid.setElement($('#grid-container')).render();	    
	    if (ListView.sort) {
		Skritter.facade.show('GETTING LISTS');
		Skritter.api.getVocabLists(ListView.sort, function(lists) {
		    for (var i in lists)
		    {
			var list = lists[i];
			ListView.grid.addTile(list.name, 'list-' + list.id, ['button list']);
		    }
		    ListView.grid.update();
		    Skritter.facade.hide();
		});
	    } else if (ListView.sectionId) {
		Skritter.facade.show('GETTING SECTION');
		Skritter.api.getVocabListSection(ListView.listId, ListView.sectionId, function(section) {
		    for (var i in section.rows)
		    {
			var row = section.rows[i];
			ListView.grid.addTile(row.vocabId + '(' + row.tradVocabId + ')', 'item-' + row.vocabId, ['button row']);
		    }
		    ListView.grid.update();
		    Skritter.facade.hide();
		});
	    } else if (ListView.listId) {
		Skritter.facade.show('GETTING LIST');
		Skritter.api.getVocabList(ListView.listId, function(list) {
		    console.log(list);
		    for (var i in list.sections)
		    {
			var section = list.sections[i];
			ListView.grid.addTile(section.name + ' (' + section.rows.length + 'items)', 'section-' + section.id, ['button section']);
		    }
		    ListView.grid.update();
		    Skritter.facade.hide();
		});
	    } else {
		ListView.grid.addTile('{My Lists}', 'mylists-button', ['button sort']);
		ListView.grid.addTile('{Textbooks}', 'textbooks-button', ['button sort']);
		ListView.grid.addTile('{Published}', 'published-button', ['button sort']);
		ListView.grid.addTile('{Custom}', 'custom-button', ['button sort']);
		ListView.grid.update();
	    }
	    
	    return this;
	},
		
	events: {
	    'click.ListView #back-button': 'back',
	    'click.ListView div.list': 'list',
	    'click.ListView div.section': 'section',
	    'click.ListView div.sort': 'sort'
	},
		
	back: function() {
	    document.location.hash = '';
	},
		
	list: function(event) {
	    var id = event.currentTarget.id.replace('list-', '');
	    document.location.hash = 'list/' + id;
	},
		
	section: function(event) {
	    var id = event.currentTarget.id.replace('section-', '');
	    document.location.hash = 'list/' + ListView.listId + '/section/' + id;
	},
		
	setListId: function(listId) {
	    ListView.listId = listId;
	    ListView.sort = null;
	},
	
	setSectionId: function(sectionId) {
	    ListView.sectionId = sectionId;
	    ListView.sort = null;
	},
		
	setSort: function(sort) {
	    ListView.sort = sort;
	},
		
	sort: function(event) {
	    var sort;
	    switch (event.currentTarget.id)
	    {
		case 'mylists-button':
		    sort = 'studying';
		    break;
		case 'textbooks-button':
		    sort = 'official';
		    break;
		case 'published-button':
		    sort = 'published';
		    break;
		case 'custom-button':
		    sort = 'custom';
		    break;
	    }
	    document.location.hash = 'list/sort/' + sort;
	}
	
    });
    
    
    return ListView;
});