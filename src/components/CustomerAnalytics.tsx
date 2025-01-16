import React from "react";
import { Card } from "@/components/ui/card";
import { Customer } from "@/types/customer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CustomerAnalyticsProps {
  customers: Customer[];
}

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({ customers }) => {
  const getTotalCustomers = () => customers.length;

  const getCustomersByPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    const filtered = customers.filter(customer => {
      const customerDate = new Date(customer.timestamp);
      const diffTime = Math.abs(now.getTime() - customerDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch(period) {
        case 'daily':
          return diffDays <= 1;
        case 'weekly':
          return diffDays <= 7;
        case 'monthly':
          return diffDays <= 30;
        default:
          return false;
      }
    });
    return filtered.length;
  };

  const chartData = [
    { name: 'Daily', customers: getCustomersByPeriod('daily') },
    { name: 'Weekly', customers: getCustomersByPeriod('weekly') },
    { name: 'Monthly', customers: getCustomersByPeriod('monthly') },
  ];

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Customer Analytics</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Daily</h3>
          <p className="text-3xl font-bold">{getCustomersByPeriod('daily')}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Weekly</h3>
          <p className="text-3xl font-bold">{getCustomersByPeriod('weekly')}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Monthly</h3>
          <p className="text-3xl font-bold">{getCustomersByPeriod('monthly')}</p>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg">Total Customers Served: <span className="font-bold">{getTotalCustomers()}</span></p>
      </div>
    </Card>
  );
};

export default CustomerAnalytics;