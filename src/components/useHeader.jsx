import { useAppContext } from "@/context/context";
import { useLayoutEffect } from "react";

export default function useHeader({name}){
    const {setDisplayName} = useAppContext()

    
    useLayoutEffect(()=>{
        console.log(name);
        setDisplayName(name);
    },[name])
}