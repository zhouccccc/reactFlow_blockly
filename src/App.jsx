import React, {useCallback, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    ReactFlowProvider,
    updateEdge,
    useEdgesState,
    useNodesState,
} from 'reactflow';
import StartNode, {StartNodeType} from "./nodes/StartNode.jsx";
import FinishDnd, {FinishNode, FinishNodeType} from "./nodes/FinishNode.jsx";
import ConditionDnd, {ConditionNode, ConditionNodeType} from "./nodes/ConditionNode.jsx";
import NotificationDnd, {NotificationNode, NotificationNodeType} from "./nodes/NotificationNode.jsx";
import ConditionOptimizerDnd, {
    ConditionOptimizerNode,
    ConditionOptimizerNodeType
} from "./nodes/ConditionOptimizerNode.jsx";
import UpdateVariablesDnd, {UpdateVariablesNode, UpdateVariablesNodeType} from "./nodes/UpdateVariablesNode.jsx";
import SwitchTaskDnd, {SwitchTaskNode, SwitchTaskNodeType} from "./nodes/SwitchTaskNode.jsx";
import TargetTaskDnd, {TargetTaskNode, TargetTaskNodeType} from "./nodes/TargetTaskNode.jsx";
import StandbyDnd, {StandbyNode, StandByNodeType} from "./nodes/StandbyNode.jsx";
import ButtonEdge from "./ButtonEdge.jsx";

import style from './app.module.less';
import 'reactflow/dist/style.css';
import {getRandomString, isNull} from "./utils.js";
import {Button, Drawer, Form, Input} from "antd";
import ConditionEdge from "./ConditionEdge.jsx";
import {TaskFlowNodeType} from "./config.js";
import {cloneDeep, find} from "lodash";
import {useKeyPress} from "ahooks";


const nodeTypes = {
    [StartNodeType]: StartNode,
    [TargetTaskNodeType]: TargetTaskNode,
    [ConditionNodeType]: ConditionNode,
    [ConditionOptimizerNodeType]: ConditionOptimizerNode,
    [StandByNodeType]: StandbyNode,
    [NotificationNodeType]: NotificationNode,
    [UpdateVariablesNodeType]: UpdateVariablesNode,
    [SwitchTaskNodeType]: SwitchTaskNode,
    [FinishNodeType]: FinishNode,
};

const edgeTypes = {
    buttonEdge: ButtonEdge,
    conditionEdge: ConditionEdge
}

const defaultEdgeOptions = {
    animated: true,
    type: 'buttonEdge',
    interactionWidth: 80,
    style: {
        stroke: '#747474',
        strokeWidth: '2px'
    }
}

const proOptions = {hideAttribution: true};

const initialNodes = [
    {
        id: `${getRandomString(4)}_${TaskFlowNodeType.START_NODE}`,
        type: StartNodeType,
        position: {x: 0, y: 0},
        data: {label: '开始', deletable: false}
    },
];

const nodeFormValues = new Map();

const App = () => {
    const [form] = Form.useForm();
    const edgeUpdateSuccessful = useRef(true);

    /**
     * ReactFlow容器对象
     * @type {React.MutableRefObject<HTMLDivElement>}
     */
    const reactFlowWrapper = useRef(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [reactFlowInstance, setReactFlowInstance,] = useState(null);
    const [nodeSelection, setNodeSelection] = useState(null); // Node Id

    // 快捷复制
    useKeyPress(['ctrl.v'], quickCopy)
    useKeyPress(['meta.v'], quickCopy)

    function quickCopy() {
        if (nodeSelection) {
            const nodeEntity = reactFlowInstance.getNode(nodeSelection)
            if (![TaskFlowNodeType.START_NODE, TaskFlowNodeType.FINISH_NODE].includes(nodeEntity.type)) {
                const newNode = cloneDeep(nodeEntity);
                const {type, position, positionAbsolute} = newNode;
                newNode.id = `${getRandomString(4)}_${type}`;
                newNode.selected = false;
                newNode.position = {x: position.x + 100, y: position.y + 50};
                newNode.positionAbsolute = {x: positionAbsolute.x + 100, y: positionAbsolute.y + 50};
                setNodes((nds) => nds.concat(newNode));
            }
        }
    }

    function onInit(instance) {
        window.ReacFlowInstance = instance
        setReactFlowInstance(instance);

        // 初始化布局
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        instance.setViewport({x: reactFlowBounds.width / 2, y: 100, zoom: 1.1}, {duration: 800})
    }

    /************************ 生成Edge *********************************/
    const onConnect = useCallback((params) => {
        setEdges((eds) => {
            params.data = {};

            // 针对起点是"开始"的情况，开始的出线只能有一条
            if (params.source.endsWith(TaskFlowNodeType.START_NODE)) {
                // 此时看下条件节点两个出口是否已经存在，存在的话
                const anotherBranch = find(eds, {source: params.source});
                if (anotherBranch) {
                    return eds
                }
            }


            // 针对起点是"条件优化"的情况，终点必须是"条件判断"
            if (
                params.source.endsWith(TaskFlowNodeType.CONDITION_OPTIMIZER_NODE) &&
                !params.target.endsWith(TaskFlowNodeType.CONDITION_NODE)
            ) {
                return eds
            }

            // 针对起点是"条件判断"的情况
            if (params.source.endsWith(TaskFlowNodeType.CONDITION_NODE)) {
                params.type = 'conditionEdge';

                // 此时看下条件节点两个出口是否已经存在，存在的话
                const anotherBranch = find(eds, {source: params.source});
                if (anotherBranch && !isNull(anotherBranch.data.condition)) {
                    params.data.condition = `${!JSON.parse(anotherBranch.data.condition)}`
                }
            }

            return addEdge({...params}, eds)
        })
    }, []);


    /************************ Node操作 *********************************/
    function onDragStart(event, payload) {
        event.dataTransfer.setData('application/reactflow', payload.type);
        event.dataTransfer.setData('label', payload.label);
        event.dataTransfer.setData('offsetX', payload.offsetX);
        event.dataTransfer.setData('offsetY', payload.offsetY);
        event.dataTransfer.effectAllowed = 'move';
    }

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('label');
            const offsetX = event.dataTransfer.getData('offsetX');
            const offsetY = event.dataTransfer.getData('offsetY');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                console.log(`iRMS: type[${type}] lose`)
                return;
            }

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            // 获取当前Stage的ZOOM
            const zoom = reactFlowInstance.getZoom();
            position.x = position.x - offsetX * zoom;
            position.y = position.y - offsetY * zoom;

            // 根据参数新建Node节点
            const newNode = {
                id: `${getRandomString(4)}_${type}`,
                type,
                position,
                data: {label, deletable: true},
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    const onNodesDelete = useCallback(([node]) => {
        if (node.type === TaskFlowNodeType.START_NODE) {
            setNodes((nds) => nds.concat(node));
        } else {
            nodeFormValues.delete(node.id);
        }
    }, []);
    /***************************** & ******************************************/



    /************************ 删除Node时候顺便删除Edges *********************************/
    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeUpdateSuccessful.current = true;
    }, []);
    /***************************** & ******************************************/


    /************************* Edge悬浮高亮 **********************************/
    const onEdgeMouseEnter = useCallback((evt, edge) => {
        setEdges((eds) => {
            return eds.map(item => {
                if (item.id === edge.id) {
                    item.style = {...item.style, stroke: "#ed1c24", strokeWidth: '3px',}
                } else {
                    item.style = {...item.style, strokeOpacity: 0.15,}
                }
                return item
            })
        })
    }, [])

    const onEdgeMouseLeave = useCallback((evt, edge) => {
        setEdges((eds) => {
            return eds.map(item => {
                if (item.id === edge.id) {
                    item.style = {...item.style, stroke: "#747474", strokeWidth: '2px'}
                } else {
                    item.style = {...item.style, strokeOpacity: 1,}
                }
                return item
            })
        })
    }, [])
    /***************************** & ******************************************/


    /**
     * 选择项发生改变后触发
     * @param params {{nodes:[], edges:[]}}
     */
    const onSelectionChange = useCallback((params) => {
        const nodeEntity = params.nodes[0];
        if (nodeEntity) {
            const cacheValues = nodeFormValues.get(nodeEntity.id);
            if (cacheValues) {
                form.setFieldsValue(cacheValues)
            } else {
                form.setFieldsValue({label: nodeEntity.data.label})
            }
        }
        setNodeSelection(params.nodes[0]?.id);
    }, [])

    /*************************** 修改Node节点 ***********************************/
    const editConfirm = useCallback(function () {
        form.validateFields().then(formValue => {
            const {label} = formValue
            setNodes((eds) => {
                return eds.map(nodeItem => {
                    if (nodeItem.id === nodeSelection) {
                        nodeItem.data = {...nodeItem.data, label}
                    }
                    return nodeItem
                })
            })
            nodeFormValues.set(nodeSelection, formValue)
        })
    }, [nodeSelection])

    /*************************** 删除Node节点 ***********************************/
    function deleteNode() {
        const nodeEntity = reactFlowInstance.getNode(nodeSelection)
        reactFlowInstance.deleteElements({
            nodes: [nodeEntity]
        })
    }

    function showDeleteBtn() {
        if(nodeSelection){
            const nodeEntity = reactFlowInstance.getNode(nodeSelection);
            return !!nodeEntity.data.deletable
        }
        return false
    }

    return (
        <div className={style.app}>
            <ReactFlowProvider>
                <div className={style.left}>
                    <TargetTaskDnd onDragStart={onDragStart}/>
                    <NotificationDnd onDragStart={onDragStart}/>
                    <UpdateVariablesDnd onDragStart={onDragStart}/>
                    <SwitchTaskDnd onDragStart={onDragStart}/>
                    <StandbyDnd onDragStart={onDragStart}/>
                    <ConditionOptimizerDnd onDragStart={onDragStart}/>
                    <ConditionDnd onDragStart={onDragStart}/>
                    <FinishDnd onDragStart={onDragStart}/>
                </div>

                <div className={style.canvas} ref={reactFlowWrapper}>
                    <ReactFlow
                        fitView
                        snapToGrid
                        minZoom={1}
                        snapGrid={[10, 10]}
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onInit={onInit}
                        onConnect={onConnect}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onEdgeUpdate={onEdgeUpdate}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={onEdgeUpdateEnd}
                        onEdgeMouseEnter={onEdgeMouseEnter}
                        onEdgeMouseLeave={onEdgeMouseLeave}
                        onSelectionChange={onSelectionChange}
                        onNodesDelete={onNodesDelete}
                        defaultEdgeOptions={defaultEdgeOptions}
                        proOptions={proOptions}
                        deleteKeyCode={null} // 禁用删除快捷键
                    >
                        <Controls/>
                        <Background/>
                    </ReactFlow>
                </div>
            </ReactFlowProvider>

            <Drawer
                mask={false}
                maskClosable={false}
                closable={false}
                title="节点编辑"
                placement="right"
                open={!!nodeSelection}
            >
                <div style={{textAlign: 'end'}}>
                    {
                        showDeleteBtn() && (
                            <Button danger type={'primary'} onClick={deleteNode}>删除</Button>
                        )
                    }
                    <Button type={'primary'} onClick={editConfirm}>确定</Button>
                </div>
                <Form form={form}>
                    <Form.Item name={'label'} label={'节点名称'}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default App;
