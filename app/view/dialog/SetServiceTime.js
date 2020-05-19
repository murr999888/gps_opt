Ext.define('Opt.view.dialog.SetServiceTime', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.setservicetime',
	requires: [
		'Opt.view.dialog.SetServiceTimeController',
	],

	stateful: true,
	stateId: 'setservicetime',
	controller: 'setservicetime',
	modal: true,
	closable: true,
	width: 300,
	title: 'Установить значение',
	items: {
		xtype: 'form',
		reference: 'form',
		bodyPadding: 5,
		items: [
			{
				xtype: 'numberfield',
				name: 'service_time_min',
				width: 240,
				readOnly: false,
				editable: false,
				fieldLabel: 'Время разгрузки, мин.',
				anchor: '100%',
				fieldStyle: 'text-align: right;',
				value: 5,
				maxValue: 60,
				minValue: 1,
				step: 1,
				labelWidth: 180,
				listeners: {
					change: 'onServiceTimeMinChange',
				},
				stateful: true,
				stateId: 'service_time_minField',

			},
			{
				xtype: 'hidden',
				name: 'service_time',
				value: 5 * 60,
				stateful: true,
				stateId: 'service_timeField',

			},
		]
	}

});
