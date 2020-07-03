Ext.define('Opt.view.tabs.tab2.RoutesGridTab2Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.tab2routesgrid',
	checkedAll: true,
	routelistEdit: null,
	requires: [
		'Opt.view.dialog.RouteListEdit',
		'Opt.ux.GridPrinter',
	],

	listen: {
		controller: {
			'*': {
				distributed_orders_change_date: 'distributed_orders_change_date',
			}
		}
	},

	init: function () {
		var self = this;
		this.goodsEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		this.ordersEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

	        var routeGoodsStore = Ext.getStore('RoutesGoodsStore');
		routeGoodsStore.on('load', function(){
			self.setGetGoodsButton();
		});

		routeGoodsStore.on('remove', function(){
			self.setGetGoodsButton();
		});
	},

	setGetGoodsButton: function(){
		var routeGoodsStore = Ext.getStore('RoutesGoodsStore');
		if (routeGoodsStore.count() > 0) {
			Ext.getCmp('tab2getRoutesGoodsButton').setDisabled(false);
		} else {
			Ext.getCmp('tab2getRoutesGoodsButton').setDisabled(true);		
		}
	},
	
	afterRender: function(){
		this.setColumnsDefault(0);
	},

	distributed_orders_change_date: function () {
		this.clearRoutes();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},


	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		this.getView().suspendEvents();
		this.getView().store.commitChanges();
		this.getView().resumeEvents();
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var self = this;

		if (!this.routelistEdit) this.routelistEdit = Ext.create('widget.routelistedit');

		this.routelistEdit.down('form').loadRecord(record);

		this.routelistEdit.down('ordergoodsgrid').setStore(this.goodsEditStore);

		this.goodsEditStore.loadData(record.get('goods'));

		this.goodsEditStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		this.routelistEdit.down('ordersgridpanel').setStore(this.ordersEditStore);

		this.ordersEditStore.loadData(record.get('orders'));

		var form = this.routelistEdit.lookupReference('form').getForm();
		form.setValues({
			route_begin_1: secToHHMMSS(record.get("route_begin_calc")),
			route_end_1: secToHHMMSS(record.get("route_end_calc")),
			duration_1: secToHHMMSS(record.get("duration")),
			durationFull_1: secToHHMMSS(record.get("durationFull")),
			date_1: getDDMMYYYY(record.get("date")),
		});

		this.routelistEdit.show().focus();

	},

	getDriverName: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var id = record.get('driver_id');
		if (id == 0) {
			metadata.style = 'background-color: yellow;'; 
		}
		return val;
	},

	getTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	openViewer: function () {
		var routeListStore = this.getView().store;
		if (routeListStore.count() == 0) {
			Ext.Msg.alert('Внимание!', 'Таблица маршрутов пуста.');
			return;
		}

		var droppedOrderStore = Ext.getCmp('tab2droppedgrid').store;

		if (!this.viewer) this.viewer = Ext.create('widget.resultviewermain', { closable: true });
		//this.viewer = null;
		//this.viewer = Ext.create('widget.resultviewermain', { closable: true });

		Ext.getCmp('resultviewerroutesgrid').setStore(routeListStore);
		Ext.getCmp('resultviewerdroppedgrid').setStore(droppedOrderStore);

		Ext.getCmp('resultviewerroutesgrid').setTitle(Ext.getCmp('tab2routesgrid').getTitle());

		Ext.getCmp('resultviewerroutesgrid').getView().getSelectionModel().select(0);
		this.viewer.show();
		this.viewer.focus();
		Ext.getCmp('resultviewerroutesgrid').focus();

		if (this.viewer.mapRendered) this.fireEvent("resultviewermapRender");
	},

	onPressClearRoutes: function(){
		var self = this;
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Таблицы маршрутов будет очищена. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.clearRoutes();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	clearRoutes: function () {
		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');
		clearStore('DroppedGoodsStore');
		clearStore('RoutesGoodsStore');

		Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы");
		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");
	},


	saveRoutes: function () {
		var self = this;
		var routeListStore = this.getView().store;
		if (routeListStore.count() == 0) {
			Ext.Msg.alert('Внимание!', 'Таблица маршрутов пуста.');
			return;
		}

		Ext.Msg.show({
			title: 'Внимание',
			message: 'Данные будут сохранены в NN.<br />Таблицы заказов и маршрутов будут очищены. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.sendRoutes();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	sendRoutes: function () {
		var self = this;

		Ext.getCmp('maintab2').mask("Идет сохранение результатов... ");

		var routes = [];
		var store = this.getView().store;
		store.each(function (record) {
			routes.push(record.getData());
		});

		var params = {
			param: 'saveDistrRoutes',
			routes: routes
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'POST',
			jsonData: params,

			success: function (response) {
				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Ext.getCmp('maintab2').unmask();
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				if (respObj.success) {
					self.clearStores();
					Ext.getCmp('maintab2').unmask();
					Ext.Msg.alert("Внимание!", respObj.message);
				}
			},

			failure: function (response) {
				Ext.getCmp('maintab2').unmask();
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
			}
		});

	},

	clearStores: function () {
		clearStore('tab2ordersgrid');
		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');
		clearStore('DroppedGoodsStore');
		clearStore('OrdersGoodsStore');
		clearStore('RoutesGoodsStore');

		Ext.getCmp('tab2ordersgrid').setTitle("Заказы");
		Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы");
		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");

	},

	loadRoutes: function () {
		var self = this;
		var store = this.getView().store;

		if (store.count() > 0) {
			Ext.Msg.show({
				title: 'Внимание',
				message: 'Таблица  маршрутов будет очищена. Продолжить?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					if (btn === 'yes') {
						self.getRoutes();
					} else if (btn === 'no') {
						return;
					}
				}
			});
		} else {
			self.getRoutes();
		}
	},

	getRoutes: function () {
		var self = this;

		this.clearRoutes();

		var store = this.getView().store;

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();
		var orders_date = formVal.solvedate;

		orders_date = orders_date.replace(/-/g, '/'); // для IE 

		var datetimeBegin = Date.parse(orders_date + ' ' + "00:00:00");
		var datetimeEnd = Date.parse(orders_date + ' ' + "23:59:59");

		var params = {
			param: 'RouteListsWithOrders',
			datetime_begin: Parse1CData(datetimeBegin),
			datetime_end: Parse1CData(datetimeEnd),
			use_plantime: true,
			not_on_route: true,
			orders_backup: true,
			use_progressive_penalty: true,
		};

		this.getView().mask("Loading...");

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,

			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				var data = respObj.data;

				store.suspendEvents();
				store.loadData(data.routes);

				store.each(function (record) {
					record.beginEdit();
					record.set('in_use', false);
					record.commit();
				});

				store.sync();
				store.resumeEvents();
				store.fireEvent('load');

				if (data.goods.length > 0) {
					var goodsStore = Ext.getStore('RoutesGoodsStore');

					var goodsData = [];
					Ext.Array.forEach(data.goods, function (item) {
						var record = item;
						if (record.kolvo > 0) {
							goodsData.push(record);
						}
					});

					goodsStore.suspendEvents();
					goodsStore.loadData(goodsData);
					goodsStore.sync();
					goodsStore.resumeEvents();
					goodsStore.fireEvent('load');
				}

				self.getView().view.refresh()
				self.getView().unmask();

				Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы (" + store.count() + ")");
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				self.getView().unmask();
			}
		});
	},

	setColumnsDefault: function(mode){
		return;

		var dim = Ext.getBody().getViewSize();
		if (dim.width > 1366) return;

		var columnManager = this.getView().getColumnManager();
		if (mode == 0) {
                	columnManager.getHeaderByDataIndex('route_begin_plan').hide();
			columnManager.getHeaderByDataIndex('route_end_plan').hide();
                	columnManager.getHeaderByDataIndex('route_begin_calc').show();
			columnManager.getHeaderByDataIndex('route_end_calc').show();
		} else {
                	columnManager.getHeaderByDataIndex('route_begin_plan').show();
			columnManager.getHeaderByDataIndex('route_end_plan').show();
                	columnManager.getHeaderByDataIndex('route_begin_calc').hide();
			columnManager.getHeaderByDataIndex('route_end_calc').hide();
		}
	},
	
	onModeSelect: function(combo, record, index, eOpts ) {
		var buttonGetRoutes = Ext.getCmp('tab2ButtonLoadRoutes');
		var checkboxSwapOrders = Ext.getCmp('tab2allowswaporders');
		var mode = record.get('id');
		if ( mode == 0) {
			buttonGetRoutes.setDisabled(true);
			checkboxSwapOrders.setDisabled(true);
		} else {
			buttonGetRoutes.setDisabled(false);
			checkboxSwapOrders.setDisabled(false);
		}

		this.setColumnsDefault(mode);
	},

	onBeforeModeSelect: function(combo, record, index, eOpts ) {
		var store = this.getView().store;
		if (store.count() > 0) {
			Opt.app.showError('Внимание!','Перед изменением режима распределения заказов <br />очистите таблицу маршрутов!');
			return false;
		}
	},

	onAllowSwapOrders: function (checkbox, newValue, oldValue, eOpts) {

	},

	getGoods: function(){
		var title = 'Отгрузка по маршрутам.';
		this.editDialog = null;
		this.editDialog = Ext.create('Opt.view.dialog.GoodsEdit', { title: title});
		var goodsGrid = this.editDialog.down('ordergoodsgrid');
		goodsGrid.setStore(Ext.getStore('RoutesGoodsStore'));
		this.editDialog.show();
		this.editDialog.focus();
	},
});