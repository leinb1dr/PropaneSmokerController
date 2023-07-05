import { ThermalProbeData } from "../sensors/ThermalProbe.js";
import { Observable, OperatorFunction, Subscriber } from "rxjs";

const A = 0.001215004541946;
const B = 0.00020533494946;
const C = 3.191763164972e-6;
const D = -2.937520102511e-8;

export interface ThermalConversionData extends ThermalProbeData {
  r: number;
  tempK: number;
}

export interface ThermalMetrics extends ThermalConversionData {
  tempC: number;
  tempF: number;
}

function adcToResistance(value: number): number {
  console.log(value);
  return 100_000 / (1023 / value - 1);
}

function resistanceToDegreesK(r: number): number {
  const logR = Math.log(r);
  return 1 / (A + B * logR + C * Math.pow(logR, 2) + D * Math.pow(logR, 3));
}

const mapTemperature: () => OperatorFunction<
  ThermalProbeData,
  ThermalConversionData
> = (): OperatorFunction<ThermalProbeData, ThermalConversionData> => {
  return (source) =>
    new Observable<ThermalConversionData>((subscriber) => {
      source.subscribe({
        next(data) {
          const r = adcToResistance(data.adc);
          const tempK = resistanceToDegreesK(r);
          subscriber.next({
            ...data,
            r,
            tempK,
          });
        },
        error(err) {
          subscriber.error(err);
        },
      });
    });
};

const mapMetrics: () => OperatorFunction<
  ThermalConversionData,
  ThermalMetrics
> = (): OperatorFunction<ThermalConversionData, ThermalMetrics> => {
  return (source) =>
    new Observable<ThermalMetrics>((subscriber) => {
      source.subscribe({
        next(data) {
          const tempC = data.tempK - 273.15;
          subscriber.next({
            ...data,
            tempC,
            tempF: tempC * (9 / 5) + 32,
          });
        },
        error(err){
          subscriber.error(err)
        }
      });
    });
};

export { mapTemperature, mapMetrics };
