import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import {TaskFlowNodeType} from '../config.js';
import style from './nodes.module.less';

const width = 125;
const height = 70;

const strokeWidth = 1;
const topHandleWidth = 18;
const topHandleHeight = 18;

const bottomHandleWidth = 16;
const bottomHandleHeight = 12;

const ConditionDnd = (props) => {
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
            {type: ConditionNodeType, label: '分支条件', offsetX, offsetY});
      }}
  >
    <div className={style.condition}>
      <svg width={width} height={height}
           viewBox={`-2 -2 ${width + 4} ${height + 4}`}>
        <path
            d={`M 0 ${(height) / 2} L ${(width) /
            2} ${height} L${width} ${(height) / 2} L ${(width) / 2} 0 Z`}
            fill={'#800080'} fillOpacity={0.4} stroke="#800080"
            strokeOpacity={0.4} strokeWidth="2"/>
      </svg>
      <div className={style.conditionLabel}>分支条件</div>
    </div>
  </div>);
};
export default memo(ConditionDnd);

const ConditionNode = (nodeEntity) => {
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

  return (<div className={style.conditionContainer}>
    <Handle id={'top_in'} type={HandleType.target} position={Position.Top}>
      <svg width={topHandleWidth} height={topHandleHeight}
           xmlns="http://www.w3.org/2000/svg">
        <polygon points={path1} strokeWidth={strokeWidth} fill="#ffffff"/>
        <polygon points={path2} strokeWidth={strokeWidth} fill="#ffffff"/>
      </svg>
    </Handle>

    {/* 这里的 bottom_out 不要改！！！！！*/}
    <Handle id={'bottom_out'} type={HandleType.source}
            position={Position.Bottom}>
      <svg width={bottomHandleWidth} height={bottomHandleHeight}
           xmlns="http://www.w3.org/2000/svg">
        <polygon points={bottomPath} strokeWidth={strokeWidth}
                 fill="#ffffff"/>
      </svg>
      <span style={{position: 'absolute', top: 15}}>true</span>
    </Handle>

    {/* tip: 这里的 right_out 不要改！！！！！*/}
    <Handle id={'right_out'} type={HandleType.source}
            position={Position.Right}>
      <svg width={bottomHandleWidth} height={bottomHandleHeight}
           xmlns="http://www.w3.org/2000/svg">
        <polygon points={bottomPath} strokeWidth={strokeWidth}
                 fill="#ffffff"/>
      </svg>
      <span style={{position: 'absolute', top: -15}}>false</span>
    </Handle>

    <div className={style.condition}>
      <svg width={width} height={height}
           viewBox={`-2 -2 ${width + 4} ${height + 4}`}>
        <path
            d={`M 0 ${(height) / 2} L ${(width) /
            2} ${height} L${width} ${(height) / 2} L ${(width) / 2} 0 Z`}
            fill={'#800080'} fillOpacity={0.4} stroke="#800080"
            strokeOpacity={0.4} strokeWidth="2"/>
      </svg>
      <span className={style.conditionLabel}>{data.label}</span>
      {selected && (<div role={'border'}/>)}
    </div>
  </div>);
};

const ConditionNodeType = TaskFlowNodeType.CONDITION_NODE;

export {ConditionNode, ConditionNodeType};
