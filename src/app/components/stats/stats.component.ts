import {Component, Input} from '@angular/core';
import {User} from "../../interface/user";
import {Statistics} from "../../interface/statistics";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  @Input() statics: Statistics;



}
