export interface GroupByLevel {
    [level: string]: number
}

export interface ITasksCountEntity {
    byLevel: GroupByLevel
}