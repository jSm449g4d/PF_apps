import React from 'react';
import { jpclock_func } from "../component/util_tsx";

interface State {
    jpclock_str: string, clockcomment_str: string,
}

// IndexPage
export class App_tsx extends React.Component<{}, State> {
    // constructors
    constructor(props: any) {
        super(props);
        this.state = {
            jpclock_str: "(´・ω・｀) Plz wait 500[ms]\n(´･ω｀･) or javascript is not working",
            clockcomment_str: ""
        };
    }
    componentDidMount() { setInterval(this._tick.bind(this), 100) }
    componentDidUpdate(prevProps: object, prevState: State) { }
    componentWillUnmount() { }

    // functions
    _tick() {
        // Clock
        this.setState({ jpclock_str: jpclock_func() })
        const now: Date = new Date();
        if (now.getHours() < 5) {
            this.setState({ clockcomment_str: "今日も良い深夜ですね (´・ω・｀)はぁと" })
        } else if (now.getHours() < 7) {
            this.setState({ clockcomment_str: "おはようございました ( ｰ̀ωｰ́ )どやぁ" })
        } else if (now.getHours() < 9) {
            this.setState({ clockcomment_str: "おねがいです! ( TДT)働きたくないでござる" })
        } else if (now.getHours() < 17) {
            this.setState({ clockcomment_str: "お勤め、ご苦労様です （´ω｀）おなかが減ってきましたね..." })
        } else if (now.getHours() < 21) {
            this.setState({ clockcomment_str: "残業の時間です! (´Д⊂早く帰りたい" })
        } else {
            this.setState({ clockcomment_str: "こんばんちわーっす! つ´Д`)つzzz" })
        }
    }

    // renders
    render() {
        return (
            <div className="p-2 bg-light">
                <div className="p-1 d-flex justify-content-between"
                    style={{ color: "#AAFEFE", border: "3px double silver", background: "#001111" }}>
                    {this.state.jpclock_str}<br />{this.state.clockcomment_str}
                    <img alt="The icon is not found" src="/favicon.ico" className="img-thumbnail ml-auto" />
                </div>
                <table className="table table-sm table-bordered" style={{ background: "#EEFFFF" }}>
                    <thead>
                        <tr>
                            <th className="text-center" colSpan={2}>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ fontWeight: "bold" }}>
                            <td><a href="./wordpress/">Word_Press</a></td>
                            <td>技術的な事や雑感等</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td><a href="https://sfb-tlnesjcoqq-an.a.run.app/app_tsx.html">Firebase_python</a></td>
                            <td>このアプリのテスト環境(CaaS)でのデプロイです</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td><a href="https://huxiin.ga/app_tsx.html">Firebase_python</a></td>
                            <td>このアプリの本番環境(VPS)でのデプロイです</td>
                        </tr>
                        <tr style={{ fontWeight: "bold" }}>
                            <td><a href="https://github.com/jSm449g4d/">Github</a></td>
                            <td>DeepLearningやWebアプリの実装等が置かれています</td>
                        </tr>
                        <tr>
                            <td><a href="https://ja.wikipedia.org/wiki/Wikipedia:削除された悪ふざけとナンセンス/機動戦士ガンダムSolaris">
                                機動戦士ガンダムSolarisとは..?</a>
                            </td>
                            <td>Joke</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };
};
