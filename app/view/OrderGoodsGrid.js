Ext.define('Opt.view.OrderGoodsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.ordergoodsgrid',
	requires: [
		'Opt.view.OrderGoodsGridController',
	],
	controller: 'ordergoodsgrid',
	columns: {
		defaults: {
			hideable: false,
			menuDisabled: false,
			sortable: true,
		},

		items: [
		{
			text: 'Наименование',
			flex: 5,
			dataIndex: 'name',
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