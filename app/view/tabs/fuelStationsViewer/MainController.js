Ext.define('Opt.view.tabs.fuelStationsViewer.MainController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.fuelstationsviewermain',

	init: function () {
	},

	onWindowResize: function () {
		Ext.getCmp('fuelstationsviewermap').doResize();
	},

	onShow: function(){
		this.fireEvent("fuelstationsViewerShow");
	},
});