Ext.define('Opt.store.RoutesGoodsStore', {
    	extend: 'Ext.data.Store',
	model: 'Opt.model.OrderGood',
	proxy: {
		type: 'memory',
	},
});