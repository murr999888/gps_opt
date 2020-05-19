Ext.define('Opt.view.dialog.Base', {
	extend: 'Ext.window.Window',
	resizable: false,
	autoScroll: true,
	constrain: true,
	style: 'background-color: white;',
	initComponent: function () {
		if (window.innerHeight) {
			this.maxHeight = window.innerHeight - 10 * 2;
		}
		this.callParent();
	}
});
