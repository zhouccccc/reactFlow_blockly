import React, {memo, useRef} from 'react';
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";
import style from "./nodes.module.less";
import {Space} from "antd";
import {StarFilled} from "@ant-design/icons";
import {TaskFlowNodeType} from "../config.js";


const TargetTaskDnd = (props) => {
    const {onDragStart} = props;

    /**
     *
     * @type {React.MutableRefObject<HTMLDivElement>}
     */
    const divRef = useRef(null)

    return (
        <div
            draggable
            ref={divRef}
            className={style.targetTaskNode}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: TargetTaskNodeType, label: '目标任务', offsetX, offsetY})
            }}
        >
            <Space>
                <StarFilled/>
                <span role={'label'}>目标任务</span>
            </Space>
        </div>
    )
}
export default memo(TargetTaskDnd);

const TargetTaskNode = (nodeEntity) => {
    const {data, selected} = nodeEntity

    return (
        <div className={style.targetTaskNode}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Handle type={HandleType.source} position={Position.Bottom}/>
            <Space>
                <StarFilled/>
                <span role={'label'}>{data.label}</span>
            </Space>
            {
                selected && (
                    <div className={style.selectBorder}></div>
                )
            }
        </div>
    )
}

const TargetTaskNodeType = TaskFlowNodeType.TARGET_TASK_NODE

export {TargetTaskNode, TargetTaskNodeType};
