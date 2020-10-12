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
                        height: 195,
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
					labelWidth: 205,
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
					labelWidth: 205,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'maxordersinroute',
					fieldLabel: 'Макс. кол. заказов в маршруте',
					value: 0,
					maxValue: 60,
					minValue: 0,
					step: 1,
					stateful: true,
					stateId: 'tab2maxordersinroute',
					stateEvents: ['change'],
					listeners: {
						change: 'onMaxOrdersInRouteChange',
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
					store: {
                                        	data: [
							{
       								id: 0,
								name: '< не рассчитывать >',
    							}, 
							{
       								id: 1,
								name: 'сначала заправить..',
    							}, 
							{
       								id: 2,
								name: 'по расходу топлива',
    							}, 
						]
					},
					matchFieldWidth: false,
					listeners: {
						select: 'onRefuelModeSelect',
					},
					/*
					stateful: true,
					stateId: 'tab2formparamtab2refuelmode',
					stateEvents: ['select'],
        				getState: function(){
						return {value: this.getValue()};
					},
        				applyState: function(state) {
						this.setValue(state.value);
					},
					*/
				},
				{
					xtype: 'checkbox',
					name: 'useGLS',
					id: 'formparamtab2useGLS',
					checked: false,
					inputValue: true,
					uncheckedValue: false,
					fieldLabel: 'Использовать guided local search',
					labelWidth: 237,
					stateful: true,
					stateId: 'tab2useGLS',
					stateEvents: ['change', 'check'],
					listeners: {
						change: 'onChangeUseGLS',
					},
					getState: function () {
						return { "checked": this.getValue() };
					},
					applyState: function (state) {
						this.setValue(state.checked);
					},
					autoEl: {
        					tag: 'div',
        					'data-qtip': 'Использовать Guided Local Search',
    					},
				},
				{
					labelWidth: 205,
					editable: false,
					width: 255,
					xtype: 'numberfield',
					fieldStyle: 'text-align: right;',
					name: 'maxsolvetime',
					fieldLabel: 'Макс. время поиска решения, мин',
					value: 60,
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