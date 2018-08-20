import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class Charts extends React.Component {
    
    render () {
        const {
            polarData,
        } = this.props;

        let data = polarData.map(d => {
            var obj = {}
            obj.date = d.date
            obj.col = Number(d.col.slice(0,3))
            obj.avrBpm = Number(d.avrBpm.slice(0,3))
            obj.maxBpm = Number(d.maxBpm.slice(0,3))
            console.log(obj)
            return obj
        })

        data = data.reverse()

        return (
            <LineChart 
                width={500} 
                height={300} 
                data={data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
           <XAxis dataKey="date"/>
           <YAxis />
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />

           <Line dataKey="col" stroke="#8884d8" />
           <Line dataKey="avrBpm" stroke="#82ca9d" />
           <Line dataKey="maxBpm" stroke="#ee8888" />
          </LineChart>
        );
      }
}

export default Charts;