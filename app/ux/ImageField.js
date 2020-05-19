Ext.define('Opt.ux.ImageField', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.imagefield',

    fieldSubTpl: ['<img id="{id}" class="{fieldCls}" src="images/markers/{value}" />', {
        compiled: true,
        disableFormats: true
    }],

    fieldCls: Ext.baseCSSPrefix + 'form-image-field',
    value: null,

	initComponent: function() {

        var me = this;
        me.setValue(me.value);

	},

    initEvents: function () {
        var me = this;

        this.callParent(arguments);

        //Adding the click event (can make other events here aswell)
        this.inputEl.on('click', this._click, this, {
            //delegate: 'img.form-image-field'
        });

        this.inputEl.on('dblclick', this._dblclick, this, {
        });

    },

    setValue: function (value) {
        var me = this;
	me.value = value;
        me.callParent(arguments);

    },

    getValue: function () {
        var me = this;
        //me.callParent(arguments);
	return me.value;
    },

    onRender: function () {
        var me = this;
        me.callParent(arguments);

      /*
        var name = me.name || Ext.id();

        me.hiddenField = me.inputEl.insertSibling({
            tag: 'input',
            type: 'hidden',
            name: name
        });
*/
   },

    _click: function (e, o) {
        this.fireEvent('click', this, e);
    },

    _dblclick: function (e, o) {
        this.fireEvent('dblclick', this, e);
    }
});
