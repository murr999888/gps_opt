Ext.define('Opt.model.Auto2', {
    	extend: 'Opt.model.Auto',
	proxy: {
        	type: 'localstorage',
        	id  : 'autosgrid'
    	}
});