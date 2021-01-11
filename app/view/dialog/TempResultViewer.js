Ext.define('Opt.view.dialog.TempResultViewer', {
	extend: 'Ext.window.Window',
	alias: 'widget.tempresultviewer',
	requires: [
		'Opt.view.TempResultGrid',
		'Opt.view.dialog.TempResultViewerController',
	],

	stateful: true,
	id: 'tempresultviewer',
	stateId: 'tempresultviewer',
	controller: 'tempresultviewer',
	constrain: true,
	modal: true,
	closeAction: 'hide',
	closable: true,
	resizable: true,
	style: 'background-color: #fff;',
	//onEsc: Ext.emptyFn,
	layout: 'fit',
	width: 540,
	height: 340,
	title: 'Результаты расчета',

	buttons: [
		{
			xtype: 'tbfill'
		},
		{
			glyph: 'xf00d@FontAwesome',
			text: 'Отмена',
			tooltipType: 'title',
			minWidth: 0,
			handler: 'closeView',
			reference: 'closeButton',
		}
	],

	bodyPadding: 5,
	items: [
		{
			xtype: 'tempresultgrid',
			layout: 'fit',
		}
	]
});
