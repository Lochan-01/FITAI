import Card from "../common/Card";

import {
    Bar
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function WeeklyChart({ data: chartData }) {

    const data = {

        labels: chartData?.labels || [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ],

        datasets: [

            {
                label: "Workout Hours",

                data: chartData?.values || [1,2,1.5,3,2.5,4,2],

                backgroundColor: [
                    "#06B6D4",
                    "#10B981",
                    "#06B6D4",
                    "#10B981",
                    "#06B6D4",
                    "#10B981",
                    "#06B6D4"
                ],

                borderRadius:12

            }

        ]

    };

    const options = {

        responsive:true,

        plugins:{

            legend:{
                display:false
            }

        },

        scales:{

            x:{

                ticks:{
                    color:"var(--text-secondary)"
                },

                grid:{
                    display:false
                }

            },

            y:{

                ticks:{
                    color:"var(--text-secondary)"
                },

                grid:{
                    color:"var(--border)"
                }

            }

        }

    };

    return(

<Card className="h-full">
  

<h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">

Weekly Activity

</h2>
<p className="text-[var(--text-secondary)] mb-6">
    Workout hours completed this week
</p>

<div className="h-80">
    <Bar
        data={data}
        options={{
            ...options,
            maintainAspectRatio: false,
        }}
    />
</div>

</Card>

)

}