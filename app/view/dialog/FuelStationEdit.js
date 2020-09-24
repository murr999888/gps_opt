Ext.define('Opt.view.dialog.FuelStationEdit', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.fuelstationedit',
	requires: [
		'Opt.view.dialog.FuelStationEditController',
	],

	controller: 'fuelstationedit',
	modal: true,
	closable: true,
	closeAction: 'hide',
	title: 'Заправка',
	width: 392,
	items: [
		{
			xtype: 'form',
			reference: 'form',
			items: [
				{
					xtype: 'fieldset',
					padding: 5,
					margin: 5,
					defaults: {
						labelWidth: 100,
						width: 355,
						readOnly: true,
					},

					items: [
						{
							xtype: 'field',
							name: 'name',
							fieldLabel: 'Наименование',
						},
						{
							xtype: 'field',
							name: 'description',
							fieldLabel: 'Описание',
						},
					]
				},
			]
		}
	]
}
);