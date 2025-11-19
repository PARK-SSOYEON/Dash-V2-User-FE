export interface Group {
    groupId: number;
    groupName: string;
}

export interface GroupListResponse {
    items: Group[];
    total: number;
    page: number;
    size: number;
    pages: number;
}
