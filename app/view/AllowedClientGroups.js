Ext.define('Opt.view.AllowedClientGroups', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.allowedclientgroups',
	controller: 'allowedclientgroups',
	requires: [
		'Opt.view.AllowedClientGroupsController'
	],

	viewConfig: {
		getRowClass: function (record, rowIndex, rowParams, store) {
			if (!record.get('in_use') == true) {
				return 'row-bk-grey';
			}
		},
	},

	tools: [
		{
			type: 'refresh',
			handler: 'refreshClientGroups',
			tooltip: 'Обновить список',
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
				text: 'Группа',
				flex: 5,
				dataIndex: 'name',
				cellWrap: true,
			},
		],
	},
});
