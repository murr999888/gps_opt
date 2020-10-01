Ext.define('Opt.view.tabs.tab2.RoutesDistTab2Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.routesdisttab2',
	routesDistrStore: null,
	droppedOrdersStore: null,
	viewer: null,
	requires: [
		'Opt.view.tabs.resultViewer.Main',
	],

	init: function () {
		this.routesDistrStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteList',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('tab2routesgrid').setStore(this.routesDistrStore);

		this.droppedOrdersStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('tab2droppedgrid').setStore(this.droppedOrdersStore);
	},
});