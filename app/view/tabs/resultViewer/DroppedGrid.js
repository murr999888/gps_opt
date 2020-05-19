Ext.define('Opt.view.tabs.resultViewer.DroppedGrid', {
	extend: 'Opt.view.DroppedGrid',
	title: 'Отброшенные заказы',
	xtype: 'resultviewerdroppedgridpanel',
	alias: 'widget.resultviewerdroppedgridpanel',
	requires: [
		'Opt.view.tabs.resultViewer.DroppedGridController',
	],

	controller: 'resultviewerdroppedgrid',
	listeners: {
		celldblclick: 'onCellDblClick',
	},

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'button',
					text: 'Показать',
					handler: 'showDroppedOrdersOnMap',
				},
				{
					xtype: 'button',
					text: 'Очистить',
					handler: 'clearDroppedOrdersOnMap',
				},

			]
		},
	],
});

