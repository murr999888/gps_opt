Ext.define('Opt.view.tabs.tab1.MapTab1Controller', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.mapTab1Controller',
	afterRender: function () {
		this.getView().doResize();
	},

	onMapClick: function(obj) {
		//console.log("MapTab1 Controller");
		//console.log(obj);
	},
});


