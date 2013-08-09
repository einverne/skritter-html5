/*
 * 
 * View: Info
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'PinyinConverter',
    'view/subview/InfoBar',
    'require.text!template/info.html',
    'backbone'
], function(PinyinConverter, InfoBarView, templateInfo) {
    var Skritter = window.skritter;
    
    var InfoView = Backbone.View.extend({
	
	initialize: function() {
	    InfoView.sentence;
	    InfoView.vocab;
	    
	    this.setVocab(this.options.id);
	    
	    //components
	    InfoView.infoBar = new InfoBarView();
	},
	
	template: _.template(templateInfo),
		
	render: function() {
	    this.$el.html(this.template);
	    
	    //loads the infobar into the dom
	    InfoView.infoBar.setElement($('#infobar')).render();
	    
	    $('#simplified-writing').text(InfoView.vocab.get('writing'));
	    $('#traditional-writing').text();
	    $('#reading').text(PinyinConverter.toTone(InfoView.vocab.get('reading')));
	    $('#definition').text(InfoView.vocab.get('definitions').en);
	    $('#sentence').text(InfoView.sentence.get('writing'));
	    
	    var contained = InfoView.vocab.get('containedVocabIds');
	    if (contained) {
		for (var i in contained)
		{
		    var containedVocab = Skritter.studyVocabs.findWhere({id:contained[i]});
		    console.log(containedVocab);
		    var div = "<div class='contained-vocab'>";
		    div += "<span class='writing'>" + containedVocab.get('writing') + "</span>";
		    div += "<span class='reading'>" + containedVocab.get('reading') + "</span>";
		    div += "<span class='definition'>" + containedVocab.get('definitions').en + "</span>";
		    div += "</div>";
		    $('#contained').append(div);
		}
	    }
	    
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