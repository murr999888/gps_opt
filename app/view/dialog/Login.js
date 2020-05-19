Ext.define('Opt.view.dialog.Login', {
	extend: 'Opt.view.dialog.Base',
	alias: 'widget.login',

	requires: [
		'Opt.view.dialog.LoginController'
	],

	border: false,
	controller: 'login',
	header: false,
	closable: false,

	items: {
		xtype: 'form',
		reference: 'form',

		bodyPadding: 10,
		border: 1,

		autoEl: {
			tag: 'form',
			method: 'POST',
			action: 'fake-login.html',
			target: 'submitTarget'
		},

		items: [
			{
				xtype: 'textfield',
				name: 'username',
				reference: 'userField',
				fieldLabel: 'Логин',
				allowBlank: false,
				enableKeyEvents: true,
				listeners: {
					specialKey: 'onSpecialKey',
					afterrender: 'onAfterRender'
				},
				inputAttrTpl: ['autocomplete="on" autocapitalize="none"']
			},
			{
				xtype: 'textfield',
				name: 'password',
				reference: 'passwordField',
				fieldLabel: 'Пароль',
				inputType: 'password',
				allowBlank: false,
				enableKeyEvents: true,
				listeners: {
					specialKey: 'onSpecialKey'
				},
				inputAttrTpl: ['autocomplete="on"']
			},
			{
				xtype: 'checkboxfield',
				inputValue: true,
				uncheckedValue: false,
				reference: 'rememberField',
				checked: true,
				name: 'rememberme',
				fieldLabel: 'Запомнить'
			},
			{
				xtype: 'component',
				html: '<iframe id="submitTarget" name="submitTarget" style="display:none"></iframe>'
			},
			{
				xtype: 'component',
				html: '<input type="submit" id="submitButton" style="display:none">'
			}
		]
	},

	buttons: [
		{
			text: 'Регистрация',
			handler: 'onRegisterClick',
			reference: 'registerButton'
		},
		{
			text: 'Вход',
			handler: 'onLoginClick'
		}
	]
});
