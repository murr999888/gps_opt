Ext.define('Opt.view.tabs.resultViewer.Left', {
	extend: 'Ext.panel.Panel',
	xtype: 'resultviewerleft',
	alias: 'widget.resultviewerleft',
	controller: 'resultviewerleft',
	requires: [
		'Opt.view.tabs.resultViewer.RoutesGrid',
		'Opt.view.tabs.resultViewer.DroppedGrid',
		'Opt.view.tabs.resultViewer.Orders',
		'Opt.view.tabs.resultViewer.LeftController',
	],

	layout: {
	        type: 'accordion',
        	titleCollapse: true,
	        animate: false,
		multi: true,
		collapseFirst: false,
	},

	listeners: {
		resize: function () {
			Ext.getCmp('resultviewermap').doResize();
		},
		collapse: function () {
			Ext.getCmp('resultviewermap').doResize();
		},
		expand: function () {
			Ext.getCmp('resultviewermap').doResize();
		}
	},

	items: [
		{
			flex: 2,
			title: 'Маршрутные листы',
			xtype: 'resultviewerroutesgrid',
			id: 'resultviewerroutesgrid',
			focusable: true,
			tabIndex: 1,
			stateful: true,
			stateId: 'resultviewerroutesgrid',
		},
		{
			flex: 3,
			title: 'Заказы',
			xtype: 'resultviewerorders',
			id: 'resultviewerorders',
			stateful: true,
			stateId: 'resultviewerorders',
		},
		{
			flex: 1,
			title: 'Отброшенные заказы',
			xtype: 'resultviewerdroppedgridpanel',
			id: 'resultviewerdroppedgrid',
			stateful: true,
			stateId: 'resultviewerdroppedgrid',
		},
	],
});