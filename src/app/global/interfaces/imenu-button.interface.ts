export interface IMenuButton{
    id: number;
    name: string;
    routerLink: string;
    queryParams?: {[name: string]: string}
}