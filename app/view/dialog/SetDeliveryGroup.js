Ext.define('Opt.view.dialog.SetDeliveryGroup', {
	extend: 'Opt.view.dialog.BaseEdit',
	alias: 'widget.setdeliverygroup',
	requires: [
		'Opt.view.dialog.SetDeliveryGroupController',
	],

	controller: 'setdeliverygroup',
	//stateful: true,
	//stateId: 'setdeliverygroup',

	modal: true,
	closable: true,
	width: 350,
	//iconCls: 'fa fa-ban',
	title: 'Установить значение',
	listeners: {
            	show: 'onShow', 
		close: 'onClose', 
		resize: 'onWindowResize',
		collapse: 'onWindowResize',
		expand: 'onWindowResize',
	},

	items: {
		xtype: 'form',
		reference: 'form',
		bodyPadding: 5,
		items: [
			{
				anchor: '100%',
				readOnly: false,
				editable: false,
				xtype: 'combobox',
				name: 'delivery_group_id',
				fieldLabel: 'Группа доставки',
				emptyText: '< не выбрана >',
				queryMode: 'local',
				displayField: 'displayField',
				valueField: 'id',
				store: 'DeliveryGroups',
				matchFieldWidth: true,
				listeners: {
					select: 'onDeliveryGroupsSelect',
				},
				listConfig: {
					loadingText: 'Загружается..',
					emptyText: 'Не выбран..',
					//minWidth: 245,
				},
			},
			{
				xtype: 'hiddenfield',
				name: 'delivery_group_name',
			},
		]
	}

});
