# 多媒体类型

表格可以展示各种类型的数据，例如文本、数字、图表等。其中，多媒体类型（如 image 和 video）在某些场景中的展示尤其重要，它们可以直观地展示信息，帮助用户快速获取关键数据。例如，电商网站可以在表格中展示商品图片，便于店主快速查看商品信息；视频网站可以在表格中展示视频预览图，方便用户快速了解视频内容。通过在表格中展示多媒体类型，可以有效提高数据展示的效果和用户体验。

注：以下介绍均以image类型为例，video类型也同样适用。

## 特有配置项介绍

首先介绍如何在 VTable 中展示图片，以下为 image 类型的特有配置项：

- `keepAspectRatio`：keepAspectRatio属性用于配置是否保持图片的横纵比。默认值为false，即不保持横纵比；当设置为true时，将会按照图片原始大小比例显示
- `imageAutoSizing`：imageAutoSizing属性用于配置是否根据图片尺寸自动调整单元格的尺寸。默认值为false，即不自动调整单元格尺寸；当设置为true时，将会根据图片尺寸调整单元格的宽度和高度

示例：
```javascript
{
  cellType: 'image',
  field: 'avatar',
  title: '头像',
  keepAspectRatio: true,
  imageAutoSizing: true,
}
```

## 特有样式介绍

image 类型在样式 style 方面的特有配置项：

- `style.margin`：图片在单元格中的边距；
示例：
```javascript
{
  cellType: 'image',
  field: 'avatar',
  title: '头像',
  keepAspectRatio: true,
  imageAutoSizing: true,
  style:{
    margin: 20
  }
}
```
## image 的点击预览

当某些场景下，我们希望点击图片可以预览大图。VTable默认点击多媒体（包括视频和图片）单元格即可以弹出预览窗口。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/03421afda76ced0240204bf01.gif)