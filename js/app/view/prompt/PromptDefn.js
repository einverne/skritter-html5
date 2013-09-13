/*
 * 
 * View: PromptDefn
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/prompt-defn.html',
    'PinyinConverter',
    'view/prompt/GradingButtons',
    'jquery.hammer',
    'backbone'
], function(templateDefn, PinyinConverter, GradingButtons) {
    
    var PromptDefn = Backbone.View.extend({
	
	initialize: function() {
	    PromptDefn.complete = false;
	    PromptDefn.definition;
	    PromptDefn.grade = 3;
	    PromptDefn.gradingButtons = new GradingButtons();
	    PromptDefn.position = 0;
	    PromptDefn.reading;
	    PromptDefn.reviewTime = 0;
	    PromptDefn.sentence;
	    PromptDefn.startTime = 0;
	    PromptDefn.thinkingTime = 0;
	    PromptDefn.vocab;
	    PromptDefn.writing;
	},
	
	template: templateDefn,
		
	render: function() {
	    this.$el.html(this.template);
	    this.resize();
	    return this;
	},
	
		
	handleGradeSelected: function(grade) {
	    PromptDefn.grade = grade;
	    this.triggerComplete();
	},
	
	handlePromptClicked: function() {
	    console.log('clicked');
	    PromptDefn.gradingButtons.setElement($('#prompt-area')).render();
	    //PromptDefn.gradingButtons.select(PromptDefn.grade);
	    PromptDefn.reviewTime = Skritter.timer.getReviewTime();
	    PromptDefn.thinkingTime = Skritter.timer.getThinkingTime();
	    this.listenToOnce(PromptDefn.gradingButtons, 'selected', this.handleGradeSelected);
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
	    PromptDefn.startTime = Skritter.fn.getUnixTime();
	    PromptDefn.definition = vocab.get('definitions')[Skritter.user.get('sourceLang')];
	    PromptDefn.position = position;
	    PromptDefn.reading = PinyinConverter.toTone(vocab.get('reading'));
	    PromptDefn.sentence = (vocab.getSentence()) ? vocab.getSentence().get('writing') : null;
	    PromptDefn.writing = vocab.get('writing');
	    PromptDefn.vocab = vocab;
	},
		
	showAnswer: function() {
	    this.$('#definition').text(PromptDefn.definition);
	    this.$('#message').hide();
	    this.$('#reading').text(PromptDefn.reading);
	},
		
	showPrompt: function() {
	    Skritter.timer.setReviewLimit(30000);
	    Skritter.timer.setThinkingLimit(15000);
	    Skritter.timer.start();
	    this.$('#defn #writing').html(PromptDefn.writing);
	    this.$('#defn #message').text("What's the definition?");
	    
	    //events and listeners
	    this.$('#prompt-area').hammer().one('tap.PromptDefn', _.bind(this.handlePromptClicked, this));
	},
		
	triggerComplete: function() {
	    this.trigger('prompt:complete', {
		grade: PromptDefn.grade,
		reviewTime: PromptDefn.reviewTime,
		startTime: PromptDefn.startTime,
		thinkingTime: PromptDefn.thinkingTime
	    });
	}
    });
    
    
    return PromptDefn;
});