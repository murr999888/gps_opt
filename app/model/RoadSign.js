Ext.define('Opt.model.RoadSign', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
		{
			name: 'icon',
			type: 'string',
		},
		{
			name: 'name',
			type: 'string',
		},
		{	
			name:'displayField', 
			convert: function(value, record) {
   				//return '<div style="background-image: url(' + record.get('icon') + '); background-repeat: no-repeat; padding-left: 20px;">' + record.get('name') + '</div>';
				return '<div style="background-image: url(' + record.get('icon') + '); background-repeat: no-repeat;">&nbsp;</div>';
			}
		},
		]
	}
);