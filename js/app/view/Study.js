/*
 * 
 * View: Study
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/study-view.html',
    'view/prompt/Prompt',
    'view/Toolbar',
    'backbone'
], function(templateStudy, PromptView, ToolbarView) {
    
    var StudyView = Backbone.View.extend({
	
	initialize: function() {
	    StudyView.currentItem = null;
	    StudyView.items;
	    StudyView.prompt = new PromptView();
	    StudyView.toolbar = new ToolbarView();
	},
		
	template: templateStudy,
		
	render: function() {
	    this.$el.html(this.template);
	    
	    this.applyFilter();
	    
	    StudyView.toolbar.setElement(this.$('#toolbar-container')).render();
	    StudyView.toolbar.addOption('{back}', 'back-button', ['button']);
	    StudyView.toolbar.addOption('{timer}', 'timer');
	    StudyView.toolbar.addOption('{add}', 'add-button', ['button']);
	    StudyView.toolbar.addOption('{no-audio}', 'audio-button', ['button']);
	    StudyView.toolbar.addOption('{info}', 'info-button', ['button']);
	    
	    //render the time to the toolbar
	    Skritter.timer.setElement(this.$('#timer')).render();
	    
	    //check for an existing prompt then either load it or select the next
	    StudyView.prompt.setElement(this.$('#prompt-container'));
	    if (StudyView.prompt.exists()) {
		StudyView.prompt.render();
	    } else {
		this.nextItem();
		this.listenTo(StudyView.prompt, 'item:complete', this.handleItemComplete);
	    }
	    
	    return this;
	},
		
	events: {
	    'click.StudyView #back-button': 'back',
	    'click.StudyView #info-button': 'info'
	},
	
	back: function() {
	    document.location.hash = '';
	},
		
	applyFilter: function() {
	    StudyView.items = Skritter.study.items.getStudy();
	    //StudyView.items = StudyView.items.filterBy('id', ['mcfarljwtest2-zh-笑死-0-rune']);
	},
	
	handleItemComplete: function() {
	    this.nextItem();
	},
	
	info: function() {
	    document.location = '#info/' + StudyView.currentItem.getVocabs()[0].get('id');
	},
		
	nextItem: function() {
	    StudyView.items.sort();
	    StudyView.items.getReadyCount();
	    StudyView.items.getNext(function(item) {
		StudyView.currentItem = item;
		StudyView.prompt.setItem(item);
	    });
	}
	
    });
    
    
    return StudyView;
});