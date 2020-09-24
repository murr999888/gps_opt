Ext.define('Opt.view.DepotGrid', {
	extend: 'Opt.view.RouteLegGrid',
	title: 'Депо',
	alias: 'widget.depotgridpanel',
	requires: [
		'Opt.view.DepotGridController',
	],

	controller: 'depotgrid',

	tools: [{
		type: 'print',
		handler: 'printTable',
		tooltip: 'Печать'
	}],

	store: 'Depots',

	columns: {
		defaults: {
			menuDisabled: false,
			sortable: true,
			hideable: false,
		},
		items: [
		{
			text: 'Название',
			cellWrap: true,
			flex: 5,
			dataIndex: 'full_name',
		},
		{
			text: 'Город',
			cellWrap: true,
			flex: 5,
			dataIndex: 'city',
			renderer: 'getCity',
			hideable: true,
			hidden: true,
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

/*
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
					if (record.get("isDepot") == true) {
						return '';
					}
					return 'fa far fa-green fa-edit';
				},

				isDisabled: function (view, rowIndex, colIndex, item, record) {
					// Returns true if 'editable' is false (, null, or undefined)
					return record.get('isDepot') == true;
				}
			}]
		},
*/

		]
	},
});