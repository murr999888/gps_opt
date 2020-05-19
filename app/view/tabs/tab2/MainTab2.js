Ext.define('Opt.view.tabs.tab2.MainTab2', {
	extend: 'Ext.Panel',
	alias: 'widget.maintab2',
	requires: [
		'Opt.view.tabs.tab2.MainTab2Controller',
		'Opt.view.tabs.tab2.MenuTab2',
		'Opt.view.tabs.tab2.OrdersTab2',
		'Opt.view.tabs.tab2.RoutesDistTab2',
	],

	controller: 'mainTab2Controller',
	layout: 'border',
	defaults: {
		border: 0,
		split: true,
		header: false,
	},

	listeners: {
		'resize': function () {
		}
	},

	items: [
		{
			xtype: 'menutab2',
			id: 'menutab2',
			title: 'Исходные параметры',
			region: 'west',
			stateful: true,
			stateId: 'optmenutab2',
			width: '30%',
			minWidth: 300,
			//flex:1,

		},
		{
			xtype: 'orderstab2',
			id: 'orderstab2',
			title: 'Распределяемые заказы',
			region: 'center',
			stateful: true,
			stateId: 'orderstab2',
			width: '30%',
			minWidth: 300,
			//flex:1,
		},
		{
			xtype: 'routesdisttab2',
			id: 'routesdisttab2',
			title: 'Результат распределения',
			region: 'east',
			stateful: true,
			stateId: 'routesdisttab2',
			width: '43%',
			minWidth: 300,
			//flex:1,
		},
	]
});
