Ext.define('Opt.view.tabs.resultViewer.RoutesGrid', {
	extend: 'Ext.grid.Panel',
	title: 'Маршруты',
	xtype: 'resultviewerroutesgrid',
	alias: 'widget.resultviewerroutesgrid',
	requires: [
		'Opt.view.tabs.resultViewer.RoutesGridController',
	],

	controller: 'resultviewerroutesgrid',
	listeners: {
		celldblclick: 'onCellDblClick',
		cellclick: 'onCellClick',
		select: 'onSelectRow',
	},

	viewConfig: {
		preserveScrollOnRefresh: true,
		getRowClass: function (record, rowIndex, rowParams, store) { },
	},

	tools: [
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		},
	],

	columns: {
		defaults: {
			sortable: true,
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
				}
			},
/*
			{
				text: '#',
				align: 'right',
				width: 30,
				renderer: function (value, metaData, record, rowIndex) {
					return rowIndex + 1;
				}
			},
*/
			{
				hideable: false,
				text: 'Машина',
				flex: 5,
				dataIndex: 'auto_name',
				cellWrap: true,
			},
			{
				text: 'Водитель',
				hidden: true,
				hideable: true,
				flex: 3,
				dataIndex: 'driver_name',
				cellWrap: true,
				hideable: true,
				renderer: 'getDriverName',
			},
			{
				text: 'Нач. план',
				flex: 1,
				align: 'center',
				dataIndex: 'route_begin_plan',
				renderer: 'getTime',
				hideable: true,
			},
			{
				text: 'Кон. план',
				flex: 1,
				align: 'center',
				dataIndex: 'route_end_plan',
				renderer: 'getTime',
				hideable: true,
			},
			{
				text: 'Нач. расч.',
				flex: 1,
				align: 'center',
				dataIndex: 'route_begin_calc',
				renderer: 'getTime',
				hideable: true,
			},
			{
				text: 'Кон. расч.',
				flex: 1,
				align: 'center',
				dataIndex: 'route_end_calc',
				renderer: 'getTime',
				hideable: true,
			},
			{
				text: 'Длина',
				flex: 1,
				align: 'right',
				dataIndex: 'distance',
				hideable: true,
			},
			{
				text: 'Время',
				flex: 1,
				dataIndex: 'duration',
				renderer: 'getTime',
				hideable: true,
			},
			{
				text: 'Вр.общ.',
				flex: 1,
				dataIndex: 'durationFull',
				renderer: 'getTime',
				hideable: true,
			},

			{
				xtype: 'actioncolumn',
				iconCls: 'fa far fa-green fa-edit',
				menuDisabled: true,
				text: 'См.',
				width: 50,
				align: 'center',
				items: [
					{
						tooltip: 'Смотреть',
						handler: 'onEditRecord',
					},
				]
			},

		]
	},
});