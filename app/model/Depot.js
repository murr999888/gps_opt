Ext.define('Opt.model.Depot', {
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
	],
});