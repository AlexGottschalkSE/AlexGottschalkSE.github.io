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
  TextField,
} from "@mui/material";
import Sidebar from "./Sidebar";

const Stock = ({ businessID }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [closeToOutOfStock, setCloseToOutOfStock] = useState(0);
  const [productFilter, setProductFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(
          `http://localhost:5000/business/${businessID}/products`
        );
        const productsData = productsResponse.data;

        setProducts(productsData);
        setTotalProducts(productsData.length);
        setOutOfStock(
          productsData.filter((product) => product.Stock === 0).length
        );
        setCloseToOutOfStock(
          productsData.filter(
            (product) => product.Stock > 0 && product.Stock <= 5
          ).length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [businessID]);

  const filteredProducts = products.filter(
    (product) =>
      product.ProductName.toLowerCase().includes(productFilter.toLowerCase()) &&
      product.SiteName.toLowerCase().includes(siteFilter.toLowerCase())
  );

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
            Stock
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Products</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    {totalProducts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Items Out of Stock</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    {outOfStock}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Items Low on Stock</Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#25467B", fontWeight: 400 }}
                  >
                    {closeToOutOfStock}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Filter by Product Name"
                variant="outlined"
                fullWidth
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Filter by Site Location"
                variant="outlined"
                fullWidth
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
              />
            </Grid>
          </Grid>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, color: "#25467B", fontWeight: 900 }}
          >
            All Stock
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 800, width: "60vw" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Purchase Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Site Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.ProductID}>
                    <TableCell>{product.ProductID}</TableCell>
                    <TableCell>{product.Barcode}</TableCell>
                    <TableCell>{product.ProductName}</TableCell>
                    <TableCell>{product.Description}</TableCell>
                    <TableCell>R{(product.Price || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      R{(product.PurchasePrice || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{product.Stock}</TableCell>
                    <TableCell>{product.Category}</TableCell>
                    <TableCell>{product.Supplier}</TableCell>
                    <TableCell>{product.SiteName}</TableCell>
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

export default Stock;
