Ext.define('Opt.store.Auto', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.Auto',
	//autoLoad: true,
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'Autos',
			includeTemplate: true,
			
		},
		actionMethods: {
            		read   : 'GET',
            		//update : 'POST'
        	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
    	},
});