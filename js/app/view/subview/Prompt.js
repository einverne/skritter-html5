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
    'view/subview/PromptDefn',
    'view/subview/PromptRdng',
    'view/subview/PromptRune',
    'view/subview/PromptTone',
    'backbone'
], function(Scheduler, PromptDefnView, PromptRdngView, PromptRuneView, PromptToneView) {
    
    var PromptView = Backbone.View.extend({
	
	initialize: function() {
	    //attributes
	    PromptView.prompt;
	    PromptView.item;
	    PromptView.vocab;
	    PromptView.position = 0;
	    
	    //components
	    PromptView.scheduler = new Scheduler();
	},
		
	render: function() {
	    //select the prompt based on the part
	    switch(PromptView.item.get('part'))
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
	    return this;
	},
		
	handlePositionComplete: function(grade) {
	    //only change the position if a rune or tone prompt
	    if (PromptView.item.get('part') === 'rune' || PromptView.item.get('part') === 'tone') {
		if (PromptView.vocab[0].getCharacterCount() > PromptView.position) {
		    this.updateItem(PromptView.item, grade);
		    this.triggerComplete();
		} else {
		    PromptView.position++;
		    this.render();
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
	    //renders the prompt once loaded
	    this.render();
	},
		
	triggerComplete: function() {
	    this.trigger('complete:prompt');
	},
		
	updateItem: function(item, grade) {
	    console.log('updating item');
	    PromptView.scheduler.update(item, grade);
	}
	
    });
    
    return PromptView;
});