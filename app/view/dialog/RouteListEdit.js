Ext.define('Opt.view.dialog.RouteListEdit', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.routelistedit',
	requires: [
		'Opt.view.dialog.RouteListEditController',
		'Opt.view.OrderGoodsGrid',
		'Opt.view.OrdersGrid',
		'Opt.ux.TimePickerUI'
	],

	id: 'routelistedit',
	controller: 'routelistedit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	title: 'Маршрутный лист',
	listeners: {
            	show: 'onShow', 
		close: 'onClose', 
		resize: 'onWindowResize',
		collapse: 'onWindowResize',
		expand: 'onWindowResize',
	},
	items: [
		{
			xtype: 'form',
			reference: 'form',
			border: 0,
			layout: 'hbox',
			items: [
				{
					xtype: 'fieldset',
					border: 0,
					padding: 5,
					margin: 5,
					defaults: {
						labelWidth: 60,
						width: 250,
						readOnly: true,
					},

					items: [
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'field',
									name: 'date_1',
									fieldLabel: 'Дата',
									width: 125,
									labelWidth: 60,
									padding: '0 5px 0 0',
								},
								{
									fieldLabel: 'Х',
									xtype: 'field',
									name: 'race_number',
									labelWidth: 10,
									width: 30,
									padding: '0 5px 0 0',
									fieldCls: 'right',
								},
								{
									xtype: 'image',
									id: 'routelistedit_icon_refuel',
									src: 'css/images/gas_station_32x32.png',
									width: 20,
								},
								{
									xtype: 'field',
									name: 'refuel_capacity',
									width: 25,
									padding: '0 5px 0 5px',
									fieldCls: 'right',
								},
								{
									xtype: 'image',
									id: 'routelistedit_icon_reload',
									src: '',
									width: 20,
									margin: 2,
								},
								
							],
						},

						{
							xtype: 'hidden',
							name: 'date',
						},

						{
							xtype: 'field',
							name: 'auto_name',
							fieldLabel: 'Машина',
						},
						{
							readOnly: false,
							editable: false,
							//value: 0,
							xtype: 'combobox',
							name: 'driver_id',
							//id: 'autoEditDriverCombo',
							fieldLabel: 'Водитель',
							emptyText: '< нет данных >',
							queryMode: 'local',
							displayField: 'name',
							valueField: 'id',
							store: 'Drivers',
							matchFieldWidth: false,
							listeners: {
								select: 'onDriverSelect',
							},

							triggers: {
								refresh: {
									cls: 'x-form-search-trigger',
									handler: 'refreshDriver',
								},
							},

							listConfig: {
								loadingText: 'Загружается..',
								minWidth: 185,
							},

						},

						{
							xtype: 'hiddenfield',
							name: 'driver_name',
						},

						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									disabled: true,
									xtype: 'timepickerui',
									name: 'route_begin_1',
									fieldLabel: 'Выезд',
									labelWidth: 60,
									width: 122,
								},
								{
									padding: '0 0 0 12',
									disabled: true,
									xtype: 'timepickerui',
									name: 'route_end_1',
									fieldLabel: 'Возврат',
									labelWidth: 55,
									width: 128,
								},
							],
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'field',
									name: 'distance',
									fieldLabel: 'Длина',
									labelWidth: 60,
									width: 122,
									fieldStyle: 'text-align: right;',
								},
								{
									padding: '0 0 0 12',
									xtype: 'timepickerui',
									disabled: true,
									name: 'duration_1',
									fieldLabel: 'Время',
									labelWidth: 55,
									width: 128,
								},
							],
						},
						{
							xtype: 'timepickerui',
							disabled: true,
							name: 'durationFull_1',
							fieldLabel: 'Общее время маршрута',
							labelWidth: 189,
							width: 250,

						},
					]
				},
				{
					stateful: true,
					stateId: 'routelistEditgoods',
					xtype: 'ordergoodsgrid',
					title: 'Начальная загрузка',
					id: 'routelistEditgoods',
					width: 430,
					height: 163,
				},

			]
		},
		{
			stateful: true,
			stateId: 'routelistEditorders',
			xtype: 'ordersgridpanel',
			title: 'Заказы',
			id: 'routelistEditorders',
			width: 700,
			height: 240,
		}

	]

});