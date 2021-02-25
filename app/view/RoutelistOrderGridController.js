Ext.define('Opt.view.RoutelistOrderGridController', {
	extend: 'Opt.view.OrdersGridController',
	alias: 'controller.routelistordergrid',

	openEditDialog: function (record, editable) {
		var self = this;

		if (!this.orderEdit || this.orderEdit.destroyed) this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab2orderEdit', });
		this.orderEdit.readOnly = true;

		this.orderEdit.down('form').loadRecord(record);

		var orderUnloadingGoodsStore = this.orderEdit.down('orderunloadinggoodsgrid').getStore();
		var unfiltered_goods = record.get("unloading_goods")

		orderUnloadingGoodsStore.loadData(unfiltered_goods);
		orderUnloadingGoodsStore.sync();

		var unfiltered_goods = record.get("loading_goods")

		var orderLoadingGoodsStore = this.orderEdit.down('orderloadinggoodsgrid').getStore();
		orderLoadingGoodsStore.loadData(unfiltered_goods);
		orderLoadingGoodsStore.sync();

		var allowedAutosStore = this.orderEdit.down('allowedautosgrid').getStore();
		allowedAutosStore.loadData(record.get("allowed_autos"));
		allowedAutosStore.sync();

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		Ext.resumeLayouts();
		this.orderEdit.show().focus();
	},
});
