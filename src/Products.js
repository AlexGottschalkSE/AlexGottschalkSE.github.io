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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Sidebar from "./Sidebar";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

const Products = ({ businessID }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [bestSellingProduct, setBestSellingProduct] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProductID, setSelectedProductID] = useState(null);

  const fetchData = async () => {
    try {
      const productsResponse = await axios.get(
        `http://localhost:5000/business/${businessID}/products`
      );
      const productsData = productsResponse.data;

      setProducts(productsData);
      setTotalProducts(productsData.length);

      const bestSellingProductResponse = await axios.get(
        `http://localhost:5000/business/${businessID}/best-selling-product`
      );
      setBestSellingProduct(bestSellingProductResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessID]);

  const handleAddProduct = () => {
    setOpenAddDialog(true);
  };

  const handleEditProduct = (productID) => {
    setSelectedProductID(productID);
    setOpenEditDialog(true);
  };

  const handleDeleteProduct = (productID) => {
    setSelectedProductID(productID);
    setOpenDeleteDialog(true);
  };

  const handleDialogClose = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    fetchData();
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
            Products
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: "130px" }}>
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
              <Card sx={{ height: "130px" }}>
                <CardContent>
                  <Typography variant="h6">Best Selling Product</Typography>
                  {bestSellingProduct ? (
                    <>
                      <Typography
                        variant="h5"
                        sx={{ color: "#25467B", fontWeight: 400 }}
                      >
                        {bestSellingProduct.ProductName}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#25467B", fontWeight: 400 }}
                      >
                        Sold: {bestSellingProduct.QuantitySold}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="h5"
                      sx={{ color: "#25467B", fontWeight: 400 }}
                    >
                      Loading...
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, color: "#25467B", fontWeight: 900 }}
          >
            All Products
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
                  <TableCell>Category</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.ProductID}>
                    <TableCell>{product.ProductID}</TableCell>
                    <TableCell>{product.Barcode}</TableCell>
                    <TableCell>{product.ProductName}</TableCell>
                    <TableCell>{product.Description}</TableCell>
                    <TableCell>R{product.Price.toFixed(2)}</TableCell>
                    <TableCell>{product.Category}</TableCell>
                    <TableCell>{product.Supplier}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditProduct(product.ProductID)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteProduct(product.ProductID)}
                        sx={{ ml: 2 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
      <Dialog open={openAddDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <AddProduct
            businessID={businessID}
            onProductAdded={handleDialogClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <EditProduct
            productID={selectedProductID}
            onProductEdited={handleDialogClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DeleteProduct
            productID={selectedProductID}
            onProductDeleted={handleDialogClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
