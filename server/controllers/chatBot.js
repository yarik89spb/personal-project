class PorkoBot {
  constructor(roomId) {
    this.roomId = roomId;
  }

  #isSpawned = false;

  get isSpawned() {
    return this.#isSpawned;
  }

  set isSpawned(x) {
    this.#isSpawned = x;
  }

  spawn(){
    if(!this.#isSpawned){
      const botMessage = '₍ᐢ･⚇･ᐢ₎ Porko bot 報道了';
      this.#isSpawned = true;
      return botMessage
    }
  }
}

let bots= {};

export function useBot(roomId){
  if (!bots[roomId]) {
    bots[roomId] = new PorkoBot(roomId);
  }
  // Return distinct bot for the given project
  return bots[roomId];
}

export default useBot;