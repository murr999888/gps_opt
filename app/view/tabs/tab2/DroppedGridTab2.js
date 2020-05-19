Ext.define('Opt.view.tabs.tab2.DroppedGridTab2', {
	extend: 'Opt.view.DroppedGrid',
	title: 'Отброшенные заказы',
	xtype: 'tab2droppedgridpanel',
	alias: 'widget.tab2droppedgridpanel',
	requires: [
		'Opt.view.tabs.tab2.DroppedGridTab2Controller',
	],

	viewConfig: {
		preserveScrollOnRefresh: false,
		getRowClass: function (record, rowIndex, rowParams, store) {
			var cl = '';
			if (record.get('isOtherCity')) {
				cl = cl + ' fontbold fontitalic';
			}
			return cl;
		},
	},

	controller: 'tab2droppedgrid',
	listeners: {
		celldblclick: 'onCellDblClick',
	},

	bufferedRenderer: false,
	allowDeselect: true,
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
					text: 'Отгрузка',
					handler: 'getGoods',
					id: 'tab2getDroppedGoodsButton',
					disabled: true,
					iconCls: 'fa fa-list',
					iconClsBck: 'fa fa-list',
				},

				{
					xtype: 'button',
					text: 'Изменить',
					menu: {
						items: [
							{
								text: 'Штраф',
								handler: 'setPenalty',
								iconCls: 'fa fa-ban',
							},
							{
								text: 'Время разгрузки',
								handler: 'setService',
								iconCls: 'fa fa-clock-o',
							},

							{
								xtype: 'menuseparator',
							},
							{
								text: 'Установить допустимые машины',
								handler: 'setAutos',
								iconCls: 'fa fa-truck',
							},
							{
								text: 'Удалить допустимые машины',
								handler: 'removeAutos',
							},
						]
					},
				},
			]
		},
	],
});