Ext.define('Opt.view.tabs.tab1.MapTab1Controller', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.mapTab1Controller',

	onMapRender: function(){
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

		this.getView().map.createPane('routelines');
		this.getView().map.getPane('routelines').style.zIndex = 520;

		this.getView().map.createPane('routelinesBlue');
		this.getView().map.getPane('routelinesBlue').style.zIndex = 650;
	},

	afterRender: function () {
		this.getView().doResize();
	},
});


