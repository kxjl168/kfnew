import React, { Fragment } from 'react';
import { RegisterNode } from 'gg-editor';
import PLUS_URL from '@/assets/plus.svg';
import MINUS_URL from '@/assets/minus.svg';
// import CATE_URL from '@/assets/docs.svg';
// import CASE_URL from '@/assets/file.svg';

import logo from '@/assets/logo.svg';

const ICON_SIZE = 16;
const COLLAPSED_ICON = 'node-inner-icon';
function getRectPath(x: string | number, y: any, w: number, h: number, r: number) {
  if (r) {
    return [
      ['M', +x + +r, y],
      ['l', w - r * 2, 0],
      ['a', r, r, 0, 0, 1, r, r],
      ['l', 0, h - r * 2],
      ['a', r, r, 0, 0, 1, -r, r],
      ['l', r * 2 - w, 0],
      ['a', r, r, 0, 0, 1, -r, -r],
      ['l', 0, r * 2 - h],
      ['a', r, r, 0, 0, 1, r, -r],
      ['z'],
    ];
  }
  const res = [['M', x, y], ['l', w, 0], ['l', 0, h], ['l', -w, 0], ['z']];
  res.toString = toString;
  return res;
}
class EditorCustomNode extends React.Component {
  render() {
    const config = {
      // 绘制标签
      // drawLabel(item) {
      // },
      // 绘制图标
      afterDraw(item) {
        const model = item.getModel();
        const group = item.getGraphicGroup();
        const label = group.findByClass('label')[0];
        const labelBox = label.getBBox();
        const { width } = labelBox;
        const { height } = labelBox;
        const x = -width / 2;
        const y = -height / 2;
        const { type, collapsed, children } = model;
        // 折叠状态图标
        if (type === 'cate' && children && children.length > 0) {
          group.addShape('image', {
            className: COLLAPSED_ICON,
            attrs: {
              //img: collapsed ? PLUS_URL : MINUS_URL,
              img:logo,
              x: x - 24,
              y: y - 2,
              width: ICON_SIZE,
              height: ICON_SIZE,
              style: 'cursor: pointer',
            },
          });
        }
        // 文件类型图标
        group.addShape('image', {
          attrs: {
            //img: type === 'cate' ? CATE_URL : CASE_URL,
            img:logo,
            x: children && children.length > 0 ? x + 4 : x - 12,
            y: y - 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
          },
        });
      },
      // 对齐标签
      adjustLabelPosition(item, labelShape) {
        const size = this.getSize(item);
        const padding = this.getPadding(item);
        const width = size[0];
        const labelBox = labelShape.getBBox();
        labelShape.attr({
          x: -width / 2 + padding[3],
          y: -labelBox.height / 2,
        });
      },
      // 内置边距
      // [上, 右, 下, 左]
      getPadding(item) {
        const model = item.getModel();
        const { children } = model;
        if (children && children.length > 0) {
          return [12, 8, 12, 60];
        }
        return [12, 8, 12, 38];
      },
      // 标签尺寸
      // [宽, 高]
      getSize(item) {
        const group = item.getGraphicGroup();
        const label = group.findByClass('label')[0];
        const labelBox = label.getBBox();
        const padding = this.getPadding(item);
        return [
          labelBox.width + padding[1] + padding[3],
          labelBox.height + padding[0] + padding[2],
        ];
      },
      // 节点路径
      // x, y, w, h, r
      getPath(item) {
        const size = this.getSize(item);
        const style = this.getStyle(item);
        return getRectPath(-size[0] / 2, -size[1] / 2, size[0] + 4, size[1], style.radius);
      },
      // 节点样式
      getStyle(item) {
        return {
          // stroke: '#d9d9d9',
          radius: 2,
          lineWidth: 1,
        };
      },
      // 标签样式
      getLabelStyle(item) {
        return {
          fill: 'rgba(0,0,0,0.65)',
          lineHeight: 18,
          fontSize: 16,
        };
      },
      // 激活样式
      getActivedStyle(item) {
        return {
          stroke: '#096dd9',
        };
      },
      // 选中样式
      getSelectedStyle(item) {
        return {
          stroke: '#096dd9',
        };
      },
    };
    return (
      <Fragment>
        <RegisterNode name="mind-base" config={config} extend="mind-base" />
        <RegisterNode name="custom-node" config={config} extend="flow-rect" />
      </Fragment>
    );
  }
}
export default EditorCustomNode;