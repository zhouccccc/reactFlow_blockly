import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import style from './nodes.module.less';
import {TaskFlowNodeType} from '../config.js';

const strokeWidth = 1;
const bottomHandleWidth = 18;
const bottomHandleHeight = 18;

const PredecessorTask = (props) => {
  const {onDragStart} = props;

  /**
   *
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const divRef = useRef(null);

  return (<div
      draggable
      ref={divRef}
      className={style.preTask}
      onDragStart={(event) => {
        // 鼠标的坐标
        const {clientX, clientY} = event;
        // 节点在Aside区域的坐标
        const {x, y} = divRef.current.getBoundingClientRect();
        const offsetX = clientX - x;
        const offsetY = clientY - y;
        onDragStart(event, {
          type: PredecessorTaskNodeType, label: '前置任务', offsetX, offsetY,
        });
      }}
  >
    <span role={'label'}>前置任务</span>
  </div>);
};
export default memo(PredecessorTask);

const PredecessorTaskNode = (nodeEntity) => {
  const {data, selected} = nodeEntity;

  const path1 = `
        ${bottomHandleWidth / 2}, ${strokeWidth / 2}
        ${strokeWidth / 2}, ${bottomHandleHeight / 1.5}
        ${bottomHandleWidth - strokeWidth / 2}, ${bottomHandleHeight / 1.5}
    `;
  const path2 = `
        ${bottomHandleWidth / 2}, ${bottomHandleHeight / 3}
        ${strokeWidth / 2}, ${bottomHandleHeight - strokeWidth / 2}
        ${bottomHandleWidth - strokeWidth / 2}, ${bottomHandleHeight -
  strokeWidth / 2}
    `;

  return (
      <div className={style.preTask}>
        <Handle type={HandleType.target} position={Position.Bottom}>
          <svg width={bottomHandleWidth} height={bottomHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={path2} strokeWidth={strokeWidth} fill="#ffffff"/>
            <polygon points={path1} strokeWidth={strokeWidth} fill="#ffffff"/>
          </svg>
        </Handle>
        <span role={'label'}>{data.label}</span>
        {selected && (<div role={'border'}></div>)}
      </div>
  );
};

const PredecessorTaskNodeType = TaskFlowNodeType.PREDECESSOR_TASK_NODE;

export {PredecessorTaskNodeType, PredecessorTaskNode};
