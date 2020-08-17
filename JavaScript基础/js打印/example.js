// 先导入getLodop方法
import { getLodop } from "./LodopFuncs.js";
// 获取打印机列表
function getPrintList() {
    let LODOP = getLodop();
    if (!LODOP) return;
    // 获取打印机个数
    let count = LODOP.GET_PRINTER_COUNT();
    let printValue = Array(count).fill(null).map((...args) => {
        if (printValue === LODOP.GET_PRINTER_NAME(args[1])) {
            this.printDefault = args[1];
        }
        return {
            value: args[1], // args[1]为数组索引
            label: LODOP.GET_PRINTER_NAME(args[1]) // 获取打印机名称
        }
    })
}
console.log(getPrintList());