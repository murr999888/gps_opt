Ext.define('Opt.view.tabs.tab3.MapTab3Controller', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.tab3mapcontroller',

	listen: {
		controller: {
			'*': {
				getTrafficLineOnMap: 'getTrafficLineOnMap',
			}
		}
	},


	getTrafficLineOnMap: function(id){
		this.getView().getTrafficLineOnMap(id);
	},

	afterRender: function () {
		this.getView().doResize();
	},

	onMapRender: function () {
		var mapCmp = this.getView();

		mapCmp.map.createPane('traffic');
		mapCmp.map.getPane('traffic').style.zIndex = 500;

		this.getView().map.createPane('trafficSign');
		this.getView().map.getPane('trafficSign').style.zIndex = 501;

		mapCmp.setAdditionalControls();
		mapCmp.setGeofenceStrumok();
		mapCmp.setAllTraficLinesOnMap();
		mapCmp.trafficLineGroupFitBounds();

		var store  = Ext.getStore("Traffic");

		store.on("load", function(){
			mapCmp.setAllTraficLinesOnMap();
			mapCmp.trafficLineGroupFitBounds();	
		});

		store.on("datachanged", function(){
			mapCmp.setAllTraficLinesOnMap();
			mapCmp.trafficLineGroupFitBounds();	
		});

		store.on("update", function(){
			mapCmp.setAllTraficLinesOnMap();
			mapCmp.trafficLineGroupFitBounds();	
		});
	},

});