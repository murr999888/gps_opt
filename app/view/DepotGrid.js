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
			sortable: false,
			hideable: false,
			resizable: false,
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
			}
		},
		{
			text: 'Название',
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
			text: 'Окно',
			cellWrap: true,
			flex: 2,
			dataIndex: 'timewindow_string',
		},

		]
	},
});