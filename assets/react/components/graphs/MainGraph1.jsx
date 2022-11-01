import React from 'react'
import ReactApexChart from 'react-apexcharts'
function MainGraph1({index, value}) {
  const  series = [
      {
        type: 'area',
        data: value
      }
    ]
    const  options =  {
       
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'string',
          categories: index
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          },
        },
      }
    
  
  return (
    <>
         
            <ReactApexChart options={options} series={series} type="area" height={280} />
         
    </>
   
  )
};

export default MainGraph1