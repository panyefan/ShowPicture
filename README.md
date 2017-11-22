# 图片缩放、旋转、拖拽组件
1、本组件的缩放、旋转的图标是使用了[antd](https://ant.design/components/icon-cn/)的UI图标

2、使用方式：
```
import {ShowPicture} from '../../../components/hsReact/UploadPicture/index';

// model="IDcardFront" 为空白图片时显示的默认图片
<ShowPicture model="IDcardFront" imageUrl={this.state.corporationIdCardz}>身份证正面照</ShowPicture>
```

3、效果图
![效果图](https://github.com/panyefan/ShowPicture/blob/master/2017-11-22_110025.png)