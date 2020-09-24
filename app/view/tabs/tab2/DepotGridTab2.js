Ext.define('Opt.view.tabs.tab2.DepotGridTab2', {
	extend: 'Opt.view.DepotGrid',
	title: 'Пункты загрузки',
	xtype: 'tab2depotgridpanel',
	alias: 'widget.tab2depotgridpanel',
	requires: [
		'Opt.view.tabs.tab2.DepotGridTab2Controller',
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

	controller: 'tab2depotgrid',
	listeners: {
		celldblclick: 'onCellDblClick',
	},

	bufferedRenderer: false,
	allowDeselect: true,

	tools: [
		{
			type: 'refresh',
			handler: 'refreshAddDepot',
			tooltip: 'Загрузить'
		},
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'button',
					text: 'Добавить',
					id: 'tab2depotgridaddButton',
					//iconCls: 'fa fa-filter',
				},
				{
					xtype: 'button',
					text: 'Удалить',
					id: 'tab2depotgridremoveButton',
					//iconCls: 'fa fa-filter',
				},
				{
					xtype: 'tbspacer',
					flex: 1,
				},
				{
					xtype: 'button',
					text: 'Главное депо',
					id: 'tab2depotgridmaindepotButton',
					//iconCls: 'fa fa-filter',
				},
			]
		}
	]

});