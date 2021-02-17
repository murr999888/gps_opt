Ext.define('Opt.view.dialog.GoodsSelect', {
	extend: 'Ext.window.Window',
	alias: 'widget.goodsselect',
	requires: [
		'Opt.view.dialog.GoodsSelectController',
	],

	stateful: true,
	stateId: 'goodsselect',
	controller: 'goodsselect',
	//constrain: true,
	modal: true,
	closeAction: 'hide',
	closable: true,
	resizable: true,
	style: 'background-color: #fff;',
	//onEsc: Ext.emptyFn,
	layout: 'fit',
	width: 355,
	height: 340,
	title: 'Выбрать товар',

	buttons: [
		{
			xtype: 'tbfill'
		},
/*
		{
			glyph: 'xf00c@FontAwesome',
			text: 'Сохранить',
			tooltipType: 'title',
			minWidth: 0,
			handler: 'onSaveClick',
			reference: 'saveButton',
		}, 
*/
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
			xtype: 'gridpanel',
			store: 'Goods',
			layout: 'fit',
			tools: [
				{
					type: 'refresh',
					handler: 'refreshTable',
					tooltip: 'Печать'
				},
				{
					type: 'print',
					handler: 'printTable',
					tooltip: 'Печать'
				}
			],		
			listeners: {
				celldblclick: 'onCellDblClick',
			},
			columns: {
				defaults: {
					sortable: true,
					hideable: false,
				},

				items: [
					{
						text: 'Товар',
						flex: 5,
						dataIndex: 'name',
						cellWrap: true,
					},
					{
						text: 'Ед',
						flex: 1,
						dataIndex: 'ed',
						//cellWrap: true,
					},
				]
			}
		}
	]
});
