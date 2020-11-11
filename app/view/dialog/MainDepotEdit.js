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
	height: 430,
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
									name: 'timewindow_begin_1',
									fieldLabel: 'Время работы с',
									labelWidth: 100,
									width: 145,
									hourMin: 8,
									hourMax: 20,
									listeners: {
										change: 'onTimeWindowBeginChange',
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
										change: 'onTimeWindowEndChange',
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
							name: 'city',
							fieldLabel: 'Город',
						},
						{
							xtype: 'field',
							name: 'adres',
							fieldLabel: 'Адрес',
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
							id: 'mainDepotEditLoadGoods',
						},
					]
				},
				{
					xtype: 'panel',
					title: 'Возврат',
					layout: 'fit',
					items: [
						{
							tools: null,
							xtype: 'ordergoodsgrid',
							id: 'mainDepotEditUnLoadGoods',
						},
					]
				},

			]
		}
	]
});