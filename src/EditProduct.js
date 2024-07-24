import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

const EditProduct = ({ productID, onProductEdited }) => {
  const [productData, setProductData] = useState({
    ProductID: productID,
    Barcode: "",
    ProductName: "",
    Description: "",
    Price: "",
    PurchasePrice: "",
    Stock: "",
    Category: "",
    Supplier: "",
    SiteID: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${productID}`
        );
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [productID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditProduct = async () => {
    try {
      await axios.put("http://localhost:5000/products/edit", productData);
      onProductEdited();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Edit Product</Typography>
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
        onClick={handleEditProduct}
        sx={{ mt: 2 }}
      >
        Edit Product
      </Button>
    </Box>
  );
};

export default EditProduct;
