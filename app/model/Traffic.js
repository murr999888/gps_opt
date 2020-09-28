Ext.define('Opt.model.Traffic', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
			{
	        		name: 'id',
        			type: 'number',
			},
			{
	        		name: 'name',
        			type: 'string',
				defaultValue: 'Новый участок',
			},
			{
	        		name: 'speed',
        			type: 'number',
				defaultValue: 0,
			},
			{
	        		name: 'rate',
        			type: 'number',
				defaultValue: 0,
			},			
			{
	        		name: 'icon',
        			type: 'string',
			},			
			{
	        		name: 'both_direction',
        			type: 'boolean',
				defaultValue: true,
			},
			{
	        		name: 'prim',
        			type: 'string',
			},
			{
	        		name: 'begin_lat',
        			type: 'number',
			},
			{
	        		name: 'begin_lon',
        			type: 'number',
			},
			{
	        		name: 'end_lat',
        			type: 'number',
			},
			{
	        		name: 'end_lon',
        			type: 'number',
			},
			{
	        		name: 'geometry',
        			type: 'string',
			},
			{
	        		name: 'points',
			},
		]
	}
);