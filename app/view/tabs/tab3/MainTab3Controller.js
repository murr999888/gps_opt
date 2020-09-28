Ext.define('Opt.view.tabs.tab3.MainTab3Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainTab3Controller',

	onWindowResize: function () {
		Ext.getCmp('tab3map').doResize();
	},

	onMapRender: function (comp, map, layers) {
		this.fireEvent("tab3mapRender", comp, map, layers);
		this.getView().mapRendered = true;
	},

});