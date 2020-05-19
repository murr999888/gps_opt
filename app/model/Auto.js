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

		]
	}
);