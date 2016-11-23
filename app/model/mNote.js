Ext.define("NotesApp.model.mNote", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [ //结构
            { name: 'id', type: 'int' },
            { name: 'dateCreated', type: 'date', dateFormat: 'c' },
            { name: 'title', type: 'string' },
            { name: 'narrative', type: 'string' }
        ],
        validations: [ //验证
            { type: 'presence', field: 'id' }, //presence必需
            { type: 'presence', field: 'dateCreated' },
            { type: 'presence', field: 'title', message: 'Please enter a title for this note.' }
        ]
    }
});