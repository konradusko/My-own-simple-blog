export const createTime = () => {
    const newOne = new Date(Date.UTC(new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()))
    const minus = newOne.getTime() 
    const dateToIso = new Date(minus).toISOString().split('T')
    return `${dateToIso[0]} ${dateToIso[1].split('.')[0]}`
}