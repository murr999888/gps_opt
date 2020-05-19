Ext.define('Opt.store.OrdersGoodsStore', {
    	extend: 'Ext.data.Store',
	model: 'Opt.model.OrderGood',
	proxy: {
		type: 'memory',
	},
});