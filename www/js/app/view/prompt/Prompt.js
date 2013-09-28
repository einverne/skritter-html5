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
	    Prompt.subItems = [];
	    Prompt.subReviews = [];
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
	    Prompt.grade = results.grade;
	    Prompt.reviewTime += results.reviewTime;
	    Prompt.thinkingTime += results.thinkingTime;
	    Prompt.subReviews.push(results);
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
	    Prompt.subItems = [];
	    Prompt.subReviews = [];
	    Prompt.startTime = 0;
	    Prompt.thinkingTime = 0;
	    Prompt.vocab = null;
	},
		
	setItem: function(item) {
	    this.reset();
	    Prompt.startTime = Skritter.fn.getUnixTime();
	    Prompt.item = item;
	    Prompt.vocab = item.getVocabs()[0];
	    Prompt.subItems = Prompt.item.getContained();
	    this.render();
	},
	
	triggerComplete: function() {
	    //updates contained items for rune and tone prompts if not a single character prompt
	    if (!Prompt.vocab.isSingleCharacter(), _.contains(['rune', 'tone'], Prompt.item.get('part'))) {
		for (var i in Prompt.subItems){
		    var item = Prompt.subItems[i];
		    var review = Prompt.subReviews[i];
		    item.spawnReview(review.grade, review.reviewTime, review.startTime, review.thinkingTime, Prompt.vocab.get('writing'), false);
		}
	    }
	    //calculate the values so we can choose a final item score
	    var total = 0;
	    var wrongCount = 0;
	    for (var i in Prompt.subReviews)
	    {
		total += parseInt(Prompt.subReviews[i].grade);
		if (parseInt(Prompt.subReviews[i].grade) === 1)
		    wrongCount++;
	    }
	    //adjust the grade for multiple character items or get rounded down average
	    if (Prompt.vocab.getCharacterCount() === 2 && wrongCount === 1) {
		Prompt.grade = 1;
	    } else if (wrongCount >= 2) {
		Prompt.grade = 1;
	    } else {
		Prompt.grade = Math.floor(total / Prompt.subReviews.length);
	    }
	    //updates the base item regardless of prompt part
	    Prompt.item.spawnReview(Prompt.grade, Prompt.reviewTime, Prompt.startTime, Prompt.thinkingTime, Prompt.vocab.get('writing'), true);
	    //triggers the item complete event to the study view
	    this.trigger('item:complete');
	},
		
	updateItem: function(results) {
	    return results;
	}
	
    });
    
    
    return Prompt;
});