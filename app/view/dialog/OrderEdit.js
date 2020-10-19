Ext.define('Opt.view.dialog.OrderEdit', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.orderedit',
	requires: [
		'Opt.view.dialog.OrderEditController',
		'Opt.view.OrderGoodsGrid',
		'Opt.view.AllowedAutosGrid',
	],

	controller: 'orderedit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	title: 'Заказ',
	listeners: {
            	show: 'onShow', 
		close: 'onClose', 
		resize: 'onWindowResize',
		collapse: 'onWindowResize',
		expand: 'onWindowResize',
	},
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	height: 530,
	changed: false,
	items: [
		{
			xtype: 'form',
			reference: 'form',
			items: [
				{
					xtype: 'fieldset',
					border: 0,
					margin: 5,
					defaults: {
						labelWidth: 70,
						width: 350,
						readOnly: true,
					},

					items: [
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'field',
									name: 'order_number',
									fieldLabel: 'Заказ',
									labelWidth: 70,
									width: 160,
								},

								{
									xtype: 'field',
									name: 'order_date',
									fieldLabel: 'от',
									labelWidth: 30,
									width: 180,
									padding: '0 0 0 10px',
								},
							]
						},

						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'field',
									name: 'num_in_routelist',
									fieldLabel: '№ в МЛ',
									labelWidth: 70,
									width: 160,
									border: 1
								},
								{
									xtype: 'field',
									name: 'timewindow_string',
									fieldLabel: 'окно',
									labelWidth: 30,
									width: 180,
									padding: '0 0 0 10px',
								},
							]
						},
						{
							xtype: 'field',
							name: 'klient_group_name',
							fieldLabel: 'Группа',
						},
						{
							xtype: 'hiddenfield',
							name: 'klient_group_id',
						},
						{
							xtype: 'field',
							name: 'klient_name',
							fieldLabel: 'Клиент',
						},
						{
							xtype: 'field',
							name: 'tochka_name',
							fieldLabel: 'Точка',
						},

						{
							xtype: 'field',
							name: 'city',
							fieldLabel: 'Город',
						},
						{
							xtype: 'field',
							name: 'adres',
							fieldLabel: 'Адрес',
						},
						{
							xtype: 'field',
							name: 'dop',
							fieldLabel: 'Дополнение',
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'field',
									name: 'lat',
									fieldLabel: 'lat',
									labelWidth: 70,
									width: 160,
									border: 1
								},
								{
									xtype: 'field',
									name: 'lon',
									fieldLabel: 'lon',
									labelWidth: 30,
									width: 180,
									padding: '0 0 0 10px',
								},
							]
						},
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'field',
									name: 'weight',
									fieldLabel: 'Вес, кг.',
									labelWidth: 70,
									width: 160,
									border: 1
								},
								{
									xtype: 'field',
									name: 'capacity',
									fieldLabel: 'Объем, м.куб.',
									labelWidth: 90,
									width: 180,
									padding: '0 0 0 10px',
								},
							]
						},
						{
							xtype: 'numberfield',
							name: 'service_time_min',
							editable: false,			
							readOnly: false,
							fieldLabel: 'Время разгрузки, мин.',
							anchor: '100%',
							maxValue: 60,
							minValue: 1,
							step: 1,
							labelWidth: 280,
							labelStyle: 'color:blue',
							fieldStyle: 'text-align: right;color:blue;',
							listeners: {
								change: 'onServiceTimeMinChange',
							},
						},
						{
							xtype: 'hidden',
							name: 'service_time',
						},
						{
							xtype: 'numberfield',
							name: 'penalty',
							editable: false,
							readOnly: false,
							fieldLabel: 'Штраф за отказ от посещения',
							anchor: '100%',
							value: 30,
							maxValue: 300,
							minValue: 0,
							step: 5,
							labelWidth: 280,
							labelStyle: 'color:brown',
							fieldStyle: 'text-align: right;color:brown;',
							listeners: {
								change: 'onPenaltyChange',
							},
						},
					]
				},
			]
		},
		{
			xtype: 'tabpanel',
			height: 150,
			width: 300,
			deferredRender: false,
			activeTab: 0,
			border: 0,
			plain: true,
			defaults: {
				border: false,
			},
			items: [
				{
					xtype: 'panel',
					title: 'Отгрузка',
					layout: 'fit',
					items: [
						{
							tools: null,
							xtype: 'ordergoodsgrid',
							id: 'ordereditgoods',
						},
					]
				},
				{
					xtype: 'panel',
					title: 'Допустимые машины',
					layout: 'fit',
					items: [
						{
							xtype: 'allowedautosgrid',
							id: 'ordereditallowedautos',
						},
					],

				}
			]
		}
	]
});