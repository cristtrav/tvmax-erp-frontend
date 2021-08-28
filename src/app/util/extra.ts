export class Extra {
    public static dateToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}`;
        return strF;
    }

    public static buildSortString(sort: {key: string, value: any}[]): string | null{
        for(let s of sort){
            if(s.value === 'ascend') return `+${s.key}`;
            if(s.value === 'descend') return `-${s.key}`;
        }
        return null;
    }
}