Ext.define('Opt.model.Depot', {
	identifier: 'negative',
    	extend: 'Opt.model.RouteLegs',
	proxy: {
        	type: 'localstorage',
        	id  : 'depot'
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