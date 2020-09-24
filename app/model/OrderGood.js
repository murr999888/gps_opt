Ext.define('Opt.model.OrderGood', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
			{
       		 		name: 'id',
        			type: 'string',
			},
			{
        			name: 'full_name',
        			type: 'string',
			},

			{
        			name: 'ed',
        			type: 'string'
			},
			{
				name: 'kolvo',
				type: 'number'
			},
			{
				name: 'weight',
				type: 'number'
			},
			{
				name: 'capacity',
				type: 'number'
			},
		]
	}
);