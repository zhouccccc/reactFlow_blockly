//************* 获取随机字符串 *************//
const randomStringSeed = [];
let charCode = 65;
for (let index = 0; index < 26; index++) {
    randomStringSeed.push(String.fromCharCode(charCode));
    charCode += 1;
}
charCode = 97;
for (let index = 0; index < 26; index++) {
    randomStringSeed.push(String.fromCharCode(charCode));
    charCode += 1;
}
for (let index = 0; index < 10; index++) {
    randomStringSeed.push(index);
}

export function getRandomString(length) {
    const randomString = [];
    for (let index = 0; index < length; index++) {
        randomString.push(randomStringSeed[Math.floor(Math.random() * randomStringSeed.length)]);
    }
    return randomString.join('');
}

export function isNull(value) {
    return value === null || value === undefined;
}