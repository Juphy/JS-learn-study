
## backgound-position
指定背景图片的初始位置。对于每一个被设定的背景图片来说，background-position设置的有一个初始值，这个初始值是相对于以background-origin定义的背景位置图层（padding-box|border-box|content-box），默认是在padding-box，拥有padding值的盒子的左上角。

### values
- top,bottom,left,right,center
- 25%,75%
- 0 0, 1cm 2cm, 1px 2px
- bottom 10px right 20px

前面的值表示x轴，以水平向右表示正值；后面的值y轴，以垂直向下表示正值。

偏移量百分比的值计算：positionX=（容器宽度-图片宽度）* percentX
                                     positionY= （容器高度-图片高度）* percentY
如果容器比图片小，此公式同样适用，负百分比表示正向偏移。

### background-repeat
默认情况下，背景图片会沿着X轴，y轴重复，同样起始于padding-box的左上角
