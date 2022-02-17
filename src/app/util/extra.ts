export class Extra {
    public static dateToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}`;
        return strF;
    }

    public static buildSortString(sort: { key: string, value: any }[] | { [field: string]: string }): string | null {
        if (Array.isArray(sort)) {
            for (let s of sort) {
                if (s.value === 'ascend') return `+${s.key}`;
                if (s.value === 'descend') return `-${s.key}`;
            }
            return null;
        }else{
            for(let k of Object.keys(sort)){
                if(sort[k] === 'ascend') return `+${k}`;
                if(sort[k] === 'descend') return `-${k}`;
            }
            return null;
        }
    }

    public static toSortOrder(srtQuery: string | null): string | null {
        if(srtQuery?.charAt(0) === '+') return 'ascend';
        if(srtQuery?.charAt(0) === '-') return 'descend';
        return null;
    }


    static formatterNroFactura = (value: number): string => `${value ? value.toString().padStart(7, '0') : ''}`;
    static parserNroFactura = (value: string): string => `${value ? Number(value) : ''}`;
}