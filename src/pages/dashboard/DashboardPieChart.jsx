import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#EC613D", "#20C997", "#F4A261", "#E0E0E0"];

const DashboardPieChart = ({ data, total }) => {
  return (
    <div className="bg-white rounded-[12px] p-5 w-full h-[220px] flex flex-col justify-between">
      <div className="flex items-center gap-2">
        {/* Pie */}
        <div className="w-[180px] h-[180px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute ml-[60px] mt-[-115px] text-center">
            <p className="text-xs text-gray-500">Total Users</p>
            <h2 className="font-bold text-lg">{total}</h2>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 text-sm">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color || COLORS[index] }}
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPieChart;