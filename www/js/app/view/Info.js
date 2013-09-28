/*
 * 
 * View: Info
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/info-view.html',
    'require.text!template/info-display.html',
    'PinyinConverter',
    'view/Toolbar',
    'backbone'
], function(templateInfo, templateInfoDisplay, PinyinConverter, ToolbarView) {
    
    var InfoView = Backbone.View.extend({
	
	initialize: function() {
	    InfoView.sentence;
	    InfoView.toolbar = new ToolbarView();
	    InfoView.vocab;
	},
		
	template: templateInfo,	
	
	render: function() {
	    this.$el.html(this.template);
	    
	    InfoView.toolbar.setElement($('#toolbar-container')).render();
	    
	    if (InfoView.vocab.has('bannedParts')) {
		InfoView.toolbar.addOption('{banned}', 'ban-button', ['button']);
	    } else {
		InfoView.toolbar.addOption('{ban}', 'ban-button', ['button']);
	    }
	    if (InfoView.vocab.get('starred')) {
		InfoView.toolbar.addOption('{starred}', 'star-button', ['button']);
	    } else {
		InfoView.toolbar.addOption('{not-starred}', 'star-button', ['button']);
	    }
	    InfoView.toolbar.addOption('{close}', 'close', ['button']);
	    this.$('#display-container').html(templateInfoDisplay);
	    
	    this.$('#writing-simp').text(InfoView.vocab.get('writing'));
	    this.$('#writing-trad').text();
	    this.$('#reading-definition').text(PinyinConverter.toTone(InfoView.vocab.get('reading')) + ': ' + InfoView.vocab.get('definitions')[Skritter.user.get('sourceLang')]);
	    if (InfoView.sentence)
		this.$('#sentence').text(InfoView.sentence.get('writing'));
	    
	    var contained = InfoView.vocab.get('containedVocabIds');
	    if (contained) {
		for (var i in contained)
		{
		    var containedVocab = Skritter.study.vocabs.findWhere({id:contained[i]});
		    var div = "<div class='contained-vocab'>";
		    div += "<span class='writing'>" + containedVocab.get('writing') + "</span>";
		    div += "<span class='reading'>" + PinyinConverter.toTone(containedVocab.get('reading')) + ": </span>";
		    div += "<span class='definition'>" + containedVocab.get('definitions').en + "</span>";
		    div += "</div>";
		    this.$('#contained').append(div);
		}
	    }
	    
	    return this;
	},
	
	events: {
            'click.InfoView #ban-button': 'ban',
	    'click.InfoView #close': 'close',
	    'click.InfoView #star-button': 'star'
	},
		
	ban: function() {
    
	},
		
	close: function() {
	    window.history.back();
	},
		
	load: function(id) {
	    console.log(id);
	    InfoView.vocab = Skritter.study.vocabs.findWhere({id: id});
	    if (InfoView.vocab.get('sentenceId'))
		InfoView.sentence = Skritter.study.sentences.findWhere({id: InfoView.vocab.get('sentenceId')});
	},
		
	star: function() {
	    
	}
	
    });
    
    
    return InfoView;
});