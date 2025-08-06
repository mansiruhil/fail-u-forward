import React from "react";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";

export default function Loadingbar(){
    return(
        <div>
            <div className="m-0 flex place-items-center justify-center min-h-screen flex-col">
            <HashLoader/>
            </div>
        </div>
    )
}