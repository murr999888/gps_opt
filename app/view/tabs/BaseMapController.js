Ext.define('Opt.view.tabs.BaseMapController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.basemapcontroller',

	onMapZoomLevelsChange: function (type, target) {
		this.getView().setArrows();
		this.getView().setAllTraficLinesOnMap();
	},
});