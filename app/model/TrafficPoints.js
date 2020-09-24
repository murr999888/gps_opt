Ext.define('Opt.model.TrafficPoints', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
			{
	        		name: 'num',
        			type: 'number',
			},
			{
	        		name: 'osm_id',
        			type: 'string',
			},
		]
	}
);