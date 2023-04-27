import React, {memo, useRef} from 'react';
import {Handle, Position} from "reactflow";
import {HandleType} from "../nodeTypes.js";
import {TaskFlowNodeType} from "../config.js";
import style from './nodes.module.less'

const width = 125;
const height = 70;
const padding = 0

const ConditionDnd = (props) => {
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
            onDragStart={(event) => {
                // 鼠标的坐标
                const {clientX, clientY} = event;
                // 节点在Aside区域的坐标
                const {x, y} = divRef.current.getBoundingClientRect();
                const offsetX = clientX - x;
                const offsetY = clientY - y;
                onDragStart(event, {type: ConditionNodeType, label: '条件判断', offsetX, offsetY})
            }}
        >
            <div className={style.condition}>
                <svg width={width} height={height}>
                    <path
                        d={`M 0 ${(height - padding * 2) / 2} L ${(width - padding * 2) / 2} ${height - padding * 2} L${width - padding * 2} ${(height - padding * 2) / 2} L ${(width - padding * 2) / 2} 0 Z`}
                        fill={'transparent'} stroke="#777777" strokeWidth="2"/>
                </svg>
                <div className={style.conditionLabel}>
                    条件判断
                </div>
            </div>
        </div>
    )
}
export default memo(ConditionDnd);

const ConditionNode = (nodeEntity) => {
    const {data, selected} = nodeEntity

    return (
        <div className={style.conditionContainer}>
            <Handle type={HandleType.target} position={Position.Top}/>
            <Handle id={'bottom'} type={HandleType.source} position={Position.Bottom}/>
            <Handle id={'right'} type={HandleType.source} position={Position.Right}/>

            <div className={style.condition}>
                <svg width={width} height={height}
                     xmlns="http://www.w3.org/2000/svg">
                    viewBox={`${padding} ${padding} ${width - padding * 2} ${height - padding * 2}`} fill="none"
                    <path
                        d={`M 0 ${(height - padding * 2) / 2} L ${(width - padding * 2) / 2} ${height - padding * 2} L${width - padding * 2} ${(height - padding * 2) / 2} L ${(width - padding * 2) / 2} 0 Z`}
                        fill={'transparent'} stroke="#777777" strokeWidth="2"/>
                </svg>
                <span className={style.conditionLabel}>{data.label}</span>
                {
                    selected && (
                        <div className={style.selectBorder}></div>
                    )
                }
            </div>
        </div>
    )
}

const ConditionNodeType = TaskFlowNodeType.CONDITION_NODE;

export {ConditionNode, ConditionNodeType}
