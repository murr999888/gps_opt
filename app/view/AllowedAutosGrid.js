Ext.define('Opt.view.AllowedAutosGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.allowedautosgrid',
	controller: 'allowedautosgrid',
	requires: [
		'Opt.view.AllowedAutosGridController'
	],

	viewConfig: {
		getRowClass: function (record, rowIndex, rowParams, store) {
			if (!record.get('in_use') == true) {
				return 'row-bk-grey';
			}
		},
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
					handler: 'addAuto',
				},
				{
					text: 'Удалить',
					handler: 'deleteAuto',
				},
			]
		},
	],

	columns: {
		defaults: {
			//menuDisabled: true,
			sortable: false,
			hideable: false,
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
				sortable: true,
				text: 'Машина',
				flex: 5,
				dataIndex: 'name',
				cellWrap: true,
			},
		],
	},
});
