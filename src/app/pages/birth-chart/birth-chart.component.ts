import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import { BirthChartService } from '../../services/birth-chart.service';
import { CurrentUserService } from "../../services/current-user.service";
import { BirthChart } from "../../models/birthchart";
import { User } from 'app/models/user';


@Component({
    selector: 'birth-chart',
    templateUrl: './birth-chart.component.html',
    styleUrls: ['./birth-chart.component.css']
})
export class BirthChartComponent implements OnInit {

    user: User;
    birthChart: BirthChart = null;
    errorMessage = "";

    constructor(
        private birthChartService: BirthChartService,
        private currentUserService: CurrentUserService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        if (!this.currentUserService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        this.user = this.currentUserService.getUser();

        this.birthChart = {
            id: 0,
            userid: 0,
            dateofbirth: '10/17/1980 11:22:00 AM',
            placeofbirth: 'Chuuk, Micronesia',
            chart: 'Some dummy chart information',
        }

        this.getBirthChart();
    }

    getBirthChart(): void {

        let currentUserId = this.currentUserService.getUser().id;

        this.birthChartService.getBirthChartByUserId(currentUserId).subscribe(
            (response: BirthChart) => {
                this.birthChart = response;
                this.errorMessage = "";
            },
            (error) => {
                this.errorMessage = error.error.message;
                this.birthChart = null;
            }
        )
    }

}
