Ext.define('Opt.store.DroppedGoodsStore', {
    	extend: 'Ext.data.Store',
	model: 'Opt.model.OrderGood',
	proxy: {
		type: 'memory',
	},
});