import { $fetch } from 'ohmyfetch';
import { defineStore } from 'pinia';
import { Socket } from "socket.io-client";
import { baseUrl, useUserStore } from './user';


interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    weather_data: (data: any) => void;
}

interface ClientToServerEvents {
    hello: () => void;
    weather_data: (data: any) => void;
}

interface InterServerEvents {
    ping: () => void;
    weather_data: (data: any) => void;
}

interface SocketData {
    name: string;
    age: number;
}


const fetcher = $fetch.create({ baseURL: `${baseUrl}` })

export interface IstationSockets {
    stationId: string;
    socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export const useStationStore = defineStore('stations', {
    state: () => ({
        stations: {
            docs: [] as any[]
        },
        latestWeatherData: {} as any,
        selectedStation: null
    }),
    getters: {
        totalStations(state) {
            return state.stations.docs.length
        }
    },
    actions: {
        async getStations(token: string) {

            try {
                const data = await fetcher('/stations', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.stations = data
                if (this.stations.docs.length > 0) {
                    for (let i = 0; i < this.stations.docs.length; i++) {
                        const station = this.stations.docs[i];
                        await this.getWeatherData(station.id, 1, 'desc')
                    }
                }
                return true
            } catch (error) {
                console.error(error)
                this.stations = {
                    docs: []
                }
                return false
            }
        },

        async getWeatherData(id: string, limit: number, sort: string = 'asc') {
            const userStore = useUserStore()
            const stationDetails = this.stations.docs.find((station: any) => station.id == id)
            try {
                const data = await fetcher(`/weather/${id}`, {
                    headers: {
                        Authorization: `Bearer ${userStore.token}`
                    },
                    query: {
                        // limit,
                        sort
                    }
                }) as any
                if (!this.latestWeatherData[stationDetails.name]) {
                    this.latestWeatherData[stationDetails.name] = {}
                }
                //@ts-ignore
                this.latestWeatherData[stationDetails.name] = data.docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                console.log('latestWeatherData', this.latestWeatherData)
                return true
            } catch (error) {
                console.error(error)
                this.selectedStation = null
                return false
            }
        }
    },
    persist: false

})