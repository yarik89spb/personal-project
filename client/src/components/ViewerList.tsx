import { Viewer } from "../utils/interfaces"
import './ViewerList.css'
import pigLogo from '/public/pig-logo.png';
import crownLogo from '/public/crown-logo.png';

interface ViewerListProps {
  viewers: Viewer[];
  hostId: string | null;
}

export default function ViewerList({viewers, hostId}: ViewerListProps){
  function renderViewer(viewer: Viewer){
    return (
      <div className="viewer-username-item" key={viewer.id}>
        <img src={pigLogo} alt="Logo"></img>
        <div className="viewer-username-text"> 
          {viewer.userName}
        </div>
      </div>
    )
  }

  function renderHost(viewer: Viewer){
    return (
      <div className="viewer-username-item" key={viewer.id}>
        <img src={crownLogo} alt="Logo"></img>
        <div className="viewer-username-text"> 
          {viewer.userName}
        </div>
      </div>
    )
  }

  return (
    <div className="viewer-list-container">
      {viewers.map((viewer)=>{
        return (viewer.id === hostId ? renderHost(viewer): renderViewer(viewer))}
      )}
    </div>
  )
}