import React from "react";
import axios from "axios";
import { Button } from "@mui/material";

const DeleteProduct = ({ productID, onProductDeleted }) => {
  const handleDeleteProduct = async () => {
    try {
      await axios.delete("http://localhost:5000/products/delete", {
        data: { ProductID: productID },
      });
      onProductDeleted();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleDeleteProduct}
      sx={{ mt: 2 }}
    >
      Delete Product
    </Button>
  );
};

export default DeleteProduct;
