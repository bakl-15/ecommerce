import React from 'react'
import ReactApexChart from 'react-apexcharts'
function MainGraph({index, value}) {
  const  series = [{
       name: 'Factures',
        data: value
      }]
    const  options =   {
      annotations: {
        points: [{
          x: 'Factures',
          seriesIndex: 0,
          label: {
            borderColor: '#775DD0',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: 'Factures',
          }
        }]
      },
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '50%',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },
      
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: index,
        tickPlacement: 'on'
      },
      yaxis: {
        title: {
          text: 'Factures',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
      }
    }
  
   return (
    <>
         
            <ReactApexChart options={options} series={series}  height={280} type="bar" />
         
    </>
   
  )
  };
    
  
 


export default MainGraph