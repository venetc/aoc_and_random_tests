const { readFileSync } = require("fs");

const main = () => {
    const input = readFileSync("./aoc_2015_2_input.txt", "utf-8").split("\n");
    let paper = 0;
    let ribbon = 0;

    for (const dim of input) {
        const [a, b, c] = dim.split("x").map(Number).sort((a, b) => a - b);

        const extra = Math.min(a * b, b * c, c * a);

        paper += 2 * (a * b + b * c + c * a) + extra
        ribbon += 2 * (a + b) + (a * b * c)
    }

    console.log({ paper });
    console.log({ ribbon });
}


main()