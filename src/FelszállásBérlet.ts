import Felszállás from "./Felszállás";
import Segéd from "./Segéd";

export default class FelszállásBérlet extends Felszállás {
    #típus: string;
    #érvényes: Date;

    get ezÉrvényesFelszállás(): boolean {
        return this.#érvényes >= this._idő;
    }

    get ezIngyenes(): boolean {
        return this.ezÉrvényesFelszállás && ["NYP", "RVS", "GYK"].includes(this.#típus);
    }

    get ezKedvezményes(): boolean {
        return this.ezÉrvényesFelszállás && ["TAB", "NYB"].includes(this.#típus);
    }

    get ezLejárHáromNap(): boolean {
        const e1: number = this._idő.getFullYear();
        const h1: number = this._idő.getMonth();
        const n1: number = this._idő.getDate();
        const e2: number = this.#érvényes.getFullYear();
        const h2: number = this.#érvényes.getMonth();
        const n2: number = this.#érvényes.getDate();
        return this.ezÉrvényesFelszállás && Segéd.napokszama(e1, h1, n1, e2, h2, n2) <= 3;
    }

    get ezLejárHáromNapSaját(): boolean {
        const érvényesMs: number = this.#érvényes.valueOf();
        const utazásNapjaMs: number = this._idő.valueOf();
        const diff: number = érvényesMs - utazásNapjaMs;
        return this.ezÉrvényesFelszállás && ~~(diff / (24 * 60 * 60 * 1000)) <= 3;
    }

    constructor(sor: string) {
        // 0 20190326-0700 4170861 NYB 20190404
        super(sor);
        const m: string[] = sor.split(" ");
        this.#típus = m[3];
        const év: number = parseInt(m[4].substring(0, 4));
        const hónap: number = parseInt(m[4].substring(4, 6));
        const nap: number = parseInt(m[4].substring(6, 8));
        // 23:59:999 -> A lejárat napján még utazhatunk
        // Date konstruktor a hónap indexét várja !!! :
        this.#érvényes = new Date(év, hónap - 1, nap, 23, 59, 59, 999);
    }
}
