//app.js应用入口
Ext.application({
    name: "NotesApp",

    models: ["mNote"], //模型
    stores: ["sNotes"], //存储
    controllers: ["cNotes"], //控制
    views: ["vNotesList", "vNoteEditor", "vNoteMap"], //视图,添加地图视图

    launch: function() {
        var notesListView = {
            xtype: "notesListView" //xtype延时实例化，提高性能
        };
        var noteEditorView = {
            xtype: "noteEditorView"
        };
        var noteMapView = {
            xtype: "noteMapView" // 地图视图
        };
        console.log("运行记事应用");
        Ext.Viewport.add([notesListView, noteEditorView, noteMapView]); //Viewport视点
    }
});