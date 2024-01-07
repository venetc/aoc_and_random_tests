const { readFileSync } = require("fs");

const main = () => {
    const input = readFileSync("./aoc_2022_6_input.txt", "utf-8");

    for (let i = 0, j = 4; j <= input.length; i++, j++) {
        const sub = input.substring(i, j);
        if (new Set(sub).size === 4) {
            console.log(j);
            break;
        }
    }
}


main()