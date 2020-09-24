Ext.define('Opt.view.tabs.fuelStationsViewer.MapController', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.fuelstationsviewermapcontroller',
	afterRender: function () {
		this.getView().doResize();
	},

	onMapClick: function(obj) {
		console.log("fuelStationsViewer.MapController");
		//console.log(obj);
	},

});


