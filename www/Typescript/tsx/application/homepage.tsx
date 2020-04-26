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
            Under Construction<br />
        </div>
    );
};
//            <iframe width="560" height="315" src="https://www.youtube.com/embed/-i9e5bNPqVI" frameBorder="0"
//                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
