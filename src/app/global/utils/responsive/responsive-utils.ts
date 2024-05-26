import { ResponsiveSizes } from "./responsive-sizes.interface";

export class ResponsiveUtils{
  static readonly DEFAULT_FORM_LABEL_SIZES: ResponsiveSizes = { sm: 7, xs: 24} as const;
  static readonly DEFALUT_FORM_CONTROL_SIZES: ResponsiveSizes = { sm: 15, xs: 24} as const;
  static readonly DEFAUT_FORM_SIZES: ResponsiveSizes = { xxl: 12, xl:14, lg: 16, md: 18, sm: 20, xs: 24 } as const;
  static readonly DEFAULT_FORM_ACTIONS_SIZES: ResponsiveSizes = { sm: 22, xs: 24 } as const;
}