export interface BirthChart {
    id: number;
    userid: number;
    dateofbirth: string;
    placeofbirth: string;
    chart: string;
}


export function mapApiDataToBirthchart(apiData: any): BirthChart {
    return {
      id: apiData.id,
      userid: apiData.user_id,
      dateofbirth: apiData.date_of_birth,
      placeofbirth: apiData.place_of_birth,
      chart: apiData.chart
    };
  }