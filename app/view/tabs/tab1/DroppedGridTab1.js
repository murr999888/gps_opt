Ext.define('Opt.view.tabs.tab1.DroppedGridTab1', {
	extend: 'Opt.view.DroppedGrid',
	title: 'Отброшенные заказы',
	alias: 'widget.tab1droppedgridpanel',
	requires: [
		'Opt.view.DroppedGrid',
		'Opt.view.tabs.tab1.DroppedGridTab1Controller',
	],

	controller: 'tab1droppedgrid',

	listeners: {
		celldblclick: 'onCellDblClick',
	},

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			defaults: {
				margin: '0 3px 0 3px',
			},

			items: [
				{
					xtype: 'button',
					text: 'Установить',
					id: 'tab1ButtonSetValueDroppedOrders',
					//disabled: false,
					menu: {
						items: [
							{
								text: 'Штраф',
								handler: 'setPenalty',
							},
							{
								text: 'Время разгрузки',
								handler: 'setService',
							}
						]
					},
				},
			]
		}
	]
});

