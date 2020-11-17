import React from "react";
import { RegisterNode, RegisterEdge } from "gg-editor";
import { entityColum } from "@/pages/EntityList";
import { getBslPoints } from "@/utils/bslPoint";

class CustomLine2 extends React.Component {
  render() {
    const config = {
      draw(item) {
        const group = item.getGraphicGroup();
        const path = this.getPath(item);
        const model = item.getModel();
        const start = item.getPoints()[0];
        const end = item.getPoints()[1];


        //test
        // var xgap = Math.abs(end.x - start.x);
        // var ygap = Math.abs(end.y - start.y);

        // const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
        // const angle =  (Math.acos((start.x - end.x) / xlength)); //-1,1

        // let rate=model.heightRate||1;
        // let updown=1;//model.updown||1; //上1，下-1

        //  let yheight=-30;

        //  const pts=getBslPoints(start,end,yheight);

        //  group.addShape('rect', {
        //   attrs: {
        //     text: label,
        //     x: pts[0].x,
        //     y: pts[0].y,
        //     textAlign: 'start',
        //     textBaseline: 'center',
        //     fill: 'red',
        //     fontSize: 11,
        //     fontWeight: 'bold',
        //     width: 5,
        //     height: 5
        //   },
        // });
        // group.addShape('rect', {
        //   attrs: {
        //     text: label,
        //     x: pts[1].x,
        //     y: pts[1].y,
        //     textAlign: 'start',
        //     textBaseline: 'center',
        //     fill: 'red',
        //     fontSize: 11,
        //     fontWeight: 'bold',
        //     width: 5,
        //     height: 5
        //   },
        // });
        // group.addShape('rect', {
        //   attrs: {
        //     text: label,
        //     x: pts[2].x,
        //     y: pts[2].y,
        //     textAlign: 'start',
        //     textBaseline: 'center',
        //     fill: 'blue',
        //     fontSize: 11,
        //     fontWeight: 'bold',
        //     width: 5,
        //     height: 5
        //   },
        // });
        // group.addShape('rect', {
        //   attrs: {
        //     text: label,
        //     x: pts[3].x,
        //     y: pts[3].y,
        //     textAlign: 'start',
        //     textBaseline: 'center',
        //     fill: 'blue',
        //     fontSize: 11,
        //     fontWeight: 'bold',
        //     width: 5,
        //     height: 5
        //   },
        // });

        // group.addShape('path', {
        //   attrs: {
        //     path:[["M",start.x,start.y],["L",end.x,end.y]],
        //     lineWidth:1,
        //     stroke: 'red',
        //     strokeOpacity: 0.92
        //   }
        // });

        //test end


     



        let style = this.getStyle(item);

        const shapeObject = group.addShape('path', {
          attrs: {
            path,
            ...style
          }
        });

        let h = shapeObject.getPoint(.5);
        if (!h)
          h = start;

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
            fill: model.textcolor || 'rgba(0,0,0,0.65)',
            fontSize: 11,
            fontWeight: 'bold',
            autoRotate:'true',
            labelCfg:{
              autoRotate:'true',
              offset: [5, 5, 10, 10],
          }

          },
        });

        const angle = Math.atan((end.y - start.y) / (end.x - start.x))
        textshape.rotateAtStart(angle);
     
        var l = this.getDefaultLabelRectPadding(item)
          , p = this.getDefaultLabelRectStyle(item)
          ,
          d = textshape.getBBox();

       const rectshape= group.addShape('rect', {
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
        rectshape.rotateAtStart(angle);

        textshape.toFront();


        return shapeObject;
      },

      /**重设连接点 使多条连线始终在节点中间*/ 
      resetAnchor(item,start,end){

        const xgap = Math.abs(end.x - start.x);
        const ygap = Math.abs(end.y - start.y);
    
        const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
        //const angle = Math.acos((end.x - start.x) / xlength); //-1,1    1:0 ,0:90,-1:180
    
        const anglePI =  (180*(Math.acos((end.x - start.x) / xlength))/Math.PI); //-1,1    1:0 ,0:90,-1:180
    
    
        const ydirect=  end.y>=start.y?-1:1; 
        let direct=1;
        if(ydirect>0)
        {
          if(anglePI<=23)
         {
          item.model.sourceAnchor= 2;// 8个节点
          item.model.targetAnchor=6;// 8个节点
         }
        else if(anglePI<=68)
         {
          item.model.sourceAnchor= 1;// 8个节点
          item.model.targetAnchor=5;// 8个节点
         }else if(anglePI<=112)
         {
          item.model.sourceAnchor= 0;// 8个节点
          item.model.targetAnchor=4;// 8个节点
         }else if(anglePI<=158)
         {
          item.model.sourceAnchor= 7;// 8个节点
          item.model.targetAnchor=3;// 8个节点
         }
         else if(anglePI<=180)
         {
          item.model.sourceAnchor= 6;// 8个节点
          item.model.targetAnchor=2;// 8个节点
         }
        }
        else{
          if(anglePI<=23)
          {
           item.model.sourceAnchor= 2;// 8个节点
           item.model.targetAnchor=6;// 8个节点
          }
         else if(anglePI<=68)
          {
           item.model.sourceAnchor= 3;// 8个节点
           item.model.targetAnchor=7;// 8个节点
          }else if(anglePI<=112)
          {
           item.model.sourceAnchor= 4;// 8个节点
           item.model.targetAnchor=0;// 8个节点
          }else if(anglePI<=158)
          {
           item.model.sourceAnchor= 5;// 8个节点
           item.model.targetAnchor=1;// 8个节点
          }
          else if(anglePI<=180)
          {
           item.model.sourceAnchor= 6;// 8个节点
           item.model.targetAnchor=2;// 8个节点
          }
          
      }

      
          
          item.graph.update(item);

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

        var model = item.getModel();

        //自己到自己的关系，修改节点

        if(model.source===model.target)
        {
          model.lineType="Q";
          model.heightRate="32";
          model.sourceAnchor= 0;// 8个节点
          model.targetAnchor=2;// 8个节点
          item.model=model;
          item.graph.update(item);
        }



        if (model.lineType && model.lineType === "C") //曲线
        {
          var hgap = Math.abs(end.x - start.x);
          if (end.x > start.x) {
            return [['M', start.x, start.y], ['C', start.x + hgap / 4, start.y, end.x - hgap / 2, end.y, end.x, end.y]];
          }
          return [['M', start.x, start.y], ['C', start.x - hgap / 4, start.y, end.x + hgap / 2, end.y, end.x, end.y]];
        }

        if (model.lineType && model.lineType === "Q") //2次曲线
        {

          if(model.source!==model.target)
          this.resetAnchor(item,start,end);

        
//debugger;

          var xgap = Math.abs(end.x - start.x);
          var ygap = Math.abs(end.y - start.y);

          const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
          const angle =  (Math.acos((start.x - end.x) / xlength)); //-1,1

          let rate=model.heightRate||1;
          let updown=model.updown||1; //上1，下-1

           let yheight=updown*rate*xlength/8;
//           let yheight=30;//xlength/8;

           const pts=getBslPoints(start,end,yheight);
        
           const svgpath=[['M', start.x, start.y], ['C',pts[0].x,pts[0].y, pts[1].x,pts[1].y, end.x, end.y]];
         //  console.log(svgpath);
           return svgpath;

        //    //return [['M', start.x, start.y], ['C', start.x + xgap / 3, start.y + updown*yheight, start.x + xgap * 2 / 3, start.y + updown*yheight, end.x, end.y]];



        //   if (end.x > start.x) {
        //     if(Math.abs(angle)<0.5)//竖直方向
        //     return [['M', start.x, start.y], ['C', start.x + xgap *4/ 5, start.y + yheight, start.x + xgap * 3 / 5, start.y + yheight, end.x, end.y]];

         
        //   }
        //  // console.log("M" + start.x + " " + start.y + " C " + start.x - xgap / 3 + " " + start.y - 30 + " " + start.x - xgap * 2 / 3 + " " + start.y - 30 + " " + end.x + " " + end.y);


        //   if(Math.abs(angle)<0.5)
        //   return [['M', start.x, start.y], ['C', start.x - xgap *4/5, start.y - yheight, start.x - xgap * 3 / 5, start.y - yheight, end.x, end.y]];

        //   return [['M', start.x, start.y], ['C', start.x - xgap / 3, start.y - yheight, start.x - xgap * 2 / 3, start.y - yheight, end.x, end.y]];
        }
        if (model.lineType && model.lineType === "A") //椭圆弧 //TODO
        {
          // <path d="M30 50 A 50 30 0 0 1 130 50"/>    起点， xr,yr, 角度, 0小于180/1大于180， 0逆时针，1顺时针，终点

          var xgap = Math.abs(end.x - start.x);
          var ygap = Math.abs(end.y - start.y);

          const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
          const angle =  (Math.acos((start.x - end.x) / xlength)/Math.PI)*180*-1; //度
        //  console.log(angle);
          let yr = xlength / 4;//椭圆程度，y半径
         // console.log("M" + start.x + " " + start.y + " A " + xlength / 2 + " " +  yr + " " + angle + " 0 " + (start.x >= end.x ? 0 : 1) + " " + end.x + " " + end.y);
          return [['M', start.x, start.y], ['A', xlength / 2, yr, angle, 0, start.x >= end.x ? 0 : 1, end.x, end.y]];
        }





        //SVG path 直线
        return [['M', start.x, start.y], ['L', end.x, end.y]];

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
            strokeOpacity: 0.92,
            lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
          }


        return {
          endArrow: true,
          lineAppendWidth: 8,
          lineWidth: model.lineWidth || 1,
          stroke: model.stroke || "#999",
          strokeOpacity: 0.92,
          fontSize: 11,
          lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线

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
            strokeOpacity: 0.92,
            lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
          }


        if (item.isActived)//移走
          return {
            lineAppendWidth: 8,
            lineWidth: model.lineWidth || 1,
            stroke: model.stroke || "#999",
            strokeOpacity: 0.92,
            fontSize: 11,
            lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
          }

        //激活，反了
        return {

          lineAppendWidth: 8,
          lineWidth: model.lineWidth || 1,
          stroke: model.strokeActived || "blue",
          strokeOpacity: 0.92,
          lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
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
          strokeOpacity: 0.92,
          lineDash:  model.localmodify?[4,2] :[4,0] ,//有本地修改，显示虚线边线
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
        <RegisterEdge name="CustomLine2" config={config} />


      </>
    );
  }
}

export default CustomLine2;
