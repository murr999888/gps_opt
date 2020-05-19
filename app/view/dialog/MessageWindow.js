Ext.define('Opt.view.dialog.MessageWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.messagewindow',
	requires: [
		'Opt.view.dialog.MessageWindowController',
	],
	controller: 'messagewindow',
	closable: false,
	closeAction: 'destroy',
	resizable: false,
	draggable: false,
	constrain: true,
	title: '',
	message: '',
	minWidth: 230,
	minHeight: 90,
	items: {
		xtype: 'panel',
		buttonAlign: 'center',
		bodyPadding: 8,
		bodyStyle: 'background-color: #FFF;',
		textAlign: 'center',
		html: '',
		buttons: [
				{
					xtype: 'button',
					text: 'OK',
					handler: 'pressOKButton',
				}	
		]
	},

});
