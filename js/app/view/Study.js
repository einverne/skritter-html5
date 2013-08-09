/*
 * 
 * Module: Study
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'view/subview/Prompt',
    'view/subview/StudyBar',
    'require.text!template/study.html',
    'backbone'
], function(PromptView, StudyBarView, templateStudy) {
    var Skritter = window.skritter;

    var StudyView = Backbone.View.extend({
	
	initialize: function() {
	    //study resources
	    StudyView.currentItems;
	    StudyView.currentItem;
	    StudyView.currentVocab;
	    
	    //components
	    StudyView.prompt = new PromptView({ el: $('#prompt') });
	    StudyView.studyBar = new StudyBarView();
	},
		
	template: _.template(templateStudy),
		
	render: function() {
	    this.$el.html(this.template);
	    
	    //loads the studybar into the dom
	    StudyView.studyBar.setElement($('#studybar')).render();
	    
	    //filters the study items based on user settings
	    this.filter();
	    
	    //checks to see if an item has been loaded
	    if (!StudyView.currentItem) {
		//loads the first item prompt
		this.next();
	    } else {
		//load an existing prompt into the dom
		StudyView.prompt.render();
	    }
	    
	    //when the prompt is complete get another item
	    this.listenTo(StudyView.prompt, 'complete:prompt', this.next);

	    return this;
	},
		
	filter: function() {
	    StudyView.currentItems = Skritter.studyItems.clone();
	    StudyView.currentItems = StudyView.currentItems.filterActive();
	    
	    //checks and filters based on the user specific settings
	    var filter = [];
	    var parts = Skritter.user.get('parts');
	    for (var part in parts)
	    {
		if (parts[part]) {
		    filter.push(part);
		}
	    }
	    StudyView.currentItems = StudyView.currentItems.filterBy('part', filter);
	    
	    //if there are no items in the selected parts then enable all
	    if (StudyView.currentItems.length === 0) {
		Skritter.user.set('parts', {
		    defn: true,
		    rdng: true,
		    rune: true,
		    tone: true
		});
		this.filter();
	    }
	    
	    StudyView.currentItems.sort();
	    
	    //StudyView.currentItems = StudyView.currentItems.filterBy('part', ['rune']);
	    //StudyView.currentItems = StudyView.currentItems.filterBy('id', ['mcfarljwtest1-zh-品-0-rune']);
	},
		
	next: function() {
	    StudyView.currentItem = StudyView.currentItems.at(0);
	    StudyView.currentVocab = StudyView.currentItem.getStudyVocabs();
	    console.log('Prompt: '+ StudyView.currentVocab[0].get('writing') + ' (' + StudyView.currentItem.get('style') + ',' +  StudyView.currentItem.get('part') + ')');
	    console.log('Readiness: ' + StudyView.currentItem.getReadiness());
	    //load the new prompt
	    StudyView.prompt.load(StudyView.currentItem, StudyView.currentVocab);
	}
	
    });

    return StudyView;
});