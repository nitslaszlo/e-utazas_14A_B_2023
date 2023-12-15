import Felszállás from "./Felszállás";

export default class FelszállásBérlet extends Felszállás {
    #típus: string;
    #érvényes: Date;

    get ezÉrvényesFelszállás(): boolean {
        return this.#érvényes >= this._idő;
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
