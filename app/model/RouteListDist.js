Ext.define('Opt.model.RouteListDist', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
	fields: [
		{	
			name: 'id', 
			type: 'string'
		},
		{
			name: 'date', 
			type: 'string'
		},
		{
			name: 'auto'
		},
		{
			name: 'auto_id', 
			type: 'string'
		},
		{
			name: 'auto_name', 
			type: 'string',
		},
		{
			name: 'route_begin', 
			type: 'number'
		},
		{
			name: 'route_end', 
			type: 'number'
		},
		{
			name: 'goods'
		},
		{
			name: 'orders'
		},
	],
});
