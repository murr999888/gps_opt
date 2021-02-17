Ext.define('Opt.view.dialog.WaitingCalc', {
	extend: 'Ext.window.Window',
	alias: 'widget.waitingcalc',
	requires: [
		'Opt.view.dialog.WaitingCalcController',
	],

	controller: 'waitingcalc',
	//modal: true,
	closable: false,
	closeAction: 'destroy',
	resizable: false,
	draggable: false,
	constrain: true,
	onEsc: Ext.emptyFn,
	title: 'Идет расчет...',
		//width: 230,
		//height: 150,
	items: {
		xtype: 'panel',
		width: 230,
		height: 90,
		buttonAlign: 'center',
		bodyPadding: 5,
		bodyStyle: 'background-color: #FFFFA0;',
		textAlign: 'center',
		html: 'Прошло: 00:00:00, осталось ~00:00:00',
		buttons: [
				{
					xtype: 'button',
					text: 'Прервать',
					handler: 'pressBreakButton',
				}	
		]
	},

});
