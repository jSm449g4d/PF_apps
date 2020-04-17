// To prevent high freq access
export class stopf5_tsx {
    last_timestamp: { [label: string]: number }
    constructor() { this.last_timestamp = {} }
    public check(label: string, interval_ms: number = 3000, stop_msg: boolean = false) {
        if (this.last_timestamp[label] && Date.now() < this.last_timestamp[label] + interval_ms) {
            if (stop_msg == true) { alert("remaining cooling time: " + String(this.last_timestamp[label] - Date.now() + interval_ms) + "[ms]") }
            return false;
        }
        this.last_timestamp[label] = Date.now()
        return true;
    }
} export var stopf5 = new stopf5_tsx

export function jpclock_func() {
    const now: any = new Date();
    const dayOfWeekStr: string[] = ["日 ", "月 ", "火 ", "水 ", "木 ", "金 ", "土 "];
    return now.getFullYear() + "年 " + now.getMonth() +
        "月 " + now.getDate() + "日 " + dayOfWeekStr[now.getDay()] +
        "曜日 " + now.getHours() + ": " + now.getMinutes() + ": " + now.getSeconds();
}
