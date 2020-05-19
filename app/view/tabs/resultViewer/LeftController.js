Ext.define('Opt.view.tabs.resultViewer.LeftController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.resultviewerleft',
	routesDistrStore: null,
	droppedOrdersStore: null,
	init: function () {
		this.routesDistrStore = Ext.create('Ext.data.Store', {
			//model: 'Opt.model.RouteListDist',
			model: 'Opt.model.RouteList',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('resultviewerroutesgrid').setStore(this.routesDistrStore);

		this.droppedOrdersStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('resultviewerdroppedgrid').setStore(this.droppedOrdersStore);
	},
});