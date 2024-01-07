const { readFileSync } = require("fs");

const main = () => {
    const input = readFileSync("./aoc_2015_1_input.txt", "utf-8");
    let floor = 0, basement;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === "(") floor++;
        if (input[i] === ")") floor--;

        if (!basement && floor === -1) basement = i + 1;
    }

    console.log({ floor });
    console.log({ basement });
}


main()