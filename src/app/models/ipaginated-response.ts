export interface IPaginatedResponse<T> {
    total: number;
    pages: number;
    data: T[];
}
