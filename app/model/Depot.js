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
        		name: 'depot_goods_capacity_in',
		},
		{
        		name: 'depot_goods_capacity_out',
		},
	],
});