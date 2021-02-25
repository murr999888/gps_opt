Ext.define('Opt.view.tabs.tab2.RoutesGridTab2', {
	extend: 'Ext.grid.Panel',
	title: 'Маршруты',
	xtype: 'tab2routesgrid',
	alias: 'widget.tab2routesgrid',
	requires: [
		'Opt.view.tabs.tab2.RoutesGridTab2Controller',
	],

	controller: 'tab2routesgrid',
	listeners: {
		celldblclick: 'onCellDblClick',
	},
	viewConfig: {
		//preserveScrollOnRefresh: true,
		getRowClass: function (record, rowIndex, rowParams, store) {
			if (!record.get('in_use') == true) {
				return 'row-bk-grey';
			}
		},
	},

	tools: [
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать',
		},
	],
	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			id: 'tab2routestoolbar',
			items: [
				{
					xtype: 'button',
					text: 'Груз',
					iconCls: 'fa fa-list',
					iconClsBck: 'fa fa-list',
					menu: {
						items: [
							{
								text: 'Отгрузка',
								handler: 'getUnloadingGoods',
								id: 'tab2getRoutesUnloadingGoodsButton',
								//disabled: true,
							},
							{
								text: 'Погрузка',
								handler: 'getLoadingGoods',
								id: 'tab2getRoutesLoadingGoodsButton',
								//disabled: true,
							},
						],
					},					
				},
				{
					xtype: 'button',
					text: 'Печать',
					id: 'tab2getRoutesPrintButton',
					//disabled: true,
					iconCls: 'fa fa-print',
					iconClsBck: 'fa fa-print',
					menu: {
						items: [
							{
								text: 'Загрузка',
								handler: 'printLoadList',
								iconCls: 'fa fa-list',
							},
							{
								text: 'Сводка',
								handler: 'printAutosList',
								iconCls: 'fa fa-list',
							},
						],
					},
				},

				{
					xtype: 'button',
					text: 'Сохранить',
					handler: 'saveRoutes',
					iconCls: 'fa fa-save',
				},
				{
					xtype: 'button',
					text: 'Очистить',
					iconCls: 'fa fa-trash-o',
					handler: 'onPressClearRoutes',
				},
				{
					xtype: 'button',
					text: 'Карта',
					//disabled: true,
					id: 'tab2mapbutton',
					handler: 'openViewer',
					iconCls: 'fa fa-globe',
				},
				{
					xtype: 'tbspacer',
					flex: 1,
				},
				{
					xtype: 'button',
					text: 'Результаты',
					disabled: true,
					id: 'tab2resultsbutton',
					handler: 'openResultDialog',
					iconCls: 'fa fa-undo',
				},
			]
		},
	],

	columns: {
		defaults: {
			sortable: true,
			hideable: false,
		},

		items: [
			{
				resizable: false,
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
				hideable: true,
				text: 'Водитель',
				flex: 3,
				dataIndex: 'driver_name',
				cellWrap: true,
				renderer: 'getDriverName',
			},
			{
				hideable: true,
				hidden: true,
				text: 'Р',
				width: 25,
				dataIndex: 'race_number',
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
				//sortable: false,	
				hideable: true,
			},
			{
				text: 'Нач. расч.',
				flex: 1,
				align: 'center',
				dataIndex: 'route_begin_calc',
				renderer: 'getTime',
				//sortable: false,	
				hideable: true,
			},
			{
				text: 'Кон. расч.',
				flex: 1,
				align: 'center',
				dataIndex: 'route_end_calc',
				renderer: 'getTime',
				//sortable: false,	
				hideable: true,
			},
			{
				text: 'Длина',
				flex: 1,
				dataIndex: 'distance',
				hideable: true,
				align: 'right',
			},
			{
				text: 'Время',
				flex: 1,
				align: 'center',
				dataIndex: 'duration',
				renderer: 'getTime',
				hideable: true,
			},
			{
				text: 'Вр.общ.',
				flex: 1,
				align: 'center',
				dataIndex: 'durationFull',
				renderer: 'getTime',
				hideable: true,
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
				text: 'Запр.',
				flex: 1,
				align: 'right',
				dataIndex: 'refuel_capacity',
				hideable: true,
				sortable: true,	
				hidden: false,
			},
		]
	},
});