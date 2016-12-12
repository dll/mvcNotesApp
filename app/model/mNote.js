Ext.define("NotesApp.model.mNote", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [ //结构
            { name: 'id', type: 'int' },
            { name: 'dateCreated', type: 'date', dateFormat: 'c' },
            { name: 'title', type: 'string' },
            { name: 'narrative', type: 'string' },
            { name: 'position', type: 'string' }, //是否定位
            { name: 'longitude', type: 'string' }, //经度
            { name: 'latitude', type: 'string' } //纬度
        ],
        validations: [ //验证
            { type: 'presence', field: 'id' }, //presence必需
            { type: 'presence', field: 'dateCreated' },
            { type: 'presence', field: 'title', message: "请输入标题" }
        ]
    }
});