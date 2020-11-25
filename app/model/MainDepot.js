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
        		name: 'goods_capacity_in',
		},
		{
        		name: 'goods_capacity_out',
		},
	],
});