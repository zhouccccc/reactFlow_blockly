import React, {memo, useEffect, useRef} from 'react';
import style from "./nodes.module.less";
import {TaskFlowNodeType} from "../config.js";
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";

const strokeWidth = 1;
const topHandleWidth = 18;
const topHandleHeight = 18;

const bottomHandleWidth = 16;
const bottomHandleHeight = 12;

const OrderOptimizerDnd = (props) => {
    const {onDragStart} = props;

    /**
     *
     * @type {React.MutableRefObject<HTMLDivElement>}
     */
    const divRef = useRef(null)

    return (<div
            draggable
            ref={divRef}
            className={style.orderOptimizerNode}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: OrderOptimizerNodeType, label: '顺序优化', offsetX, offsetY})
            }}
        >
            <span role={'label'}>顺序优化</span>
        </div>

    )
}
export default memo(OrderOptimizerDnd);

const OrderOptimizerNode = (nodeEntity) => {
    const {data, selected} = nodeEntity

    const topPath1 = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${topHandleWidth / 2}, ${topHandleHeight / 1.5}
        ${topHandleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;
    const topPath2 = `
        ${strokeWidth / 2}, ${topHandleHeight / 3}
        ${topHandleWidth - strokeWidth / 2}, ${topHandleHeight / 3}
        ${topHandleWidth / 2}, ${topHandleHeight - strokeWidth / 2}
    `;

    const bottomPath = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${bottomHandleWidth / 2}, ${bottomHandleHeight - strokeWidth / 2}
        ${bottomHandleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;


    return (<div className={style.orderOptimizerNode}>
        <Handle id={'top_in'} type={HandleType.target} position={Position.Top}>
            <svg width={topHandleWidth} height={topHandleHeight} xmlns="http://www.w3.org/2000/svg">
                <polygon points={topPath1} strokeWidth={strokeWidth} fill="#ffffff"/>
                <polygon points={topPath2} strokeWidth={strokeWidth} fill="#ffffff"/>
            </svg>
        </Handle>

        <Handle id={'right_out'} type={HandleType.source} position={Position.Right}>
            <svg width={topHandleWidth} height={topHandleHeight} xmlns="http://www.w3.org/2000/svg">
                <polygon points={topPath1} strokeWidth={strokeWidth} fill="#ffffff"/>
                <polygon points={topPath2} strokeWidth={strokeWidth} fill="#ffffff"/>
            </svg>
        </Handle>

        <Handle id={'right_in'} type={HandleType.target} position={Position.Right}>
            <svg width={topHandleWidth} height={topHandleHeight} xmlns="http://www.w3.org/2000/svg">
                <polygon points={topPath1} strokeWidth={strokeWidth} />
                <polygon points={topPath2} strokeWidth={strokeWidth} />
            </svg>
        </Handle>

        <Handle id={'bottom_out'} type={HandleType.source} position={Position.Bottom}>
            <svg width={bottomHandleWidth} height={bottomHandleHeight} xmlns="http://www.w3.org/2000/svg">
                <polygon points={bottomPath} strokeWidth={strokeWidth} fill="#ffffff"/>
            </svg>
        </Handle>

        <span role={'label'}>{data.label}</span>
        {selected && (<div role={'border'}/>)}
    </div>)
}

const OrderOptimizerNodeType = TaskFlowNodeType.ORDER_OPTIMIZER_NODE;
export {OrderOptimizerNode, OrderOptimizerNodeType}
