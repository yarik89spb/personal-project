const createPromise = (count) => {
  return new Promise((resolve, reject) => {
    console.log(`--------------------------------`);
    console.log(`Yarik: 這個禮拜一定會加 NLP 的功能！`);
    setTimeout(() => {
      reject(`Yarik: 哇，來不及做。 沒關係，下個 Sprint 會昨晚 ᕦ( ͡° ͜ʖ ͡°)ᕤ`);
    }, 3000); 
  });
};

const handleRejection = (count) => {
  createPromise(count)
    .then(() => {
      
    })
    .catch((error) => {
      console.log(`--------------------------------`);
      console.log(`### Sprint #${count} 結束了 ###`);
      console.log(error);
      setTimeout(() => {
        handleRejection(count + 1); 
      }, 1000);
    });
};

// Start the chain with the first promise
handleRejection(1);
