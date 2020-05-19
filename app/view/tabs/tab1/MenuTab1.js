Ext.define('Opt.view.tabs.tab1.MenuTab1', {
	extend: 'Ext.panel.Panel',
	xtype: 'menutab1',
	alias: 'widget.menutab1',
	controller: 'menutab1controller',
	requires: [
		'Opt.view.tabs.tab1.MenuTab1Controller',
		'Opt.view.tabs.tab1.RouteLegGridTab1',
		'Opt.view.tabs.tab1.DroppedGridTab1',
		'Opt.ux.DatePickerUI',
		'Opt.ux.TimePickerUI',
	],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	stateful: true,
	stateId: 'optmenutab1',
	header: {
		titlePosition: 0,
	},
	tools: [
		{
			type: 'refresh',
			handler: 'setDefaultValues',
			tooltip: 'Сбросить'
		}
	],
	items: [
		{
			xtype: 'form',
			reference: 'formtab1',
			id: 'formtab1',
			height: 157,
			border: 0,
			items: [
				{
					xtype: 'fieldcontainer',
					layout: 'hbox',
					height: 125,
					items: [
						{
							flex: 1,
							xtype: 'fieldset',
							layout: 'vbox',
							height: 125,
							padding: 5,
							items: [
								{
									xtype: 'fieldset',
									border: 0,
									padding: 0,
									width: 280,
									height: 78,
									defaults: {
										labelWidth: 55,
										editable: false,
									},
									items: [
										{
											xtype: 'datepickerui',
											id: 'menutab1tracker_date',
											fieldLabel: 'Дата',
											name: 'tracker_date',
											leftMargin: -60,
											value: new Date(), // defaults to today
											listeners: {
												change: 'onTrackerDateChange',
											}
										},
										{
											value: 0,
											xtype: 'combobox',
											id: 'menutab1trackerselect',
											name: 'auto',
											fieldLabel: 'Машина',
											store: 'Auto',
											queryMode: 'local',
											displayField: 'name',
											valueField: 'id',
											matchFieldWidth: true,
											width: 275,
											listeners: {
												select: 'onAutoSelect',
												afterrender: 'setAutoComboFirstRow'
											},
											listConfig: {
												loadingText: 'Загружается..',
											},

										},

										{
											value: 0,
											xtype: 'combobox',
											id: 'menutab1mlselect',
											name: 'selectedml',
											fieldLabel: 'МЛ',
											emptyText: '< нет данных >',
											queryMode: 'local',
											displayField: 'description',
											valueField: 'id',
											matchFieldWidth: false,
											width: 275,
											listeners: {
												select: 'onMlSelect',
											},
											triggers: {
												refresh: {
													cls: 'x-form-search-trigger',
													handler: 'refreshRouteLists',
												},
											},

											listConfig: {
												loadingText: 'Загружается..',
												minWidth: 210,
											},
										},
									],
								},
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									items: [
										{
											//margin: '-5 0 0 0',
											padding: 0,
											width: 120,
											labelWidth: 55,
											leftMargin: -64,
											hourMin: 8,
											hourMax: 20,
											value: def_route_time_begin,
											xtype: 'timepickerui',
											id: 'menutab1tracker_time_begin_1',
											name: 'tracker_time_begin_1',
											align: 'center',
											fieldLabel: 'c:',
											listeners: {
												change: 'onTimeBeginSelect',
											},
										},
										{
											xtype: 'hiddenfield',
											name: 'tracker_time_begin',
											value: 28800,
										},
										{
											xtype: 'checkbox',
											name: 'usePlanTime',
											padding: '0 0 0 36px',
											checked: true,
											inputValue: true,
											uncheckedValue: false,
											fieldLabel: 'Плановое время',
											labelWidth: 100,
											stateful: true,
											stateId: 'tab1usePlanTime',
											stateEvents: ['change', 'check'],
											listeners: {
												change: 'onChangeUsePlanTime',
											},
											getState: function () {
												return { "checked": this.getValue() };
											},
											applyState: function (state) {
												this.setValue(state.checked);
											},
											autoEl: {
        											tag: 'div',
        											'data-qtip': 'Использовать плановое время выезда',
    											},
										},
									]
								},
							]
						},
						{
							flex: 1,
							xtype: 'fieldset',
							padding: '5 5',
							margin: '0 0 0 8px',
							width: 285,
							height: 125,
							defaults: {
								labelWidth: 210,
								editable: false,
							},

							items: [
								{
									xtype: 'numberfield',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									name: 'coeffincreasetransittime',
									fieldLabel: 'Коэфф. увел. времени пути',
									value: 1,
									maxValue: 3,
									minValue: 0.5,
									step: 0.05,
									stateful: true,
									stateId: 'tab1coeffincreasetransittime',
									stateEvents: [
										'change',
									],
									listeners: {
										change: 'onIncreaseTimeChange',
									},
								},
								{
									xtype: 'numberfield',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									name: 'slacktimevalue',
									fieldLabel: 'Допуст. время ожидания, мин.',
									value: 30,
									maxValue: 180,
									minValue: 0,
									step: 10,
									stateful: true,
									stateId: 'tab1slacktimevalue',
									stateEvents: [
										'change',
									],
									listeners: {
										change: 'onSlackTimeChange',
									},
								},
								{
									xtype: 'fieldcontainer',
									fieldLabel: 'Исх.',
									labelWidth: 60,
									border: 0,
									defaults: {
										editable: false,
									},
									layout: 'hbox',

									items: [
										{
											xtype: 'textfield',
											width: 70,
											anchor: '100%',
											fieldStyle: 'text-align: center;',
											name: 'firstfullduration',
											id: 'tab1firstfullduration',
											value: '',
										},
										{
											xtype: 'textfield',
											padding: '0 0 0 5',
											width: 70,
											anchor: '100%',
											fieldStyle: 'text-align: center;',
											name: 'firstduration',
											id: 'tab1firstduration',
											value: '',
										},
										{
											xtype: 'numberfield',
											hideTrigger: true,
											keyNavEnabled: false,
											mouseWheelEnabled: false,
											width: 63,
											padding: '0 0 0 5',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											name: 'firstdistance',
											id: 'tab1firstdistance',
											value: 0,
										},

									]
								},
								{
									xtype: 'fieldcontainer',
									fieldLabel: 'Опт.',
									labelWidth: 60,
									border: 0,
									defaults: {
										editable: false,
									},
									layout: 'hbox',

									items: [
										{
											xtype: 'textfield',
											width: 70,
											anchor: '100%',
											fieldStyle: 'text-align: center;',
											name: 'optfullduration',
											id: 'tab1optfullduration',
											value: '',
										},
										{
											xtype: 'textfield',
											padding: '0 0 0 5',
											width: 70,
											anchor: '100%',
											fieldStyle: 'text-align: center;',
											name: 'optduration',
											id: 'tab1optduration',
											value: '',
										},
										{
											xtype: 'numberfield',
											hideTrigger: true,
											keyNavEnabled: false,
											mouseWheelEnabled: false,
											width: 63,
											padding: '0 0 0 5',
											anchor: '100%',
											fieldStyle: 'text-align: right;',
											name: 'optdistance',
											id: 'tab1optdistance',
											value: 0,
											listeners: {
												focus: 'setDistanceToolTip',
											},
										},
									]
								},
							]
						},
					]
				},
				{
					xtype: 'fieldcontainer',
					layout: 'hbox',
					align: 'stretch',
					defaults: {
						width: 135,
					},
					items: [
						{
							flex: 1,
							margin: '0 0 0 0',
							xtype: 'button',
							id: 'menutab1gettrackbutton',
							name: 'gettrackbutton',
							text: 'Получить',
							iconCls: 'fa fa-download',
							handler: 'getOrders',
						},
						{
							flex: 1,
							disabled: true,
							margin: '0 0 0 5px',
							xtype: 'button',
							id: 'menutab1optimizebutton',
							name: 'optimizebutton',
							text: 'Оптимизировать',
							iconCls: 'fa fa-calculator',
							handler: 'optimizeRoute',
						},
						{
							flex: 1,
							margin: '0 0 0 5px',
							xtype: 'button',
							id: 'menutab1resettrack',
							name: 'resettrackbutton',
							text: 'Убрать',
							iconCls: 'fa fa-trash-o',
							handler: 'resetMap',
						},
						{
							flex: 1,
							margin: '0 0 0 5px',
							xtype: 'button',
							id: 'menutab1savetrack',
							name: 'savebutton',
							text: 'Сохранить',
							iconCls: 'fa fa-save',
							handler: 'saveRoute',
							disabled: true,
						},
					]
				},
			]
		}, 
		{
			title: 'Пункты назначения',
			xtype: 'tab1routeleggridpanel',
			id: 'tab1routeleggrid',
			flex: 5,
		}, 
		{
			animCollapse: false,
			collapsible: true,
			floatable: false,
			titleCollapse: true,
			collapsed: true,
			split: true, // enable resizing
			flex: 2,
			collapseDirection: 'bottom',
			title: 'Отброшенные заказы',
			xtype: 'tab1droppedgridpanel',
			id: 'tab1droppedgrid',
		},
	]
});