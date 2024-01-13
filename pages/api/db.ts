import {Connection} from "./connectionClass";
declare global {
  var instance: undefined | Connection;
}

const instance=globalThis.instance ?? Connection.getInstance();
console.log("Node Env",process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') globalThis.instance=instance;
export default  instance;

