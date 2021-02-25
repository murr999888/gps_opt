Ext.define('Opt.view.dialog.SetAllowedClientGroups', {
	extend: 'Ext.window.Window',
	alias: 'widget.setallowedclientgroups',
	requires: [
		'Opt.view.dialog.SetAllowedClientGroupsController',
	],

	stateful: true,
	id: 'setallowedclientgroups',
	stateId: 'setallowedclientgroups',
	controller: 'setallowedclientgroups',
	constrain: true,
	modal: true,
	closeAction: 'hide',
	closable: true,
	resizable: true,
	style: 'background-color: #fff;',
	//onEsc: Ext.emptyFn,
	layout: 'fit',
	width: 240,
	height: 340,
	title: 'Установить допустимые группы клиентов',

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
			xtype: 'grid',
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
						text: 'Группа клиентов',
						flex: 5,
						dataIndex: 'name',
						cellWrap: true,
					},
				]
			}
		}
	]
});
