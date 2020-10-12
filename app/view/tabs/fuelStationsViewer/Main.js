Ext.define('Opt.view.tabs.fuelStationsViewer.Main', {
	extend: 'Ext.window.Window',
	width: 100,
	height: 100,
	maximized: true,
	title: 'Заправочные станции',
	xtype: 'fuelstationsviewer',
	alias: 'widget.fuelstationsviewer',
	controller: 'fuelstationsviewermain',
	requires: [
		'Opt.view.tabs.fuelStationsViewer.MainController',
		'Opt.view.tabs.fuelStationsViewer.Map',
		'Opt.view.tabs.fuelStationsViewer.FuelStationGrid',
	],
	layout: 'border',
	closable: true,
	closeAction: 'hide',
	defaults: {
		header: false,
	},

	listeners: {
            	show: 'onShow', 
		close: 'onClose', 
		resize: 'onWindowResize',
		collapse: 'onWindowResize',
		expand: 'onWindowResize',
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
			title: 'Список заправок',
			xtype: 'fuelstationsviewerfuelstationgridpanel',
			id: 'fuelstationsviewerleft',
			region: 'west',
			width: 550,
			stateful: true,
			stateId: 'fuelstationsviewerleft',

		},
		{
			xtype: 'fuelstationsviewermap',
			layout: 'border',
			id: 'fuelstationsviewermap',
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