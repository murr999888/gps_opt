Ext.define('Opt.view.dialog.AddAllowedAuto', {
	extend: 'Ext.window.Window',
	alias: 'widget.addallowedauto',
	requires: [
		'Opt.view.dialog.AddAllowedAutoController',
	],

	stateful: true,
	id: 'addallowedauto',
	stateId: 'addallowedauto',
	controller: 'addallowedauto',
	constrain: true,
	modal: true,
	closeAction: 'destroy',
	closable: true,
	resizable: true,
	style: 'background-color: #fff;',
	//onEsc: Ext.emptyFn,
	layout: 'fit',
	width: 240,
	height: 340,
	title: 'Добавить машины в список допустимых',

	buttons: [
		{
			xtype: 'tbfill'
		},
		{
			glyph: 'xf00c@FontAwesome',
			text: 'Сохранить',
			tooltipType: 'title',
			minWidth: 0,
			handler: 'onSaveClick',
			reference: 'saveButton',
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
			xtype: 'gridpanel',
			layout: 'fit',
			viewConfig: {
				getRowClass: function (record, rowIndex, rowParams, store) {
					if (!record.get('in_use') == true) {
						return 'row-bk-grey';
					}
				},
			},

			columns: {
				defaults: {
					sortable: false,
					hideable: false
				},

				items: [
					{
						xtype: 'checkcolumn',
						text: '',
						dataIndex: 'in_use',
						menuDisabled: true,
						headerCheckbox: true,
						width: 25,
						listeners: {
							checkchange: 'onChangeInUse',
							headercheckchange: 'onHeaderCheckChange',
						}
					},
					{
						text: 'Машина',
						flex: 5,
						dataIndex: 'name',
						cellWrap: true,
					},
				]
			}
		}
	]
});
