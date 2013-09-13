/*
 * 
 * View: PromptRdng
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/prompt-rdng.html',
    'PinyinConverter',
    'view/prompt/GradingButtons',
    'jquery.hammer',
    'backbone'
], function(templateRdng, PinyinConverter, GradingButtons) {
    
    var PromptRdng = Backbone.View.extend({
	
	initialize: function() {
	    PromptRdng.complete = false;
	    PromptRdng.definition;
	    PromptRdng.grade = 3;
	    PromptRdng.gradingButtons = new GradingButtons();
	    PromptRdng.position = 0;
	    PromptRdng.reading;
	    PromptRdng.reviewTime = 0;
	    PromptRdng.sentence;
	    PromptRdng.startTime = 0;
	    PromptRdng.thinkingTime = 0;
	    PromptRdng.vocab;
	    PromptRdng.writing;
	},
	
	template: templateRdng,
		
	render: function() {
	    this.$el.html(this.template);
	    this.resize();
	    return this;
	},
		
	handleGradeSelected: function(grade) {
	    PromptRdng.grade = grade;
	    this.triggerComplete();
	},
	
	handlePromptClicked: function() {
	    PromptRdng.gradingButtons.setElement($('#prompt-area')).render();
	    PromptRdng.reviewTime = Skritter.timer.getReviewTime();
	    PromptRdng.thinkingTime = Skritter.timer.getThinkingTime();
	    this.listenToOnce(PromptRdng.gradingButtons, 'selected', this.handleGradeSelected);
	    this.showAnswer();
	},
		
	handleSwipeLeft: function() {
	    this.triggerComplete();
	},
		
	resize: function() {
	    var appHeight = Skritter.settings.get('appHeight');
	    var toolbarHeight = $('#toolbar-container').height();
	    var canvasSize = Skritter.settings.get('canvasSize');
	    this.$('#top').height(appHeight - toolbarHeight - canvasSize);
	    this.$('#top').width(canvasSize);
	    this.$('#prompt-area').height(canvasSize);
	    this.$('#prompt-area').width(canvasSize);
	},
	
	set: function(vocab, position) {
	    PromptRdng.startTime = Skritter.fn.getUnixTime();
	    PromptRdng.definition = vocab.get('definitions')[Skritter.user.get('sourceLang')];
	    PromptRdng.position = position;
	    PromptRdng.reading = PinyinConverter.toTone(vocab.get('reading'));
	    PromptRdng.sentence = (vocab.getSentence()) ? vocab.getSentence().get('writing') : null;
	    PromptRdng.writing = vocab.get('writing');
	    PromptRdng.vocab = vocab;
	},
		
	showAnswer: function() {
	    this.$('#rdng #definition').text(PromptRdng.definition);
	    this.$('#rdng #message').hide();
	    this.$('#rdng #reading').text(PromptRdng.reading);
	},
		
	showPrompt: function() {
	    Skritter.timer.setReviewLimit(30000);
	    Skritter.timer.setThinkingLimit(15000);
	    Skritter.timer.start();
	    this.$('#rdng #writing').html(PromptRdng.writing);
	    this.$('#rdng #message').text("What's the pinyin?");
	    
	    //events and listeners
	    this.$('#prompt-area').hammer().one('tap.PromptRdng', _.bind(this.handlePromptClicked, this));
	},
		
	triggerComplete: function() {
	    this.trigger('prompt:complete', {
		grade: PromptRdng.grade,
		reviewTime: PromptRdng.reviewTime,
		startTime: PromptRdng.startTime,
		thinkingTime: PromptRdng.thinkingTime
	    });
	}
	
    });
    
    
    return PromptRdng;
});