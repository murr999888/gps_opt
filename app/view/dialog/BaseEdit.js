Ext.define('Opt.view.dialog.BaseEdit', {
	extend: 'Opt.view.dialog.Base',

	requires: [
		'Opt.view.dialog.BaseEditController'
	],

	controller: 'baseEdit',

	buttons: [
		{
			xtype: 'tbfill'
		},
		{
			glyph: 'xf00c@FontAwesome',
			text: 'Сохранить',
			handler: 'onSaveClick',
			reference: 'saveButton',
		},
		{
			glyph: 'xf00d@FontAwesome',
			text: 'Отмена',
			handler: 'closeView',
			reference: 'closeButton',
		},
	]
});
