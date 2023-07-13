import { IMenuButton } from "./imenu-button.interface";

export interface ISubmenu{
    id: number;
    title: string;
    icon: string;
    isOpened: boolean;
    children: IMenuButton[];
}