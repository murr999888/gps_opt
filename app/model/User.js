Ext.define('Opt.model.User', {
    extend: 'Ext.data.Model',
    identifier: 'negative',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'password',
        type: 'string'
    }, {
        name: 'phone',
        type: 'string'
    }, {
        name: 'readonly',
        type: 'boolean'
    }, {
        name: 'isadmin',
        type: 'boolean'
    }, {
        name: 'map',
        type: 'string'
    }, {
        name: 'distanceUnit',
        type: 'string'
    }, {
        name: 'speedUnit',
        type: 'string'
    }, {
        name: 'latitude',
        type: 'float'
    }, {
        name: 'longitude',
        type: 'float'
    }, {
        name: 'zoom',
        type: 'int'
    }, {
        name: 'twelveHourFormat',
        type: 'boolean'
    }, {
        name: 'coordinateFormat',
        type: 'string'
    }, {
        name: 'disabled',
        type: 'boolean'
    }, {
        name: 'expirationTime',
        type: 'date',
        dateFormat: 'c'
    }, {
        name: 'deviceLimit',
        type: 'int'
    }, {
        name: 'userLimit',
        type: 'int'
    }, {
        name: 'deviceReadonly',
        type: 'boolean'
    }, {
        name: 'token',
        type: 'string'
    }, {
        name: 'timezone',
        type: 'string'
    }, {
        name: 'attributes'
    }],
});
