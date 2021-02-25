Ext.define('Opt.view.RoutelistOrderGrid', {
	extend: 'Opt.view.OrdersGrid',
	alias: 'widget.routelistordergrid',
	requires: [
		'Opt.view.RoutelistOrderGridController',
	],
	controller: 'routelistordergrid',
});
