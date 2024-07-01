import { Viewer } from "../utils/interfaces"
import './ViewerList.css'

interface ViewerListProps {
  viewers: Viewer[];
}

export default function ViewerList({viewers}: ViewerListProps){
  return (
    <div className="viewer-list-container">
      {viewers.map((viewer)=>{
        return <div
        className="viewer-username-item" 
        key={viewer.id}> {viewer.userName} </div>
      })}
    </div>
  )
}