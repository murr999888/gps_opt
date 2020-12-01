Ext.define('Opt.view.OrderLoadingGoodsGrid', {
	extend: 'Opt.view.OrderGoodsGrid',
	alias: 'widget.orderloadinggoodsgrid',
	requires: [
		'Opt.view.OrderLoadingGoodsGridController',
	],
	controller: 'orderloadinggoodsgrid',
});