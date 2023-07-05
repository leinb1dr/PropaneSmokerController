import { Observer } from "rxjs";
import { ThermalMetrics } from "../converters/ThermalConverter.js";

export default {
    next(rawValue){
		console.log(`value read for 0: ${JSON.stringify(rawValue)}`)
	},
	error(error){
		console.error(`error`)
		console.log(error)
	}
} as Partial<Observer<ThermalMetrics>>