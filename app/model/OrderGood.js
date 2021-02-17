Ext.define('Opt.model.OrderGood', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
			{
       		 		name: 'id',
        			type: 'string',
			},
			{
        			name: 'name',
        			type: 'string',
			},
			{
        			name: 'name_short',
        			type: 'string',
			},
			{
        			name: 'ed',
        			type: 'string'
			},
			{
        			name: 'isPack',
        			type: 'boolean',
				defaultValue: false,
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