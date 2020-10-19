Ext.define('Opt.view.dialog.SetMaxRaces', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.setmaxraces',
	requires: [
		'Opt.view.dialog.SetMaxRacesController',
	],

	controller: 'setmaxraces',
	stateful: true,
	stateId: 'setmaxraces',

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
				name: 'maxraces',
				stateful: true,
				stateId: 'setmaxracesField',
				fieldLabel: 'Макс. количество рейсов',
				anchor: '100%',
				fieldStyle: 'text-align: right;',
				value: 1,
				minValue: 1,
				maxValue: 10,
				step: 1,
				readOnly: false,
				editable: false,
				labelWidth: 220,
				width: 250,
			},
		]
	}

});
