Ext.define('Opt.view.tabs.fuelStationsViewer.MainController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.fuelstationsviewermain',

	init: function () {
	},

	onWindowResize: function () {
		Ext.getCmp('fuelstationsviewermap').doResize();
	},

	onMapRender: function (comp, map, layers) {
		this.fireEvent("fuelstationsviewermapRender", comp, map, layers);
		this.getView().mapRendered = true;
	},
});