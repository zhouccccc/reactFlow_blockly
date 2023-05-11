import React from 'react';
import {getSmoothStepPath, useReactFlow} from 'reactflow';
import styles from './app.module.less'

import './index.css';
import {DeleteOutlined} from "@ant-design/icons";
import {Button} from "antd";

const foreignObjectSize = 40;



export default function ButtonEdge(edgeEntity) {

    const reactFlowInstance = useReactFlow();

    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {},
    }=edgeEntity;

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    function remove() {
        // 删除功能是异步的，WTF!!!!
        reactFlowInstance.deleteElements({
            edges:[edgeEntity]
        })

        // 点击删除按钮时候必定会触发onEdgeMouseEnter事件，导致其他线条变浅色。所以这里要恢复其他线条的样式
        setTimeout(()=>{
            reactFlowInstance.setEdges((eds) => {
                return eds.map(item => {
                    item.style = {...item.style, strokeOpacity: 1,}
                    return item
                })
            })
        },10)
    }

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
            />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={labelX - foreignObjectSize / 2}
                y={labelY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <div className={styles.edgeButtonContainer} onClick={remove}>
                    <Button type={'primary'} shape="circle" size="small" icon={<DeleteOutlined />} />
                </div>
            </foreignObject>
        </>
    );
}
