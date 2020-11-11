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
			{	
				menuDisabled: true,
				hideable: false,
				sortable: false,
				resizable: false,
				//text: '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>',       
				text: '?',
				width: 25,
				renderer: 'getIcon',
				align: 'center',
			},
			{
				hideable: true,
				text: 'Машина',
				flex: 3,
				dataIndex: 'auto_name',
				cellWrap: true,
			},
			{
				hideable: true,
				text: 'Кратко',
				flex: 2,
				dataIndex: 'auto_name_short',
				cellWrap: true,
				hidden: true,
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
				hideable: true,
				hidden: true,
				text: 'Р',
				align: 'center',
				width: 25,
				dataIndex: 'race_number',
				renderer: 'getNumbers',
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
				align: 'center',
				dataIndex: 'distance',
				hideable: true,
				renderer: 'getNumbers',
			},
			{
				text: 'Время',
				flex: 1,
				dataIndex: 'duration',
				renderer: 'getTime',
				hideable: true,
				align: 'center',
			},
			{
				text: 'Вр.общ.',
				flex: 1,
				dataIndex: 'durationFull',
				renderer: 'getTime',
				hideable: true,
				align: 'center',
			},
                        {
				text: 'Зак.',
				flex: 1,
				align: 'right',
				dataIndex: 'ordersCount',
				hideable: true,
				sortable: true,	
				hidden: false,
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