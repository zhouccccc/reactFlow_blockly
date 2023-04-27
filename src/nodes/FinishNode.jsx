import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from "../nodeTypes.js";
import style from "./nodes.module.less";
import {TaskFlowNodeType} from "../config.js";


const FinishDnd = (props) => {
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
            className={style.baseRectStyle}
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: FinishNodeType, label: '结束', offsetX, offsetY})
            }}
        >
            <span role={'label'}>结束</span>
        </div>
    )
}
export default memo(FinishDnd);

const FinishNode = (nodeEntity) => {
    const {data,selected} = nodeEntity

    return (
        <div className={style.baseRectStyle}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <span role={'label'}>{data.label}</span>

            {
                selected && (
                    <div className={ style.selectBorder}></div>
                )
            }
        </div>
    )
}


const FinishNodeType = TaskFlowNodeType.FINISH_NODE

export {FinishNode, FinishNodeType}
