Ext.define('Opt.view.dialog.DeliveryGroupsList', {
	extend: 'Ext.window.Window',
	alias: 'widget.deliverygroupslist',

	requires: [
		'Opt.view.dialog.DeliveryGroupsListController',
	],

	stateful: true,
	id: 'deliverygroupslist',
	stateId: 'deliverygroupslist',

	controller: 'deliverygroupslist',
	constrain: true,
	modal: true,
	closeAction: 'hide',

	closable: true,
	resizable: false,
	style: 'background-color: #fff;',

	//onEsc: Ext.emptyFn,
	layout: 'fit',
	width: 540,
	height: 340,
	title: 'Группы доставки',
	buttons: [
		{
			xtype: 'tbfill'
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
			store: 'DeliveryGroups',
			columns: {
				defaults: {
					sortable: false,
					hideable: false
				},

				items: [
					{
						text: 'Группа',
						flex: 5,
						dataIndex: 'name',
						cellWrap: true,
					},
					{
						xtype: 'checkcolumn',
						text: 'Транзит запрещен',
						dataIndex: 'transit_restricted',
						menuDisabled: true,
						editable: false,
						readOnly: true,
						//disabled: true,
						flex: 2,
						disabledClass : '',
						listeners: {
	 						beforecheckchange: function(){
	     							return false; // disable check
							}
						},
					},
				]
			}
		}
	]
});
