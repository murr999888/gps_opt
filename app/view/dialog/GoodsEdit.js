Ext.define('Opt.view.dialog.GoodsEdit', {
	extend: 'Ext.window.Window',
	alias: 'widget.goodsedit',
	requires: [
		'Opt.view.OrderGoodsGrid',
		'Opt.view.dialog.GoodsEditController',
	],

	id: 'goodsedit',
	stateful: true,
	stateId: 'goodsedit',
	controller: 'goodsedit',
	constrain: true,
	modal: true,
	closeAction: 'destroy',
	closable: true,
	resizable: true,
	style: 'background-color: #fff;',
	//onEsc: Ext.emptyFn,
	layout: 'fit',
	title: 'Отгрузка',
	width: 440,
	height: 240,
	minWidth: 440,
	minHeight: 240,
	maxWidth: 840,
	maxHeight: 440,

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
			title: 'Продукция',
			xtype: 'ordergoodsgrid',
			layout: 'fit',
		}
	]
});
