import React from "react";
import { RegisterNode } from "gg-editor";

class CustomNodeLRect extends React.Component {
  render() {
    const config = {

      draw(item) {
        // const keyShape = this.drawKeyShape(item);

        // // 绘制图标
        // const group = item.getGraphicGroup();
        // const model = item.getModel();

        // group.addShape("image", {
        //   attrs: {
        //     x: -15,
        //     y: -25,
        //     width: 30,
        //     height: 30,
        //     img: model.icon
        //   }
        // });



        // // 绘制标签
        // this.drawLabel(item);

        // return keyShape;

        const group = item.getGraphicGroup();
        const model = item.getModel();
        const width = 184;
        const height = 40;
        const x = -width / 2;
        const y = -height / 2;
        const borderRadius = 4;
        const keyShape = group.addShape('rect', {
          attrs: {
            x,
            y,
            width,
            height,
            radius: borderRadius,
            fill: '#FA8C16',
            stroke: model.stroke//'#CED4D9',
          },
        });

        // 左侧色条
        group.addShape('path', {
          attrs: {
            path: [
              ['M', x, y + borderRadius],
              ['L', x, y + height - borderRadius],
              ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
              ['L', x + borderRadius, y],
              ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius],
            ],
            fill: model.stroke_left,
          },
        });

        // 类型 logo
        group.addShape('image', {
          attrs: {
            img: model.icon, //this.type_icon_url,
            x: x + 16,
            y: y + 12,
            width: 20,
            height: 16,
          },
        });

        // 名称文本
        const label = model.label ? model.label : this.label;

        group.addShape('text', {
          attrs: {
            text: label,
            x: x + 52,
            y: y + 13,
            textAlign: 'start',
            textBaseline: 'top',
            fill: 'rgba(0,0,0,0.65)',
          },
        });

        // // 状态 logo
        // group.addShape('image', {
        //   attrs: {
        //     img: this.state_icon_url,
        //     x: x + 158,
        //     y: y + 12,
        //     width: 16,
        //     height: 16,
        //   },
        // });

        return keyShape;


      },

      // 原本样式
      getStyle(item) {
        const model = item.getModel();
        return {
          fill: "#FA8C16",
          stroke: model.stroke,
        

        };
      },
      // hover上的样式
      getActivedStyle(item) {
        const model = item.getModel();
        return {
          fill: "#FC5C36",
          stroke: model.stroke
        };
      },
      // 选中样式
      getSelectedStyle(item) {
        const model = item.getModel();
        return {
          stroke: model.stroke,
          fill: "#FB6C56"
        };
      },
      anchor: [
        [0.5, 0], // 上边中点
        [0.5, 1], // 底边中点
        [0, 0.5], // 上边中点
        [1, 0.5] // 底边中点
      ]
    };

    return (
      <>
        <RegisterNode name="CustomNodeLRect" config={config} />


      </>
    );
  }
}

export default CustomNodeLRect;
