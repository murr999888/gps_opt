Ext.define('Opt.view.dialog.MessageWindowController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.messagewindow',

	init: function () {

	},

	afterRender: function(){
		var parentPanel = this.getView().renderTo;
		if(parentPanel !='') Ext.getCmp(parentPanel).mask();

		var message = this.getView().message;

		var panelText = this.getView().down('panel');
        	panelText.setHtml(message);
	},

	pressOKButton: function (button) {
		var self = this;
		var parentPanel = this.getView().renderTo;
		if(parentPanel !='') Ext.getCmp(parentPanel).unmask();
		this.getView().destroy();
	},
});