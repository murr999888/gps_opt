Ext.define('Opt.view.tabs.tab1.RouteLegGridTab1', {
	extend: 'Opt.view.RouteLegGrid',
	alias: 'widget.tab1routeleggridpanel',
	requires: [
		'Opt.view.tabs.tab1.RouteLegGridTab1Controller',
	],

	tools: [
		{
			type: 'refresh',
			handler: 'refreshOrders',
			tooltip: 'Обновить список заказов'
		},
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	controller: 'tab1routeleggrid',
        allowDeselect: true,
	stateful: true,
	stateId: 'tab1routelegleftgridpanel',
	listeners: {
		celldblclick: 'onCellDblClick',
	},
	bufferedRenderer: false,
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
					id: 'tab1ButtonSetValue',
					disabled: true,
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

