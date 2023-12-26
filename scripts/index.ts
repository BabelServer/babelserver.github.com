interface Experience {
    chance: number;
    value: number;
}

interface Block {
    typeId: string;
    location: {
        x: number;
        y: number;
        z: number;
    };
    slot: number;
    money: number;
    experience: Experience;
    errorName: string;
}

interface RootObject {
    mineNumber: number;
    money: number;
    experience: Experience;
    blocks: Block[];
}[];

interface RootObject {
    mineNumber: number;
    money: number;
    experience: {
        chance: number;
        value: number;
    };
    blocks: {
        typeId: string;
        location: {
            x: number;
            y: number;
            z: number;
        };
        slot: number;
        money: number;
        experience: {
            chance: number;
            value: number;
        };
        errorName: string;
    }[];
}[];
