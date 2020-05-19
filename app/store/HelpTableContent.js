Ext.define('Opt.store.HelpTableContent', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.HelpTableContent',
	proxy: {
        	type: 'ajax',
		url: 'help.php',
		
		extraParams:{
			param: 'getHelpTableContent',
		},

		actionMethods: {
            		read   : 'GET',
            		update : 'POST'
        	},

            	reader: {
	                type: 'json',
                	rootProperty: 'data',
            	},
    	},
});

