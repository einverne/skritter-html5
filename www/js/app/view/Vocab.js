/*
 * 
 * View: Vocab
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/vocab-view.html',
    'PinyinConverter',
    'view/Toolbar',
    'backbone'
], function(templateVocab, PinyinConverter, Toolbar) {
    
    var VocabView = Backbone.View.extend({
	
	initialize: function() {
	    VocabView.toolbar = new Toolbar();
	},
	
	template: templateVocab,
	
	render: function() {
	    this.$el.html(this.template);
	    
	    VocabView.toolbar.setElement(this.$('#toolbar-container')).render();
	    VocabView.toolbar.addOption('{back}', 'back-button', ['button']);
	    
	    this.populateVocab();
	    
	    return this;
	},
		
	events: {
	    'click.VocabView #back-button': 'back'
	},
		
	back: function() {
	    document.location.hash = '';
	},
		
	populateVocab: function() {
	    var vocabs = Skritter.study.vocabs;
	    for (var id in vocabs.models)
	    {
		var vocab = vocabs.models[id];
		this.$('#vocab-container').append("<div class='vocab' id='" + vocab.get('id') + "'>" +
			vocab.get('writing') + " " + 
			' (' + vocab.get('style') + ') ' +
			PinyinConverter.toTone(vocab.get('reading')) +
			"</div>");
	    }
	}
	
    });
    
    
    return VocabView;
});