Ext.application({
    name: "NotesApp",
    //controllers: ["Notes"],
    models: ["Note"],
    stores: ["Notes"],
    controllers: ["Notes"],
    views: ["NotesList", "NotesListContainer", "NoteEditor"],
    launch: function() {
        var notesListContainer = {
            xtype: "noteslistcontainer"
        };
        var noteEditor = {
            xtype: "noteeditor"
        };
        // Ext.create("NotesApp.view.NotesListContainer");
        //Ext.Viewport.add(notesListContainer);
        Ext.Viewport.add([notesListContainer, noteEditor]);
    }
});