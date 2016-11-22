Ext.application({
    name: "NotesApp",
    controllers: ["Notes"],
    models: ["Note"],
    stores: ["Notes"],
    //views: ["NotesListContainer"],
    views: ["NotesList", "NotesListContainer"],
    launch: function() {
        var notesListContainer = {
            xtype: "noteslistcontainer"
        };
        // Ext.create("NotesApp.view.NotesListContainer");
        Ext.Viewport.add(notesListContainer);
    }
});