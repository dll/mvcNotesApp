Ext.application({
    name: "NotesApp",
    views: ["NotesListContainer"],
    launch: function() {
        var notesListContainer = Ext.create("NotesApp.view.NotesListContainer");
        Ext.Viewport.add(notesListContainer);
    }
});