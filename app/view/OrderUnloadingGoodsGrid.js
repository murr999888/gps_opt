Ext.define('Opt.view.OrderUnloadingGoodsGrid', {
	extend: 'Opt.view.OrderGoodsGrid',
	alias: 'widget.orderunloadinggoodsgrid',
	requires: [
		'Opt.view.OrderUnloadingGoodsGridController',
	],
	controller: 'orderunloadinggoodsgrid',
});