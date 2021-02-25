Ext.define('Opt.view.dialog.AddServiceTime', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.addservicetime',
	requires: [
		'Opt.view.dialog.AddServiceTimeController',
	],

	stateful: true,
	stateId: 'addservicetime',
	controller: 'addservicetime',
	modal: true,
	closable: true,
	closeAction: 'hide',
	width: 300,
	title: 'Изменить время',
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
				fieldLabel: 'Изменить время на мин.',
				anchor: '100%',
				fieldStyle: 'text-align: right;',
				value: 1,
				maxValue: 10,
				minValue: -10,
				step: 1,
				labelWidth: 180,
				listeners: {
					change: 'onServiceTimeMinChange',
				},
				stateful: true,
				stateId: 'add_service_time_minField',

			},
			{
				xtype: 'hidden',
				name: 'service_time',
				value: 1 * 60,
			},
		]
	}

});
