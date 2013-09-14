/*
 * 
 * View: Options
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/options-view.html',
    'require.text!template/options-parts.html',
    'require.text!template/options-stroke.html',
    'view/Grid',
    'view/Toolbar',
    'backbone'
], function(templateOptions, templateParts, templateStroke, GridView, ToolbarView) {
    
    var OptionsView = Backbone.View.extend({
	
	initialize: function() {
	    OptionsView.grid = new GridView();
	    OptionsView.toolbar = new ToolbarView();
	},
	
	template: templateOptions,
	
	render: function() {
	    if (!Skritter.user.isLoggedIn())
		document.location.hash = '';
    
	    this.$el.html(this.template);
	    
	    OptionsView.toolbar.setElement(this.$('#toolbar-container')).render();
	    OptionsView.toolbar.addOption('{back}', 'back-button', ['button']);
	    OptionsView.toolbar.addOption('{save}', 'save-button', ['button']);
	    
	    OptionsView.grid.setElement(this.$('#grid-container')).render();
	    OptionsView.grid.addTile(templateParts, 'parts');
	    OptionsView.grid.addTile(templateStroke, 'stroke');
	    OptionsView.grid.update();
	    
	    this.load();
	    
	    return this;
	},
		
	events: {
	    'click.OptionsView #back-button': 'back',
	    'click.OptionsView #save-button': 'save'
	},
	
	back: function() {
	    document.location.hash = '';
	},
		
	load: function() {
	    var parts = Skritter.user.getStudyParts();
	    this.$('#part-rune').prop('checked', _.contains(parts, 'rune'));
	    this.$('#part-tone').prop('checked', _.contains(parts, 'tone'));
	    this.$('#part-defn').prop('checked', _.contains(parts, 'defn'));
	    this.$('#part-rdng').prop('checked', _.contains(parts, 'rdng'));
	    this.$('#raw-squigs').prop('checked', Skritter.user.get('squigs'));
	    this.$('#order-strictness').val(Skritter.user.get('orderStrictness'));
	},
		
	save: function() {
	    var lang = Skritter.user.get('targetLang');
	    if (lang === 'zh') {
		lang = 'chineseStudyParts';
	    } else {
		lang = 'japaneseStudyParts';
	    }
	    
	    var parts = [];
	    if (this.$('#part-defn').prop('checked')) parts.push('defn');
	    if (this.$('#part-rdng').prop('checked')) parts.push('rdng');
	    if (this.$('#part-rune').prop('checked')) parts.push('rune');
	    if (this.$('#part-tone').prop('checked')) parts.push('tone');
	    Skritter.user.set(lang, parts);
	    Skritter.user.set('orderStrictness', this.$('#order-strictness').val());
	    Skritter.user.set('squigs', $('#raw-squigs').prop('checked'));
	}   
	
    });
    
    
    return OptionsView;
});