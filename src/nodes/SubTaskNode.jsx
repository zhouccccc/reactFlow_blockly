import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import style from './nodes.module.less';
import {HandleConnectStrict, TaskFlowNodeType} from '../config.js';

const strokeWidth = 1;
const topHandleWidth = 18;
const topHandleHeight = 18;

const bottomHandleWidth = 16;
const bottomHandleHeight = 12;

const leftHandleSize = 16;

const SubTaskDnd = (props) => {
  const {onDragStart} = props;

  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const divRef = useRef(null);

  return (
      <div
          draggable
          ref={divRef}
          className={style.subTaskNode}
          onDragStart={(event) => {
            // 鼠标的坐标
            const {clientX, clientY} = event;
            // 节点在Aside区域的坐标
            const {x, y} = divRef.current.getBoundingClientRect();
            const offsetX = clientX - x;
            const offsetY = clientY - y;
            onDragStart(event,
                {type: SubTaskNodeType, label: '子任务', offsetX, offsetY});
          }}
      >
        <span role={'label'}>子任务</span>
      </div>
  );
};

export default memo(SubTaskDnd);

const SubTaskNode = (nodeEntity) => {
  const {data, selected} = nodeEntity;

  const path1 = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${topHandleWidth / 2}, ${topHandleHeight / 1.5}
        ${topHandleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;
  const path2 = `
        ${strokeWidth / 2}, ${topHandleHeight / 3}
        ${topHandleWidth - strokeWidth / 2}, ${topHandleHeight / 3}
        ${topHandleWidth / 2}, ${topHandleHeight - strokeWidth / 2}
    `;

  const bottomPath = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${bottomHandleWidth / 2}, ${bottomHandleHeight - strokeWidth / 2}
        ${bottomHandleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;

  return (
      <div className={style.subTaskNode}>
        <Handle id={'top_in'} type={HandleType.target} position={Position.Top}>
          <svg width={topHandleWidth} height={topHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={path1} strokeWidth={strokeWidth} fill="#ffffff"/>
            <polygon points={path2} strokeWidth={strokeWidth} fill="#ffffff"/>
          </svg>
        </Handle>

        <Handle id={'bottom_out'} type={HandleType.source}
                position={Position.Bottom}>
          <svg width={bottomHandleWidth} height={bottomHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={bottomPath} strokeWidth={strokeWidth}
                     fill="#ffffff"/>
          </svg>
        </Handle>

        {/* tips: 这个节点必须连接前置条件的底部Handle */}
        <Handle
            id={`@${HandleConnectStrict.TO_PRE_CONDITION_BOTTOM}`}
            type={HandleType.source}
            position={Position.Left}
        >
          <svg width={leftHandleSize} height={leftHandleSize}
               xmlns="http://www.w3.org/2000/svg">
            <rect x={strokeWidth / 2} y={strokeWidth / 2}
                  width={leftHandleSize - strokeWidth}
                  height={leftHandleSize - strokeWidth}/>
          </svg>
        </Handle>

        <span role={'label'}>{data.label}</span>
        {selected && (<div role={'border'}></div>)}
      </div>
  );
};

const SubTaskNodeType = TaskFlowNodeType.SUB_TASK_NODE;

export {SubTaskNode, SubTaskNodeType};
