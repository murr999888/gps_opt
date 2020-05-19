Ext.define('Opt.view.tabs.resultViewer.Orders', {
	extend: 'Opt.view.RouteLegGrid',
	alias: 'widget.resultviewerorders',
	requires: [
		'Opt.view.tabs.resultViewer.OrdersController',
	],

	tools: [
		{
			type: 'search',
			handler: 'routeZoom',
			tooltip: 'Масштаб: весь маршрут'
		},
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		},
	],

	controller: 'resultviewerorders',
	listeners: {
		celldblclick: 'onCellDblClick',
	},

});