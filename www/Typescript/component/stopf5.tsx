// To prevent high freq access
export class stopf5_tsx {
    lastaccess_timestamp: { [label: string]: number }
    constructor() { this.lastaccess_timestamp = {} }
    public check(label: string, interval_ms: number = 3000, stop_msg: boolean = false) {
        if (this.lastaccess_timestamp[label] && Date.now() < this.lastaccess_timestamp[label] + interval_ms) {
            if (stop_msg == true) {
                alert("remaining cooling time: " + String(this.lastaccess_timestamp[label] - Date.now() + interval_ms) + "[ms]")
            }
            return false;
        }
        this.lastaccess_timestamp[label] = Date.now()
        return true;
    }
} export var stopf5 = new stopf5_tsx
