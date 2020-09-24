Ext.define('Opt.model.Auto', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
	//idProperty: 'baseId',
    	fields: [
		{
        		name: 'in_use',
        		type: 'boolean',
		},
		{
        		name: 'id',
        		type: 'string'
		},
		{
        		name: 'parent_id',
        		type: 'string'
		},

		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'name_short',
			type: 'string'
		},
		{
			name: 'water',
			type: 'number'
		},
		{
			name: 'bottle',
			type: 'number'
		},
		{
			name: 'tank',
			type: 'number'
		},

		{
			name: 'max_capacity',
			type: 'number',
			defaultValue: 1,
		},
		{
			name: 'max_weight',
			type: 'number',
			defaultValue: 3000,
		},

		{
			name: 'is_watercarrier',
			type: 'boolean'
		},

		{
			name: 'is_template',
			type: 'boolean'
		},
		{
			name: 'time_increase_k',
			type: 'number',
			defaultValue: 1,
		},
		{
			name: 'cost_k',
			type: 'number',
			defaultValue: 1,
		},

		{
			name: 'worktime_begin',
			type: 'number'
		},

		{
			name: 'worktime_end',
			type: 'number'
		},

		{
			name: 'route_begin_endtime',
			type: 'number'
		},

		{
			name: 'route_end_endtime',
			type: 'number'
		},
		{
			name: 'maximize_water',
			type: 'boolean'
		},

		{
			name: 'maximize_bottle',
			type: 'boolean'
		},

		{
			name: 'maximize_capacity',
			type: 'boolean'
		},

		{
			name: 'driver_id',
			type: 'string'
		},

		{
			name: 'driver_name',
			type: 'string'
		},

		{
			name: 'allowed_clientgroups',
		},
		{
			name: 'fuel_tank_capacity',
			type: 'number',
                        defaultValue: 100,
		},
		{
			name: 'fuel_balance_begin',
			type: 'number',
			defaultValue: 30,
		},
		{
			name: 'fuel_balance_min',
			type: 'number',
			defaultValue: 30,
		},
		{
			name: 'fuel_rate_by_100',
			type: 'number',
			defaultValue: 15.5,
		},
		{
			name: 'fuel_need_refuel',
			type: 'boolean',
			defaultValue: 0,
		},
		{
			name: 'fuel_use_rate',
			type: 'boolean',
			defaultValue: false,
		},

		{
			name: 'fuel_first_station',
			type: 'number',
			defaultValue: 0,
		},

		]
	}
);