Ext.define('Opt.view.MainController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainController',
	init: function () {
		//this.lookupReference('reportView').setHidden(Traccar.app.getBooleanAttributePreference('ui.disableReport'));
	},

	afterRender: function () {
		Ext.on('resize', function () {
			//console.log('resize');
			setTimeout(function () {
				Ext.getCmp('maptab1').doResize();
				//Ext.getCmp('maptab2').doResize();
			}, 500);
		});
	},
});

