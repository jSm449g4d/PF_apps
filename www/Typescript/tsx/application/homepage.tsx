import React from 'react';
import { auth, useAuth } from "../component/account";

const bgImage: any = {
    backgroundImage: "url(/static/img/publicdomainq-0014284zts.jpg)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
}

export const App_tsx = () => {
    const [uid,] = useAuth()

    return (
        <div className="p-2 bg-light" style={bgImage}>
            Under Construction
        </div>
    );
};
