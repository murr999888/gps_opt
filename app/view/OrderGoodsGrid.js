Ext.define('Opt.view.OrderGoodsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.ordergoodsgrid',
	requires: [
		'Opt.view.OrderGoodsGridController',
	],

	tools: [{
		type: 'print',
		handler: 'printTable',
		tooltip: 'Печать'
	}],

	controller: 'ordergoodsgrid',

	columns: {
		defaults: {
			menuDisabled: true,
			sortable: false,
			hideable: false
		},

		items: [{
			text: 'Наименование',
			flex: 5,
			dataIndex: 'full_name',
			cellWrap: true,
		},
		{
			text: 'Ед.',
			flex: 1,
			dataIndex: 'ed',
		},
		{
			text: 'Кол.',
			align: 'right',
			flex: 1,
			dataIndex: 'kolvo',
		},
		]
	},
});