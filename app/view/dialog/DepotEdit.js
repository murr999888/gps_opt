Ext.define('Opt.view.dialog.DepotEdit', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.depotedit',
	requires: [
		'Opt.view.dialog.DepotEditController',
		//'Opt.view.DepotGoodsGrid',
		//'Opt.view.AllowedAutosGrid',
	],

	controller: 'depotedit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	//stateful: true,
	//stateId: 'orderedit',
	title: 'Депо',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	height: 580,  
	width: 500,
	changed: false,
	listeners: {
            	show: 'onShow', 
		//resize: 'onWindowResize',
		//collapse: 'onWindowResize',
		//expand: 'onWindowResize',
	},
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
									xtype: 'timepickeruiws',
									name: 'timewindow_begin_1',
									fieldLabel: 'Время работы с',
									labelWidth: 100,
									width: 145,
									hourMin: 8,
									hourMax: 20,
									listeners: {
										change: 'onWorktimeBeginChange',
									},
								},
								{
									xtype: 'hiddenfield',
									name: 'timewindow_begin',
								},
								{
									xtype: 'timepickeruiws',
									name: 'timewindow_end_1',
									padding: '0 0 0 10px',
									fieldLabel: 'по',
									labelWidth: 20,
									hourMin: 8,
									hourMax: 20,
									width: 75,
									listeners: {
										change: 'onWorktimeEndChange',
									},
								},
								{
									xtype: 'hiddenfield',
									name: 'timewindow_end',
								},
							]
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
							readOnly: false,
							editable: false,
							xtype: 'combobox',
							name: 'delivery_group_id',
							fieldLabel: 'Группа доставки',
							emptyText: '< не выбрана >',
							queryMode: 'local',
							displayField: 'displayField',
							valueField: 'id',
							store: 'DeliveryGroups',
							matchFieldWidth: true,
							listeners: {
								select: 'onDeliveryGroupsSelect',
							},

							listConfig: {
								loadingText: 'Загружается..',
								emptyText: 'Не выбран..',
								//minWidth: 245,
							},
						},
						{
							xtype: 'hiddenfield',
							name: 'delivery_group_name',
						},
						{
							xtype: 'numberfield',
							name: 'service_time_min',
							editable: false,			
							readOnly: false,
							fieldLabel: 'Время погрузки/разгрузки, мин.',
							maxValue: 60,
							minValue: 0,
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
							value: 0,
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
			height: 236,
			width: 400,
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
					title: 'Емкость отгрузки',
					layout: 'fit',
					items: [
						{
							xtype: 'depotgoodsgrid_out',
							id: 'depotEditLoadGoods_out',
							printTitle: 'Емкость отгрузки',
						},
					]
				},
				{
					xtype: 'panel',
					title: 'Емкость возврата',
					layout: 'fit',
					items: [
						{
							xtype: 'depotgoodsgrid_in',
							id: 'depotEditUnLoadGoods_in',
							printTitle: 'Емкость возврата',
						},
					]
				},

			]
		}
	]
});