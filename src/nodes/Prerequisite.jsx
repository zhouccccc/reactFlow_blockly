import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import {TaskFlowNodeType} from '../config.js';
import style from './nodes.module.less';

const width = 125;
const height = 70;

const strokeWidth = 1;
const bottomHandleWidth = 18;
const bottomHandleHeight = 18;

const topHandleWidth = 16;
const topHandleHeight = 12;

const svgPath = `M 0 ${(height) / 2} L ${(width) /
2} ${height} L${width} ${(height) / 2} L ${(width) / 2} 0 Z`;

const PrerequisiteDnd = (props) => {
  const {onDragStart} = props;

  /**
   *
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const divRef = useRef(null);

  return (<div
      draggable
      ref={divRef}
      onDragStart={(event) => {
        // 鼠标的坐标
        const {clientX, clientY} = event;
        // 节点在Aside区域的坐标
        const {x, y} = divRef.current.getBoundingClientRect();
        const offsetX = clientX - x;
        const offsetY = clientY - y;
        onDragStart(event,
            {type: PrerequisiteNodeType, label: '前置条件', offsetX, offsetY});
      }}
  >
    <div className={style.prerequisite}>
      <svg width={width} height={height}
           viewBox={`-2 -2 ${width + 4} ${height + 4}`}>
        <path d={svgPath} strokeWidth="2"/>
      </svg>
      <div className={style.prerequisiteLabel}>前置条件</div>
    </div>
  </div>);
};
export default memo(PrerequisiteDnd);

const PrerequisiteNode = (nodeEntity) => {
  const {data, selected} = nodeEntity;

  const path1 = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${bottomHandleWidth / 2}, ${bottomHandleHeight / 1.5}
        ${bottomHandleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;
  const path2 = `
        ${strokeWidth / 2}, ${bottomHandleHeight / 3}
        ${bottomHandleWidth - strokeWidth / 2}, ${bottomHandleHeight / 3}
        ${bottomHandleWidth / 2}, ${bottomHandleHeight - strokeWidth / 2}
    `;

  const topPath = `
        ${strokeWidth / 2}, ${strokeWidth / 2}
        ${topHandleWidth / 2}, ${topHandleHeight - strokeWidth / 2}
        ${topHandleWidth - strokeWidth / 2}, ${strokeWidth / 2}
    `;

  return (
      <div className={style.prerequisiteNode}>
        <Handle id={'top_out'} type={HandleType.source} position={Position.Top}>
          <svg width={topHandleWidth} height={topHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={topPath} strokeWidth={strokeWidth}/>
          </svg>
        </Handle>

        {/* tips: 这个节点必须连接前置任务。 此时id的命名规则是: `@[节点类型]` */}
        <Handle
            id={`@${TaskFlowNodeType.PREDECESSOR_TASK_NODE}`}
            type={HandleType.source}
            position={Position.Left}
        >
          <svg width={topHandleWidth} height={topHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={topPath} strokeWidth={strokeWidth}/>
          </svg>
        </Handle>

        <Handle id={'bottom_in'} type={HandleType.target}
                position={Position.Bottom}>
          <svg width={bottomHandleWidth} height={bottomHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={path1} strokeWidth={strokeWidth}/>
            <polygon points={path2} strokeWidth={strokeWidth}/>
          </svg>
        </Handle>


        <div className={style.prerequisite}>
          <svg width={width} height={height}
               viewBox={`-2 -2 ${width + 4} ${height + 4}`}>
            <path d={svgPath} strokeWidth={strokeWidth}/>
          </svg>
          <span className={style.prerequisiteLabel}>{data.label}</span>
          {selected && (<div role={'border'}/>)}
        </div>
      </div>
  );
};

const PrerequisiteNodeType = TaskFlowNodeType.PREREQUISITE_NODE;

export {PrerequisiteNodeType, PrerequisiteNode};
