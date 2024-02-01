import { Injectable } from '@angular/core';
import  { BirthChart, mapApiDataToBirthchart } from '../models/birthchart';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class BirthChartService {

  private baseUrl =
    "https://fng90w0hv0.execute-api.us-west-2.amazonaws.com/dev";

  constructor(private http: HttpClient) {}

  getBirthChartByUserId(id: number): Observable<BirthChart> {
    return this.http
      .get<any>(`${this.baseUrl}/birth-chart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .pipe(map((apiData) => mapApiDataToBirthchart(apiData)));
  }
}
