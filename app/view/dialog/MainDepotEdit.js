Ext.define('Opt.view.dialog.MainDepotEdit', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.maindepotedit',
	requires: [
		'Opt.view.dialog.MainDepotEditController',
		//'Opt.view.DepotGoodsGrid',
		//'Opt.view.AllowedAutosGrid',
	],

	controller: 'maindepotedit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	//stateful: true,
	//stateId: 'orderedit',
	title: 'Главное депо',
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
									xtype: 'timepickeruiws',
									name: 'worktime_begin_1',
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
									name: 'worktime_begin',
								},
								{
									xtype: 'timepickeruiws',
									name: 'worktime_end_1',
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
									name: 'worktime_end',
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
/*
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
*/
			]
		}
	]
});