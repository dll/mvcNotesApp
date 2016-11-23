Ext.define("NotesApp.store.sNotes", {
    extend: "Ext.data.Store",
    requires: "Ext.data.proxy.LocalStorage",//代理读写本地存储数据
    config: {
        model: "NotesApp.model.mNote",
        proxy: {
            type: 'localstorage',
            id: 'notes-app-store'
        },
        sorters: [{ property: 'dateCreated', direction: 'DESC' }],//DESC降序
        grouper: {
            sortProperty: "dateCreated",
            direction: "DESC",
            groupFn: function(record) {//分组函数
                if (record && record.data.dateCreated) {
                    return record.data.dateCreated.toDateString();
                } else {
                    return '';
                }
            }
        }
    }
});