Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditMain', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.trafficedit',
	requires: [
		'Opt.view.dialog.TrafficEdit.TrafficEditMainController',
		'Opt.view.dialog.TrafficEdit.TrafficEditForm',
		'Opt.view.dialog.TrafficEdit.TrafficEditMap',
	],

	controller: 'trafficeditcontroller',
	modal: true,
	closable: true,
	closeAction: 'hide',
	title: 'Участок дороги',
	height: 500,
	width: 800,
	resizable: true,
	stateful: true,
	stateId: 'trafficeditcontroller',
	layout: 'border',

	listeners: {
            	show: 'onShow', 
		resize: 'onWindowResize',
		collapse: 'onWindowResize',
		expand: 'onWindowResize',
	},

	items: [
		{
			xtype: 'trafficeditform',
			region: 'west',
			width: 247,
		},
		{
			xtype: 'trafficeditmap',
			id: 'trafficeditmap',
			layout: 'border',
			region: 'center',
			mapOptions: {
				zoom: 12,
				center: { lat: 47.07559, lng: 37.50796 }
			},
			listeners: {
				'maprender': 	'onMapRender',
				'resize':	'onWindowResize',
			},
		},
	]
}
);