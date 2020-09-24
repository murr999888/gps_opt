Ext.define('Opt.view.TrafficGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.trafficgridpanel',
	requires: [
		'Opt.view.TrafficGridController',
	],

	controller: 'trafficgrid',

	tools: [{
		type: 'print',
		handler: 'printTable',
		tooltip: 'Печать'
	}],

	store: 'Traffic',

	columns: {
		defaults: {
			menuDisabled: false,
			sortable: true,
		},
		items: [
			{
				text: 'Название',
				cellWrap: true,
				flex: 5,
				dataIndex: 'name',
				hideable: false,
			},
			{
				text: 'Скорость',
				flex: 1,
				dataIndex: 'speed',
				hideable: true,
				align: 'right',
			},
			{
				xtype: 'actioncolumn',
				iconCls: 'fa far fa-green fa-edit',
				menuDisabled: true,
				text: 'Ред.',
				tooltip: 'Открыть участок',
				//width: 50,
				flex: 1,
				align: 'center',
				items: [
					{
						tooltip: 'Редактировать',
						handler: 'onEditRecord',
					}
				],
			},
		]
	},
});