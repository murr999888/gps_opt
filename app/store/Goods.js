Ext.define('Opt.store.Goods', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.DepotGood',
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		extraParams:{
			param: 'Goods'
		},
		actionMethods: {
            		read   : 'GET',
        	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
    	},
});


