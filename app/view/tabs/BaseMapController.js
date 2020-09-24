Ext.define('Opt.view.tabs.BaseMapController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.basemapcontroller',

	onMapRender: function () {
		var self = this;
		this.getView().setAdditionalControls();
		this.getView().setGeofenceStrumok();
		this.getView().setAllTraficLinesOnMap();

		var store  = Ext.getStore("Traffic");

		store.on("load", function(){
			self.getView().setAllTraficLinesOnMap();
		});

		store.on("datachanged", function(){
			self.getView().setAllTraficLinesOnMap();
		});

		store.on("update", function(){
			self.getView().setAllTraficLinesOnMap();
		});
	},

	onMapZoomLevelsChange: function (type, target) {
		this.getView().setArrows();
		this.getView().setAllTraficLinesOnMap();
	},
});