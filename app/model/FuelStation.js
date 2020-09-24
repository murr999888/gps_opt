Ext.define('Opt.model.FuelStation', {
    	extend: 'Opt.model.RouteLegs',
	proxy: {
        	type: 'localstorage',
        	id  : 'fuelstationgrid'
    	},

	identifier: 'negative',
	sorters:[
    		{
        		field: 'klient_name',
        		direction: 'ASC'
    		}
	],

    	fields: [
			{
        			name: 'gas',
        			type: 'boolean',
    			},
			{
        			name: 'service_time',
	        		type: 'number',
				defaultValue: 600,
    			},
			{	name:'displayField', 
				convert: function(value, record) {
    					return record.get('klient_name') + ' (' + record.get('adres') + ')';
				}
			},
		]

	},
);