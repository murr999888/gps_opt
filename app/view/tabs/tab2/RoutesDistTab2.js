Ext.define('Opt.view.tabs.tab2.RoutesDistTab2', {
	extend: 'Ext.panel.Panel',
	xtype: 'routesdisttab2',
	alias: 'widget.routesdisttab2',
	controller: 'routesdisttab2',
	requires: [
		'Opt.view.tabs.tab2.RoutesGridTab2',
		'Opt.view.tabs.tab2.RoutesDistTab2Controller',
		'Opt.view.tabs.tab2.DroppedGridTab2',
	],

	layout: {
	        type: 'accordion',
        	titleCollapse: true,
	        animate: false,
		multi: true,
		collapseFirst: false,
	},

	header: {
		titlePosition: 0,
	},

	items: [
		{
			flex: 5,
			title: 'Маршрутные листы',
			xtype: 'tab2routesgrid',
			id: 'tab2routesgrid',
			stateful: true,
			stateId: 'tab2routesgrid',
		},
		{
			flex: 5,
			title: 'Отброшенные заказы',
			xtype: 'tab2droppedgridpanel',
			id: 'tab2droppedgrid',
			stateful: true,
			stateId: 'tab2droppedgrid',
			collapsed: true,
		},
/*
		{
			flex: 1,
			xtype: 'ordergoodsgrid',
			id: 'tab2routestotals',
			title: 'Отгрузка по МЛ',
			stateful: true,
			stateId: 'tab2routestotals',
		}
*/
	],
});