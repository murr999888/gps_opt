Ext.define('Opt.view.tabs.tab2.AutoGridTab2', {
	extend: 'Opt.view.AutoGrid',
	alias: 'widget.tab2autogridpanel',
	xtype: 'tab2autogridpanel',
	requires: [
		'Opt.view.tabs.tab2.AutoGridTab2Controller',
	],
	controller: 'tab2autogrid',
	store: 'Auto2',
	stateful: true,
	stateId: 'tab2autogridpanel',
	allowDeselect: true,
	tools: [
		{
			type: 'refresh',
			handler: 'refreshAutos',
			tooltip: 'Загрузить список машин'
		},
		{
			type: 'refresh',
			handler: 'refreshDrivers',
			tooltip: 'Обновить водителей'
		},
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'button',
					text: 'Фильтр',
					id: 'tab2autosgridfilter',
					iconCls: 'fa fa-filter',
					menu: {
						items: [],
					},
				},

				{
					xtype: 'button',
					text: 'Изменить',
					id: 'tab2autosgridmenubuttonChange',
					iconCls: 'fa fa-edit',
					menu: {
						items: [
							{
								text: 'Первая половина (8-13)',
								handler: 'setFirstHalf',
							},
							{
								text: 'Вторая половина (13-20)',
								handler: 'setSecondHalf',
							},
							{
								text: 'Весь день (8-20)',
								handler: 'setAllDay',
								iconCls: 'fa fa-sun-o',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Установить количество рейсов',
								handler: 'setMaxRaces',
								//iconCls: 'fa fa-user',
							},
							{
								text: 'Сбросить количество рейсов для всех',
								handler: 'setMaxRacesDefault',
								//iconCls: 'fa fa-user',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Установить группы клиентов',
								handler: 'setAllowedClientGroups',
								iconCls: 'fa fa-user',
							},
							{
								text: 'Сбросить группы клиентов',
								handler: 'resetAllowedClientGroups',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Сбросить "Сначала заправить..."',
								handler: 'resetFirstFuelStation',
							},
							{
								xtype: 'menuseparator',
							},
							{
								text: 'Участвует в расчете заправок по расходу',
								handler: 'setRefuelByRate',
							},
							{
								text: 'Не участвует в расчете заправок по расходу',
								handler: 'resetRefuelByRate',
							},
						]
					},
				},

				{
					xtype: 'tbspacer',
					flex: 1,
				},
				{
					xtype: 'button',
					text: 'Заправки',
					id: 'tab2fuelstationbutton',
					iconCls: 'fuel_station_icon',
					handler: 'fuelStations',
				},
			]
		},
	],
});

