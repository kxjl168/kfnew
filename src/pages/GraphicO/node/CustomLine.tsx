import React from "react";
import { RegisterNode, RegisterEdge } from "gg-editor";

class CustomLine2 extends React.Component {
  render() {
    const config = {
      draw(item) {
        const group = item.getGraphicGroup();
        const path = this.getPath(item);
        const model = item.getModel();
        const startPoint = item.getPoints()[0];
        const endPoint = item.getPoints()[1];
        let style = this.getStyle(item);

        const shapeObject = group.addShape('path', {
          attrs: {
            path,
            ...style
          }
        });

        const h = shapeObject.getPoint(.5);

        const label = model.label ? model.label : this.label;


        const a = model.labelOffsetX
          , u = model.labelOffsetY;
        h.x = a ? h.x + a : h.x,
          h.y = u ? h.y + u : h.y;


        const textshape = group.addShape('text', {
          attrs: {
            text: label,
            // x: endPoint.x / 2 + 1 / 2 * startPoint.x-10,
            //  y: endPoint.y / 2 + 1 / 2 * startPoint.y -20,
            x: h.x - 10,
            y: h.y + 5,
            textAlign: 'start',
            textBaseline: 'center',
            fill: model.textcolor||'rgba(0,0,0,0.65)',
            fontSize: 11,
            fontWeight: 'bold',

          },
        });
        var l = this.getDefaultLabelRectPadding(item)
          , p = this.getDefaultLabelRectStyle(item)
          ,
          d = textshape.getBBox();

        group.addShape('rect', {
          attrs: {
            text: label,
            x: d.minX - l[3],
            y: d.minY - l[0],
            textAlign: 'start',
            textBaseline: 'center',
            fill: '#fff',
            fontSize: 11,
            fontWeight: 'bold',
            width: d.maxX - d.minX + l[1] + l[3],
            height: d.maxY - d.minY + l[0] + l[2]
          },
        });

        textshape.toFront();


        return shapeObject;
      },


      getDefaultLabelRectPadding(item) {
        return [2, 4, 2, 4]
      },
      getDefaultLabelRectStyle(item) {
        return {
          fill: "white"
        };
      },
      getPath(item) {
        var points = item.getPoints();
        var start = points[0];
        var end = points[points.length - 1];
        var hgap = Math.abs(end.x - start.x);
        if (end.x > start.x) {
          return [['M', start.x, start.y], ['C', start.x + hgap / 4, start.y, end.x - hgap / 2, end.y, end.x, end.y]];
        }
        return [['M', start.x, start.y], ['C', start.x - hgap / 4, start.y, end.x + hgap / 2, end.y, end.x, end.y]];
      },

      getStyle(item) {
       // console.log("getStyle");
       // console.log("item.isActived:" + item.isActived + " / " + "item.isSelected:" + item.isSelected);
        //  console.log('------------');

        const model = item.getModel();

        //  let sstyle = this.getSelectedStyle(item);
        if (item.isSelected)
          return {
            endArrow: true,
            lineAppendWidth: 8,
            lineWidth: (model.lineWidth + 1) || 2,
            stroke: model.strokeSeleted || "#555",
            strokeOpacity: 0.92
          }


        return {
          endArrow: true,
          lineAppendWidth: 8,
          lineWidth: model.lineWidth || 1,
          stroke: model.stroke || "#999",
          strokeOpacity: 0.92,
          fontSize: 11,

        }


      }
      ,
      //   // // hover上的样式
      getActivedStyle(item) {
       // console.log("getActivedStyle");
      //  console.log("item.isActived:" + item.isActived + " / " + "item.isSelected:" + item.isSelected);
        //  console.log('------------');
        const model = item.getModel();

        if (item.isSelected)
          return {
            lineAppendWidth: 8,
            lineWidth: (model.lineWidth + 1) || 2,
            stroke: model.strokeSeleted || "#555",
            strokeOpacity: 0.92
          }


        if (item.isActived)//移走
          return {
            lineAppendWidth: 8,
            lineWidth: model.lineWidth || 1,
            stroke: model.stroke || "#999",
            strokeOpacity: 0.92,
            fontSize: 11,
          }

        //激活，反了
        return {

          lineAppendWidth: 8,
          lineWidth: model.lineWidth || 1,
          stroke: model.strokeActived || "blue",
          strokeOpacity: 0.92
        }




      },

      //   // 选中样式 或者不选中
      getSelectedStyle(item) {
        //  console.log("getSelectedStyle");
        //  console.log("item.isActived:" + item.isActived + " / " + "item.isSelected:" + item.isSelected);
        //  console.log(item);


        // let nitem= item.getGraph().find(item.id)
        // console.log("nitem.isActived:"+nitem.isActived+" / "+"nitem.isSelected:"+nitem.isSelected);
        // console.log('------------');

        const model = item.getModel();
        //  if (item.isSelected)
        return {

          lineAppendWidth: 8,
          lineWidth: (model.lineWidth + 1) || 2,
          stroke: model.strokeSeleted || "#555",
          strokeOpacity: 0.92
        }
        // else {
        //   return {
        //     lineAppendWidth: 8,
        //     lineWidth: model.lineWidth || 2,
        //     stroke: model.stroke || "#999",
        //     strokeOpacity: 0.92,
        //     fontSize: 11,
        //   }
        // }
      },


    };

    return (
      <>
        {/* extend="flow-smooth" */}
        <RegisterEdge name="CustomLine1" config={config} />


      </>
    );
  }
}

export default CustomLine2;
