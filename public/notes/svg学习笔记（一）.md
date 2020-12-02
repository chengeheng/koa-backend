## 1. SVG(Scalable Vector Graphics)

SVG 是一种 XML 应用，用来表示矢量图形。所有图形有关信息被存储为纯文本，具有 XML 的开放性、可移植性和可交互性。

SVG 使用 g 元素对图形进行分组，使用 use 元素实现元素的复用。

优势：

1.  SVG 文件可被非常多的工具读取和修改（如记事本）
2.  SVG 相对 JPEG 和 GIF 尺寸更小，压缩性更强
3.  SVG 是可伸缩的
4.  SVG 图像可在任意分辨率下高质量的打印
5.  SVG 在被放大时图片质量不会下降
6.  SVG 可与 Java 技术一起运行
7.  SVG 是开放的标准
8.  SVG 文件是纯粹的 XML

## 2. 使用

-   将 SVG 作为图像

    将 svg 作为图像包含在 HTML 标记的 img 元素内，常常作为 css 的 background-image 属性使用，需注意避免使用文件太大的 svg。

    局限性：此时 svg 图像无法与主页面通信，主页面的样式对 svg 无效，运行在主页面上的脚本无法感知或者修改 svg 文档结构。

-   将 svg 作为应用程序（如 react 中作为一个 react 组件使用）

    使用 object 元素将 SVG 嵌入 HTML 文档中，object 元素的 type 属性表示要嵌入的文档类型，对用 SVG 应该是 type="image/svg+xml"。此时作为 DOM 的一部分，可以用 js 和 css 进行操作。

## 3.基本形状

1. 矩形

    元素：rect

    属性：

    ```
    x: 矩形左上角的x位置
    y: 矩形左上角的y位置
    width: 矩形的宽度
    height: 矩形的高度
    rx: 圆角的x方位的半径
    ry: 圆角的y方位的半径
    ```

    如果只设置 rx 或者 ry 任意一个，则另外一个将默认相等；如果没有设置，则默认为 0。

    ```html
    <rect x="10" y="10" width="30" height="30" />
    <rect x="60" y="60" width="30" height="30" rx="10" ry="10" />
    ```

2. 圆形

    元素：circle

    属性：

    ```
    r: 圆的半径
    cx: 圆心的x位置
    cy: 圆心的y位置
    ```

    ```html
    <circle cx="25" cy="25" r="20" />
    ```

3. 椭圆

    元素：ellipse

    椭圆是 circle 元素更通用的形式，可以分别缩放圆的 x 半径和 y 半径

    属性：

    ```
    rx: 椭圆的x半径
    ry: 椭圆的y半径
    cx: 椭圆中心的x位置
    cy: 椭圆中心的y位置
    ```

    ```html
    <ellipse cx="25" cy="25" rx="25" ry="15" />
    ```

4. 线条

    元素：line

    line 绘制直线，它取两个点的位置作为线段的起点和终点

    属性：

    ```
    x1: 起点的x位置
    y1: 起点的y位置
    x2: 终点的x位置
    y2: 终点的y位置
    ```

    ```html
    <line x1="10" y1="5" x2="30" y2="50" stroke="#000" />
    ```

5. 折线

    元素：polyline

    属性：

    ```
    points: 点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开
    ```

    ```html
    <polyline points="0 0, 20 30, 10 60" fill="transparent" stroke="black" />
    ```

6. 多边形

    元素：polygon

    ploygon 和折线很像，区别是 polygon 的路径在最后一个点处会自动回到第一个点

    属性：

    ```
    points: 点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开
    ```

    ```html
    <polygon points="0 0, 20 30, 10 60" />
    ```

7. 特性总结

    | 特性              | 说明                                                |
    | ----------------- | --------------------------------------------------- |
    | stroke            | 笔画颜色                                            |
    | stroke-width      | 笔画宽度                                            |
    | stroke-opacity    | 笔画不透明度                                        |
    | stroke-dasharray  | 虚线笔画                                            |
    | stroke-linecap    | 笔画头的形状 butt（默认）,round,square              |
    | stroke-linejoin   | 圆形棱角，有 miter（默认），round 和 bevel 三个取值 |
    | stroke-miterlimit | 相交处显示宽度和线宽的最大比例，默认为 4            |
    | fill              | 填充颜色，默认为 black                              |
    | fill-opacity      | 填充不透明度                                        |
    | fill-rule         | 填充规则                                            |

## 4.文档结构

-   结构

    1. XML 声明

        ```html
        <?xml version="1.0"?>
        ```

    2. XML 声明空间

        ```html
        <svg xmlns="http://www.w3.org/2000/svg"></svg>
        ```

    最小的 svg 结构：

    ```html
    <?xml version="1.0"?>
    <svg xmlns="http://www.w3.org/2000/svg">
    	<!-- SVG代码 -->
    </svg>
    ```

    典型的 svg 结构：

    ```html
    <?xml version="1.0"?>
    <svg
    	xmlns="http://www.w3.org/2000/svg"
    	xmlns:xlink="http://www.w3.org/1999/xlink"
    	width="600"
    	height="300"
    >
    	<!-- SVG代码 -->
    </svg>
    ```

-   分组和引用

    g 元素用来将其子元素作为一个组合，可以使文档结构更清晰。

    use 元素用来复用图形中重复出现的元素，需要为 use 标签的 xlink:href 指定 URI 来引用指定的图形元素，同事还要指定 x 和 y 属性以表示组合应该移动到哪个位置。

    defs 元素用来定

    | 标签   | 作用                                                                                                                                           |
    | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
    | g      | 用来将其子元素作为一个组合，可以使文档结构更清晰                                                                                               |
    | use    | 用来复用图形中重复出现的元素，需要为 use 标签的 xlink:href 指定 URI 来引用指定的图形元素，同事还要指定 x 和 y 属性以表示组合应该移动到哪个位置 |
    | defs   | 用来定义复用的元素，但是定义在 defs 内的元素并不会被显示，而是作为模板供其他地方使用                                                           |
    | symbol | symbol 永远不会被显示，可以用来指定被后续使用的元素（如 use 引用）                                                                             |
    | image  | 可以用来包含一个完整的 svg 或栅格文件                                                                                                          |
