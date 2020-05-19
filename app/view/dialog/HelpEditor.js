Ext.define('Opt.view.dialog.HelpEditor', {
	extend: 'Ext.window.Window',
	width: 800,
	height: 500,
	modal: true,
	maximizable: true,
	title: 'Редактор справки',
	xtype: 'helpeditor',
	id: 'helpeditor',
	alias: 'widget.helpeditor',
	stateful: true,
	stateId: 'helpeditor',
	controller: 'helpeditor',

	requires: [
		'Opt.view.dialog.HelpEditorController',
	],

	layout: 'fit',
	closable: true,
	closeAction: 'destroy',
	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			defaults: {
				margin: '0 3px 0 3px',
			},

			items: [
				{
					xtype: 'button',
					text: 'Сохранить',
					handler: 'saveText',
				},
				{
					xtype: 'button',
					text: 'Сохранить и закрыть',
					handler: 'saveTextAndClose',
				},
				{
					xtype: 'button',
					text: 'Закрыть',
					handler: 'closeEditor',
				},
				{
					xtype: 'tbspacer',
					flex: 1,
				},
			]
		},
	],

	items: [
		{
			xtype: 'form',
			reference: 'form',
			layout: 'fit',
			items: [
				{
					xtype: 'ckeditor',
					name: 'editor1',
					id: 'editor1',
					editorId: 'editor1',
					value: '',
					width: 500,
				}
			],
		}
	]
});