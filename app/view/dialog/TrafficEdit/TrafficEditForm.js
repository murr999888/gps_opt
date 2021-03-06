Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditForm', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.trafficeditform',
	requires: [
		'Opt.view.dialog.TrafficEdit.TrafficEditFormController',
		'Opt.view.dialog.TrafficEdit.TrafficEditPoints',
		'Opt.ux.HtmlCombo',
	],

	controller: 'trafficeditformcontroller',


	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	items: [
		{
			xtype: 'form',
			reference: 'form',
			items: [
				{
					xtype: 'fieldset',
					padding: 5,
					margin: 5,
					defaults: {
						labelWidth: 100,
						width: 220,
					},
				
					items: [
						{
							xtype: 'fieldcontainer',
							layout: 'hbox',
							items: [
								{
									xtype: 'checkbox',
									name: 'both_direction',
									checked: true,
									inputValue: true,
									uncheckedValue: false,
									fieldLabel: 'В обе стороны',
								},
								{
									xtype: 'field',
									name: 'id',
									fieldLabel: 'id',
									readOnly: true,
									editable: false,
									padding: '0 0 0 10px',
									labelWidth: 20,
									width: 95,
								},
							]
						},
						{
							//xtype: 'field',
							xtype: 'textareafield',
							name: 'name',
							fieldLabel: 'Наименование',
							labelAlign: 'top',
							value: 'Новый участок дороги',
							height: 45,
						},
						{
							labelWidth: 135,
							width: 220,
							xtype: 'numberfield',
							name: 'speed',
							fieldLabel: 'Скорость участка, км/ч',
							//anchor: '100%',
							fieldStyle: 'text-align: right;',
							step: 1,
							minValue: 0,
							maxValue: 80,
							readOnly: false,
							editable: false,
							value: 0,
						},
						{
							labelWidth: 135,
							width: 220,
							xtype: 'numberfield',
							name: 'rate',
							fieldLabel: 'Rate участка',
							//anchor: '100%',
							fieldStyle: 'text-align: right;',
							step: 1,
							minValue: 1,
							maxValue: 100,
							readOnly: false,
							editable: false,
							value: 0,
						},
						{
	         					xtype: 'htmlcombo',
							name: 'icon',
							id: 'trafficediticoncombo',
         						fieldLabel: 'Иконка на карте',
         						displayField: 'displayField',
         						valueField: 'icon',
         						queryMode: 'local',
							store: 'RoadSigns',
							value: 'css/images/signs/znak-proezd-16-16.png',
							labelWidth: 170,
							width: 220,
							listeners: {
                                                        	expand: 'comboSetListSize'
							}
						},
						{
							xtype: 'textareafield',
							name: 'prim',
							fieldLabel: 'Примечание',
							labelAlign: 'top',
							height: 45,
						},
						{
							xtype: 'fieldcontainer',
							fieldLabel: 'Начало',
							labelWidth: 50,
							border: 0,
							defaults: {
								editable: false,
								width: 80,
							},
							layout: 'hbox',
	                                               	items: [
								{
									xtype: 'textfield',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									readOnly: true,
									editable: false,
									value: 0,
									name: 'begin_lat',
								},
								{
									xtype: 'textfield',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									readOnly: true,
									editable: false,
									value: 0,
									name: 'begin_lon',
									padding: '0 0 0 5',
								},
							]
						},
						{
							xtype: 'fieldcontainer',
							fieldLabel: 'Конец',
							labelWidth: 50,
							border: 0,
							defaults: {
								editable: false,
								width: 80,
							},
							layout: 'hbox',
	                                               	items: [
								{
									xtype: 'textfield',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									readOnly: true,
									editable: false,
									value: 0,
									name: 'end_lat',
								},
								{
									xtype: 'textfield',
									anchor: '100%',
									fieldStyle: 'text-align: right;',
									readOnly: true,
									editable: false,
									value: 0,
									name: 'end_lon',
									padding: '0 0 0 5',
								},
							]
						},

						{
							//xtype: 'textareafield',
							xtype: 'hiddenfield',
							name: 'geometry',
							fieldLabel: 'Геометрия',
							labelAlign: 'top',
							readOnly: true,
							height: 45,
						},
						{
							xtype: 'hiddenfield',
							name: 'distance',
						},

					]
				}, 
			]
		},
		{ 
			xtype: 'trafficpointsgridpanel',
			id: 'trafficeditpoints',
			reference: 'trafficeditpoints',
			title: 'Точки OSM',
			flex:5,
		}
	]
}
);