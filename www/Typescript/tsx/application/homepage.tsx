import React from 'react';
import { useAuth } from "../component/firebaseWrapper";

const bgImage: any = {
    backgroundImage: "url(/static/img/publicdomainq-0014284zts.jpg)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
}

export const AppMain = () => {
    const [uid] = useAuth()

    return (
        <div className="p-2 bg-light" style={bgImage}>
            Under Construction
        </div>
    );
};
