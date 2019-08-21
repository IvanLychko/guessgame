export default class Utils {
    static formatNumber(n: number, decimals: number = 4): number | string {
        return Number(n) === n && n % 1 !== 0 ? n.toFixed(decimals).replace(/0+$/, '') : n;
    }
}