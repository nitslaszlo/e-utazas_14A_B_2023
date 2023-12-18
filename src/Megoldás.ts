import Felszállás from "./Felszállás";
import fs from "fs";
import FelszállásJegy from "./FelszállásJegy";
import FelszállásBérlet from "./FelszállásBérlet";

export interface IMaxMegálló {
    megálló: number;
    felszálló: number;
}
export default class Megoldás {
    //0 20190326-0700 4170861 NYB 20190404
    #utasadatok: Felszállás[] = [];

    get utasokSzáma(): number {
        return this.#utasadatok.length;
    }

    get érvénytelenFelszállásokSzáma(): number {
        let db: number = 0;
        for (const e of this.#utasadatok) {
            if (!e.ezÉrvényesFelszállás) db++;
        }
        return db;
    }

    get maxMegálló(): IMaxMegálló {
        const max: IMaxMegálló = { felszálló: -1, megálló: -1 };
        let aktMegálló: number = 0;
        let aktFelszálló: number = 0;
        for (const e of this.#utasadatok) {
            if (e.megállóSorszáma == aktMegálló) aktFelszálló++;
            else {
                // váltás van a megálló számában:
                if (aktFelszálló > max.felszálló) {
                    max.felszálló = aktFelszálló;
                    max.megálló = aktMegálló;
                }
                aktMegálló = e.megállóSorszáma;
                aktFelszálló = 1;
            }
        }
        // utolsó (29-es) megálló ellnőrzése:
        if (aktFelszálló > max.felszálló) {
            max.felszálló = aktFelszálló;
            max.megálló = aktMegálló;
        }
        return max;
    }

    get maxMegállóVektor(): IMaxMegálló {
        const max: IMaxMegálló = { felszálló: -1, megálló: -1 };
        const stat: number[] = new Array(30).fill(0);
        for (const e of this.#utasadatok) stat[e.megállóSorszáma]++;
        max.felszálló = Math.max(...stat);
        max.megálló = stat.indexOf(max.felszálló);
        return max;
    }

    get ingyenesUtazóFő(): number {
        return this.#utasadatok.filter(x => x.ezIngyenes).length;
    }

    get kedvezményesenUtazóFő(): number {
        return this.#utasadatok.filter(x => x.ezKedvezményes).length;
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
