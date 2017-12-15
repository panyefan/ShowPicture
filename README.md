# React组件：图片缩放、旋转、全屏拖拽
1、本组件的缩放、旋转的图标是使用了[antd](https://ant.design/components/icon-cn/)的UI图标

2、需求：实现图片缩放、旋转、全屏拖拽，如果页面中使用多个图片，只能显示和操作当前那一个，其他的图片则需要关闭掉；
 
 同类组件只能显示一个，大多数会使用“子组件->父组件->子组件”通信的模式，但是如果
 多处使用，会增加很多冗余的代码，每一处使用到该组件的地方都要做修改，麻烦！！！
 
# 所以引入了观察模式，它的好处在于：组件之间的通信，不需要通过父组件，从而减少冗余的代码
 
3、使用方式：
```
import {ShowPicture} from '../../../components/hsReact/UploadPicture/index';

// model="IDcardFront" 为空白图片时显示的默认图片
<ShowPicture model="IDcardFront" imageUrl={this.state.corporationIdCardz}>身份证正面照</ShowPicture>
```

4、效果图
![效果图](https://github.com/panyefan/ShowPicture/blob/master/2017-11-22_110025.png)