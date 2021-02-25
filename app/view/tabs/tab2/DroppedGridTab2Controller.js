Ext.define('Opt.view.tabs.tab2.DroppedGridTab2Controller', {
	extend: 'Opt.view.DroppedGridController',
	alias: 'controller.tab2droppedgrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.OrderEdit',
	],

	listen: {
		controller: {
			'*': {
				tab2droppedgridsettitle: 'setTitle',
			}
		}
	},

	setTitle: function (filterString) {
		if (!filterString) filterString = '';
		var store = this.getView().getStore();
		if (!store) {
			this.getView().setTitle('Отброшенные заказы');
			return;
		}
		this.getView().setTitle('Отброшенные заказы ' + '(' + store.count() + ') ' + filterString);
	},

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI');
    		var columns = this.getView().getColumns();
        	Ext.each(columns, function(column) {
			if (column.xtype == 'actioncolumn' 
			|| column.dataIndex == 'num_in_routelist') {
				column.setHidden(true);
			}
		});
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var orderId = record.get("order_id");
		var orderGrid = Ext.getCmp("tab2ordersgrid");
		var orderIndex = orderGrid.store.find("order_id", orderId);
		var orderRecord = orderGrid.store.getAt(orderIndex);
		this.openEditDialog(orderRecord, false);
	},

	openEditDialog: function (record) {

		var self = this;
		if (!this.orderEditDialog || this.orderEditDialog.destroyed) this.orderEditDialog = Ext.create('widget.orderedit', { stateId: 'tab2deroppedOrderEdit'});
		this.orderEditDialog.down('form').loadRecord(record);

		var orderUnloadingGoodStore = this.orderEditDialog.down('orderunloadinggoodsgrid').store;
		orderUnloadingGoodStore.loadData(record.get("unloading_goods"));

		var orderLoadingGoodStore = this.orderEditDialog.down('orderloadinggoodsgrid').store;
		orderLoadingGoodStore.loadData(record.get("loading_goods"));

		var allowedAutoStore = this.orderEditDialog.down('allowedautosgrid').store;
		allowedAutoStore.loadData(record.get("allowed_autos"));
		allowedAutoStore.sync();

		var form = this.orderEditDialog.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});
		this.orderEditDialog.show().focus();
	},

	setPenalty: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		var secGrid = Ext.getCmp('tab2ordersgrid');

		if (!this.setPenaltyDialog || this.setPenaltyDialog.destroyed) this.setPenaltyDialog = Ext.create('widget.setpenalty', { parentGrid: grid});
		this.setPenaltyDialog.show();
	},

	setService: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		if (!this.setServiceTimeDialog || this.setServiceTimeDialog.destroyed) this.setServiceTimeDialog = Ext.create('widget.setservicetime', { parentGrid: grid});
		this.setServiceTimeDialog.show();
	},

	setAutos: function () {
		var selection = this.getView().getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		var autosStore = Ext.getStore('Auto2');
		var parent = this.getView();
		var secGrid = Ext.getCmp('tab2ordersgrid');

		if (!this.AddAllowedAutoDialog || this.AddAllowedAutoDialog.destroyed) this.AddAllowedAutoDialog = Ext.create('Opt.view.dialog.AddAllowedAuto', { mode: 'list_order', tab: selection, secondaryGrid: secGrid });
		this.AddAllowedAutoDialog.show();
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

	getSod: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var ww = val;

		if (record.get('delivery_group_id') != '00000000-0000-0000-0000-000000000000'){
			ww = ww + '<br /><b>' + record.get('delivery_group_name') + '</b>';
		}

		var str = 'data-qtip="';
		var sod = "";
		var goods = record.get('unloading_goods');
		if (goods.length > 0) {
			sod = sod + "Отгрузка:<br />";
			for (var i=0; i < goods.length; i++) {
				var good = goods[i];
				sod = sod + Ext.util.Format.htmlEncode(good.name) + " - " + good.kolvo + " " + good.ed + "<br />";
			}
		}

		var goods = record.get('loading_goods');
		if (goods.length > 0) {
			sod = sod + "Погрузка:<br />";
			for (var i=0; i < goods.length; i++) {
				var good = goods[i];
				sod = sod + Ext.util.Format.htmlEncode(good.name) + " - " + good.kolvo + " " + good.ed + "<br />";
			}
		}

		var dop = Ext.util.Format.htmlEncode(record.get('dop'));

		if (sod != '' && dop != '') {
			str = str + sod + '<br />' + dop;
		} else {
			str = str + sod + dop;
		}

		metadata.tdAttr = str + '"';
		return ww;
	},

   	getGoods: function(title, goodstable){
	        var sumGoodsArr = []; 
		var store = this.getView().getStore(); 

		if (!this.goodsDialog || this.goodsDialog.destroyed) this.goodsDialog = Ext.create('widget.goodsedit', { title: title});

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
		this.getGoods('Отгрузка по заказам.', 'unloading_goods');
	},

	getLoadingGoods: function(){
		this.getGoods('Погрузка по заказам.', 'loading_goods');
	},
});