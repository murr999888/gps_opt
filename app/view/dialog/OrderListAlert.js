Ext.define('Opt.view.dialog.OrderListAlert', {
	extend: 'Ext.window.Window',
	alias: 'widget.orderlistalert',
	requires: [
		'Opt.view.dialog.OrderListAlertController',
	],

	controller: 'orderlistalert',
	autoScroll: false,
	constrain: true,
	modal: true,
	stateful: true,
	stateId: 'orderlistalert',
	closeAction: 'destroy',
	closable: true,
	resizable: true,
	maxWidth: 600,
	maxHeight: 500,
	minWidth: 500,
	minHeight: 200,
	style: 'background-color: #fff;',
	title: 'Внимание!',
	layout: 'fit',

	items: [
		{
			xtype: 'gridpanel',
			id: 'orderlistalertgrid',
			width: 500,
			height: 200,
			title: {
				text: '<div style="text-align:center;">К этим заказам привязаны машины, которые не отмечены для расчета! <br /> Измените привязки заказа или снимите флаг участия его в расчете.</div>',
				style: 'background-color: #fff;',
			},

			listeners: {
				celldblclick: 'onCellDblClick',
			},

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
							text: 'Изменить',
							menu: {
								items: [
									{
										text: 'Установить допустимые машины',
										handler: 'setAutos',
									},
									{
										text: 'Удалить допустимые машины',
										handler: 'removeAutos',
									},
								]
							},
						},
					]
				},
			],

			columns: {
				defaults: {
					menuDisabled: true,
					sortable: false,
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
						text: 'Пункт',
						cellWrap: true,
						flex: 5,
						dataIndex: 'full_name',
						renderer: 'getSod',
					},
					{
						text: 'Ш',
						align: 'right',
						flex: 1,
						dataIndex: 'penalty',
					},
					{
						text: 'Окно',
						cellWrap: true,
						flex: 2,
						dataIndex: 'timewindow_string',
					},
				]
			},
		},
	],

	buttons: [
		{
			xtype: 'tbfill'
		},
		{
			glyph: 'xf00c@FontAwesome',
			text: 'Продолжить',
			minWidth: 100,
			handler: 'onOKClick',
			reference: 'OKButton',
		}, 
		{
			glyph: 'xf00d@FontAwesome',
			text: 'Отмена',
			minWidth: 100,
			handler: 'onCancelClick',
			reference: 'CancelButton',
		},
		{
			xtype: 'tbfill'
		},
	],
});