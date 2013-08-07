/*
 * 
 * View: Info
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'PinyinConverter',
    'require.text!template/info.html',
    'backbone'
], function(PinyinConverter, templateInfo) {
    var Skritter = window.skritter;
    
    var InfoView = Backbone.View.extend({
	
	initialize: function() {
	    InfoView.sentence;
	    InfoView.vocab;
	    
	    this.setVocab(this.options.id);
	},
	
	template: _.template(templateInfo),
		
	render: function() {
	    this.$el.html(this.template);
	    
	    $('#simplified-writing').text(InfoView.vocab.get('writing'));
	    $('#traditional-writing').text();
	    $('#reading').text(PinyinConverter.toTone(InfoView.vocab.get('reading')));
	    $('#definition').text(InfoView.vocab.get('definitions').en);
	    $('#sentence').text(InfoView.sentence.get('writing'));
	    
	    return this;
	},
		
	setVocab: function(id) {
	    InfoView.vocab = Skritter.studyVocabs.findWhere({id: id});
	    InfoView.sentence = Skritter.studySentences.findWhere({id: InfoView.vocab.get('sentenceId')});
	    console.log(InfoView.vocab);
	}
	
    });
    
    return InfoView;
});