import React, {memo, useRef} from 'react';
import {Handle, Position} from 'reactflow';
import {HandleType} from '../nodeTypes.js';
import style from './nodes.module.less';
import {TaskFlowNodeType} from '../config.js';

const strokeWidth = 1;
const topHandleWidth = 18;
const topHandleHeight = 18;

const bottomHandleWidth = 16;
const bottomHandleHeight = 12;

const NotificationDnd = (props) => {
  const {onDragStart} = props;

  /**
   *
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const divRef = useRef(null);

  return (
      <div
          draggable
          ref={divRef}
          className={style.notification}
          onDragStart={(event) => {
            // 鼠标的坐标
            const {clientX, clientY} = event;
            // 节点在Aside区域的坐标
            const {x, y} = divRef.current.getBoundingClientRect();
            const offsetX = clientX - x;
            const offsetY = clientY - y;
            onDragStart(event, {
              type: NotificationNodeType,
              label: '通知事件',
              offsetX,
              offsetY,
            });
          }}
      >
        <span role={'label'}>通知事件</span>
      </div>

  );
};
export default memo(NotificationDnd);

const NotificationNode = (nodeEntity) => {
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
      <div className={style.notification}>
        <Handle id={'top_in'} type={HandleType.target} position={Position.Top}>
          <svg width={topHandleWidth} height={topHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={path1} strokeWidth={strokeWidth} fill="#ffffff"/>
            <polygon points={path2} strokeWidth={strokeWidth} fill="#ffffff"/>
          </svg>
        </Handle>

        <Handle id={'bottom_out'} type={HandleType.source} position={Position.Bottom}>
          <svg width={bottomHandleWidth} height={bottomHandleHeight}
               xmlns="http://www.w3.org/2000/svg">
            <polygon points={bottomPath} strokeWidth={strokeWidth}
                     fill="#ffffff"/>
          </svg>
        </Handle>

        <span role={'label'}>{data.label}</span>
        {
            selected && (
                <div role={'border'}/>
            )
        }
      </div>
  );
};

const NotificationNodeType = TaskFlowNodeType.NOTIFICATION_NODE;
export {NotificationNode, NotificationNodeType};
