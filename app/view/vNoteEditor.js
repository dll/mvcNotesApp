Ext.define("NotesApp.view.vNoteEditor", {
    extend: "Ext.form.Panel",
    requires: "Ext.form.FieldSet",
    alias: "widget.noteEditorView",
    config: {
        scrollable: 'vertical',
        items: [{
                xtype: "toolbar",
                docked: "top",
                title: "编辑记事",
                items: [{
                        xtype: "button",
                        ui: "back",
                        text: "返回",
                        itemId: "backButton"
                    },
                    { xtype: "spacer" },
                    {
                        xtype: "button",
                        ui: "action",
                        text: "保存",
                        itemId: "saveButton"
                    }
                ]
            },
            {
                xtype: "toolbar",
                docked: "bottom",
                items: [{
                    xtype: "button",
                    iconCls: "trash",
                    iconMask: true,
                    itemId: "deleteButton"
                }]
            },
            {
                xtype: "fieldset",
                items: [{
                        xtype: 'textfield',
                        name: 'title',
                        label: '标题',
                        required: true
                    },
                    {
                        xtype: 'textareafield',
                        name: 'narrative',
                        label: '内容'
                    },
                    {
                        xtype: "hiddenfield",
                        label: "经度",
                        name: "longitude",
                        id: "longitude",
                        value: "long"
                    },
                    {
                        xtype: "hiddenfield",
                        label: "纬度",
                        name: "latitude",
                        id: "latitude",
                        value: "long"
                    },
                    {
                        xtype: "togglefield",
                        label: "是否地理定位",
                        labelWidth: "70%",
                        name: 'isSetLocation',
                        id: "isSetLocation",
                        value: 0
                    },
                    {
                        xtype: "togglefield",
                        label: "是否显示地图",
                        labelWidth: '70%',
                        hidden: true,
                        name: "isOpenMap",
                        id: "isOpenMap",
                        value: 0
                    }
                ]
            }
        ],
        listeners: [{
                delegate: "#backButton",
                event: "tap",
                fn: "onBackButtonTap"
            },
            {
                delegate: "#saveButton",
                event: "tap",
                fn: "onSaveButtonTap"
            },
            {
                delegate: "#deleteButton",
                event: "tap",
                fn: "onDeleteButtonTap"
            }, {
                delegate: "#isSetLocation",
                event: "change",
                fn: "onIsSetLocationChange"
            }, {
                delegate: "#isOpenMap",
                event: "change",
                fn: "onIsOpenMapChange"
            }
        ]
    },
    //视图中绑定事件函数，实现用户的交互
    onSaveButtonTap: function() {
        console.log("保存记事");
        this.fireEvent("saveNoteCommand", this);
    },
    onDeleteButtonTap: function() {
        console.log("删除记事");
        this.fireEvent("deleteNoteCommand", this);
    },
    onBackButtonTap: function() {
        console.log("返回主页");
        this.fireEvent("backToHomeCommand", this);
    },
    onIsSetLocationChange: function(field, newValue, oldValue) {
        console.log("地理定位");
        if (newValue == 1)
            this.fireEvent("isSetLocationCommand", this);
    },
    onIsOpenMapChange: function(field, newValue, oldValue) {
        console.log("显示地图");
        if (newValue == 1)
            this.fireEvent("isOpenMapCommand", this);
    }
});