import cooking from "../../assets/cooking.gif";
import "./index.css"
function LoadComponent(){

    return <div className="load-container">
        <img src={cooking} className="load-img"/>
        <div className="loading-text">Loading...</div>
    </div>
}

export default LoadComponent;