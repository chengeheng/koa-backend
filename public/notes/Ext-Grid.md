## Ext-Grid

### 一、制作简单表格

主要配置项：

-   title：标题
-   store：数据存储
-   column：行配置项
-   width, height: 表格宽高

```javascript
Ext.create("Ext.grid.Panel", {
    xtype: "gridpanel",
    store: Ext.getStore("User"),
    title: "Grid未分组组件-简单表格",
    wdith: 100,
    columns: [
        {
            text: "Name",
            width: 100,
            sortable: false,
            hideable: false,
            draggable: true,
            dataIndex: "name",
            editor: {
                xtype: "textfield",
                allowBlank: false
            },
            listeners: {
                click: function(gridview, td) {
                    var record = arguments[5];
                    console.log(record.getData());
                }
            }
        },
        {
            text: "sex",
            flex: 1,
            dataIndex: "sex",
            renderer: function(value) {
                console.log(value);
                if (value == "male") {
                    return "<span style='color:red;font-weigth:bold;'>男</span>";
                } else {
                    return "<span style='color:green;font-weigth:bold;'>女</span>";
                }
            }
        },
        {
            text: "Email",
            flex: 1,
            dataIndex: "email",
            renderer: function(value, meta, record) {
                return Ext.String.format(
                    '<a href="mailto:{0}">{1}</a>',
                    value,
                    value
                );
            },
            editor: {
                xtype: "textfield",
                allowBlank: false,
                vtype: "email"
            }
        },
        {
            text: "Phone",
            flex: 1,
            dataIndex: "phone",
            editor: {
                xtype: "textfield",
                allowBlank: false
            }
        }
    ]
});
```

### 二、column 配置

-   text：指定该列的列名。
-   dataIndex：指定读取底层 Ext.data.Store 数据中哪个数据字段。
-   renderer：指定一个函数对该列数据进行转换后显示在表格中。通过该选项即可对该列数据指定自定义的显示格式。
-   sortable：指定是否可以对该列进行排序。
-   hideable：指定该列是否可以隐藏。
-   menuDisabled：指定是否禁用该列上默认的右键菜单。
-   draggable：指定该列是否可以通过拖动来改变列的排列顺序。
-   groupable：指定是否可以对该列进行分组。

还包括其他一些样式的定义，如 width 等

### 三、行编辑、单元格编辑

表格的编辑是通过 plugin 插件实现的，包括行编辑（row editing）和单元格编辑（cell editing）两种

-   单元格编辑


    -   首先需要给 grid 设置单元格选中模式，即 selType：cellmodel（默认是行编辑模式）。单元格选中模式下只能同时对一个单元格进行设置，选中第二个单元格是时，前一个编辑框会自动消失。


    - 	其次，需要给grid引入单元格编辑插件（Cell Editing Plugin）

    -   在配置 column 单元格是，添加 editor 属性既可以对单元格进行配置，editor 可以是一个字符串或是对象

```javascript
Ext.create('Ext.grid.Panel', {
    ...
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clickToEdit: 1
        })
    ]
})
```

```javascript
Ext.create('Ext.grid.Panel', {
    ...
    columns: [{
        text: 'Email Address',
        dataIndex: 'email',
        editor: 'textfield'
    }]
})
// 额外配置
Ext.create('Ext.grid.Panel', {
    ...
    columns: [{
        text: 'Email Address',
        dataIndex: 'email',
        editor:  {
        xtype: 'textfield',
        allowBlank: false
    }
    }]
})
```

-   行编辑

    -   不需要设置 grip 的 selType
    -   将引入的插件改为行编辑插件（Row Editing Plugin）

```javascript
Ext.create('Ext.grid.Panel', {
    ...
    selType: 'rowmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 1
        })
    ]
})
```

### 四、复选框 Selection Models

-   添加属性：selType: "checkboxmodel"来实现
-   获取选中数据：gridPanel.getSelectionModel().getSelection()，gridPanel 为当前选中的表格对象

### 五、Group 分组

Grid 可以对数据进行分组，首先我们需要在 store 中添加一个 groupField 属性

```javascript
Ext.create('Ext.data.Store', {
    model: 'Employee',
    data: ...,
    groupField: 'department'
})
```

然后，我们需要在 Grid Panel 中添加一个 Grouping Feature，用于显示分组情况

```javascript
Ext.create('Ext.grid.Panel', {
    ...
    features: [{ ftype: 'grouping' }]
})
```

### 六、分页

```javascript
// 配置 dockedItems 的 xtpye 为"pagingtoolbar"
dockedItems: [
  {
    xtype: "pagingtoolbar",
    store: pagingStore,
    dock: "bottom",
    displayInfo: true
  }
];
// 或者配置bbar，即Bottom Bar
bbar: {
        xtype: "pagingtoolbar",
        dock: "bottom",
        listeners: {
          changepage: {
            fn: function() {
              me.loadData();
            }
          }
        }
      }
```

### 七、数据获取

通常是通过 panel.getStore()获取的保存在 store 里面的数据，然后进行提交，获取等操作
