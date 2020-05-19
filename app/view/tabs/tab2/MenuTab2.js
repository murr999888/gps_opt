Ext.define('Opt.view.tabs.tab2.MenuTab2', {
	extend: 'Ext.panel.Panel',
	xtype: 'menutab2',
	alias: 'widget.menutab2',
	controller: 'menutab2controller',
	requires: [
		'Opt.view.tabs.tab2.MenuTab2Controller',
		'Opt.view.tabs.tab2.AutoGridTab2',
		'Opt.ux.TimePickerUI',
		'Opt.ux.TimePickerUIWS',
	],

	layout: {
		type: 'vbox',
		align: 'stretch'
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
			collapsible: true,
			titleCollapse: true,
			animCollapse: false,
			title: 'Настройки поиска решения',
			xtype: 'form',
			reference: 'formparamtab2',
			id: 'formparamtab2',
			height: 115,
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
	],
});