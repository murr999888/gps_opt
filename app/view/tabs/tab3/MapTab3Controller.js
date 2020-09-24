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

	onMapClick: function(e) {
		this.getView().setTrafficMarker(e.latlng);
	},

	onMapRender: function () {
		var mapCmp = this.getView();
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