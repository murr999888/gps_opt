Ext.define('Opt.store.OrdersLoadingGoodsStore', {
    	extend: 'Opt.store.OrdersGoodsStore',
	model: 'Opt.model.OrderGood',
	proxy: {
		type: 'memory',
	},
	requires: [
		'Opt.store.OrdersGoodsStore',
	],
});