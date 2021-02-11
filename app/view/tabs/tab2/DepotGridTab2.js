Ext.define('Opt.view.tabs.tab2.DepotGridTab2', {
	extend: 'Opt.view.DepotGrid',
	title: 'Пункты загрузки',
	xtype: 'tab2depotgridpanel',
	alias: 'widget.tab2depotgridpanel',
	requires: [
		'Opt.view.tabs.tab2.DepotGridTab2Controller',
	],

	store: 'Depots',

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
			handler: 'refreshDepots',
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
					xtype: 'tbspacer',
					flex: 1,
				},
				{
					xtype: 'button',
					text: 'Главное депо',
					id: 'tab2depotgridmaindepotButton',
					handler: 'openMainDepoDialog',
					iconCls: 'fa fa-home',
				},
			]
		}
	]

});