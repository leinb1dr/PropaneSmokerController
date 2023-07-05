import { open } from "mcp-spi-adc";

import ThermalProbe, { ThermalProbeData } from "../ThermalProbe";
import { Observable, Subscriber } from "rxjs";

interface Reading{
  value:number,
  rawValue:number
}

/**
 * This is an anolog to digital probe. It gets the digital value
 * of the Thermistor in 10-bit resolution
 */ 
export default class ADCThermalProbe implements ThermalProbe {

  readonly name: string;
  readonly port: number;

  /**
   * Create a thermal probe by giving it a name and indicating what
   * port it is.
   *
   * @param {string} name The name of the probe
   * @param {number} probe The port number of the probe
   */ 
  constructor(name: string, port: number){
    this.name = name;
    this.port = port;
  }

  /**
   * Start listening to the thermal probe and produce values to
   * a hot observable.
   *
   * @returns {Observable<ThermalProbeData>} A hot observable that produces
   * 10-bit adc values.
   */ 
  listen(): Observable<ThermalProbeData> {
    console.log(`Started listening on port: ${this.port}`);

    return new Observable((subscriber:Subscriber<ThermalProbeData>) => {
      const tempSensor = open(this.port, { speedHz: 20000 }, (err: Error) => {
        if (err) subscriber.error(err);
        else {
          console.log("starting listener");
          setInterval((_: any) => {
            tempSensor.read((err: Error, reading:Number) => {
              if (err) subscriber.error(err);
              else subscriber.next({
                name: this.name,
                port: this.port,
                adc: 500
              });//reading.rawValue);
            });
          }, 1000);
        }
      });
    });
  }
}
