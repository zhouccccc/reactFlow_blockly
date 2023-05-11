import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import style from './nodes.module.less';
import {TaskFlowNodeType} from '../config.js';

const strokeWidth = 1;
const topHandleWidth = 18;
const topHandleHeight = 18;

const FinishDnd = (props) => {
  const {onDragStart} = props;

  /**
   *
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const divRef = useRef(null);

  return (<div
      draggable
      ref={divRef}
      className={style.finishTaskNode}
      onDragStart={(event) => {
        // 鼠标的坐标
        const {clientX, clientY} = event;
        // 节点在Aside区域的坐标
        const {x, y} = divRef.current.getBoundingClientRect();
        const offsetX = clientX - x;
        const offsetY = clientY - y;
        onDragStart(event,
            {type: FinishNodeType, label: '结束', offsetX, offsetY});
      }}
  >
    <span role={'label'}>结束</span>
  </div>);
};
export default memo(FinishDnd);

const FinishNode = (nodeEntity) => {
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

  return (
      <div className={style.finishTaskNode}>
        <Handle type={HandleType.target} position={Position.Top}>
          <svg width={topHandleWidth} height={topHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={path1} strokeWidth={strokeWidth} fill="#ffffff"/>
            <polygon points={path2} strokeWidth={strokeWidth} fill="#ffffff"/>
          </svg>
        </Handle>

        <span role={'label'}>{data.label}</span>
        {selected && (<div role={'border'}/>)}
      </div>
  );
};

const FinishNodeType = TaskFlowNodeType.FINISH_NODE;

export {FinishNode, FinishNodeType};
