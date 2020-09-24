Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditPoints', {
	extend: 'Ext.grid.Panel',
	xtype: 'trafficpointsgridpanel',
	alias: 'widget.trafficpointsgridpanel',
	requires: [
		'Opt.view.dialog.TrafficEdit.TrafficEditPointsController',
	],

	controller: 'trafficpointsgridcontroller',

	tools: [{
		type: 'print',
		handler: 'printTable',
		tooltip: 'Печать'
	}],

	//store: 'Traffic',

	columns: {
		defaults: {
			menuDisabled: false,
			sortable: false,
			hideable: false,
		},
		items: [
			{
				text: '№',
				flex: 1,
				dataIndex: 'num',
				align: 'right',
			},
			{
				text: 'OSM Id',
				flex: 3,
				dataIndex: 'osm_id',
				
			},
		]
	},
});