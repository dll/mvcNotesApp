Ext.define("NotesApp.view.vNoteMap", {
    extend: "Ext.Container",
    requires: "Ext.form.FieldSet",
    alias: "widget.noteMapView",
    config: {
        scrollable: "vertical",
        items: [{
            xtype: "toolbar",
            docked: "top",
            title: "事件地图",
            flex: 1,
            items: [{
                xtype: "button",
                ui: "back",
                text: "返回",
                itemId: "backEdit"
            }, {
                xtype: "spacer"
            }, {
                xtype: "button",
                ui: "action",
                text: "删除",
                itemId: "deleteMap"
            }]
        }, {
            xtype: "panel",
            id: 'baidumap',
            width: 1200,
            height: 900,
        }],
        listeners: [{
            delegate: "#backEdit",
            event: "tap",
            fn: "onBackEditTap"
        }, {
            delegate: "#deleteMap",
            event: "tap",
            fn: "onDeleteMapTap"
        }]
    },
    onDeleteMapTap: function() {
        console.log("删除地图");
        this.fireEvent("deleteMapCommand", this);
    },
    onBackEditTap: function() {
        console.log("返回编辑视图");
        this.fireEvent("backToEditCommand", this);
    },
});