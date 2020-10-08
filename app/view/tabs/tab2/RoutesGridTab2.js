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
			items: [
				{
					//disabled: true,
					value: 0,
					labelWidth: 50,
					margin: '1px 2px 1px 5px',
					xtype: 'combobox',
					id: 'distordersmode',
					fieldLabel: 'Режим',
					store: {
						autoLoad: true,
						fields: ['id', 'name'],
						data: [
							{ id: 0, name: "Создание" },
							{ id: 1, name: "Дополнение" }
						]
					},
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					editable: false,
					listeners: {
						beforeselect: 'onBeforeModeSelect',
						select: 'onModeSelect',
					},
				},
       				{
					disabled: true,
					xtype: 'checkbox',
					labelWidth: 38,
					fieldLabel: 'Обмен',
					value: false,
					checked: false,
					inputValue: true,
					uncheckedValue: false,
					margin : '0 0 0 3px',
					id: 'tab2allowswaporders',
					listeners:{
						change: 'onAllowSwapOrders',
					},
					autoEl: {
        					tag: 'div',
        					'data-qtip': 'Разрешить перераспределение заказов между маршрутами',
    					},
				},
				{
					xtype: 'tbspacer',
					flex: 1,
				},
				{
					disabled: true,
					xtype: 'button',
					id: 'tab2ButtonLoadRoutes',
					text: 'Загрузить из NN',
					handler: 'loadRoutes',
				},
			]
		},
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'button',
					text: 'Отгрузка',
					handler: 'getGoods',
					id: 'tab2getRoutesGoodsButton',
					disabled: true,
					iconCls: 'fa fa-list',
					iconClsBck: 'fa fa-list',
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
					handler: 'openViewer',
					iconCls: 'fa fa-globe',
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
				hideable: false,
				text: 'Машина',
				flex: 3,
				dataIndex: 'auto_name',
				cellWrap: true,
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
				text: 'Нач. план',
				flex: 1,
				align: 'center',
				dataIndex: 'route_begin_plan',
				renderer: 'getTime',
				//sortable: false,	
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
		]

	},
});