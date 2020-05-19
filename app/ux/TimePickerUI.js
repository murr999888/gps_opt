Ext.define( 'Opt.ux.TimePickerUI', {
    	//extend: 'Ext.Component',
    	extend: 'Ext.form.field.Text',
    	alias: 'widget.timepickerui',

	hourMin: 0,
	hourMax: 23,
	leftMargin: -64,
	editable: false,

	initComponent: function() {
        	var me = this;
        	me.setValue(me.value);
	},

    	afterRender: function() {
        	this.callParent();
		var body = '#' + this.bodyEl.getId();
		$(body).css('width','60px');
		$(body).css('min-width','auto');
                
    	},

    	onRender: function () {
        	this.callParent();

	},

    	setValue: function (value) {
        	var me = this;
		me.value = value;
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

        	this.inputEl.on('click', this._click, this, {
            		//delegate: 'img.form-image-field'
        	});

        	this.inputEl.on('dblclick', this._dblclick, this, {

        	});


        	this.inputEl.on('focus', this._focus, this, {

        	});

        	this.inputEl.on('change', this._change, this, {

        	});

		this.inputEl.on('blur', this._blur, this, {

        	});

    	},

	getEl: function(){
	        var id = this.getId();
        	return $("#" + id +"-inputEl");
		//return $("#" + id);
	},

    	_click: function (e, o) {
		console.log('_click');
		this.fireEvent('click');
    	},

    	_dblclick: function (e, o) {
		console.log('_dblclick');
        	this.fireEvent('dblclick', this, e);
    	},

    	_change: function (e, o) {
		console.log('_change');
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

			rr.timepicker({
          			stepHour: 1,
				zIndex: 500,
				hourMin: self.hourMin,
				hourMax: self.hourMax,

		  		timeFormat: 'HH:mm:ss',
				afterInject: function(){
					$('#ui-datepicker-div').css('margin-left', self.leftMargin.toString() + 'px');

				},
				onSelect: function(datetimeText, datepickerInstance){
					self.setValue(datetimeText);
					self._change(datetimeText, datepickerInstance);
				},
        		});

    	},

} );  