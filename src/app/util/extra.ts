export class Extra {
    public static dateToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}`;
        return strF;
    }
}