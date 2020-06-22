Ext.define('Opt.view.tabs.resultViewer.Main', {
	extend: 'Ext.window.Window',
	width: 100,
	height: 100,
	maximized: true,
	title: 'Просмотр результатов расчета',
	xtype: 'resultviewermain',
	alias: 'widget.resultviewermain',
	controller: 'resultviewermain',
	requires: [
		'Opt.view.tabs.resultViewer.MainController',
		'Opt.view.tabs.resultViewer.Left',
		'Opt.view.tabs.resultViewer.Map',
	],
	layout: 'border',
	closable: true,
	closeAction: 'hide',
	defaults: {
		header: false,
	},

	items: [
		{
			animCollapse: false,
			collapsible: true,
			floatable: false,
			titleCollapse: true,
			collapsed: false,
			collapseDirection: 'left',
			header: true,
			title: 'Результат расчета',
			xtype: 'resultviewerleft',
			id: 'resultviewerleft',
			region: 'west',
			width: 650,
		},
		{
			xtype: 'resultviewermap',
			layout: 'border',
			id: 'resultviewermap',
			region: 'center',
			mapOptions: {
				zoom: 12,
				center: { lat: 47.07559, lng: 37.50796 }
			},
			listeners: {
				'maprender': 'onMapRender'
			},
		},
	]
});