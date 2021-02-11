Ext.define('Opt.model.MainDepot', {
	identifier: 'negative',
    	extend: 'Opt.model.RouteLegs',
	proxy: {
        	type: 'localstorage',
        	id  : 'maindepot'
    	},
	fields: [
		{
        		name: 'isMainDepot',
        		type: 'boolean',
			defaultValue: true,
		},
		{
        		name: 'depot_goods_capacity_in',
		},
		{
        		name: 'depot_goods_capacity_out',
		},
	],
});