Ext.define('Opt.view.OrderUnloadingGoodsGrid', {
	extend: 'Opt.view.OrderGoodsGrid',
	alias: 'widget.orderunloadinggoodsgrid',
	requires: [
		'Opt.view.OrderGoodsGrid',
		'Opt.view.OrderUnloadingGoodsGridController',
	],
	controller: 'orderunloadinggoodsgrid',

	listeners: {
		celldblclick: 'onCellDblClick',
	},

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			defaults: {
				margin: '0 3px 0 3px',
			},
			items: [
				{
					text: 'Добавить',
					handler: 'addOrderString',
				},
				{
					text: 'Удалить',
					handler: 'deleteOrderString',
				},
			]
		},
	],

	plugins: {
        	ptype: 'cellediting',
        	clicksToEdit: 1
    	},

	columns: {
		defaults: {
			menuDisabled: false,
			sortable: true,
			hideable: false
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
			editor: {
                		completeOnEnter: true,
	                	field: {
					xtype: 'numberfield',
                		    	allowBlank: false
		        	},
			},
		},
		]
	},

});