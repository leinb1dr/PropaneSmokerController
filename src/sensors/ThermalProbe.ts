import { Observable } from "rxjs";

export interface ThermalProbeData{
    name: string,
    port: number,
    adc: number
}

export default interface ThermalProbe{
    listen():Observable<ThermalProbeData>
}
