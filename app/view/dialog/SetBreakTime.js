Ext.define('Opt.view.dialog.SetBreakTime', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.setbreaktime',
	requires: [
		'Opt.view.dialog.SetBreakTimeController',
	],

	controller: 'setbreaktime',
	stateful: true,
	stateId: 'setbreaktime',

	modal: true,
	closable: true,
	closeAction: 'hide',
	width: 300,
	//iconCls: 'fa fa-ban',
	title: 'Установить значение',
	items: {
		xtype: 'form',
		reference: 'form',
		bodyPadding: 5,
		items: [
			{
				xtype: 'numberfield',
				name: 'breaktime',
				stateful: true,
				stateId: 'breaktimeField',
				fieldLabel: 'Перерыв между рейсами, мин.',
				anchor: '100%',
				fieldStyle: 'text-align: right;',
				value: 30,
				minValue: 10,
				maxValue: 180,
				step: 10,
				readOnly: false,
				editable: false,
				labelWidth: 220,
				width: 250,
			},
		]
	}

});
