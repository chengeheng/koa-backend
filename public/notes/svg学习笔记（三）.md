## 6.路径

1. path

    path 元素可以通过制定一系列相互连接的线、弧、曲线来绘制任意形状的轮廓，轮廓中可以填充或者绘制轮廓线，也可以用来定义裁剪区域或蒙版。

    | 命令              | 参数                                      | 说明                                                                                                                                                                   |
    | ----------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | M（相对坐标为 m） | x y                                       | 移动画笔到指定坐标                                                                                                                                                     |
    | L                 | x y                                       | 绘制一条到给定坐标的线                                                                                                                                                 |
    | H                 | x                                         | 绘制一条到给定 x 坐标的横线                                                                                                                                            |
    | V                 | y                                         | 绘制一条到给定 y 坐标的垂线                                                                                                                                            |
    | A                 | rx ry x-axis-rotation large-arc sweep x y | 圆弧曲线命令有 7 个参数，依次表示为 x 方向半径、y 方向半径、旋转角度、大圆标识、顺逆时针标识、目标点 x、目标点 y。大圆标识和顺逆时针以 0 和 1 表示，0 表示小圆、逆时针 |
    | Q                 | x1 y1 x y                                 | 绘制一条从当前点到 x，y 控制点为 x1，y1 的二次贝塞尔曲线                                                                                                               |
    | T                 | x y                                       | 绘制一条从当前点到 x，y 的光滑二次贝塞尔曲线，控制点为前一个 Q 命令的控制点的中心对称点，如果没有前一条则以当前点为控制点                                              |
    | C                 | x1 y1 x2 y2                               | 绘制一条从当前点到 x，y 控制点为 x1，y1， x2，y2 的三次贝塞尔曲线                                                                                                      |
    | S                 | x2 y2 x y                                 | 绘制一条从当前点到 x，y 的光滑三次贝塞尔曲线。第一个控制点为前一个 C 命令的第二个控制点的中心对称点，如果没有前一条曲线，则第一个控制点为当前的点                      |

2. marker

    marker 元素用来在 path 上添加一个标记，比如箭头之类的，path 中使用 marker-start、marker-mid、marker-end 和 marker 属性来设置标记的位置。marker 元素需要事先定义，然后其他元素根据 marker 元素的 id 属性进行引用。

    marker 属性：

    | marker 属性                 | 说明                                                                                                                                                         |
    | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | markerWidth                 | marker 标记的宽度                                                                                                                                            |
    | markerHeight                | marker 标记的高度                                                                                                                                            |
    | refX refY                   | 指定 marker 中的哪个坐标与路径的开始坐标对齐                                                                                                                 |
    | orient                      | 自动旋转匹配路径的方向，需要设置为 auto                                                                                                                      |
    | markerUnits                 | 这个属性决定标记的坐标系统是否需要根据 path 的笔画宽度调整，如果设置为 strokeWidth，则标记会自动调整大小。如果设置为 useSpaceOnUse，则不会自动调整标记的大小 |
    | viewBox preserveAspectRadio | 设置标记的显示效果，比如可以将标记的(0, 0)设置在标记网格的中心                                                                                               |

    例：

    ```html
    <defs>
    	<marker
    		id="arrow"
    		markerWidth="10"
    		markerHeight="10"
    		refX="0"
    		refY="3"
    		orient="auto"
    		markerUnits="strokeWidth"
    		viewBox="0 0 20 20"
    	>
    		<path d="M0,0 L0,6 L9,3 z" fill="#f00" />
    	</marker>
    </defs>
    <line
    	x1="50"
    	y1="50"
    	x2="250"
    	y2="50"
    	stroke="#000"
    	stroke-width="3"
    	marker-end="url(#arrow)"
    />
    ```

    还可以在 css 中设置：

    ```css
    path {
    	marker: url(#marker_id);
    }
    ```

    在 marker 中引入 path 时需要注意，如果 path 也需要引用 marker，不能引用自身的 marker，否则会出现无限引用自身的情况，因此一般 marker 中的 path 不需要添加标记。

## 7.图案填充和渐变

1. 图案

    svg 图案一般用户 svg 图形对象的填充 fill 或者描边 stroke，图形可以是 svg 元素，也可以是图像，通过\<pattern>元素在 x 轴或 y 轴方向以固定的间隔平铺。

    例：

    ```html
    <svg width="1000" height="1000">
    	<defs>
    		<pattern
    			id="grid"
    			x="100"
    			y="100"
    			width="0.2"
    			height="0.2"
    			patternUnits="objectBoundingBox"
    		>
    			<circle cx="10" cy="10" r="5" fill="red"></circle>
    			<polygon points="30 10 60 50 0 50" fill="green"></polygon>
    		</pattern>
    	</defs>
    	<rect
    		x="100"
    		y="100"
    		width="400"
    		height="300"
    		fill="url(#grid)"
    		stroke="blue"
    	></rect>
    </svg>
    ```

    效果如下：

    <svg width="600" height="400">
    <defs>
    <pattern id="grid" x="100" y="100" width="0.2" height="0.2" patternUnits="objectBoundingBox">
    <circle cx="10" cy="10" r="5" fill="red"></circle>
    <polygon points="30 10 60 50 0 50" fill="green"></polygon>
    </pattern>
    </defs>
    <rect x="100" y="100" width="400" height="300" fill="url(#grid)" stroke="blue"></rect>
    </svg>

    同 marker 一样，使用 pattern 之前需要在 defs 中先定义好，元素的内容直到引用的时候才显示。属性中，x、y 值决定图案初始位置，width、height 决定 pattern 图案占填充图形的百分比或是指定的宽高。

    pattern 还有两个个属性，即 patternUnits 和 patternContentUnits，patternUnits 用来决定填充图案的大小是相对于填充图形还是基于被填充对象尺寸方式之外；patternContentUnits 用来设置 pattern 内图案的单位大小。

    | patternUnits      | 说明                                                                             |
    | ----------------- | -------------------------------------------------------------------------------- |
    | objectBoundingBox | width 和 height 为相对填充对象的百分比                                           |
    | userSpaceOnUse    | width 和 height 为基于填充对象尺寸之外，也可以按照用户指定图案的 width 和 height |


    |patternContentUnits|说明|
    |---|---|
    |userSpaceOnUse（默认值）|x、y、width和height表示的值都是当前用户坐标系统的值，即这些值没有缩放，都是绝对值|
    |objectBoundingBox|x、y、width和height的值都是占外框（包裹pattern的元素）的百分比。|

2. 渐变

    - 线性渐变 linearGradient

        | 属性         | 说明                                                                                                                                                           |
        | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
        | x1、y1       | 渐变的起点位置，使用百分比表示，默认的渐变方向是从左到右                                                                                                       |
        | x2、y2       | 渐变的终点位置，使用百分比表示                                                                                                                                 |
        | spreadMethod | 如果设置的 offset 不能覆盖整个对象的填充方式。pad：起点或终点的颜色会扩展到对象边缘；repaet：渐变重复起点到终点的过程；reflect：渐变按终点-起点-终点的排列重复 |

        线性渐变是一系列颜色沿着一条直线过渡，在特定的位置指定想要的颜色，被称为渐变点。

        ```html
        <defs>
        	<linearGradient id="linear">
        		<stop offset="0%" style="stop-color:#ffcc00;"></stop>
        		<stop offset="100%" style="stop-color:#0099cc;"></stop>
        	</linearGradient>
        </defs>
        <rect
        	x="20"
        	y="20"
        	width="200"
        	height="100"
        	style="fill:url(#linear);stroke:black;"
        ></rect>
        ```

        stop 元素有两个必要属性：offset 和 stop-color。offset 属性用来指定在哪个点的颜色应该等于 stop-color，取值范围为 0~100%；stop-color 对应 offset 位置点的颜色，stop-opacity 对应 offset 位置点的不透明度。

    - 径向渐变 radialGradient

        径向渐变的每个渐变是一个圆形路径，从中心点向外扩散。设置方式和线性渐变差不多

        | 属性         | 说明                                                                       |
        | ------------ | -------------------------------------------------------------------------- |
        | cx、cy、r    | 定义渐变的范围，测量半径的单位是对象的宽高均值，而不是对角线，默认都为 50% |
        | fx、fy       | 0%点所处的圆路径的圆心，默认和 cx、cy 一样                                 |
        | spreadMethod | pad、repeat、reflect 三个值，用来解决绘制范围没有到达图形边缘的情况        |

        ```html
        <defs>
        	<radialGradient
        		id="grey_blue"
        		cx="50%"
        		cy="50%"
        		r="50%"
        		fx="50%"
        		fy="50%"
        	>
        		<stop
        			offset="0%"
        			style="stop-color:rgb(200,200,200);
            stop-opacity:0"
        		/>
        		<stop
        			offset="100%"
        			style="stop-color:rgb(0,0,255);
            stop-opacity:1"
        		/>
        	</radialGradient>
        </defs>

        <ellipse
        	cx="230"
        	cy="200"
        	rx="110"
        	ry="100"
        	style="fill:url(#grey_blue)"
        />
        ```

## 8.文本

svg 的文本使用 text 标签表示，以指定的 x 和 y 值作为元素内容的第一个字符的基线位置，默认样式黑色填充、没有轮廓。

| 属性            | 说明                                                                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| font-family     | 以空格分隔的一系列字体名称或通用字体名称                                                                                                                                     |
| font-size       | 如果有多行文本，则 font-size 为平行的两条基线的距离                                                                                                                          |
| font-weight     | 两个值： bold（粗体）和 normal（默认）                                                                                                                                       |
| text-decoration | 下划线，可能的值：none、underline（下划线）、overline（上划线）、line-through（删除线）                                                                                      |
| word-spacing    | 单词之间的距离                                                                                                                                                               |
| letter-spacing  | 字母之间的距离                                                                                                                                                               |
| text-anchor     | 对齐方式：start、middle、end                                                                                                                                                 |
| textLength      | 设置文本的长度                                                                                                                                                               |
| lengthAdjust    | 在指定了 textLength 时，可以通过 lengthAdjust 属性设置字符的调整方式，值为 spacing（默认）时，只调整字符的间距。当值为 spacingAndGlyphs 时，同时调整字符间距和字符本身的大小 |
| writing-mode    | 设为 tb 则可以将文本上下排列                                                                                                                                                 |

**相关术语**

| 术语                 | 说明                                                                      |
| -------------------- | ------------------------------------------------------------------------- |
| 字符                 | XML 中，字符是指带有一个数字值得一个或多个字节，数字值与 Unidode 标准对应 |
| 符号                 | 字符的视觉呈现。每个字符可以有多种视觉呈现                                |
| 字体                 | 代表某个字符集合的一组符号                                                |
| 基线                 | 字体中所有符号以基线对齐                                                  |
| 上坡度               | 基线到字体中最高字符的顶部距离                                            |
| 下坡度               | 基线到最深字符底部的距离                                                  |
| 大写字母高度、x 高度 | 大写字母高度是指基线上大写字母的高度，x 高度是基线到小写字母 x 顶部的高度 |

-   tspan

    text 元素无法对文本进行换行，如果需要换行显示，则需要使用 tspan 标签，tspan 可以镶嵌在 text 元素中。

    | 属性           | 说明                                                                      |
    | -------------- | ------------------------------------------------------------------------- |
    | dx,dy          | x 和 y 方向的偏移                                                         |
    | x,y            | 对 tspan 进行绝对定位                                                     |
    | rotate         | 旋转字符，可以同时设置多个值，这些值会依次作用在 tspan 包裹的字母上       |
    | baseline-shift | 与 dy 属性设置上下标相比，这个属性更方便，当为 super 时，会上标。sub 时为 | 下标。仅仅在所在的 tspan 内有效 |

-   textPath

    如果需要将文本按照某条路径排列，则需要将文本放在 textPath 元素内部，然后使用 textPath 元素的 xlink：href 属性引用一个定义好的 path 元素。
