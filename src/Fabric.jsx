import React, {memo, useEffect} from 'react';
import {fabric} from "fabric";

const Fabric = () => {
    useEffect(()=>{
        // 创建一个canvas实例
        var canvas = new fabric.Canvas('canvas');

        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);


// 创建一个矩形对象
        var rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: 'red'
        });

// 将矩形添加到canvas中
        canvas.add(rect);

//鼠标按下事件
        canvas.on("mouse:down", function(e) {
            this.panning = true;
            canvas.selection = false;
        });
        // 移动画布事件
        canvas.on("mouse:move", function(e) {
            if (this.panning && e && e.e) {
                var delta = new fabric.Point(e.e.movementX, e.e.movementY);
                canvas.relativePan(delta);
            }
        });
        //鼠标抬起事件
        canvas.on("mouse:up", function(e) {
            this.panning = false;
            canvas.selection = true;
        });



        // 鼠标滚动画布放大缩小
        canvas.on("mouse:wheel", function(e) {
            var zoom = (event.deltaY > 0 ? -0.1 : 0.1) + canvas.getZoom();
            zoom = Math.max(0.1, zoom); //最小为原来的1/10
            zoom = Math.min(3, zoom); //最大是原来的3倍
            var zoomPoint = new fabric.Point(event.pageX, event.pageY);
            canvas.zoomToPoint(zoomPoint, zoom);
        });

// 渲染canvas
        canvas.renderAll();


    },[])

    return <canvas id={'canvas'} />;
}
export default memo(Fabric);
