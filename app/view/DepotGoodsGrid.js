Ext.define('Opt.view.DepotGoodsGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.depotgoodsgrid',
	requires: [
		'Opt.view.DepotGoodsGridController',
	],

	tools: [
		{
			type: 'refresh',
			handler: 'refreshGoods',
			tooltip: 'Загрузить список товаров'
		},
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	viewConfig: {
		stripeRows: false,
		preserveScrollOnRefresh: true,
		getRowClass: function (record, rowIndex, rowParams, store) {
			var cl = '';

			if (!record.get('in_use') == true) {
				cl = cl + ' row-bk-grey';
			}
			return cl;
		},
	},

	bufferedRenderer: false,

	controller: 'depotgoodsgrid',

	plugins: {
        	ptype: 'cellediting',
        	clicksToEdit: 1
    	},

	columns: {
		defaults: {
			menuDisabled: true,
			sortable: false,
			hideable: false
		},

		items: [
			{
				hideable: false,
				xtype: 'checkcolumn',
				text: '',
				dataIndex: 'in_use',
				menuDisabled: true,
				tooltip: 'Используется при расчете',
				headerCheckbox: true,
				width: 25,
				listeners: {
					checkchange: 'onChangeInUse',
					headercheckchange: 'onHeaderCheckChange',
				},
			},
			{
				text: 'Наименование',
				flex: 5,
				dataIndex: 'name',
				cellWrap: true,
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
		        	        }
	            		}
			},
		]
	},
});

Ext.define('Opt.view.DepotGoodsGridIn', {
	extend: 'Opt.view.DepotGoodsGrid',
	alias: 'widget.depotgoodsgrid_in',
});

Ext.define('Opt.view.DepotGoodsGridOut', {
	extend: 'Opt.view.DepotGoodsGrid',
	alias: 'widget.depotgoodsgrid_out',
});