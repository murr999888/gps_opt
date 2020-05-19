Ext.define( 'Opt.ux.DatePickerUI', {
    	extend: 'Ext.form.field.Text',
    	alias: 'widget.datepickerui',

	leftMargin: -74,
	editable: false,

	initComponent: function() {
        	var me = this;
		this.setTriggers( {
			calendar: {
            				cls: 'calendar-field'
        		}
    		});
	},

    	afterRender: function() {
		var me = this;
        	this.callParent();

		var body = '#' + this.bodyEl.getId();
		$(body).css('width','90px');
		$(body).css('min-width','auto');

		var formated_date = me.value.getFullYear() + '-' + ('0' + (me.value.getMonth() + 1)).slice(-2) + '-' + ('0' + me.value.getDate()).slice(-2);
		me.setValue(formated_date);
    	},

    	onRender: function () {
        	var me = this;
        	me.callParent(arguments);
	},

    	setValue: function (value) {
        	var me = this;

		if (typeof value.getMonth === 'function'){
			value = value.getFullYear() + '-' + ('0' + (value.getMonth() + 1)).slice(-2) + '-' + ('0' + value.getDate()).slice(-2);

		}

		me.value =  value;
        	me.callParent(arguments);
    	},

    	getValue: function () {
        	var me = this;
        	me.callParent(arguments);

		return me.value;
    	},

    	initEvents: function () {
        	var me = this;

        	this.callParent(arguments);

        	//Adding the click event (can make other events here aswell)
        	this.inputEl.on('click', this._click, this, {
        	});

        	this.inputEl.on('dblclick', this._dblclick, this, {
        	});

        	this.inputEl.on('focus', this._focus, this, {
        	});

        	this.inputEl.on('change', this._change, this, {
        	});
    	},

	getEl: function(){
	        var id = this.getId();
        	return $("#" + id +"-inputEl");
	},

    	_click: function (e, o) {
    	},

    	_dblclick: function (e, o) {
        	this.fireEvent('dblclick', this, e);
    	},

    	_change: function (e, o) {
        	this.fireEvent('change', this, e);
    	},

    	_focus: function (e, o) {
		var self = this;
	        var id = this.inputEl.getId();
        	var rr = $("#" + id);

        	this.fireEvent('focus', this, e);

		$('.datepicker').datepicker('destroy');    
		$('.datepicker').removeClass("hasDatepicker").removeAttr('id');   

		rr.datepicker('destroy');    
		rr.removeClass("hasDatepicker").removeAttr('id');   
		
		rr.datepicker({
          		dateFormat: 'yy-mm-dd',
          		firstDay: 1,
			maxDate: self.config.maxDate,
		 	beforeShow: function(input, inst){
				$('#ui-datepicker-div').css('margin-left', self.leftMargin + 'px');
			},
			onSelect: function(datetimeText, datepickerInstance){
				self.setValue(datetimeText);
				self._change(datetimeText, datepickerInstance);
			},
        	});
    	},
} );  