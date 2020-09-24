Ext.define('Opt.view.tabs.tab3.MainTab3', {
	extend: 'Ext.Panel',
	title: 'Пробки',
	xtype: 'maintab3',
	controller: 'mainTab3Controller',
	requires: [
		'Opt.view.tabs.tab3.MainTab3Controller',
		'Opt.view.tabs.tab3.MapTab3',
		'Opt.view.tabs.tab3.TrafficGridTab3',
	],

	layout: 'border',
	//closable: true,
	//closeAction: 'hide',
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
			title: 'Список',
			xtype: 'tab3trafficgridpanel',
			id: 'tab3left',
			region: 'west',
			width: 550,
			stateful: true,
			stateId: 'tab3left',

		},

		{
			xtype: 'tab3map',
			layout: 'border',
			id: 'tab3map',
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