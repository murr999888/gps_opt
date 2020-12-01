Ext.define('Opt.store.OrdersUnloadingGoodsStore', {
    	extend: 'Opt.store.OrdersGoodsStore',
	model: 'Opt.model.OrderGood',
	proxy: {
		type: 'memory',
	},
	requires: [
		'Opt.store.OrdersGoodsStore',
	],
});