Ext.define('Opt.view.tabs.tab2.OrdersGridTab2', {
	extend: 'Opt.view.RouteLegGrid',
	//extend: 'Ext.grid.Panel',
	title: 'Список заказов',
	alias: 'widget.tab2ordersgridpanel',
	xtype: 'tab2ordersgridpanel',
	requires: [
		'Opt.view.RouteLegGrid',
		'Opt.view.tabs.tab2.OrdersGridTab2Controller',
	],

	controller: 'tab2ordersgrid',
	allowDeselect: true,
	tools: [
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		},
	],

	listeners: {
		celldblclick: 'onCellDblClick',
		cellclick: 'onCellClick',
	},

	viewConfig: {
		preserveScrollOnRefresh: false,
		getRowClass: function (record, rowIndex, rowParams, store) {
			var cl = '';
			if (!record.get('in_use')) {
				cl = cl + ' row-bk-grey';
			}

			return cl;
		},
	},

	bufferedRenderer: false,
	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			defaults: {
				margin: '0 3px 0 3px',
			},

			items: [
				{
					xtype: 'checkbox',
					value: !testmode,
					id: 'tab2onlyfreeorders',
					fieldLabel: 'Н/в',
					labelWidth: 30,
					stateful: true,
					stateId: 'tab2onlyfreeorders',
					stateEvents: ['change', 'check'],
					listeners: {
						change: 'onChangeOnlyFreeOrders',
					},
					getState: function () {
						return { "checked": this.getValue() };
					},
					applyState: function (state) {
						this.setValue(state.checked);
					},
				},
				{
					xtype: 'tbspacer',
					flex: 1,
				},
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
								id: 'tab2getOrdersUnloadingGoodsButton',
							},
							{
								text: 'Погрузка',
								handler: 'getLoadingGoods',
								id: 'tab2getOrdersLoadingGoodsButton',
							}

						],
					},
				},
				{
					xtype: 'button',
					text: 'Получить',
					handler: 'getOrders',
					iconCls: 'fa fa-download',
					iconClsBck: 'fa fa-download',
				},
				{
					xtype: 'button',
					text: 'Изменить',
					iconCls: 'fa fa-edit',
					iconClsBck: 'fa fa-edit',
					menu: {
						items: [
							{
								text: 'Штраф',
								handler: 'setPenalty',
								iconCls: 'fa fa-ban',
							},
							{
								text: 'Установить время разгрузки',
								handler: 'setServiceTime',
								iconCls: 'fa fa-clock-o',
							},                                            
							{
								text: 'Изменить время разгрузки',
								handler: 'addServiceTime',
								iconCls: 'fa fa-clock-o',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Установить допустимые машины',
								handler: 'setAutos',
								iconCls: 'fa fa-truck',
							},
							{
								text: 'Удалить допустимые машины',
								handler: 'removeAutos',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Установить группу доставки',
								handler: 'setDeliveryGroup',
								iconCls: 'fa fa-object-group',
							},

							{
								text: 'Обновить координаты',
								handler: 'refreshCoords',
								iconCls: 'fa fa-globe',
							},

							{
								xtype: 'menuseparator',
							},
							{
								text: 'Выделить все',
								handler: 'setAllSelected',
								iconCls: 'fa fa-check',
							},
							{
								text: 'Снять выделение со всех',
								handler: 'setAllDeselected',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Выделить отмеченные',
								handler: 'setMarkedSelected',
								iconCls: 'fa fa-check',
							},
							{
								text: 'Снять выделение с отмеченных',
								handler: 'setMarkedDeselected',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Отметить выделенные',
								handler: 'setMarkOnSelected',
								iconCls: 'fa fa-check-square',
							},
							{
								text: 'Снять отметку с выделенных',
								handler: 'clearMarkOnSelected',
								iconCls: 'fa fa-square',
							},
						]
					},
				},
				{
					xtype: 'button',
					text: 'Очистить',
					handler: 'clearData',
					iconCls: 'fa fa-trash-o',
					iconClsBck: 'fa fa-trash-o',
				},
				{
					xtype: 'button',
					text: 'Расчет',
					handler: 'sendData',
					iconCls: 'fa fa-calculator',
					iconClsBck: 'fa fa-calculator',
				},
			]
		},
	],

	columns: {
		defaults: {
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
					beforeheadercheckchange: 'beforeHeaderCheckChange',
				}
			},
			{
				hideable: false,
				text: 'Пункт',
				cellWrap: true,
				flex: 5,
				dataIndex: 'full_name',
				renderer: 'getSod',
			},
			{
				hideable: true,
				hidden: true,
				text: 'Группа',
				cellWrap: true,
				flex: 5,
				dataIndex: 'klient_group_name',
			},
			{
				hideable: true,
				hidden: true,
				text: 'Город',
				cellWrap: true,
				flex: 5,
				renderer: 'getCity',
				dataIndex: 'city',
			},
			{
				text: 'Разгр.',
				flex: 1,
				align: 'center',
				dataIndex: 'service_time',
				renderer: 'getServiceTime',
			},
			{
				text: 'Ш',
				flex: 1,
				align: 'right',
				dataIndex: 'penalty',
			},
			{
				sortable: false,
				text: 'Окно',
				cellWrap: true,
				flex: 2,
				align: 'center',
				dataIndex: 'timewindow_string',
			},
		]
	},

	removeButtonIcons: function(){
		var items = this.down('toolbar').items.items;
		Ext.each(items, function(item){
			if(item.iconClsBck) {
                       		item.setIconCls('');
			}
		});
	},

	setButtonIcons: function(){
		var items = this.down('toolbar').items.items;
		Ext.each(items, function(item){
			if(item.iconClsBck) {
                       		item.setIconCls(item.iconClsBck);
			}
		});
	},


});