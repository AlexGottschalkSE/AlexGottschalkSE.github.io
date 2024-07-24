import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "./Sidebar";
import { format, subDays } from "date-fns";

const Dashboard = ({ businessID }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [recentSales, setRecentSales] = useState([]);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [
      {
        label: "Lifetime Sales",
        data: [],
        fill: false,
        borderColor: "#25467B",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get(
          `http://localhost:5000/business/${businessID}/sales`
        );
        const salesData = salesResponse.data;

        const totalAmount = salesData.reduce(
          (acc, sale) => acc + (sale.FinalAmount || 0),
          0
        );

        const oneWeekAgo = subDays(new Date(), 7);
        const weeklyAmount = salesData
          .filter((sale) => new Date(sale.SaleDate) >= oneWeekAgo)
          .reduce((acc, sale) => acc + (sale.FinalAmount || 0), 0);

        const currentMonth = new Date().getMonth();
        const monthlyAmount = salesData
          .filter(
            (sale) =>
              new Date(sale.SaleDate).getMonth() === currentMonth &&
              new Date(sale.SaleDate).getFullYear() === new Date().getFullYear()
          )
          .reduce((acc, sale) => acc + (sale.FinalAmount || 0), 0);

        const recentSalesResponse = await axios.get(
          `http://localhost:5000/business/${businessID}/recent-sales`
        );
        const recentSalesData = recentSalesResponse.data;

        const salesDates = salesData
          .map((sale) => format(new Date(sale.SaleDate), "MMM dd, yyyy"))
          .reverse();
        const salesAmounts = salesData
          .map((sale) => sale.FinalAmount || 0)
          .reverse();

        setTotalSales(totalAmount);
        setTotalSalesCount(salesData.length);
        setWeeklySales(weeklyAmount);
        setMonthlySales(monthlyAmount);
        setRecentSales(recentSalesData);
        setSalesData({
          labels: salesDates,
          datasets: [
            {
              label: "Daily Sales",
              data: salesAmounts,
              fill: false,
              borderColor: "#25467B",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [businessID]);

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#25467B", fontWeight: 900 }}
          >
            Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Sales</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    R{totalSales.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Sales Count</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    {totalSalesCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Weekly Sales</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    R{weeklySales.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Monthly Sales</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    R{monthlySales.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, color: "#25467B", fontWeight: 900 }}
          >
            Lifetime Sales
          </Typography>
          <Line data={salesData} options={chartOptions} />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, color: "#25467B", fontWeight: 900 }}
          >
            Most Recent Sales
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sale ID</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Sale Date</TableCell>
                  <TableCell>Site Location</TableCell>
                  <TableCell>Close Time</TableCell>
                  <TableCell>Final Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.SaleID}>
                    <TableCell>{sale.SaleID}</TableCell>
                    <TableCell>{sale.EmployeeName}</TableCell>
                    <TableCell>
                      {format(new Date(sale.SaleDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{sale.SiteLocation}</TableCell>
                    <TableCell>{sale.CloseTime}</TableCell>
                    <TableCell>R{(sale.FinalAmount || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
