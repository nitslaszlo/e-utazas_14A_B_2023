import Felszállás from "./Felszállás";

export default class FelszállásJegy extends Felszállás {
    #jegyekSzáma: number;

    constructor(sor: string) {
        super(sor); // végrehajtja az ősosztály konstruktorát
        this.#jegyekSzáma = parseInt(sor.split(" ")[4]);
    }
}
