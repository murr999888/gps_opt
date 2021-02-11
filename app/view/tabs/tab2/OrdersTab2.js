Ext.define('Opt.view.tabs.tab2.OrdersTab2', {
	extend: 'Ext.panel.Panel',
	xtype: 'orderstab2',
	alias: 'widget.orderstab2',
	controller: 'tab2orders',
	allowDeselect: true,
	requires: [
		'Opt.view.tabs.tab2.OrdersTab2Controller',
		'Opt.view.tabs.tab2.OrdersGridTab2',
		'Opt.ux.DatePickerUI',
		'Opt.ux.TimePickerUIWS',
	],

	layout: {
	        type: 'accordion',
        	titleCollapse: true,
	        animate: false,
		multi: true,
		collapseFirst: false,
		fill: false,
	},

	listeners: {
		resize: 'onResize',
	},

	header: {
		titlePosition: 0,
	},

	items: [
		{
			stateful: true,
			stateId: 'formorderstab2',
			collapsible: true,
			titleCollapse: true,
			animCollapse: false,
			title: 'Фильтр заказов',
			xtype: 'form',
			reference: 'formorderstab2',
			id: 'formorderstab2',
			height: 293,
			bodyPadding: 5,
			items: [
				{
					xtype: 'fieldcontainer',
					layout: 'hbox',
					border: 1,
					height: 225,
					items: [
						{
							xtype: 'fieldset',
							padding: 5,
							height: 222,
							items: [
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2client',
											name: 'not_clientname',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',

											xtype: 'textfield',
											id: 'formorderstab2client',
											name: 'clientname',
											fieldLabel: 'Клиент',
											editable: true,
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: 'clearField',
												},
											},
											listeners: {
												specialkey: function (field, e) {
													// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
													// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
													if (e.getKey() == e.ENTER) {
														//Ext.getCmp("orderstab2").getController().setFilter();
													}
												}
											},
										},
									]
								},

								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2tochka',
											name: 'not_tochkaname',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',

											xtype: 'textfield',
											id: 'formorderstab2tochka',
											name: 'tochkaname',
											fieldLabel: 'Точка',
											editable: true,
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: 'clearField',
												},
											},
											listeners: {
												specialkey: function (field, e) {
													// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
													// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
													if (e.getKey() == e.ENTER) {
														//Ext.getCmp("orderstab2").getController().setFilter();
													}
												}
											},
										},

									]
								},
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2addr',
											name: 'not_addr',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',

											xtype: 'textfield',
											id: 'formorderstab2addr',
											name: 'addr',
											fieldLabel: 'Адрес',
											editable: true,
											autocomplete: 'new-addr',
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: 'clearField',
												},
											},
											listeners: {
												specialkey: function (field, e) {
													// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
													// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
													if (e.getKey() == e.ENTER) {
														//Ext.getCmp("orderstab2").getController().setFilter();
													}
												}
											},
										},
									]
								},
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2city',
											name: 'not_city',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',

											xtype: 'textfield',
											id: 'formorderstab2city',
											name: 'city',
											fieldLabel: 'Город',
											editable: true,     
											autocomplete: 'new-city',
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: 'clearField',
												},
											},
											listeners: {
												specialkey: function (field, e) {
													// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
													// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
													if (e.getKey() == e.ENTER) {
														//Ext.getCmp("orderstab2").getController().setFilter();
													}
												}
											},
										},
									]
								},
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2productselect',
											name: 'not_productselect',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',

											value: 0,
											xtype: 'combobox',
											id: 'formorderstab2productselect',
											name: 'productselect',
											fieldLabel: 'Продукция',
											matchFieldWidth: true,
											store: 'Product',
											queryMode: 'local',
											displayField: 'short_name',
											valueField: 'id',
											editable: false,
											listeners: {
												select: 'onProdCSelect',
											},
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: function (combo) {
														combo.setValue(0);
													},
												},
											},
										},
									],
								},
								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2clientgroupselect',
											name: 'not_clientgroupselect',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',
											value: 0,
											xtype: 'combobox',
											id: 'formorderstab2clientgroupselect',
											name: 'clientgroupselect',
											fieldLabel: 'Гр. клиентов',
											store: 'ClientGroup',
											queryMode: 'local',
											displayField: 'name',
											valueField: 'id',
											editable: false,
											listeners: {
												select: 'onClientCSelect',
											},
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: function (combo) {
														combo.setValue(0);
													},
												},
											},
										},
									],
								},

								{
									xtype: 'fieldcontainer',
									layout: 'hbox',

									border: 0,
									items: [
										{
											xtype: 'checkbox',
											value: false,
											id: 'not_formorderstab2deliverygroupselect',
											name: 'not_deliverygroupselect',
											fieldLabel: 'Не',
											labelWidth: 20,
										},
										{
											labelWidth: 90,
											editable: false,
											width: 315,
											padding: '0 0 0 10px',
											//cls: 'tworowlabelfield',
											value: '00000000-0000-0000-0000-000000000000',
											xtype: 'combobox',
											id: 'formorderstab2deliverygroupselect',
											name: 'deliverygroupselect',
											fieldLabel: 'Гр. доставки',
											store: 'DeliveryGroups',
											queryMode: 'local',
											displayField: 'displayField',
											valueField: 'id',
											editable: false,
											listeners: {
												select: 'onDeliveryGroupsSelect',
											},
											triggers: {
												clearField: {
													cls: 'x-form-clear-trigger',
													handler: function (combo) {
														combo.setValue('00000000-0000-0000-0000-000000000000');
													},
												},
											},
										},
									],
								},

								{
									xtype: 'fieldcontainer',
									layout: 'hbox',
										
									items: [
										{
											labelWidth: 75,
											xtype: 'checkbox',
											value: false,
											id: 'formorderstab2inuse',
											name: 'in_use',
											fieldLabel: 'Отмеченные',
											checked: false,
											inputValue: true,
											uncheckedValue: false,
										},
										{
											labelWidth: 90,
											margin: '0 0 0 25px',
											xtype: 'checkbox',
											value: false,
											id: 'formorderstab2notinuse',
											name: 'not_in_use',
											fieldLabel: 'Не отмеченные',
											checked: false,
											inputValue: true,
											uncheckedValue: false,
										},
									]
								}
							]
						},
					]
				},
				{
					xtype: 'fieldcontainer',
					layout: 'hbox',
					align: 'stretch',
					padding: '3 0',
					defaults: {
						flex: 1
					},
					items: [
						{
							xtype: 'button',
							id: 'menutab2setfilterbutton',
							text: 'Уст. фильтр',
							handler: 'setFilter',
							iconCls: 'fa fa-filter',
						},
						{
							margin: '0 0 0 5',
							xtype: 'button',
							id: 'menutab2clearformbutton',
							text: 'Сбросить поля',
							handler: 'clearForm',
						},
						{
							margin: '0 0 0 5',
							xtype: 'button',
							id: 'menutab2clearfilterbutton',
							text: 'Уд. фильтр',
							handler: 'clearFilter',
						},
					]
				},
			]
		},
		{
			flex: 5,
			title: 'Заказы',
			xtype: 'tab2ordersgridpanel',
			id: 'tab2ordersgrid',
			stateful: true,
			stateId: 'tab2ordersgrid',
		},
	],
});