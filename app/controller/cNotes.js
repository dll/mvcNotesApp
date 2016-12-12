Ext.define("NotesApp.controller.cNotes", {

    extend: "Ext.app.Controller",
    config: {
        refs: { //refs和xtype的应用：控制器加载视图
            notesListView: "notesListView",
            noteEditorView: "noteEditorView",
            noteMapView: "noteMapView"
        },
        control: {
            //冒号左侧为引用名，右侧为一个对象
            notesListView: {
                //冒号左侧为自定义事件（跟视图中的fireEvent事件名一致），右侧为事件具体执行的函数
                newNoteCommand: "onNewNoteCommand", //new按钮
                editNoteCommand: "onEditNoteCommand" //向右箭头
            },
            noteEditorView: {
                //记事编辑视图命令
                saveNoteCommand: "onSaveNoteCommand",
                deleteNoteCommand: "onDeleteNoteCommand",
                backToHomeCommand: "onBackToHomeCommand",
                isSetLocationCommand: "onIsSetLocationCommand",
                isOpenMapCommand: "onIsOpenMapCommand"
            },
            noteMapView: { //绑定地图视图命令
                deleteMapCommand: "onDeleteMapCommand",
                backToEditCommand: "onBackToEditCommand"
            }
        }
    },
    // Transitions页面切换特效
    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },
    // 辅助函数
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    //跳转到编辑视图
    activateNoteEditor: function(record) {
        var noteEditorView = this.getNoteEditorView();
        noteEditorView.setRecord(record); // 视图要在控制器之后，与先后顺序有关
        Ext.Viewport.animateActiveItem(noteEditorView, this.slideLeftTransition);
    },
    //跳转到列表视图
    activateNotesList: function() {
        Ext.Viewport.animateActiveItem(this.getNotesListView(), this.slideRightTransition);
    },
    // 增删改查命令
    //新建记事，然后激活activateNoteEditor()
    onNewNoteCommand: function() {
        console.log("新建记事");
        //设置位置和地图隐藏和显示
        Ext.getCmp('isSetLocation').setHidden(false);
        Ext.getCmp('isOpenMap').setHidden(true);

        var now = new Date();
        var noteId = (now.getTime()).toString() + (this.getRandomInt(0, 100)).toString();
        var newNote = Ext.create("NotesApp.model.mNote", {
            id: noteId,
            dateCreated: now,
            title: "",
            narrative: "",
            longitude: "",
            latitude: "",
            position: "0" //是否定位?
        });
        this.activateNoteEditor(newNote);
    },
    //编辑记事
    onEditNoteCommand: function(list, record) {
        console.log("编辑记事");
        Ext.getCmp('isSetLocation').setHidden(true); //显示允许定位切换Toggle组件
        Ext.getCmp('isOpenMap').setHidden(false); //隐藏地图切换Toggle组件
        this.activateNoteEditor(record);
    },
    //保存记事
    onSaveNoteCommand: function() {
        console.log("保存记事");
        Ext.getCmp('isSetLocation').setValue(0);
        Ext.getCmp('isOpenMap').setValue(0);
        var noteEditorView = this.getNoteEditorView();
        var currentNote = noteEditorView.getRecord();
        var newValues = noteEditorView.getValues();
        //更新当前表单文本框的值
        currentNote.set("title", newValues.title);
        currentNote.set("narrative", newValues.narrative);
        currentNote.set("longitude", newValues.longitude);
        currentNote.set("latitude", newValues.latitude);
        var errors = currentNote.validate();
        if (!errors.isValid()) {
            Ext.Msg.alert('提示', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
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
    //删除记事
    onDeleteNoteCommand: function() {
        console.log("删除记事");
        var noteEditorView = this.getNoteEditorView();
        var currentNote = noteEditorView.getRecord();
        var notesStore = Ext.getStore("sNotes");
        notesStore.remove(currentNote);
        notesStore.sync();
        this.activateNotesList();
    },
    //返回主视图即记事列表视图
    onBackToHomeCommand: function() {
        console.log("返回主页");
        Ext.getCmp('isOpenMap').setValue(0); //关闭地图
        this.activateNotesList();
    },
    //设置定位
    onIsSetLocationCommand: function() {
        console.log("设置定位");
        var noteEditorView = this.getNoteEditorView();
        //设置mask,显示进度
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: '正在地理定位...'
        });

        var noteMapView = this.getNoteMapView();
        //sench touch的地图组件，参考Ext.Map
        //http: //docs.sencha.com/touch/2.4/2.4.2-apidocs/#!/api/Ext.Map
        var geo = Ext.create('Ext.util.Geolocation', {
            //var geo = Ext.create('Ext.Map', {
            autoUpdate: false,
            listeners: {
                locationupdate: function(geo) {
                    Ext.getCmp('latitude').setValue(geo.getLatitude());
                    Ext.getCmp('longitude').setValue(geo.getLongitude());
                    console.log("定位成功");
                    Ext.Msg.alert("定位成功");
                    Ext.Viewport.setMasked(false); //取消定位时的mask
                },
                locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout) {
                        Ext.Msg.alert('定位超时');
                    } else {
                        Ext.Msg.alert('定位失败！请在手机浏览器上测试');
                    }
                }
            }
        });
        geo.updateLocation();
    },
    //百度地图自定义函数
    baidumap: function(longitude, latitude, title, narrative) {
        console.log("调用自定义函数");
        console.log("百度地图API获取纬度:" + latitude + ",经度:" + longitude);

        var gpsPoint = new BMap.Point(longitude, latitude);
        setTimeout(function() {
            BMap.Convertor.translate(gpsPoint, 0, translateCallback); //原始经纬度（WGS84）转成百度坐标
        }, 6000);
        //坐标转换的回调函数
        translateCallback = function(point) {
            var map = new BMap.Map("baidumap"); //在百度地图容器中创建一个地图
            map.centerAndZoom(point, 15);
            Ext.Viewport.setMasked(false); //取消加载地图时的mask
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            map.addControl(new BMap.OverviewMapControl());

            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            var label = new BMap.Label(title, {
                offset: new BMap.Size(20, -10)
            });
            marker.setLabel(label); //添加百度标签
            var opts = {
                width: 200, // 信息窗口宽度
                height: 100, // 信息窗口高度
                title: title, // 信息窗口标题
            }
            var infoWindow = new BMap.InfoWindow(narrative, opts); //创建信息窗口对象 
            marker.addEventListener("click", function() {
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            });
        }
    },

    //回到编辑视图
    onBackToEditCommand: function() {
        console.log("返回编辑视图");
        Ext.getCmp('isOpenMap').setValue(0); //将开启地图的toggle值设为0
        var noteEditorView = this.getNoteEditorView();
        Ext.Viewport.animateActiveItem(noteEditorView, this.slideLeftTransition);
    },
    //删除记事及地图
    onDeleteMapCommand: function() {
        console.log("删除记事");
        this.onDeleteNoteCommand();
    },
    //显示地图视图
    onIsOpenMapCommand: function() {
        console.log("显示地图视图");
        //获取记事的标题，内容及经纬度
        var noteEditorView = this.getNoteEditorView();
        var title = noteEditorView.getValues().title;
        var narrative = noteEditorView.getValues().narrative;
        var longitude = noteEditorView.getValues().longitude;
        var latitude = noteEditorView.getValues().latitude;

        console.log("经纬度为空值");
        if (!Ext.isEmpty(longitude) && !Ext.isEmpty(latitude)) {
            //设置mask	
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: '加载地图中...'
            });
            //调用自定义的百度函数
            this.baidumap(longitude, latitude, title, narrative);
        } else {
            Ext.Msg.alert("记事当时没有开启定位或定位失败");
            return;
        }
        var noteMapView = this.getNoteMapView();
        console.log("宽度：" + window.innerWidth + "高度：" + window.innerHeight);
        //设置放置地图容器的高宽
        noteMapView.getComponent("baidumap").setWidth(window.innerWidth);
        noteMapView.getComponent("baidumap").setHeight(window.innerHeight)
        Ext.Viewport.animateActiveItem(noteMapView, this.slideLeftTransition); //以动画的方式激活noteEditorView
    },
    //基础类函数
    launch: function() {
        this.callParent(arguments);
        var notesStore = Ext.getStore("sNotes");
        notesStore.load();
        console.log("加载记事");
    },
    init: function() {
        this.callParent(arguments);
        console.log("初始化记事数据");
    }
});