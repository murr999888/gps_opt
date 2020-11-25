Ext.define('Opt.model.DepotGood', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
			{
       		 		name: 'in_use',
        			type: 'boolean',
			},
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
        			name: 'isPack',
        			type: 'boolean',
			},
			{
        			name: 'isMaldev',
        			type: 'boolean',
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