Ext.define('Opt.store.RoadSigns', {
    	extend: 'Ext.data.Store',
	model: 'Opt.model.RoadSign',
	proxy: {
		type: 'memory',
	},
	data: [
		{
       			icon: 'css/images/signs/znak-proezd-16-16.png',
			name: 'Проезд запрещен',
    		}, 
		{
        		icon: 'css/images/signs/znak-alert-16-16.png',
			name: 'Внимание',
     		}, 
		{
        		icon: 'css/images/signs/znak-remont-16-16.png',
			name: 'Ремонт',
     		}, 
		{            
        		icon: 'css/images/signs/znak-zator-16-16.png',
			name: 'Затор',
     		}, 
		{
        		icon: 'css/images/signs/znak-5-16-16.png',
			name: 'Ограничение 5 км/ч.',
     		}, 
		{
        		icon: 'css/images/signs/znak-10-16-16.png',
			name: 'Ограничение 10 км/ч.',
     		},
		{
        		icon: 'css/images/signs/znak-20-16-16.png',
			name: 'Ограничение 20 км/ч.',
     		},
		{
        		icon: 'css/images/signs/znak-30-16-16.png',
			name: 'Ограничение 30 км/ч.',
     		},
		{
        		icon: 'css/images/signs/znak-40-16-16.png',
			name: 'Ограничение 40 км/ч.',
     		},
	]
});