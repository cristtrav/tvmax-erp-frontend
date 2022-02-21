export class Extra {
    public static dateToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}`;
        return strF;
    }

    public static dateTimeToString(d: Date): string {
        const dia = `${d.getDate()}`.padStart(2, '0');
        const mes = `${d.getMonth() + 1}`.padStart(2, '0');
        const hora = `${d.getHours()}`.padStart(2, '0') ;
        const minuto = `${d.getMinutes()}`.padStart(2, '0');
        const segundo = `${d.getSeconds()}`.padStart(2, '0');
        const strF: string = `${d.getFullYear()}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
        return strF;
    }

    public static dateStrToDate(dateStr: string): Date{
        return new Date(+dateStr.split('-')[0], (+dateStr.split('-')[1])-1, +dateStr.split('-')[2]);
    }

    public static buildSortString(sort: { key: string, value: any }[] | { [field: string]: string }): string | null {
        if (Array.isArray(sort)) {
            for (let s of sort) {
                if (s.value === 'ascend') return `+${s.key}`;
                if (s.value === 'descend') return `-${s.key}`;
            }
            return null;
        } else {
            for (let k of Object.keys(sort)) {
                if (sort[k] === 'ascend') return `+${k}`;
                if (sort[k] === 'descend') return `-${k}`;
            }
            return null;
        }
    }

    public static toSortOrder(srtQuery: string | null): string | null {
        if (srtQuery?.charAt(0) === '+') return 'ascend';
        if (srtQuery?.charAt(0) === '-') return 'descend';
        return null;
    }


    static formatterNroFactura = (value: number): string => `${value ? value.toString().padStart(7, '0') : ''}`;
    static parserNroFactura = (value: string): string => `${value ? Number(value) : ''}`;

    public static agregarCssImpresion(targetWindow: Window): void {
        // Copy styles from parent window
        document.querySelectorAll("style").forEach(htmlElement => {
            targetWindow.document.head.appendChild(htmlElement.cloneNode(true));
        });
        // Copy stylesheet link from parent window
        const styleSheetElement = this._getStyleSheetElement();
        targetWindow.document.head.appendChild(styleSheetElement);
    }

    private static _getStyleSheetElement() {
        const styleSheetElement = document.createElement("link");
        document.querySelectorAll("link").forEach(htmlElement => {
            if (htmlElement.rel === "stylesheet") {
                const absoluteUrl = new URL(htmlElement.href).href;
                styleSheetElement.rel = "stylesheet";
                styleSheetElement.type = "text/css";
                styleSheetElement.href = absoluteUrl;
            }
        });
        console.log(styleSheetElement.sheet);
        return styleSheetElement;
    }
}