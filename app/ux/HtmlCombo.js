Ext.define('Opt.ux.HtmlCombo', {
    alias: 'widget.htmlcombo',
    extend: 'Ext.form.field.ComboBox',
    fieldSubTpl: [ // note: {id} here is really {inputId}, but {cmpId} is available
        '<input id="{id}" data-ref="inputEl" type="{type}" {inputAttrTpl}',
            ' size="1"', // allows inputs to fully respect CSS widths across all browsers
            '<tpl if="name"> name="{name}"</tpl>',
            '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
            '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
            '{%if (values.maxLength !== undefined){%} maxlength="{maxLength}"{%}%}',
            '<tpl if="readOnly"> readonly="readonly"</tpl>',
            '<tpl if="disabled"> disabled="disabled"</tpl>',
            '<tpl if="tabIdx != null"> tabindex="{tabIdx}"</tpl>',
            '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
            '<tpl foreach="inputElAriaAttributes"> {$}="{.}"</tpl>',
        ' class="{fieldCls} {typeCls} {typeCls}-{ui} {editableCls} {inputCls}" autocomplete="off"/>',
        // overlay element to show formatted value
        '<div id="{cmpId}-overlayEl" data-ref="overlayEl"<tpl if="name"> name="{name}-overlayEl"</tpl> class="{fieldCls}-overlay {typeCls} {typeCls}-{ui} {inputCls}">{value}</div>',
        {
            disableFormats: true
        }
    ],
    forceSelection: true,

    childEls: [
        'overlayEl'
    ],

    setRawValue: function(value) {
        var me = this;

        // set value in overlay
        if (me.rendered) {
            me.overlayEl.update(value);
        }
        return me.callParent([value]);
    }
});

