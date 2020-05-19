Ext.define('Opt.view.tabs.BaseMapController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.basemapcontroller',

	onMapRender: function () {
		this.getView().setAdditionalControls();
		this.getView().setGeofenceStrumok();
	},

	onMapZoomLevelsChange: function (type, target) {
		this.getView().setArrows();
	},
});