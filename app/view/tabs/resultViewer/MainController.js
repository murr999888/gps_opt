Ext.define('Opt.view.tabs.resultViewer.MainController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.resultviewermain',
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

	onShow: function(){
		this.fireEvent("resultViewerShow");
	},

	onClose: function(){
		this.fireEvent("resultViewerClose");
	},

	onWindowResize: function () {
		Ext.getCmp('resultviewermap').doResize();
	},
});