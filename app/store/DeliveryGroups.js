Ext.define('Opt.store.DeliveryGroups', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.DeliveryGroup',
	//autoLoad: true,
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'DeliveryGroups',
			
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

	listeners: {
       		load: function (store, records, successful, operation, eOpts) {
       			var emptyRecord = Ext.create('Opt.model.DeliveryGroup', {
				id: "00000000-0000-0000-0000-000000000000",
				name: '< не указана >',
				transit_restricted: false,
			});

            		this.autoSync = false;
       	    		this.insert(0, emptyRecord);
       		}
        },
});