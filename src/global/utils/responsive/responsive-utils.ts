import { ResponsiveSizes } from "./responsive-sizes.interface";

export class ResponsiveUtils{
  static readonly DEFAULT_FORM_LABEL_SIZES: ResponsiveSizes = { nzSm: 7, nzXs: 24}
  static readonly DEFALUT_FORM_CONTROL_SIZES: ResponsiveSizes = { nzSm: 15, nzXs: 24}
  static readonly DEFAUT_FORM_SIZES: ResponsiveSizes = { nzXXl: 12, nzXl:14, nzLg: 16, nzMd: 18, nzSm: 20 }
  static readonly DEFAULT_FORM_ACTIONS_SIZES: ResponsiveSizes = { nzSm: 22, nzXs: 24 };
}