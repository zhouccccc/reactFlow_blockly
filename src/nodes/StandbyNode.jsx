import React, {memo, useRef} from 'react';
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";
import style from "./nodes.module.less";
import {HourglassOutlined} from "@ant-design/icons";
import {Space} from "antd";
import {TaskFlowNodeType} from "../config.js";

const StandbyDnd = (props) => {
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
            className={style.standbyNode}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: StandByNodeType, label: '车辆待命', offsetX, offsetY})
            }}
        >
            <Space>
                <HourglassOutlined />
                <span role={'label'}>车辆待命</span>
            </Space>
        </div>

    )
}
export default memo(StandbyDnd);

const StandbyNode = (nodeEntity) => {
    const {data,selected} = nodeEntity

    return (
        <div className={style.standbyNode}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Space>
                <HourglassOutlined />
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

const StandByNodeType = TaskFlowNodeType.STANDBY_NODE;

export {StandbyNode, StandByNodeType}
