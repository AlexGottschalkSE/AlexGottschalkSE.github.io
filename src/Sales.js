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
import Sidebar from "./Sidebar";
import { format } from "date-fns";

const Sales = ({ businessID }) => {
  const [sales, setSales] = useState([]);
  const [totalSalesCount, setTotalSalesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get(
          `http://localhost:5000/business/${businessID}/sales`
        );
        const salesData = salesResponse.data;

        setSales(salesData);
        setTotalSalesCount(salesData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [businessID]);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#25467B", fontWeight: 900 }}
          >
            Sales
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Sales Count</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                    s
                  >
                    {totalSalesCount}
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
            All Sales
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 800, width: "60vw" }}
          >
            <Table stickyHeader>
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
                {sales.map((sale) => (
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

export default Sales;
