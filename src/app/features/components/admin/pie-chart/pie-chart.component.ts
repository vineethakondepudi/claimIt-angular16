import { Component } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export default class AppComponent {
  // Pie chart data
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw + '%';  // Show percentage in tooltips
          }
        }
      }
    }
  };

  public pieChartLabels: string[] = ['Red', 'Blue', 'Yellow'];  // Labels for the chart
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [300, 50, 100],  // Static data
        backgroundColor: ['#FF0000', '#0000FF', '#FFFF00'],  // Slice colors
        hoverBackgroundColor: ['#FF3333', '#3333FF', '#FFFF33']  // Hover colors
      }
    ]
  };

  public pieChartType: ChartType = 'pie';  // Define chart type
}
