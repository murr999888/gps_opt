Ext.define('Opt.store.SettingsUser', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.SettingsUser',
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'SettingsUser',
		},
		actionMethods: {
            		read   : 'GET',
            		update : 'POST'
        	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
    	},
});

