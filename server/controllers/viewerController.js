let currentViewers = {};

export function removeViewer(projectId, viewerId){
  if(currentViewers[projectId]){
    console.log('Removing viewer:', currentViewers[projectId].find(viewer => {return viewer.id === viewerId}))
    currentViewers[projectId] = currentViewers[projectId].filter(viewer => viewer.id !== viewerId);
    console.log('Current viewers after removal:', currentViewers[projectId]);
  } else {
    console.log(`Project ${projectId} not found in currentViewers.`);
  }
}

export function addViewer(projectId, viewerObj){
  if(currentViewers[projectId] && !currentViewers[projectId].find(viewer => {return viewer.id === viewerObj.id})){
    console.log('HAAA', currentViewers[projectId].find(viewer => {return viewer.id === viewerObj.id}))
    console.log('Adding viewer:', viewerObj);
    currentViewers[projectId].push(viewerObj);
  }else if(!currentViewers[projectId]){
    currentViewers[projectId] = [viewerObj];
  }
  // if(currentViewers[projectId] && !currentViewers[projectId].find(viewer => 
  //   {return viewer.id === viewerObj.id})){
  //     console.log('1111', currentViewers[projectId])
  //     console.log('2222', viewerObj.id)
  //     console.log('Here', currentViewers[projectId].find(viewer => 
  //   {return viewer.id === viewerObj.id}))
  //   // Ensure to remove the viewer if they already exist
  //   //removeViewer(projectId, viewerObj.id);
  //   currentViewers[projectId].push(viewerObj);
  // } else {
  //   currentViewers[projectId] = [viewerObj];
  // }
  console.log('Current viewers after addition:', currentViewers[projectId]);
}

export function renameViewer(projectId, usernameData){
  console.log('Renaming!')
  if(currentViewers[projectId]){
    console.log('Changing name of viewer:', usernameData);
    const viewerExists = currentViewers[projectId].some(viewer => viewer.id === usernameData.id);
    if (viewerExists) {
      removeViewer(projectId, usernameData.id);
      addViewer(projectId, {
        id: usernameData.id,
        userName: usernameData.newUsername,
        isBot: false
      });
    } else {
      console.log(`Viewer with id ${usernameData.id} not found in project ${projectId}.`);
      addViewer(projectId, {
        id: usernameData.id,
        userName: usernameData.newUsername,
        isBot: false
      });
    }
    console.log('Current viewers after renaming:', currentViewers[projectId]);
  } else {
    console.log(`Project ${projectId} not found in currentViewers.`);
  }
}

export function getViewers(projectId){
  console.log('Current viewers:', currentViewers);
  if(currentViewers[projectId]){
    return currentViewers[projectId];
  }
  throw new Error(`Project ${projectId} not found`);
}
