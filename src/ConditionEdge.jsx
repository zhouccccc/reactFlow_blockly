import React from 'react';
import {EdgeLabelRenderer, getSmoothStepPath, useReactFlow} from 'reactflow';
import styles from './app.module.less'
import {LinkOutlined} from "@ant-design/icons";
import {Button, Divider, Dropdown, Space} from "antd";

const foreignObjectSize = 40;

const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    alert(`remove ${id}`);
};

const dropDownMenus = [
    {key: 'true', label: '是'},
    {key: 'false', label: '否'},
]

export default function ConditionEdge(edgeEntity) {

    const reactFlowInstance = useReactFlow();

    const {
        id,
        source,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {},
        data,
    } = edgeEntity;

    const [edgePath, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    function remove() {
        reactFlowInstance.deleteElements({
            edges: [edgeEntity]
        })
    }

    function onMenuClick({key}) {
        const edges = reactFlowInstance.getEdges();
        const newEdges = edges.map(edge => {
            // 条件节点分支，只要一个分支确定，另外一条也会确定
            if (edge.id === id) {
                edge.data = {...edge.data, condition: key}
            }
            if (edge.id !== id && edge.source === source) {
                edge.data = {...edge.data, condition: `${!JSON.parse(key)}`}
            }
            return edge
        })
        reactFlowInstance.setEdges(newEdges)
    }

    function getEdgeLabelTransform() {
        // 横向
        if (offsetX >= offsetY) {
            return `translate(${sourceX + 10}px, calc(${sourceY}px - 50%))`
        }
        // 纵向
        return `translate(calc(${sourceX}px - 50%), ${sourceY + 10}px)`
    }


    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
            />

            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={labelX - foreignObjectSize / 2}
                y={labelY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <div className={styles.conditionButtonContainer}>
                    <Dropdown
                        trigger={['hover']}
                        menu={{items: dropDownMenus, onClick: onMenuClick}}
                        dropdownRender={(menu) => (
                            <div className={styles.conditionDropdownContent}>
                                {menu}
                                <Divider style={{margin: 0}}/>
                                <Space style={{padding: 8}}>
                                    <Button danger type="primary" size={'small'} onClick={remove}>删除</Button>
                                </Space>
                            </div>
                        )}
                    >
                        <Button type={'primary'} shape="circle" size="small" icon={<LinkOutlined/>}/>
                    </Dropdown>
                </div>
            </foreignObject>

            <EdgeLabelRenderer>
                {data.condition && (
                    <EdgeLabel label={data.condition} transform={getEdgeLabelTransform()}/>
                )}
            </EdgeLabelRenderer>
        </>
    );
}

// this is a little helper component to render the actual edge label
function EdgeLabel({transform, label}) {
    return (
        <div style={{transform,}} className={styles.conditionLabelStyle}>
            {label}
        </div>
    );
}