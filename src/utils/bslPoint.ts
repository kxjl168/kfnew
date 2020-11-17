
/**
 * 根据高度获取贝塞尔三阶曲线 中间2个点坐标
 * @param x1 
 * @param y1 
 * @param x2 
 * @param y2 
 * @param height 
 */
export function getBslPoints(start:any,end:any,height:number){

    const xgap = Math.abs(end.x - start.x);
    const ygap = Math.abs(end.y - start.y);

    const xlength = Math.sqrt(xgap * xgap + ygap * ygap); //距离
    const angle = Math.acos((end.x - start.x) / xlength); //-1,1    1:0 ,0:90,-1:180

    const anglePI =  (180*(Math.acos((end.x - start.x) / xlength))/Math.PI); //-1,1    1:0 ,0:90,-1:180


    const heightdirect=  end.y<=start.y?1:-1; 

    let widthdirect=1;
    
    
    if(end.y>=start.y )
        widthdirect=-1;//第3.4象限;


    let pt1={};
    let pt2={};
    let pt1x= xlength* 1/3 - (height*Math.tan(angle));
    const t1= height*Math.tan(angle)*widthdirect;
    let pt2x= xlength* 2/3 -( height*Math.tan(angle));
    if(t1<=xlength*1/3)
    {
         pt1x= xlength* 1/3 - t1;

         pt1={
            x:start.x+  Math.cos(angle)*pt1x,
            y:start.y   -  heightdirect*( height/Math.cos(angle)*widthdirect+pt1x*Math.sin(angle)), 
        }
     
    }
    else{
        pt1x= t1-xlength* 1/3 ;

        pt1={
           x:start.x-   Math.cos(angle)*pt1x,
           y:start.y   - heightdirect*( height/Math.cos(angle)*widthdirect-pt1x*Math.sin(angle)), 
       }
    }

    if(t1<=xlength*2/3)
    {
         pt2x= xlength* 2/3 - t1;

         pt2={
            x:start.x+   Math.cos(angle)*pt2x,
            y:start.y  -heightdirect*( height/Math.cos(angle)*widthdirect+pt2x*Math.sin(angle)), 
        }
    
    }
    else{
        pt2x= t1-xlength* 2/3 ;

        pt2={
           x:start.x-   Math.cos(angle)*pt2x,
           y:start.y  - heightdirect*( height/Math.cos(angle)*widthdirect-pt2x*Math.sin(angle)), 
       }
    }
    
    
 

    // console.log("height:"+height);
    // console.log("angle:"+angle +"/"+anglePI);
    // console.log("xlength:"+xlength);


    // console.log("pt1x:"+pt1x+" Math.cos(angle):"+Math.cos(angle)+" Math.tan(angle)："+Math.tan(angle)+" Math.cos(angle)*pt1x:"+Math.cos(angle)*pt1x);
    // console.log("pt2x:"+pt2x);

    // console.log("start:"+start.x+"-"+start.y);
    // console.log("end:"+end.x+"-"+end.y);


  
    // console.log("pt1:"+pt1.x+"-"+pt1.y);
    // console.log("pt2:"+pt2.x+"-"+pt2.y);

    // console.log("---------");
    

let pt3={
    x:start.x+   Math.cos(angle)* xlength*1/3,
    y:start.y-  heightdirect* Math.sin(angle)* xlength*1/3,
}

let pt4={
    x:start.x+   Math.cos(angle)* xlength*2/3,
    y:start.y-   heightdirect*Math.sin(angle)* xlength*2/3,
}

    return [pt1,pt2,pt3,pt4];


}