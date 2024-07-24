import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const AddProduct = ({ businessID, onProductAdded }) => {
  const [productData, setProductData] = useState({
    Barcode: "",
    ProductName: "",
    Description: "",
    Price: "",
    PurchasePrice: "",
    Stock: "",
    Category: "",
    Supplier: "",
    SiteID: businessID, // Use businessID as SiteID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/products/add",
        productData
      );
      onProductAdded();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Add New Product</Typography>
      <TextField
        label="Barcode"
        name="Barcode"
        value={productData.Barcode}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Product Name"
        name="ProductName"
        value={productData.ProductName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="Description"
        value={productData.Description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        name="Price"
        value={productData.Price}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Purchase Price"
        name="PurchasePrice"
        value={productData.PurchasePrice}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Stock"
        name="Stock"
        value={productData.Stock}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Category"
        name="Category"
        value={productData.Category}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Supplier"
        name="Supplier"
        value={productData.Supplier}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        sx={{ mt: 2 }}
      >
        Add Product
      </Button>
    </Box>
  );
};

export default AddProduct;
