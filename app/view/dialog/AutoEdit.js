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
	closeAction: 'hide',
	title: 'Машина',
	width: 395,
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
					padding: 5,
					margin: 5,
					defaults: {
						labelWidth: 100,
						width: 355,
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
							name: 'time_increase_k',
							fieldLabel: 'Коэфф. увелич. времени пути',
							//anchor: '100%',
							fieldStyle: 'text-align: right;',
							step: 0.05,
							minValue: 0.5,
							maxValue: 3,
							readOnly: false,
							editable: false,
							labelWidth: 190,
							width: 245,
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
									width: 160,
									hourMin: 8,
									hourMax: 20,
									fieldStyle: 'text-align: center;',
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
									fieldLabel: 'до',
									labelWidth: 20,
									hourMin: 8,
									hourMax: 20,
									width: 85,
									fieldStyle: 'text-align: center;',
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
							fieldStyle: 'text-align: center;',
							hourMin: 8,
							hourMax: 20,
							labelWidth: 190,
							width: 245,
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
							fieldStyle: 'text-align: center;',
							hourMin: 8,
							hourMax: 20,
							labelWidth: 190,
							width: 245,
							listeners: {
								change: 'onRouteEndEndTimeChange',
							},
						},
						{
							xtype: 'hiddenfield',
							name: 'route_end_endtime',
						},
						{
							xtype: 'numberfield',
							fieldStyle: 'text-align: right;',
							name: 'maxraces',
							readOnly: false,
							editable: false,
							fieldLabel: 'Макс. кол. рейсов машины',
							value: 1,
							maxValue: 10,
							minValue: 1,
							step: 1,
							labelWidth: 190,
							width: 245,
							listeners: {
								change: 'onMaxOrdersInRouteChange',
							},
						},
						{
							xtype: 'numberfield',
							name: 'race_breaking_time',
							fieldLabel: 'Перерыв между рейсами, мин.',
							fieldStyle: 'text-align: right;',
							step: 10,
							minValue: 10,
							maxValue: 180,
							readOnly: false,
							editable: false,
							labelWidth: 190,
							width: 245,
						},
						{
							xtype: 'fieldset',
							title: 'Максимизировать начальную загрузку по:',
							margin: '0 0 0 0',
							width: 358,
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
										{
											padding: '0 0 0 10',
											xtype: 'checkbox',
											name: 'maximize_capacity',
											inputValue: true,
											uncheckedValue: false,
											checked: true,
											fieldLabel: 'Объем груза',
											labelWidth: 78,
										},
									],
								},
							]
						},
					]
				},

				{
					xtype: 'tabpanel',
					height: 150,
					//width: 400,
					//deferredRender: false,
					activeTab: 0,
					border: 0,
					plain: true,
					defaults: {
						border: 0,
					},
					items: [
						{
							border: false,
							xtype: 'panel',
							title: 'Груз',
							layout: 'vbox',
							height: 160,
							//width: 400,
							padding: 5,
							margin: 5,
							items: [
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
											width: 90,
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
											width: 115,
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
											width: 115,
											padding: '0 0 0 15px',
											editable: false,
										},
									]
								},
								{
									xtype: 'fieldcontainer',
									//padding: '5 0 5 0',
									layout: 'hbox',
									items: [
										{
											xtype: 'numberfield',
											name: 'max_capacity',
											fieldLabel: 'Объем кузова, м.куб.',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											minValue: 1,
											maxValue: 10,
											step: 0.1,
											readOnly: false,
											labelWidth: 125,
											width: 190,
											editable: false,
										},
										{
											xtype: 'numberfield',
											name: 'max_weight',
											fieldLabel: 'Макс. вес, кг.',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											minValue: 100,
											maxValue: 10000,
											step: 100,
											readOnly: false,
											labelWidth: 85,
											width: 150,
											padding: '0 0 0 10px',
											editable: false,
										},
									]
								},

							],
						},
						{
							border: false,
							xtype: 'panel',
							title: 'Группы клиентов',
							layout: 'fit',
							
							height: 160,
							//width: 400,
							items: [
								{
									header: false,		
									//title: 'Допустимые группы клиентов',
									layout: 'fit',
									height: 160,
									//width: 350,
									xtype: 'allowedclientgroups',
									id: 'ordereditallowedclientgroups',
								},
							],
						},
						{
							border: false,
							xtype: 'panel',
							title: 'Топливо',
							layout: 'vbox',
							height: 160,
							//width: 400,
							padding: 5,
							//margin: 5,
							items: [
								{
									xtype: 'fieldcontainer',
									//padding: '5 0 5 0',
									layout: 'hbox',
									items: [
										{
											xtype: 'checkbox',
											name: 'fuel_gas',
											id: 'autoEditFuelGas',
											inputValue: true,
											uncheckedValue: false,
											checked: true,
											fieldLabel: 'Топливо - газ',
											labelWidth: 115,
											listeners: {
												change: 'onChangeFuelGas',
											},
										},
										{
											xtype: 'checkbox',
											name: 'fuel_refuel_by_rate',
											id: 'autoEditRefuelByRate',
											inputValue: true,
											uncheckedValue: false,
											checked: true,
											fieldLabel: 'Заправить по расходу',
											labelWidth: 160,
											autoEl: {
        											tag: 'div',
        											'data-qtip': 'Признак участия в расчете заправок',
    											},
											listeners: {
												//change: 'onChangeFuelGas',
											},
											padding: '0 0 0 58px',
										},
									]
								},
								{
									xtype: 'fieldcontainer',
									//padding: '5 0 5 0',
									layout: 'hbox',
									items: [
										{
											xtype: 'numberfield',
											id: 'autoEditFuelTankCapacity',
											name: 'fuel_tank_capacity',
											fieldLabel: 'Объем бака, л.',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											minValue: 10,
											maxValue: 200,
											step: 1,
											readOnly: false,
											labelWidth: 115,
											width: 180,
											editable: false,
											listeners: {
												change: 'onChangeFuelTankCapacity',
											},
										},
										{
											xtype: 'numberfield',
											id: 'autoEditFuelBalanceBegin',
											name: 'fuel_balance_begin',
											fieldLabel: 'Нач. остаток, л.',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											minValue: 10,
											maxValue: 200,
											step: 1,
											readOnly: false,
											labelWidth: 115,
											width: 180,
											padding: '0 0 0 10px',
											editable: false,
											listeners: {
												change: 'onChangeFuelBalanceBegin',
											},
										},
									]
								},	
								{
									xtype: 'fieldcontainer',
									//padding: '5 0 5 0',
									layout: 'hbox',
									items: [
										{
											xtype: 'numberfield',
											id: 'autoEditFuelRateBy100',
											name: 'fuel_rate_by_100',
											fieldLabel: 'Расход л/100 км.',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											minValue: 5,
											maxValue: 50,
											step: 0.1,
											readOnly: false,
											labelWidth: 115,
											width: 180,
											editable: false,
											listeners: {
												change: 'onChangeFuelRateBy100',
											},
										},
										{
											xtype: 'numberfield',
											id: 'autoEditFuelBalanceMin',
											name: 'fuel_balance_min',
											fieldLabel: 'Кон. остаток, л.',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											minValue: 10,
											maxValue: 200,
											step: 1,
											readOnly: false,
											labelWidth: 115,
											width: 180,
											padding: '0 0 0 10px',
											editable: false,
											listeners: {
												change: 'onChangeFuelBalansMin',
											},
										},
									]
								},	
								{
									readOnly: false,
									editable: false,
									xtype: 'combobox',
									name: 'fuel_first_station',
									id: 'autoEditFirstStation',
									fieldLabel: 'Сначала заправить',
									labelWidth: 115,
									width: 370,
									queryMode: 'local',
									displayField: 'displayField',
									valueField: 'klient_id',
									value: '0',
									//matchFieldWidth: false,
									listeners: {
										//select: 'onDriverSelect',
									},
									tpl: '<tpl for="."><div class="x-boundlist-item">{displayField}</div><hr style="padding: 0px; margin: 0px;" /></tpl>',
								},					
							],
						},
					],
				},

			]
		}
	]
}
);