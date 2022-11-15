import React from "react";
import styles from "./Command.module.css"

function Command(props){

    let cmd=props.cmd
    console.log('시작')
    console.log("결과2 : ",props.cmd)
    console.log("뿌에에에엥 : ",props.cmd[0])
    let arr =props.cmd
    // let arr = JSON.parse(props.cmd);
    for(let i=0;i<arr.length;i++){
        console.log(i +" : "+ arr[i])
    }

    return(
        <>
            <div className={styles.cmdBox}>
            {cmd.split('\n').map((item, idx)=>(
                <div key={idx} className={styles.cmd}>
                    {item}
                </div>
            ))}
        </div>
        </>
        
    )
}



export default Command


