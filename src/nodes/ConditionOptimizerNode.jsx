import React, {memo, useRef} from 'react';
import style from "./nodes.module.less";
import {TaskFlowNodeType} from "../config.js";
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";
import {BranchesOutlined} from "@ant-design/icons";
import {Space} from "antd";

const ConditionOptimizerDnd = (props) => {
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
            className={style.conditionOptimizerNode}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: ConditionOptimizerNodeType, label: '条件优化', offsetX, offsetY})
            }}
        >
            <Space>
                <BranchesOutlined />
                <span role={'label'}>条件优化</span>
            </Space>
        </div>

    )
}
export default memo(ConditionOptimizerDnd);

const ConditionOptimizerNode = (nodeEntity) => {
    const {data,selected} = nodeEntity

    return (
        <div className={style.conditionOptimizerNode}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Handle type={HandleType.source} position={Position.Bottom}/>

            <Space>
                <BranchesOutlined />
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

const ConditionOptimizerNodeType = TaskFlowNodeType.CONDITION_OPTIMIZER_NODE;
export {ConditionOptimizerNode, ConditionOptimizerNodeType}
