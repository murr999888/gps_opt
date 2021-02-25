Ext.define('Opt.view.dialog.SetTime', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.settime',
	requires: [
		'Opt.ux.TimePickerUI',
		'Opt.view.dialog.SetTimeController',
	],

	controller: 'settime',
	modal: true,
	closable: true,
	closeAction: 'hide',
	stateful: true,
	stateId: 'settime',
	width: 230,
	title: 'Установить значение',
	items: {
		xtype: 'form',
		reference: 'form',
		bodyPadding: 5,
		items: [
			{
				xtype: 'timepickerui',
				name: 'timeField',
				width: 190,
				readOnly: false,
				fieldLabel: 'Время разгрузки, мин.',
				hourMin: 8,
				hourMax: 20,
				anchor: '100%',
				labelWidth: 140,
				listeners: {
					change: 'onTimeChange',
				},
			},
			{
				xtype: 'hidden',
				name: 'time',
			},

			{
				xtype: 'hidden',
				name: 'setField',
			},
		],
	}

});
