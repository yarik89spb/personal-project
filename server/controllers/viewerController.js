let currentViewers = {};
let projectHosts = {};

export function removeViewer(viewerId){
  let projectId; 
  for(let project of Object.keys(currentViewers)){
    let viewerArray = currentViewers[project];
    for (let i = 0; i < viewerArray.length; i++) {
      if (viewerArray[i].id === viewerId) {
        projectId = project;
        viewerArray.splice(i, 1);
        // Remove host if no viewers left
        if(currentViewers[projectId] && currentViewers[projectId].length === 0){
          projectHosts[projectId] = null;
        }
        return viewerArray
      }
    }
  }
}

export function addViewer(projectId, viewerObj){
  if(currentViewers[projectId] && !currentViewers[projectId].find(viewer => {return viewer.id === viewerObj.id})){
    currentViewers[projectId].push(viewerObj);
  }else if(!currentViewers[projectId]){
    currentViewers[projectId] = [viewerObj];
  }
  if(!projectHosts[projectId] || projectHosts[projectId] === null){
    projectHosts[projectId] = viewerObj.id;
  }
  return currentViewers[projectId]
}

export function renameViewer(projectId, usernameData){
  if(currentViewers[projectId]){
    let viewerExists = false;
    for(let viewer of currentViewers[projectId]){
      if(viewer.id === usernameData.id){
        viewerExists = true;
        viewer.userName = usernameData.newUsername
        return viewer;
      }
    }
  } else {
    console.error(`Project ${projectId} not found`);
  }
}

export function getViewers(projectId){
  if(currentViewers[projectId]){
    return [projectHosts[projectId], currentViewers[projectId]];
  }
  throw new Error(`Project ${projectId} not found`);
}
