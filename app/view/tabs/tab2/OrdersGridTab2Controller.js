Ext.define('Opt.view.tabs.tab2.OrdersGridTab2Controller', {
	extend: 'Opt.view.RouteLegGridController',
	alias: 'controller.tab2ordersgrid',
	requires: [
		'Opt.ux.NumberPrompt',
		'Opt.view.dialog.SetPenalty',
		'Opt.view.dialog.SetServiceTime',
		'Opt.view.dialog.AddServiceTime',
		'Opt.view.dialog.SetDeliveryGroup',
		'Opt.view.dialog.GoodsEdit',
	],

	msgbox: null,

	listen: {
		controller: {
			'*': {
				distributed_orders_change_date: 'distributed_orders_change_date',
				tab2ordergridsettitle: 'setTitle',
				tab2ordersgriddeselect: 'setAllDeselected',
			}
		}
	},

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI');
	},

	distributed_orders_change_date: function () {
		this.clearData();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	getOrders: function () {
		this.fireEvent('tab2getOrdersFromServer');
	},

	clearData: function () {
		this.fireEvent('tab2clearData');
	},

	sendData: function () {
		this.fireEvent('tab2sendData');
	},

	setPenalty: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setpenalty', { parentGrid: grid });
		this.msgbox.show();
	},

	setServiceTime: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setservicetime', { parentGrid: grid });
		this.msgbox.show();
	},

	addServiceTime: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.addservicetime', { parentGrid: grid });
		this.msgbox.show();
	},

	setDeliveryGroup: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setdeliverygroup', { parentGrid: grid });
		this.msgbox.show();
	},

	getCity: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var str = record.get('city') + '<br />' + record.get('adres');
		return str;
	},

	setTitle: function (filterString) {
		var store = this.getView().getStore();
		if (!store) {
			this.getView().setTitle('Заказы');
			return;
		}

		if (!filterString) filterString = '';
		var inUseCount = 0;
		store.each(function(record){
			if(record.get("in_use")){
				inUseCount++;
			}
		});
		var checkedStr = '';
		if (inUseCount>0) checkedStr = ' &#10003;' + inUseCount + ' ';
		this.getView().setTitle('Заказы ' + checkedStr + '(' + store.count() + ') ' + filterString);
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		this.openEditDialog(record);
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
		this.setTitle();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().store;
		store.commitChanges();
		store.resumeEvents();
		Ext.suspendLayouts();
		this.getView().view.refresh();
		Ext.resumeLayouts();
		this.setTitle('');
	},

	beforeHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().store;
		store.suspendEvents();
	},

	openEditDialog: function (record) {
		var self = this;

		if (!this.orderEdit) this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab2orderEdit', });
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

		this.orderEdit.on('close', function (panel) {
			self.onCloseEditOrderDialog(panel);
		});

		Ext.resumeLayouts();
		this.orderEdit.show().focus();
	},

	setAutos: function () {
		var selection = this.getView().getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.editDialog = null;
		this.editDialog = Ext.create('Opt.view.dialog.AddAllowedAuto', { mode: 'list_order', tab: selection });
		this.editDialog.show();
	},

	removeAutos: function () {
		var self = this;
		var selection = this.getView().getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		Ext.Msg.show({
			title: 'Внимание',
			message: 'Список допустимых машин для выделенных заказов будет очищен. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.deleteAllowedAutos();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	deleteAllowedAutos: function () {
		var selection = this.getView().getSelection();
		selection.forEach(function (record) {
			record.set('allowed_autos', []);
		});
	},

	getGoods: function(title, gridname, goodstable){
	        var sumGoodsArr = []; 
		var store = Ext.getCmp(gridname).getStore(); 

		if (!this.goodsDialog) this.goodsDialog = Ext.create('widget.goodsedit', { title: title});

		var goodsGrid = this.goodsDialog.down('ordergoodsgrid');
		var goodsGridStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		goodsGridStore.sort([
    			{
        			property : 'name',
        			direction: 'ASC'
    			},
		]);

		goodsGrid.setStore(goodsGridStore);
		this.goodsDialog.show();
		this.goodsDialog.focus();

		setTimeout(function(){
			for (var i=0; i < store.count(); i++){
				var order = store.getAt(i);
				var goods = order.get(goodstable);
				for (var j=0; j < goods.length; j++){
					var good = goods[j];
					var index = sumGoodsArr.findIndex((element)=>element.id == good.id); 
					if (index == -1) {
						if (good.kolvo > 0){
							var goodCopy = $.extend(true, {}, good);
							sumGoodsArr.push(goodCopy);
						}
					} else {
						sumGoodsArr[index].kolvo = sumGoodsArr[index].kolvo + good.kolvo;
					};
				}; 
			};
			
			goodsGridStore.loadData(sumGoodsArr);
		},0);
	},
	

	getUnloadingGoods: function(){
		this.getGoods('Отгрузка по заказам.', 'tab2ordersgrid', 'unloading_goods');
	},

	getLoadingGoods: function(){
		this.getGoods('Погрузка по заказам.', 'tab2ordersgrid', 'loading_goods');
	},

	setAllSelected: function(){
		this.getView().getSelectionModel().selectAll(true);
	},

	setAllDeselected: function(){
		this.getView().getSelectionModel().deselectAll(true);
	},

	getMarkedRecords: function(){
		var store = this.getView().store;
		var arrMarked = [];
		store.each(function(record){
			if (record.get('in_use')) {
				arrMarked.push(record);
			}
		});

		return arrMarked;
	},

	setMarkedSelected: function(){
		var arrMarked = this.getMarkedRecords();
		if (arrMarked.length > 0) this.getView().getSelectionModel().select(arrMarked);
	},

	setMarkedDeselected: function(){
		var arrMarked = this.getMarkedRecords();
		if (arrMarked.length > 0) this.getView().getSelectionModel().deselect(arrMarked);
	},

	setMarkOnSelected: function(){
		var selected = this.getView().getSelectionModel().getSelection();
		var store = this.getView().store;
		store.suspendEvents();
		for (var i=0; i < selected.length; i++){
			var record = selected[i];
			record.set('in_use', true);
			record.commit();
		}

		store.resumeEvents();
		this.getView().view.refresh();
	},

	clearMarkOnSelected: function(){
		var selected = this.getView().getSelectionModel().getSelection();
		var store = this.getView().store;
		store.suspendEvents();
		for (var i=0; i < selected.length; i++){
			var record = selected[i];
			record.set('in_use', false);
			record.commit();
		}

		store.resumeEvents();
		this.getView().view.refresh();
	},

	refreshCoords: function(){
		var orders = [];

		var store = this.getView().store;

		var selected = this.getView().getSelectionModel().getSelection();
		if (selected.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		for (var i=0; i < selected.length; i++){
			var record = selected[i];
			orders.push(record.get('order_id'));
		}

		var params = {
			param: 'getOrdersCoords',
			orders: orders
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'POST',
			jsonData: params,
			async: true,
			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				var data = respObj.data;

				store.suspendEvents();
				data.forEach(function(record){
	                                var orderId = record.id;
					var orderIndex = store.find("order_id", orderId);
					if (orderIndex != -1) {
						var orderRecord = store.getAt(orderIndex);
						orderRecord.set('lat', record.lat);
						orderRecord.set('lon', record.lon);
						orderRecord.commit();
					}
				});
				store.resumeEvents();
				Ext.Msg.alert("Внимание!", "Координаты обновлены.");
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				Ext.getCmp('tab2ordersgrid').unmask();
			}
		});
	}
});