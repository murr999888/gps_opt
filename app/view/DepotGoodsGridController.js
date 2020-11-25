Ext.define('Opt.view.DepotGoodsGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.depotgoodsgrid',
	requires: [
		'Opt.ux.GridPrinter',
	],

	init: function () {
		var self = this;
		var grid = this.getView();
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.DepotGood',
			proxy: {
				type: 'memory',
			},
		});
		
		grid.setStore(store);
		store.load();
		this.getView().getSelectionModel().setSelectionMode('MULTI');

		grid.on('edit', function(editor, e) {
    			// commit the changes right after editing finished
    			e.record.commit();
		});		

		grid.on('beforeedit', function(editor, context, eOpts){ 
			if(context.record.get("kolvo") == 0) {
				context.value = '';
			}
		});
	},	

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		this.getView().store.commitChanges();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	refreshGoods: function(){
		var self = this;
		var grid = this.getView();
		var store = grid.getStore();
		var params = {
			param: 'Prod',
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,
		        async: true,
			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				//store.suspendEvents();
				store.loadData(respObj.data);
				store.each(function(record){
					record.set("in_use", true);
					record.set("kolvo", 9999999);
				});

				store.sync();
	
				//store.resumeEvents();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				Ext.getCmp('tab2ordersgrid').unmask();
			}
		});

	},
});