const fs = require('fs');

function decodeYValue(base, value) {
    return parseInt(value, base);
}

function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    const n = jsonData.keys.n;
    const k = jsonData.keys.k;
    const points = [];
    for (const key in jsonData) {
        if (key !== "keys") {
            const x = parseInt(key);
            const base = parseInt(jsonData[key].base);
            const yEncoded = jsonData[key].value;
            const y = decodeYValue(base, yEncoded);
            points.push({ x, y, base, value: yEncoded });
        }
    }
    return { n, k, points };
}

function lagrangeInterpolation(points, k) {
    const selectedPoints = [];
    for (let i = 0; i < k; i++) {
        selectedPoints.push(points[i]);
    }

    const L = function (xi) {
        let product = 1;
        for (let j = 0; j < selectedPoints.length; j++) {
            const xj = selectedPoints[j].x;
            if (xj !== xi) {
                product *= -xj / (xi - xj);
            }
        }
        return product;
    };

    let constant = 0;
    for (let i = 0; i < selectedPoints.length; i++) {
        const xi = selectedPoints[i].x;
        const yi = selectedPoints[i].y;
        constant += yi * L(xi);
    }

    return constant;
}

let answers=new Map();
let count=0;
function cpV(points, k) {
    helper(points,0,[],k);
    return answers.get(correctAnswer);
}


let maxCount=0,correctAnswer=0;
function helper(points,i,selected,k){
    if(i>=points.length ){
        return;
    }
    if(selected.length==k){
        let ans=lagrangeInterpolation(selected,k);
        if(answers.has(ans)){
            answers.get(ans).push(selected);
            if(answers.get(ans).length>maxCount){
                maxCount=answers.get(ans).length;
                correctAnswer=ans;
            }
        }else{
            answers.set(ans,selected);
        }
    }
    selected.push(points[i]);
    helper(points,i+1,selected,k)
    selected.pop()
    helper(points,i+1,selected,k)
}

function solve(filePath) {
    const { k, points } = parseInput(filePath);

    const constantTerm = lagrangeInterpolation(points, k);
    const wrongPoints = cpV(points, k, constantTerm);

    return { constantTerm, wrongPoints };
}
const result2 = solve('2.json');
console.log("Constant term for input2:", result2.constantTerm);
console.log("Correct combinations for input2:", result2.wrongPoints.length);
console.log("Correct points for input2:", result2.wrongPoints);
