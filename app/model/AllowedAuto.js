Ext.define('Opt.model.AllowedAuto', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
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
				name: 'name',
				type: 'string'
			},
		]
	}
);