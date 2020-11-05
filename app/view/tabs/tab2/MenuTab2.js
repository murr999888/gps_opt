Ext.define('Opt.view.tabs.tab2.MenuTab2', {
	extend: 'Ext.panel.Panel',
	xtype: 'menutab2',
	alias: 'widget.menutab2',
	controller: 'menutab2controller',
	requires: [
		'Opt.view.tabs.tab2.MenuTab2Controller',
		'Opt.view.tabs.tab2.AutoGridTab2',
		'Opt.view.tabs.tab2.DepotGridTab2',
		'Opt.ux.TimePickerUI',
		'Opt.ux.TimePickerUIWS',
	],

	layout: {
	        type: 'accordion',
        	titleCollapse: true,
	        animate: false,
		multi: true,
		collapseFirst: false,
		fill: false,
	},

	header: {
		titlePosition: 0,
	},

	items: [
		{
			tools: [
				{
					type: 'refresh',
					handler: 'setDefaultValues',
					tooltip: 'Сбросить'
				}
			],


			stateful: true,
			stateId: 'formparamtab2',
			title: 'Настройки поиска решения',
			xtype: 'form',
			reference: 'formparamtab2',
			id: 'formparamtab2',
                        height: 303,
			bodyPadding: 5,
			defaults: {
				editable: false,
			},

			items: [
				{
					xtype: 'fieldcontainer',
					layout: 'hbox',
					items: [
						{
							labelWidth: 35,
							editable: false,
							xtype: 'datepickerui',
							id: 'formparamtab2date',
							leftMargin: -35,
							fieldLabel: 'Дата',
							name: 'solvedate',
							value: new Date(), // defaults to today
							listeners: {
								change: 'onDateChange',
							}
						},
					]
				},
				{
					labelWidth: 195,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'maxslacktime',
					fieldLabel: 'Допустимое время ожидания, мин',
					value: 5,
					maxValue: 60,
					minValue: 0,
					step: 1,
					stateful: true,
					stateId: 'tab2slacktime',
					stateEvents: ['change'],
					listeners: {
						change: 'onSlackTimeChange',
					},
				},
				{
					labelWidth: 195,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'fixedcostallvehicles',
					fieldLabel: 'Стоимость машины, мин',
					value: 0,
					maxValue: 240,
					minValue: 0,
					step: 10,
					stateful: true,
					stateId: 'tab2fixedcostallvehicles',
					stateEvents: ['change'],
					listeners: {
						//change: 'onSlackTimeChange',
					},
				},
				{
					labelWidth: 195,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'globalspancoeff_time',
					fieldLabel: 'Глобальный коэфф. дуги (время)',
					value: 0,
					maxValue: 100,
					minValue: 0,
					step: 5,
				},
				{
					labelWidth: 195,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'softlowerbound_water',
					fieldLabel: 'Мягкая нижняя граница (вода, л.)',
					value: 0,
					maxValue: 5000,
					minValue: 0,
					step: 100,
					stateful: true,
					stateId: 'tab2softlowerbound_water',
					stateEvents: ['change'],
					listeners: {
						//change: 'onMaxSolveTimeChange',
					},
				},
				{
					readOnly: false,
					editable: false,
					xtype: 'combobox',
					id: 'formparamtab2refuelmode',
					name: 'refuelmode',
					fieldLabel: 'Расчет заправок',
					emptyText: '< нет данных >',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					value: 0,
					store: 'RefuelMode',
					listeners: {
						select: 'onRefuelModeSelect',
					},
				},
				{
					xtype: 'checkbox',
					name: 'refuel_full_tank',
					id: 'formparamtab2refuel_full_tank',
					checked: false,
					inputValue: true,
					uncheckedValue: false,
					fieldLabel: 'Заправка по расходу - "до полного"',
					labelWidth: 237,
					disabled: true,
				},
				{
					readOnly: false,
					editable: false,
					xtype: 'combobox',
					id: 'formparamtab2solutionstrategy',
					name: 'solutionstrategy',
					fieldLabel: 'Алгоритм',
					emptyText: '< нет данных >',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					value: 3,
					store: 'CalcAlgorithm',
				},
				{
					xtype: 'checkbox',
					name: 'useGLS',
					id: 'formparamtab2useGLS',
					checked: false,
					inputValue: true,
					uncheckedValue: false,
					fieldLabel: 'Использовать локальный поиск',
					labelWidth: 237,
					autoEl: {
        					tag: 'div',
        					'data-qtip': 'Использовать Guided Local Search',
    					},
				},
				{
					labelWidth: 195,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'maxsolvetime',
					fieldLabel: 'Макс. время поиска решения, мин',
					value: 30,
					maxValue: 240,
					minValue: 1,
					step: 1,
					stateful: true,
					stateId: 'tab2maxsolvetime',
					stateEvents: ['change'],
					listeners: {
						change: 'onMaxSolveTimeChange',
					},
				},
			],
		},
		{
			xtype: 'tab2autogridpanel',
			id: 'tab2autogrid',
			flex: 5,
		},

		{
			xtype: 'tab2depotgridpanel',
			id: 'tab2depotgrid',
			flex: 3,
			collapsed: true,
		},
	],
});