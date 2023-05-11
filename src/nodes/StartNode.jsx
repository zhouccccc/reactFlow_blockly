import React, {memo} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import {TaskFlowNodeType} from '../config.js';
import style from './nodes.module.less';

const radius = 36;
const strokeWidth = 1.5;

const handleWidth = 24;
const handleHeight = 16;

const StartNode = (nodeEntity) => {
  const {data, selected} = nodeEntity;

  const bottomPath = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${handleWidth / 2}, ${handleHeight - strokeWidth / 2}
        ${handleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;

  return (
      <div className={style.startNode}>
        <Handle type={HandleType.source} position={Position.Bottom}>
          <svg width={handleWidth} height={handleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={bottomPath} strokeWidth={strokeWidth}
                     fill="#ffffff"/>
          </svg>
        </Handle>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={radius * 4}
             height={radius * 2}
             viewBox={`0 0 ${radius * 4} ${radius * 2}`}>
          <ellipse
              cx={radius * 2}
              cy={radius}
              rx={radius * 2 - strokeWidth / 2}
              ry={radius - strokeWidth / 2}
              strokeWidth={strokeWidth}
          />
        </svg>

        <div className={style.startLabel}>
          {data.label}
        </div>

        {selected && (<div role={'border'}></div>)}
      </div>
  );
};
export default memo(StartNode);

export const StartNodeType = TaskFlowNodeType.START_NODE;
