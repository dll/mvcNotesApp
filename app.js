//app.js应用入口
Ext.application({
    name: "NotesApp",

    models: ["mNote"], //模型
    stores: ["sNotes"], //存储
    controllers: ["cNotes"], //控制
    views: ["vNotesList", "vNoteEditor"], //视图

    launch: function() {
        var notesListView = {
            xtype: "noteslistview" //xtype延时实例化，提高性能
        };
        var noteEditorView = {
            xtype: "noteeditorview"
        };
        Ext.Viewport.add([notesListView, noteEditorView]); //Viewport视点
    }
});