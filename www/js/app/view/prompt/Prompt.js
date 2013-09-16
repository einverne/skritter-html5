/*
 * 
 * View: Prompt
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/prompt-view.html',
    'Scheduler',
    'view/prompt/PromptDefn',
    'view/prompt/PromptRdng',
    'view/prompt/PromptRune',
    'view/prompt/PromptTone',
    'backbone'
], function(templatePrompt, Scheduler, PromptDefn, PromptRdng, PromptRune, PromptTone) {
    
    var Prompt = Backbone.View.extend({
	
	initialize: function() {
	    Prompt.grade = 3;
	    Prompt.item = null;
	    Prompt.position = 0;
	    Prompt.prompt = null;
	    Prompt.scheduler = new Scheduler();
	    Prompt.startTime = 0;
	    Prompt.reviewTime = 0;
	    Prompt.thinkingTime = 0;
	    Prompt.vocab = null;
	},
		
	template: templatePrompt,
		
	render: function() {
	    this.$el.html(this.template);
	    
	    console.log('Item:', Prompt.vocab.get('writing'), Prompt.item.get('part'), Prompt.item.getReadiness().toFixed(2), 'Prompt:', Prompt.vocab.getCharacterAt(Prompt.position));
	    
	    //select the subprompt based on study part
	    switch (Prompt.item.get('part'))
	    {
		case 'rune':
		    Prompt.prompt = new PromptRune();
		    break;
		case 'tone':
		    Prompt.prompt = new PromptTone();
		    break;
		case 'rdng':
		    Prompt.prompt = new PromptRdng();
		    break;
		case 'defn':
		    Prompt.prompt = new PromptDefn();
		    break;
	    }
	    
	    //load the prompt into the dom and show it
	    Prompt.prompt.setElement($('#prompt-view')).render();
	    Prompt.prompt.set(Prompt.vocab, Prompt.position);
	    Prompt.prompt.showPrompt();
	    
	    //listen for the prompt to return complete
	    this.listenToOnce(Prompt.prompt, 'prompt:complete', this.handlePromptComplete);
	    
	    return this;
	},
	
	exists: function() {
	    if (Prompt.item)
		return true;
	    return false;
	},
		
	handlePromptComplete: function(results) {
	    console.log(results);
	    Prompt.reviewTime += results.reviewTime;
	    Prompt.thinkingTime += results.thinkingTime;
	    if (_.contains(['rune', 'tone'], Prompt.item.get('part'))) {
		if (Prompt.vocab.getCharacterCount() <= Prompt.position + 1) {
		    this.triggerComplete();
		} else {
		    Prompt.position++;
		    this.render();
		}
	    } else {
		this.triggerComplete();
	    }
	},
	
	reset: function() {
	    Prompt.grade = 3;
	    Prompt.item = null;
	    Prompt.position = 0;
	    Prompt.prompt = null;
	    Prompt.reviewTime = 0;
	    Prompt.startTime = 0;
	    Prompt.thinkingTime = 0;
	    Prompt.vocab = null;
	},
		
	setItem: function(item) {
	    this.reset();
	    Prompt.startTime = Skritter.fn.getUnixTime();
	    Prompt.item = item;
	    Prompt.vocab = item.getVocabs()[0];
	    this.render();
	},
	
	triggerComplete: function() {
	    Prompt.scheduler.update(Prompt.item, Prompt.vocab, Prompt.grade, Prompt.reviewTime, Prompt.startTime, Prompt.thinkingTime, true);
	    this.trigger('item:complete');
	},
		
	updateItem: function(results) {
	    return results;
	}
	
    });
    
    
    return Prompt;
});