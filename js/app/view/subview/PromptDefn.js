/*
 * 
 * Module: PromptDefn
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'PinyinConverter',
    'view/subview/GradingButtons',
    'require.text!template/prompt/defn.html',
    'jquery.hammer',
    'backbone'
], function(PinyinConverter, GradingButtonsView, templateDefn) {
    var Skritter = window.skritter;
    
    var PromptDefnView = Backbone.View.extend({
	
	initialize: function() {
	    PromptDefnView.grade = 3;
	    PromptDefnView.gradingButtons = new GradingButtonsView();
	    PromptDefnView.position;
	    PromptDefnView.reading;
	    PromptDefnView.vocab;
	    PromptDefnView.writing;
	},
	
	template: _.template(templateDefn),
	
	render: function() {
	    this.$el.html(this.template);
	    
	    if (PromptDefnView.question)
		$(this.$el.selector + ' #defn #question').text(PromptDefnView.question);
	    if (PromptDefnView.reading)
		$(this.$el.selector + ' #defn #reading').html(PromptDefnView.reading);
	    if (PromptDefnView.writing)
		$(this.$el.selector + ' #defn #writing').text(PromptDefnView.writing);		
	    
	    Skritter.frame.study();
	    
	    //events
	    self = this;
	    $(this.$el.selector + ' #defn #bottom').hammer().one('tap.PromptDefnView', function() {
		self.handlePromptClick();		
	    });
	    
	    return this;
	},
	
	handleGradeSelected: function(grade) {
	    PromptDefnView.grade = grade;
	    this.triggerComplete();
	},
	
	handlePromptClick: function() {
	    $(this.$el.selector + ' #defn #bottom-prompt').hammer().one('tap.PromptDefnView', _.bind(this.triggerComplete, this));
	    $(this.$el.selector + ' #defn #bottom-prompt').hammer().one('swipeleft.PromptDefnView', _.bind(this.triggerComplete, this));
	    this.show();
	},
		
	set: function(vocab, position) {
	    Skritter.timer.setReviewLimit(30000);
	    Skritter.timer.setThinkingLimit(15000);
	    Skritter.timer.start();
    
	    this.render();
	    PromptDefnView.vocab = vocab;
	    PromptDefnView.position = position;
	    
	    PromptDefnView.writing = PromptDefnView.vocab[0].get('writing');
	    PromptDefnView.reading = PinyinConverter.toTone(PromptDefnView.vocab[0].get('reading'));
	    PromptDefnView.question = "What's the definition?";
	    
	    $(this.$el.selector + ' #defn #writing').text(PromptDefnView.writing);
	    $(this.$el.selector + ' #defn #reading').html(PromptDefnView.reading);
	    $(this.$el.selector + ' #defn #question').text(PromptDefnView.question);
	},
		
	show: function() {
	    Skritter.timer.stop();
	    
	    $(this.$el.selector + ' #defn #question').hide();
	    $(this.$el.selector + ' #defn #answer').html(PromptDefnView.vocab[0].get('definitions').en);
	    PromptDefnView.gradingButtons.setElement($(this.$el.selector + ' #defn #grading-buttons')).render();
	    
	    //events
	    this.listenToOnce(PromptDefnView.gradingButtons, 'selected', this.handleGradeSelected);
	},
		
	triggerComplete: function() {
	    console.log(PromptDefnView.grade);
	    this.trigger('complete', PromptDefnView.grade);
	}
    });

    return PromptDefnView;
});