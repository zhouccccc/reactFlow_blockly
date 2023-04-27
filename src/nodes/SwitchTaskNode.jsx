import React, {memo, useRef} from 'react';
import style from "./nodes.module.less";
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";
import {Space} from "antd";
import {SwapOutlined} from "@ant-design/icons";
import {TaskFlowNodeType} from "../config.js";

const SwitchTaskDnd = (props) => {
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
            className={style.switchTaskNode}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: SwitchTaskNodeType, label: '切换任务', offsetX, offsetY})
            }}
        >
            <Space>
                <SwapOutlined />
                <span role={'label'}>切换任务</span>
            </Space>
        </div>

    )
}
export default memo(SwitchTaskDnd);

const SwitchTaskNode = (nodeEntity) => {
    const {data,selected} = nodeEntity

    return (
        <div className={style.switchTaskNode}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Space>
                <SwapOutlined />
                <span role={'label'}>{data.label}</span>
            </Space>
            {
                selected && (
                    <div className={ style.selectBorder}></div>
                )
            }
        </div>

    )
}

const SwitchTaskNodeType = TaskFlowNodeType.SWITCH_TASK_NODE

export {SwitchTaskNode, SwitchTaskNodeType}
