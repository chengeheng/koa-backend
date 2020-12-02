## 5. 坐标系统及坐标变换

1.  坐标系统

    -   默认坐标：以页面的左上角为(0,0)坐标点，坐标以像素为单位，x 轴正方向是向右，y 轴正方向是向下。

    ```html
    <!-- 定义一个矩形，长和宽都为100px -->
    <rect x="0" y="0" width="100" height="100"></rect>
    ```

    -   指定用户坐标系（用户坐标系，也成为原始坐标系）：如果不想使用默认的用户坐标，可以自己为视图设置一个用户坐标，通过 svg 元素的 viewBox 属性设置

        viewBox 由 4 个数值组成，分别代表要叠加在视图上的最小 x，最小 y，宽度和高度。

    -   嵌套坐标系统
        可以将另一个 svg 元素插入到文档中新增一个新的视图和坐标系统，也就是说 svg 中可以嵌套另一个 svg，每个 svg 都有自己独立的视图和坐标系统。

    在 svg 中，可以绘制的地方是一个无穷大的空间，而能看到的只是一个矩形视野。svg 元素可以指定宽高属性，用来表示 svg 文件渲染的大小，这个区域的大小也就是视窗。视窗和视野有可能会有不同的尺寸，如果视野和视窗大小不一致，就可以使用 svg 的填充策略，也就是定义 svg 的宽高比。

    svg 代码: 定义 svg 的无穷大空间。

    viewBox, preserveAspectRatio: 控制 svg 的视野。

    width,height: 控制 svg 的视窗。

    #### viewprot, viewBox, preserveAspectRatio

    -   svg 画布

        canvas 是绘制 svg 内容的一块空间或区域，是一个无穷大的空间。

    -   视窗

        视窗是一块 svg 可视区域，这个区域叫做 viewport，超出视窗的区域会被裁切并隐藏。可以在最外层的 svg 元素上使用 width 和 height 属性声明视窗尺寸。

        在 svg 中，值可以带单位也可以不带，不带单位的值可以在用户空间中通过用户单位声明。一旦设置最外层 svg 元素宽高，浏览器会建立初始视窗坐标系和初始用户坐标系。

        -   viewBox（用户坐标系）

        可以使用 viewBox 声明自己的用户坐标系。如果用户坐标系和视窗坐标系的宽高比不同，则可以用 preserveAspectRadio 来声明整个系统在视窗内是否可见，也可以用来声明在视窗中如何定位。

        语法：viewBox 属性接收四个参数值，包括 min-x,min-y,width 和 height。

        ```html
        <svg viewBox="min-x min-y width height"></svg>
        ```

        <code>min-x</code> 和<code>min-y</code>决定 viewBox 的左上角，<code>width</code> 和 <code>height</code> 决定视窗的宽高，不可为负值，为<code>0</code>则会禁止元素的渲染

    -   preserveAspectRatio

        preserveAspectRatio 属性强制统一缩放比来保持图形的宽高比。

        语法：preserveAspectRatio = defer? <align> <meetOrSlice>?

        align 的值是可选的，默认为 none；其他值为 xMinYMin、xMinYMid、xMinYMax、xMidYMin、xMidYMid（默认值）、xMidYMax、xMaxYMid、xMaxYMax

        meetOrSlice 也是可选的，默认为 meet，即基于以下两条准则尽可能缩放元素：

        -   保持宽高比
        -   整个 viewBox 在视窗中可见

        可选的其他值为 slice，作用为在保持宽高比的情况下，缩放图形直到 viewBox 覆盖了整个视窗区域。

2.  坐标变换

    svg 元素可以通过缩放、移动、倾斜和旋转来变换，类似 HTML 元素使用 CSS transform 来变换。

    #### transform

    <code>transform</code>属性用来对一个元素声明一个或者多个变换，每个变换之间用空格或者逗号隔开，然后依次对元素进行变换。

    1. Matrix（矩阵变换）

        语法：

        ```
        matrix(<a> <b> <c> <d>)
        ```

        上述变换等同于<code>matrix[a b c d]</code>其中 a、b、c、d 都是矩阵。

    2. translate（平移）

        语法：

        ```
        tanslate(<tx> [<ty>])

        transform = "tarnslate(<tx> [<ty>])"
        ```

        <code>tx</code>表示在 x 轴上的 translattion 值，<code>ty</code>表示 y 轴上的 translation 值，也可用逗号分隔。

        translate 移动整个坐标系统而不是元素本身，在进行后续变换时需要注意此时的坐标系变幻。

    3. scale（缩放）

        语法：

        ```
        scale(<sx> [<sy>])

        transform = "scale(<sx> [<sy>])"
        ```

        scale 接收两个值来表示水平和竖直缩放，竖直方向的<code>sy</code>可以省略，省略默认和<code>sx</code>相等，可用逗号分隔。

        缩放变换不会改变图形对象的网格坐标或者笔画宽度，仅仅改变对应画布上的坐标系统网格的大小。

    4. rotate（旋转）

        语法：

        ```
        rotate(<angle> [<cx> <cy>])

        transform = "rotate(<angle> [<cx> <cy>])"
        ```

        rotate 对于给定的点和旋转角度进行旋转，角度默认单位为度。可在角度后面加上旋转中心点，如果不加，则默认中心点为坐标系原点。

    5. skew（倾斜）

        语法：

        ```
        skewX(<angle>)
        skewY(<angle>)

        tarnsform = "skewX(<angle>)"
        ```

        skewX 声明一个沿 x 轴的倾斜；skewY 声明一个沿 y 轴的倾斜。

        注意倾斜一个元素会导致元素在视窗中重新定位。
