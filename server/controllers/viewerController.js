let currentViewers = {};
let projectHosts = {};

export function removeViewer(projectId, viewerId){
  if(currentViewers[projectId]){
    currentViewers[projectId] = currentViewers[projectId].filter(viewer => viewer.id !== viewerId);
  } else {
    console.error(`Project ${projectId} not found`);
  }
  if(currentViewers[projectId] && currentViewers[projectId].length === 0){
    projectHosts[projectId] = null;
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
}

export function renameViewer(projectId, usernameData){
  if(currentViewers[projectId]){
    const viewerExists = currentViewers[projectId].some(viewer => viewer.id === usernameData.id);
    if (viewerExists) {
      removeViewer(projectId, usernameData.id);
      addViewer(projectId, {
        id: usernameData.id,
        userName: usernameData.newUsername,
        isBot: false
      });
    } else {
      addViewer(projectId, {
        id: usernameData.id,
        userName: usernameData.newUsername,
        isBot: false
      });
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
