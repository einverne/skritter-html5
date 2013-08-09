/*
 * 
 * View: Prompt
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * This is an imaginary view that doesn't render anything specifically to the dom.
 * It just chooses which kind of prompt to render and handles multi-charater prompets.
 * 
 */
define([
    'Scheduler',
    'model/StudyReview',
    'view/subview/PromptDefn',
    'view/subview/PromptRdng',
    'view/subview/PromptRune',
    'view/subview/PromptTone',
    'backbone'
], function(Scheduler, StudyReview, PromptDefnView, PromptRdngView, PromptRuneView, PromptToneView) {
    var Skritter = window.skritter;
    
    var PromptView = Backbone.View.extend({
	
	initialize: function() {
	    //attributes
	    PromptView.item;
	    PromptView.position = 0;
	    PromptView.prompt;
	    PromptView.submitTime;
	    PromptView.vocab;
	    
	    //components
	    PromptView.scheduler = new Scheduler();
	},
		
	render: function(next) {
	    //select the prompt based on the part
	    //also checks for existing prompt to continue
	    if (!PromptView.prompt || next) {
		console.log('new prompt');
		switch (PromptView.item.get('part'))
		{
		    case 'defn':
			PromptView.prompt = new PromptDefnView();
			break;
		    case 'rdng':
			PromptView.prompt = new PromptRdngView();
			break;
		    case 'rune':
			PromptView.prompt = new PromptRuneView();
			break;
		    case 'tone':
			PromptView.prompt = new PromptToneView();
			break;
		}
		
		//load the selected prompt into the dom
		PromptView.prompt.setElement($(this.$el.selector)).render();
		
		//pass the prompt the vocab details to display
		PromptView.prompt.set(PromptView.vocab, PromptView.position);
		
		//wait for the prompt instance to return complete
		this.listenToOnce(PromptView.prompt, 'complete', this.handlePositionComplete, this);
	    } else {
		console.log('existing prompt');
		//load the selected prompt into the dom
		PromptView.prompt.setElement($(this.$el.selector)).render();
	    }
	    
	    return this;
	},
		
	handlePositionComplete: function(grade) {
	    console.log(Skritter.timer.getDuration());
	    //only change the position if a rune or tone prompt
	    if (PromptView.item.get('part') === 'rune' || PromptView.item.get('part') === 'tone') {
		if (PromptView.vocab[0].getCharacterCount() <= PromptView.position + 1) {
		    this.updateItem(PromptView.item, grade);
		    this.triggerComplete();
		} else {
		    PromptView.position++;
		    this.render(true);
		}
	    } else {
		this.updateItem(PromptView.item, grade);
		this.triggerComplete();
	    }
	},
		
	load: function(item, vocab) {
	    //sets the prompt item and vocab
	    PromptView.item = item;
	    PromptView.vocab = vocab;
	    //resets the prompt
	    this.reset();
	    //renders the prompt once loaded
	    this.render(true);
	},
		
	reset: function() {
	    PromptView.position = 0;
	    PromptView.submitTime = Skritter.fn.getUnixTime();
	},
		
	triggerComplete: function() {
	    this.trigger('complete:prompt');
	},
		
	updateItem: function(item, grade) {
	    //update the items values using the scheduler
	    var updatedItem = PromptView.scheduler.update(item, grade);
	    //create a review for the item to be sent to the server
	    /*Skritter.studyReviews.add(new StudyReview({
		itemId: item.id,
		score: grade,
		bearTime: true,
		submitTime: PromptView.submitTime,
		reviewTime: Skritter.timer.getDuration,
		thinkingTime: Skritter.timer.getDuration,
		currentInterval: item.previous('interval'),
		actualInterval: Skritter.fn.getUnixTime() - item.previous('last'),
		newInterval: item.get('interval'),
		wordGroup: PromptView.vocab.get('writing'),
		previousInterval: item.get('previousInterval'),
		previousSuccess: item.get('previousSuccess')
	    }));*/
	}
	
    });
    
    return PromptView;
});