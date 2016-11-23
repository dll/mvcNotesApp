Ext.define("NotesApp.controller.cNotes", {

    extend: "Ext.app.Controller",
    config: {
        refs: { //refs和xtype的应用：控制器加载视图
            // We're going to lookup our views by xtype.
            notesListView: "noteslistview",
            noteEditorView: "noteeditorview",
            notesList: "#notesList"
        },
        control: {
            notesListView: {
                // The commands fired by the notes list container.
                newNoteCommand: "onNewNoteCommand", //new按钮
                editNoteCommand: "onEditNoteCommand" //向右箭头
            },
            noteEditorView: {
                // The commands fired by the note editor.
                saveNoteCommand: "onSaveNoteCommand",
                deleteNoteCommand: "onDeleteNoteCommand",
                backToHomeCommand: "onBackToHomeCommand"
            }
        }
    },
    // Transitions特性
    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },

    // Helper functions
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    activateNoteEditor: function(record) {

        var noteEditorView = this.getNoteEditorView();
        noteEditorView.setRecord(record); // 视图要在控制器之后，与先后顺序有关
        Ext.Viewport.animateActiveItem(noteEditorView, this.slideLeftTransition);
    },
    activateNotesList: function() {
        Ext.Viewport.animateActiveItem(this.getNotesListView(), this.slideRightTransition);
    },

    // Commands.
    onNewNoteCommand: function() {
        console.log("onNewNoteCommand");
        var now = new Date();
        var noteId = (now.getTime()).toString() + (this.getRandomInt(0, 100)).toString();
        var newNote = Ext.create("NotesApp.model.mNote", {
            id: noteId,
            dateCreated: now,
            title: "",
            narrative: ""
        });
        this.activateNoteEditor(newNote);
    },
    onEditNoteCommand: function(list, record) {
        console.log("onEditNoteCommand");
        this.activateNoteEditor(record);
    },
    onSaveNoteCommand: function() {
        console.log("onSaveNoteCommand");
        var noteEditorView = this.getNoteEditorView();
        var currentNote = noteEditorView.getRecord();
        var newValues = noteEditorView.getValues();
        // Update the current note's fields with form values.
        currentNote.set("title", newValues.title);
        currentNote.set("narrative", newValues.narrative);
        var errors = currentNote.validate();
        if (!errors.isValid()) {
            Ext.Msg.alert('Wait!', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
            currentNote.reject();
            return;
        }
        var notesStore = Ext.getStore("sNotes");
        if (null == notesStore.findRecord('id', currentNote.data.id)) {
            notesStore.add(currentNote);
        }
        notesStore.sync(); //同步数据
        notesStore.sort([{ property: 'dateCreated', direction: 'DESC' }]);
        this.activateNotesList();
    },
    onDeleteNoteCommand: function() {
        console.log("onDeleteNoteCommand");
        var noteEditorView = this.getNoteEditorView();
        var currentNote = noteEditorView.getRecord();
        var notesStore = Ext.getStore("sNotes");
        notesStore.remove(currentNote);
        notesStore.sync();
        this.activateNotesList();
    },
    onBackToHomeCommand: function() {
        console.log("onBackToHomeCommand");
        this.activateNotesList();
    },

    // Base Class functions.
    launch: function() {
        this.callParent(arguments);
        var notesStore = Ext.getStore("sNotes");
        notesStore.load();
        console.log("launch");
    },
    init: function() {
        this.callParent(arguments);
        console.log("init");
    }
});