Ext.define('Opt.store.SettingsGlobal', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.SettingsGlobal',
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'SettingsGlobal',
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

