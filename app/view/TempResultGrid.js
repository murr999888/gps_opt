Ext.define('Opt.view.TempResultGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.tempresultgrid',
	requires: [
		'Opt.view.TempResultGridController',
	],

	tools: [
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	store: 'TempResults',

	controller: 'tempresultgrid',

	columns: {
		defaults: {
			menuDisabled: true,
			sortable: false,
			hideable: false
		},

		items: [
			{
				text: 'user_id',
				flex: 1,
				dataIndex: 'user_id',
				cellWrap: true,
			},
			{
				text: 'Закончен',
				flex: 2,
				dataIndex: 'calc_time',
				//cellWrap: true,
				renderer: 'getTime',
			},
			{
				text: 'Длит.',
				flex: 1,
				dataIndex: 'calc_time',
				//cellWrap: true,
				renderer: 'getCalcDuration',
			},
			{
				text: 'Машин',
				flex: 1,
				renderer: 'getAutosCount',
			},
			{
				text: 'Зак.',
				flex: 1,
				renderer: 'getOrdersCount',
			},
			{
				text: 'Отброшено',
				flex: 1,
				renderer: 'getDroppedCount',
			},
			{
				text: 'Общ. вр.',
				flex: 1,
				renderer: 'getDuration',
			},
			{
				text: 'Общ. расст.',
				flex: 1,
				renderer: 'getDistance',
			},
		]
	},
});