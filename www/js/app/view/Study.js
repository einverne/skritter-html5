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
	    StudyView.toolbar.addOption(Skritter.study.items.getReadyCount(), 'items-due');
	    StudyView.toolbar.addOption('{timer}', 'timer');
	    StudyView.toolbar.addOption('{add}', 'add-button', ['button']);
	    StudyView.toolbar.addOption('{audio}', 'audio-button', ['button']);
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
	    'click.StudyView #audio-button': 'audio',
	    'click.StudyView #back-button': 'back',
	    'click.StudyView #info-button': 'info'
	},
	
	back: function() {
	    document.location.hash = '';
	    Skritter.timer.stop();
	},
		
	applyFilter: function() {
	    StudyView.items = Skritter.study.items.getStudy();
	    //StudyView.items = StudyView.items.filterBy('id', ['mcfarljwtest2-zh-你-0-rune']);
	},
		
	audio: function() {
	    StudyView.currentItem.getVocabs()[0].play();
	},
	
	handleItemComplete: function() {
	    this.updateItemsDue();
	    this.nextItem();
	},
	
	info: function() {
	    document.location = '#info/' + StudyView.currentItem.getVocabs()[0].get('id');
	    Skritter.timer.stop();
	},
		
	nextItem: function() {
	    StudyView.items.sort();
	    StudyView.items.getReadyCount();
	    StudyView.items.getNext(function(item) {
		StudyView.currentItem = item;
		StudyView.prompt.setItem(item);
	    });
	},
	
	updateItemsDue: function() {
	    this.$('#items-due').html(Skritter.study.items.getReadyCount());
	}
	
    });
    
    
    return StudyView;
});