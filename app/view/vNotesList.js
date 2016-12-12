Ext.define("NotesApp.view.vNotesList", {

    extend: "Ext.Container",
    requires: "Ext.dataview.List",
    alias: "widget.notesListView",

    config: {
        layout: {
            type: 'fit'
        },
        items: [{
            xtype: "toolbar",
            title: "记事列表",
            docked: "top",
            items: [
                { xtype: 'spacer' },
                {
                    xtype: "button",
                    text: "新建",
                    iconCls: "add",
                    ui: 'action',
                    itemId: "newButton"
                }
            ]
        }, {
            xtype: "list",
            store: "sNotes",
            itemId: "notesList",
            loadingText: "加载记事数据中...",
            emptyText: '<pre><div class="notes-list-empty-text">无记事</div></pre>',
            onItemDisclosure: true,
            grouped: true,
            itemTpl: '<pre><div class="list-item-title"> {title} </div> <div class="list-item-narrative"> {narrative} </div><div class="clear-both"></div></pre>'
        }],
        listeners: [{ //事件监听机制
            delegate: "#newButton", //代理
            event: "tap", //事件名
            fn: "onNewButtonTap" //函数
        }, {
            delegate: "#notesList",
            event: "disclose",
            fn: "onNotesListDisclose"
        }]
    },
    //视图与控制的交互
    onNewButtonTap: function() {
        console.log("新建记事");
        this.fireEvent("newNoteCommand", this);
    },
    onNotesListDisclose: function(list, record, target, index, evt, options) {
        console.log("编辑视图");
        this.fireEvent('editNoteCommand', this, record);
    }
});