import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from "../nodeTypes.js";
import style from "./nodes.module.less";
import {NotificationOutlined, SoundFilled} from "@ant-design/icons";
import {Space} from "antd";
import {TaskFlowNodeType} from "../config.js";

const NotificationDnd = (props) => {
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
            className={style.notification}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: NotificationNodeType, label: '通知事件', offsetX, offsetY})
            }}
        >
            <Space>
                <SoundFilled />
                <span role={'label'}>通知事件</span>
            </Space>
        </div>

    )
}
export default memo(NotificationDnd);

const NotificationNode = (nodeEntity) => {
    const {data, selected} = nodeEntity

    return (
        <div className={style.notification}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Handle type={HandleType.source} position={Position.Bottom}/>
            <Space>
                <SoundFilled />
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

const NotificationNodeType = TaskFlowNodeType.NOTIFICATION_NODE
export {NotificationNode, NotificationNodeType}
