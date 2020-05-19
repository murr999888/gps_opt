Ext.define('Opt.view.dialog.AutoEdit', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.autoedit',
	requires: [
		'Opt.view.dialog.AutoEditController',
		'Opt.view.AllowedClientGroups',
		'Opt.ux.TimePickerUIWS',
	],

	controller: 'autoedit',
	modal: true,
	closable: true,
	closeAction: 'destroy',
	//stateful: true,
	//stateId: 'autoedit',
	title: 'Машина',
	items: [
		{
			xtype: 'form',
			reference: 'form',
			items: [
				{
					xtype: 'fieldset',
					padding: 5,
					margin: 5,
					defaults: {
						labelWidth: 100,
						width: 350,
						readOnly: true,
					},

					items: [
						{
							xtype: 'field',
							name: 'name_short',
							fieldLabel: 'Кратко',
						},
						{
							xtype: 'field',
							name: 'name',
							fieldLabel: 'Наименование',
						},
						{
							readOnly: false,
							editable: false,
							xtype: 'combobox',
							name: 'driver_id',
							id: 'autoEditDriverCombo',
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
								emptyText: 'Не выбран..',
								minWidth: 245,
							},
						},
						{
							xtype: 'hiddenfield',
							name: 'driver_name',
						},
						{
							xtype: 'numberfield',
							name: 'cost_k',
							fieldLabel: 'Коэффициент стоимости машины',
							anchor: '100%',
							fieldStyle: 'text-align: right;',
							step: 0.1,
							minValue: 1,
							maxValue: 3,
							readOnly: true,
							editable: false,
							labelWidth: 290,
							width: 350,
						},
						{
							xtype: 'numberfield',
							name: 'time_increase_k',
							fieldLabel: 'Коэффициент увеличения времени пути',
							anchor: '100%',
							fieldStyle: 'text-align: right;',
							step: 0.05,
							minValue: 0.5,
							maxValue: 3,
							readOnly: false,
							editable: false,
							labelWidth: 290,
							width: 350,
						},
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
							xtype: 'timepickeruiws',	
							id: 'route_begin_timepickeruiws',
							name: 'route_begin_endtime_1',
							fieldLabel: 'Выехать до:',
							labelWidth: 100,
							hourMin: 8,
							hourMax: 20,
							width: 145,
							listeners: {
								change: 'onRouteBeginEndTimeChange',
							},
						},
						{
							xtype: 'hiddenfield',
							name: 'route_begin_endtime',
						},
						{
							xtype: 'timepickeruiws',
							name: 'route_end_endtime_1',
							fieldLabel: 'Вернуться до:',
							labelWidth: 100,
							hourMin: 8,
							hourMax: 20,
							width: 145,
							listeners: {
								change: 'onRouteEndEndTimeChange',
							},
						},
						{
							xtype: 'hiddenfield',
							name: 'route_end_endtime',
						},
{
							xtype: 'fieldcontainer',
							//padding: '5 0 5 0',
							layout: 'hbox',
							items: [
								{
									xtype: 'numberfield',
									name: 'water',
									fieldLabel: 'Вода',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									minValue: 0,
									maxValue: 10000,
									step: 100,
									readOnly: false,
									labelWidth: 30,
									width: 100,
									editable: false,
								},
								{
									xtype: 'numberfield',
									name: 'bottle',
									fieldLabel: 'Баллоны',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									minValue: 0,
									maxValue: 1000,
									step: 1,	
									readOnly: false,
									labelWidth: 50,
									width: 110,
									padding: '0 0 0 15px',
									editable: false,
								},
								{
									xtype: 'numberfield',
									name: 'tank',
									fieldLabel: 'Емкости',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									minValue: 0,
									maxValue: 10,
									step: 1,
									readOnly: false,
									labelWidth: 50,
									width: 110,
									padding: '0 0 0 15px',
									editable: false,
								},
							]
						},
						{
							xtype: 'fieldset',
							title: 'Максимизировать начальную загрузку по:',
							items: [
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									items: [
										{
											xtype: 'checkbox',
											name: 'maximize_water',
											checked: true,
											inputValue: true,
											uncheckedValue: false,
											fieldLabel: 'Вода, л.',
											labelWidth: 50,
										},
										{
											padding: '0 0 0 10',
											xtype: 'checkbox',
											name: 'maximize_bottle',
											inputValue: true,
											uncheckedValue: false,
											checked: true,
											fieldLabel: 'Баллон 19 л.',
											labelWidth: 78,
										},
									],
								},
							]
						},
					]
				}
			]
		},
		{
			border: false,
			xtype: 'panel',
			layout: 'fit',
			height: 160,
			width: 374,
			items: [
				{
					title: 'Допустимые группы клиентов',
					layout: 'fit',
					height: 160,
					//width: 350,
					xtype: 'allowedclientgroups',
					id: 'ordereditallowedclientgroups',
				},
			],
		},

	]
});