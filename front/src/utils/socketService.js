import io from 'socket.io-client'
import { BASE_URL } from '../config'
const SOCKET_URL = BASE_URL

class WSService {
    initialzeSocekt = async () => {
        try {
            this.socket = io(SOCKET_URL, {
                transports:["websocket", "polling"],
                
            })
            console.log("initialzing socket",this.socket)
        
            this.socket.on("connect", (data)=>{
                console.log("=== socket connected ===")
                this.socket.emit('user_online', {userId})

            })
            this.socket.on("disconnect", (data)=>{
                console.log("=== socket disconnected ===")
            })
            this.socket.on("error", (data)=>{
                console.log("=== socket error ===",data)
            })

        } catch (error) {
            console.log("=== socket is not initialized ===",error)
        }
    }
}
const socketServices = new WSService()
export default socketServices
