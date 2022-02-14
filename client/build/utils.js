export function fillObjectPartially(objToFill, newData) {
    for (const key in newData) {
        objToFill[key] = newData[key];
    }
}
