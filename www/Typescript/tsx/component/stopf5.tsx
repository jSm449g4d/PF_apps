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

