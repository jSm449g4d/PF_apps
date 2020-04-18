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

export function Query2Dict(query_str: string = window.location.search) {
    let ret_dict: { [key: string]: string } = {};
    if (query_str[0] == "?") query_str = query_str.slice(1)
    const data = query_str.split('&');
    for (var i = 0; i < data.length; i++) {
        let keyvalue: string[] = ["", ""]
        keyvalue = data[i].split('=');
        ret_dict[keyvalue[0]] = decodeURIComponent(keyvalue[1]).replace(/\+/g, ' ');
    }; return ret_dict;
}
export function Dict2Query(query_dict: { [key: string]: string }) {
    let ret_str: string = "?"
    const tmpkey_array: string[] = Object.keys(query_dict);
    const tmpvalue_array: string[] = Object.values(query_dict);
    for (let i = 0; i < tmpkey_array.length; i++) {
        ret_str += tmpkey_array[i] + "=" + tmpvalue_array[i] + "&"
    }
    return ret_str
}