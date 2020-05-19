Ext.define('Opt.view.dialog.Register', {
	extend: 'Opt.view.dialog.Base',

	requires: [
		'Opt.view.dialog.RegisterController'
	],

	controller: 'register',
	title: 'Регистрация',

	items: {
		xtype: 'form',
		reference: 'form',
		jsonSubmit: true,
		bodyPadding: 10,
		border: 2,
		items: [
			{
				xtype: 'textfield',
				name: 'name',
				fieldLabel: 'Логин',
				allowBlank: false
			},
			{
				xtype: 'textfield',
				name: 'password',
				fieldLabel: 'Пароль',
				inputType: 'password',
				allowBlank: false
			}
		]
	},

	buttons: [
		{
			text: 'ОК',
			handler: 'onCreateClick'
		},
		{
			text: 'Отмена',
			handler: 'closeView'
		}
	]
});
