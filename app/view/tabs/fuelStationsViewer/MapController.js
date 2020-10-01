Ext.define('Opt.view.tabs.fuelStationsViewer.MapController', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.fuelstationsviewermapcontroller',
	afterRender: function () {
		this.getView().doResize();
	},

	onMapRender: function (comp, map, layers) {
		var self = this;

		this.fireEvent("fuelstationsviewermapRender", comp, map, layers);
		this.getView().mapRendered = true;

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
});


