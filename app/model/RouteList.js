Ext.define('Opt.model.RouteList', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
	fields: [
		{
			name: 'id', 
			type: 'string',
		},
		{
			name: 'number', 
			type: 'string',
		},
		{
			name: 'number_short', 
			type: 'string',
		},
		{
			name: 'date', 
			type: 'string',
		},
		{
			name: 'auto_id', 
			type: 'string',
		},
		{
			name: 'auto_name', 
			type: 'string',
		},
		{
			name: 'driver_id', 
			type: 'string',
		},
		{
			name: 'driver_name', 
			type: 'string',
		},
		{
			name: 'race_number', 
			type: 'number',
		},
		{
			name: 'load_fact', 
			type: 'number',
		},
		{
			name: 'route_begin_fact', 
			type: 'number',
		},
		{
			name: 'route_end_fact', 
			type: 'number',
		},
		{
			name: 'route_begin_plan', 
			type: 'number',
		},
		{
			name: 'route_end_plan', 
			type: 'number',
		},
		{
			name: 'route_begin_calc', 
			type: 'number',
		},
		{
			name: 'route_end_calc', 
			type: 'number',
		},
		{
			name: 'ordersCount', 
			type: 'number',
			defaultValue: 0, 
		},

		{
			name: 'goods'
		},

		{
			name: 'orders'
		},

		{
			name: 'weight',
			type: 'number'
		},
		{
			name: 'capacity',
			type: 'number'
		},

		{
			name: 'orders_backup'
		},

		{
			name: 'optimized', 
			type: 'boolean',
		},
	],
});
