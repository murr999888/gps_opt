Ext.define('Opt.view.dialog.GoodsSelectController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.goodsselect',
	requires: [
		'Opt.ux.GridPrinter',
	],

	init: function () {
		var self = this;
		var grid = this.getView().down('gridpanel');
		var store = grid.getStore();
		//store.sort('name', 'ASC');
	},

	closeView: function () {
		this.getView().destroy();
	},

	refreshTable: function(){
		Ext.getStore('Goods').reload();
	},

	printTable: function () {
		var grid = this.getView().down('grid');
		Opt.ux.GridPrinter.print(grid);
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var parent_grid = this.getView().parent_grid;
		var parent_record = this.getView().parent_record;

		var store = parent_grid.getStore();

		var rowIndex = store.findBy(function(rec, id) {
        		if(rec.get('id') == record.get('id')) {
            			return true;
        		}
    		});

		// режим добавления
		if (!parent_record) {
			if (rowIndex == -1) { // такого товара еще нет в таблице - добавим
				var rec = Ext.create('Opt.model.OrderGood', {
					id: record.get('id'),
					name: record.get('name'),
					name_short: record.get('name_short'),
					ed: record.get('ed'),
					kolvo: 0,
				});
				store.add(rec);
			} else { // товар уже есть
				var rec = store.getAt(rowIndex);
			}

			parent_grid.getView().select(rec, true, true);
			parent_grid.editingPlugin.startEditByPosition(
				{
					row: store.indexOf(rec),
   					column: 2,
				}
			);
		// режим редактирования
        	} else {
			parent_record.set('id', record.get('id'));
			parent_record.set('name', record.get('name'));
			parent_record.set('name_short', record.get('name_short'));
			parent_record.set('ed', record.get('ed'));
			parent_grid.editingPlugin.startEditByPosition(
				{
					row: store.indexOf(parent_record),
   					column: 2,
				}
			);
		}

		this.getView().close();
	},
});