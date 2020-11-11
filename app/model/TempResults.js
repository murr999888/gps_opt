Ext.define('Opt.model.TempResults', {
    	extend: 'Ext.data.Model',
	proxy: {
        	type: 'localstorage',
        	id  : 'autosgrid'
    	}
});