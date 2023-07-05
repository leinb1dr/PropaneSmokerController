import ThermalProbe from "./sensors/ADCThermalProbe/index.js";
import { mapTemperature, mapMetrics } from "./converters/ThermalConverter.js";
import graphiteSubscriber from "./subscribers/GraphiteSubscriber.js";

console.log("started");

new ThermalProbe("cabinet", 0)
  .listen()
  .pipe(mapTemperature())
  .pipe(mapMetrics())
  .subscribe(graphiteSubscriber);
