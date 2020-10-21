Ext.define('Opt.view.dialog.SetPenalty', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.setpenalty',
	requires: [
		'Opt.view.dialog.SetPenaltyController',
	],

	controller: 'setpenalty',
	stateful: true,
	stateId: 'setpenalty',

	modal: true,
	closable: true,
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
				name: 'penalty',
				stateful: true,
				stateId: 'setpenaltyField',
				fieldLabel: 'Штраф за отказ от посещения, мин.',
				anchor: '100%',
				fieldStyle: 'text-align: right;',
				value: 30,
				minValue: 0,
				maxValue: max_penalty_value,
				step: 10,
				readOnly: false,
				editable: false,
				labelWidth: 220,
				width: 250,
			},
		]
	}

});
