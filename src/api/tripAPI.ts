import type TripSearchParams from "../types/SearchForm";
import type { TripRead } from "../types/Trip";
import { BaseAPI } from "./api";



class TripAPI extends BaseAPI {
  getAllTrips() {
    return this.get<TripRead[]>("/trips/");
  }

    searchTrips(params: TripSearchParams) {
    // 1. Создаем объект параметров, удаляя пустые значения
    const query = new URLSearchParams();
    
    if (params.fromCity) query.append('from_city', params.fromCity);
    if (params.toCity) query.append('to_city', params.toCity);
    if (params.date) query.append('date', params.date);

    // 2. Генерируем строку запроса (например: ?from_city=Москва&to_city=Сочи...)
    const queryString = query.toString();
    const url = `/trips/search${queryString ? `?${queryString}` : ''}`;

    return this.get<TripRead[]>(url);
    }

}

const tripAPI = new TripAPI();

export default tripAPI;
