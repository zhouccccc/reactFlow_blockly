import React, {memo, useRef} from 'react';
import style from "./nodes.module.less";
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";
import {Space} from "antd";
import {CloseCircleFilled, CodeFilled, DeleteFilled} from "@ant-design/icons";
import {TaskFlowNodeType} from "../config.js";

const UpdateVariablesDnd = (props) => {
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
            className={style.updateVariablesNode}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: UpdateVariablesNodeType, label: '更改变量', offsetX, offsetY})
            }}
        >
            <Space>
                <CodeFilled />
                <span role={'label'}>更改变量</span>
            </Space>
        </div>

    )
}
export default memo(UpdateVariablesDnd);

const UpdateVariablesNode = (nodeEntity) => {
    const {data,selected} = nodeEntity


    return (
        <div className={style.updateVariablesNode}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Handle type={HandleType.source} position={Position.Bottom}/>

            <Space>
                <CodeFilled />
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

const UpdateVariablesNodeType = TaskFlowNodeType.UPDATE_VARIABLES_NODE

export {UpdateVariablesNode, UpdateVariablesNodeType}
