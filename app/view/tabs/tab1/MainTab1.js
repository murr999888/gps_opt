Ext.define('Opt.view.tabs.tab1.MainTab1', {
	extend: 'Ext.Panel',
	alias: 'widget.maintab1',
	requires: [
		'Opt.view.tabs.tab1.MainTab1Controller',
		'Opt.view.tabs.tab1.MenuTab1',
		'Opt.view.tabs.tab1.MapTab1',

	],

	controller: 'mainTab1Controller',
	layout: 'border',
	defaults: {
		animCollapse: false,
		collapsible: true,
		floatable: false,
		titleCollapse: true,

		listeners: {
			collapse: function () {
				Ext.getCmp('maptab1').doResize();
			},
			expand: function () {
				Ext.getCmp('maptab1').doResize();
			}
		},
	},
	items: [
		{
			xtype: 'menutab1',
			id: 'menutab1',
			title: 'Маршрут',
			region: 'west',
			collapseDirection: 'left',
			width: 600,
			stateful: true,
			bodyPadding: 5,
		},
		{
			xtype: 'maptab1',
			layout: 'fit',
			region: 'center',
			collapsible: false,
			id: 'maptab1',
			mapOptions: {
				zoom: 12,
				center: { lat: 47.07559, lng: 37.50796 }
			},
		},
	]
});
