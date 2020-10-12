Ext.define('Opt.view.DroppedGrid', {
	extend: 'Opt.view.RouteLegGrid',
	title: 'Отброшенные заказы',
	alias: 'widget.droppedgridpanel',
	requires: [
		'Opt.view.DroppedGridController',
	],

	controller: 'droppedgrid',

	tools: [{
		type: 'print',
		handler: 'printTable',
		tooltip: 'Печать'
	}],

	columns: {
		defaults: {
			menuDisabled: false,
			sortable: true,
			hideable: false,
		},
		items: [
		{
			text: '#',
			align: 'right',
			flex: 1,
			dataIndex: 'num_in_routelist',
		},
		{
			text: 'Пункт',
			cellWrap: true,
			flex: 5,
			dataIndex: 'full_name',
			renderer: 'getSod',
		},
		{
			text: 'Город',
			cellWrap: true,
			flex: 5,
			dataIndex: 'city',
			renderer: 'getCity',
			hideable: true,
		},
		{
			text: 'Разгр.',
			align: 'center',
			flex: 1,
			dataIndex: 'service_time',
			renderer: 'getServiceTime',
			hideable: true,
		},
		{
			text: 'Ш',
			align: 'right',
			flex: 1,
			dataIndex: 'penalty',
			hideable: true,
		},

		{
			text: 'Окно',
			cellWrap: true,
			flex: 2,
			dataIndex: 'timewindow_string',
		},

       		{
			xtype: 'actioncolumn',
			iconCls: 'fa far fa-green fa-edit',
			menuDisabled: true,
			text: 'Ред.',
			tooltip: 'Открыть заказ',
			//width: 50,
			flex: 1,
			align: 'center',
			items: [{
				tooltip: 'Редактировать',
				handler: 'onEditRecord',

				getClass: function (value, metaData, record) {
					//console.log(metaData);
					if (record.get("node_type") == 0) {
						return '';
					}
					return 'fa far fa-green fa-edit';
				},

				isDisabled: function (view, rowIndex, colIndex, item, record) {
					// Returns true if 'editable' is false (, null, or undefined)
					return record.get('node_type') == 0;
				}
			}]
		},

		]
	},
});