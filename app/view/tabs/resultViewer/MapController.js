Ext.define('Opt.view.tabs.resultViewer.MapController', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.resultviewermapcontroller',
	afterRender: function () {
		this.getView().doResize();
	},
});


