Ext.define('Opt.view.OrderUnloadingGoodsGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.orderunloadinggoodsgrid',

	afterRender: function () {
		var self = this;
        	this.getView().body.el.on('keydown', function(e, el) {
    			if (e.getKeyName() === 'INSERT'){
	        		self.addOrderString();
    			}
		});	
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	addOrderString: function (button) {
		var parent = this.getView();
		if (!this.editSelectGoods || this.editSelectGoods.destroyed) {
			this.editSelectGoods = Ext.create('widget.goodsselect', {
				parent_grid: this.getView(),
				parent_record: null,
			});
		}

		this.editSelectGoods.show();
		this.editSelectGoods.down('grid').focus();
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if(cellIndex !=0) return;
		var parent = this.getView();
		if (!this.editSelectGoods || this.editSelectGoods.destroyed) {
			this.editSelectGoods = Ext.create('widget.goodsselect', {
				parent_grid: this.getView(),
				parent_record: record,
			});
		}

		this.editSelectGoods.show();
		this.editSelectGoods.down('grid').focus();
	},

	deleteOrderString: function () {
		var grid = this.getView();
		var store = grid.store;
		var selection = grid.getSelection();

		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для удаления!');
			return;
		}

		store.suspendEvents();

		for (var i = 0; i < selection.length; i++) {
			var record = selection[i];
			store.remove(record);
		}

		store.resumeEvents();
		store.sync();
		grid.view.refresh();
	},
});