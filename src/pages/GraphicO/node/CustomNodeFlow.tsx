import React from "react";
import { RegisterNode } from "gg-editor";
import { LightenDarkenColor } from '@/utils/utils';

class CustomNodeCircle extends React.Component {
  render() {
    const config = {

      draw(item) {
        const keyShape = this.drawKeyShape(item);

        // 绘制图标
        const group = item.getGraphicGroup();
        const model = item.getModel();

        // group.addShape("image", {
        //   attrs: {
        //     x: -15,
        //     y: -25,
        //     width: 30,
        //     height: 30,
        //     img: model.icon
        //   }
        // });

        // 绘制标签
        //  this.drawLabel(item);
        const x = -model.width / 2;
        const y = -model.height / 2;


        try {
          
      
        let labels = [];
        let sizeinRow = 6;//一行6个字 ，最多显示3行
        let index = 0;
        for (index = 0; index < 3; index++) {
          if (model.label.length > (index + 1) * sizeinRow)
            labels.push(model.label.substr(index * sizeinRow, sizeinRow));
          else
          {
            if(index==0)
            labels.push(model.label);

            break;
            
          }
            
        }

        if(model.label.length>18)
         labels[2]=labels[2]+'...';

         for (let index2 = 0; index2 < labels.length; index2++) {
           const txt = labels[index2];
           group.addShape('text', {
            attrs: {
              text: txt,
              x: -25,
              y:  labels.length===1?0: 15*(index2-1),
              textAlign: 'start',
              textBaseline: 'top',
              fill: '#333',
              fontSize: 11,
              fontWeight: 'bold',
              shadowColor: '#fff',
            },
          });
         }
        } catch (error) {
          
        }
        

      

        return keyShape;
      },
      // 原本样式
      getStyle(item) {
        const model = item.getModel();
        return {
          fill: model.color,
          stroke: LightenDarkenColor(model.color, -30),
          lineWidth: 2.5,
          lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
        };
      },
      // hover上的样式
      getActivedStyle(item) {
        const model = item.getModel();
        return {
          fill: LightenDarkenColor(model.color, 20),
          stroke: LightenDarkenColor(model.color, -30),
          lineWidth: 2.5,
          lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
        };
      },
      // 选中样式
      getSelectedStyle(item) {
        const model = item.getModel();
        return {
          fill: LightenDarkenColor(model.color, -10),
          stroke: LightenDarkenColor(model.color, -30),
          lineWidth: 2.5,
          lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线

        };
      },

      // anchor: [
      //   [0.5, 0], // 上边中点
      //   [0.5, 1], // 底边中点
      //   [0, 0.5], // 上边中点
      //   [1, 0.5] // 底边中点
      // ]

      anchor: [
        //上方顺时针
        [0.5, 0], // 上边中点
        [0.85, 0.15], // 上边右中点
        [1, 0.5], // 中线右边
        [0.85, 0.85], // 下边右中点
        [0.5, 1], // 底边中点
        [0.15, 0.85], // 下边左中点
        [0, 0.5], // 上边中点
        [0.15, 0.15], // 上边左中点

        
      ]



    };

    return (
      <>
        <RegisterNode name="custom-node-circle" config={config} extend="flow-circle" />
        <RegisterNode name="custom-node-rect" config={config} extend="flow-rect" />

      </>
    );
  }
}

export default CustomNodeCircle;
