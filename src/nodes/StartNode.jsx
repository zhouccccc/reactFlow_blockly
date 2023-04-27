import React, {memo} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from "../nodeTypes.js";
import {TaskFlowNodeType} from "../config.js";
import style from "./nodes.module.less";

const radius = 40

const StartNode = (nodeEntity) => {
    const {data, selected} = nodeEntity

    return (
        <div className={style.startNode}>
            <Handle type={HandleType.source} position={Position.Bottom}/>
            <svg width={radius * 2 + 2} height={radius * 2 + 2}>
                <circle
                    r={radius}
                    cx={radius + 1}
                    cy={radius + 1}
                    fill={'transparent'}
                    stroke="#777777"
                    strokeWidth="2"
                />
            </svg>

            <div className={style.startLabel}>
                {data.label}
            </div>
            {
                selected && (
                    <div className={style.selectBorder} style={{
                        transform: 'scale(1.2, 1.2)'
                    }}></div>
                )
            }
        </div>
    )
}
export default memo(StartNode);

export const StartNodeType = TaskFlowNodeType.START_NODE
