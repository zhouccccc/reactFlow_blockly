export const TaskFlowNodeType = {
    START_NODE: 'startNode',
    STANDBY_NODE: 'standByNode',
    CONDITION_NODE: 'conditionNode',
    FINISH_NODE: 'finishNode',
    NOTIFICATION_NODE: 'notificationNode',
    SWITCH_TASK_NODE: 'switchTaskNode',
    SUB_TASK_NODE: 'subTaskNode',
    UPDATE_VARIABLES_NODE: 'updateVariablesNode',
    PREDECESSOR_TASK_NODE: 'predecessorTaskNode', // 前置任务
    PREREQUISITE_NODE:'prerequisiteNode', // 前置条件
    ORDER_OPTIMIZER_NODE: 'orderOptimizerNode',
}
