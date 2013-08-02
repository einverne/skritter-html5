/*
 * 
 * Module: PromptRdng
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'PinyinConverter',
    'view/subview/GradingButtons',
    'require.text!template/prompt/rdng.html',
    'jquery.hammer',
    'backbone'
], function(PinyinConverter, GradingButtonsView, templateRdng) {
    var Skritter = window.skritter;
    
    var PromptRdngView = Backbone.View.extend({
	
	initialize: function() {
	    PromptRdngView.grade = 3;
	    PromptRdngView.gradingButtons = new GradingButtonsView();
	    PromptRdngView.position;
	    PromptRdngView.vocab;
	},
	
	template: _.template(templateRdng),
	
	render: function() {
	    this.$el.html(this.template);
	    Skritter.frame.study();
	    return this;
	},
	
	handleGradeSelected: function(grade) {
	    PromptRdngView.grade = grade;
	    this.triggerComplete();
	},
	
	handlePromptClick: function() {
	    $(this.$el.selector + ' #rdng #bottom-prompt').hammer().one('tap.PromptRdngView', _.bind(this.triggerComplete, this));
	    $(this.$el.selector + ' #rdng #bottom-prompt').hammer().one('swipeleft.PromptRdngView', _.bind(this.triggerComplete, this));
	    this.show();
	},
		
	set: function(vocab, position) {
	    this.render();
	    PromptRdngView.vocab = vocab;
	    PromptRdngView.position = position;
	    $(this.$el.selector + ' #rdng #writing').text(PromptRdngView.vocab[0].get('writing'));
	    $(this.$el.selector + ' #rdng #question').text("What's the pinyin?");
	    
	    //events
	    self = this;
	    $(this.$el.selector + ' #rdng #bottom').hammer().one('tap.PromptRdngView', function() {
		self.handlePromptClick();		
	    });
	},
		
	show: function() {
	    $(this.$el.selector + ' #rdng #question').hide();
	    $(this.$el.selector + ' #rdng #definition').html(PromptRdngView.vocab[0].get('definitions').en);
	    $(this.$el.selector + ' #rdng #reading').html(PinyinConverter.toTone(PromptRdngView.vocab[0].get('reading')));
	    PromptRdngView.gradingButtons.setElement($(this.$el.selector + ' #rdng #grading-buttons')).render();
	    
	    //events
	    this.listenToOnce(PromptRdngView.gradingButtons, 'selected', this.handleGradeSelected);
	},
		
	triggerComplete: function() {
	    console.log(PromptRdngView.grade);
	    this.trigger('complete', PromptRdngView.grade);
	}
	
    });

    return PromptRdngView;
});