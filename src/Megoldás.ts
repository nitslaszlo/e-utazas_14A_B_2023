import Felszállás from "./Felszállás";
import fs from "fs";
import FelszállásJegy from "./FelszállásJegy";
import FelszállásBérlet from "./FelszállásBérlet";

export default class Megoldás {
    //0 20190326-0700 4170861 NYB 20190404
    #utasadatok: Felszállás[] = [];

    get utasokSzáma(): number {
        return this.#utasadatok.length;
    }

    constructor(forrásFile: string) {
        fs.readFileSync(forrásFile)
            .toString()
            .split("\n")
            .forEach(sor => {
                const aktSor: string = sor.trim();
                const típus: string = aktSor.split(" ")[3];
                if (típus == "JGY") {
                    this.#utasadatok.push(new FelszállásJegy(aktSor));
                }
                if (["FEB", "TAB", "NYB", "NYP", "RVS", "GYK"].includes(típus)) {
                    this.#utasadatok.push(new FelszállásBérlet(aktSor));
                }
            });
    }
}
