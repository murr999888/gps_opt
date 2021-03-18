Ext.define('Opt.view.tabs.resultViewer.MapController', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.resultviewermapcontroller',
	afterRender: function () {
		this.getView().doResize();
	},

	onMapRender: function(){
		var self = this;

		this.getView().map.createPane('routelines');
		this.getView().map.getPane('routelines').style.zIndex = 520;

		this.getView().map.createPane('routelinesBlue');
		this.getView().map.getPane('routelinesBlue').style.zIndex = 650;

		this.getView().map.createPane('traffic');
		this.getView().map.getPane('traffic').style.zIndex = 500;

		this.getView().map.createPane('trafficSign');
		this.getView().map.getPane('trafficSign').style.zIndex = 501;

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
		this.fireEvent("resultviewermapRender");
		this.getView().mapRendered = true;
	},
});


