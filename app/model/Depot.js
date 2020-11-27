Ext.define('Opt.model.Depot', {
    	extend: 'Opt.model.RouteLegs',
	identifier: 'negative',
	proxy: {
        	type: 'localstorage',
        	id  : 'depot',
    	},
	fields: [
		{
        		name: 'isMainDepot',
        		type: 'boolean',
			defaultValue: false,
		},
		{
        		name: 'goods_capacity_in',
		},
		{
        		name: 'goods_capacity_out',
		},
	],
});