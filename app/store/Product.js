Ext.define('Opt.store.Product', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.Product',
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		extraParams:{
			param: 'Prod'
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
	listeners: {
        	load: function (store, records, successful, operation, eOpts) {
        		var emptyRecord = Ext.create('Opt.model.Product', {
				id: 0,
				name: '< по всем >',
				short_name: '< по всем >'
			});

            		this.autoSync = false;
            		this.insert(0, emptyRecord);
			var tankRecord = Ext.create('Opt.model.Product', {
				id: "00000000-0000-0000-0000-000000000000",
				name: 'Емкости',
				short_name: 'емкости'
			});
			this.add(tankRecord);
            	}
        }
});


