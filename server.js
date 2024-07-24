const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors middleware
const sql = require("mssql");
const app = express();

app.use(bodyParser.json());
app.use(cors()); // Use cors middleware

const dbConfig = {
  user: "Dev", // Replace with your actual username
  password: "Dev123", // Replace with your actual password
  server: "mcewarehouse.fortiddns.com", // Server name
  port: 9999, // Port number
  database: "SwiftSale", // Replace with your actual database name
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
};
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
        EXEC spLoginBusiness @Email=${email}, @Password=${password}`;

    const businessID = result.recordset[0]?.BusinessID;

    if (businessID) {
      res.json({ businessID });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/business/:businessID/sites", async (req, res) => {
  const { businessID } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
        SELECT s.SiteID, s.SiteName, s.Location
        FROM Site s
        INNER JOIN BusinessSites bs ON s.SiteID = bs.SiteID
        WHERE bs.BusinessID = CAST(${businessID} AS UNIQUEIDENTIFIER)`;

    res.json(result.recordset);
  } catch (err) {
    console.error("Get sites error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/business/:businessID/sales", async (req, res) => {
  const { businessID } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT 
        s.SaleID, 
        s.EmployeeID, 
        s.SaleDate, 
        s.SiteID, 
        s.CloseTime, 
        s.FinalAmount,
        e.FirstName + ' ' + e.LastName AS EmployeeName,
        si.Location AS SiteLocation
      FROM Sales s
      INNER JOIN BusinessSites bs ON s.SiteID = bs.SiteID
      INNER JOIN Site si ON s.SiteID = si.SiteID
      INNER JOIN Employee e ON s.EmployeeID = e.EmployeeID
      WHERE bs.BusinessID = CAST(${businessID} AS UNIQUEIDENTIFIER) AND s.FinalAmount > 0
      ORDER BY s.SaleDate DESC`;

    res.json(result.recordset);
  } catch (err) {
    console.error("Get sales error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/business/:businessID/saleItems", async (req, res) => {
  const { businessID } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
        SELECT si.SaleItemID, si.SaleID, si.ProductID, si.Quantity, si.SiteID
        FROM SaleItems si
        INNER JOIN BusinessSites bs ON si.SiteID = bs.SiteID
        WHERE bs.BusinessID = CAST(${businessID} AS UNIQUEIDENTIFIER)`;

    res.json(result.recordset);
  } catch (err) {
    console.error("Get sale items error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/business/:businessID/products", async (req, res) => {
  const { businessID } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
    SELECT 
      p.ProductID, 
      p.Barcode,
      p.ProductName, 
      p.Description, 
      p.Price, 
      p.PurchasePrice,
      p.Stock, 
      p.Category, 
      p.Supplier,
      s.SiteName
    FROM Product p
    INNER JOIN BusinessSites bs ON p.SiteID = bs.SiteID
    INNER JOIN Site s ON p.SiteID = s.SiteID
    WHERE bs.BusinessID = CAST(${businessID} AS UNIQUEIDENTIFIER)`;

    res.json(result.recordset);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/business/:businessID/recent-sales", async (req, res) => {
  const { businessID } = req.params;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
        EXEC spGetRecentSales @BusinessID=${businessID}`;

    res.json(result.recordset);
  } catch (err) {
    console.error("Get recent sales error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/business/:businessID/best-selling-product", async (req, res) => {
  const { businessID } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      EXEC spGetBestSellingProduct @BusinessID=${businessID}`;
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "No sales data found" });
    }
  } catch (err) {
    console.error("Get best-selling product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/products/add", async (req, res) => {
  const {
    Barcode,
    ProductName,
    Description,
    Price,
    PurchasePrice,
    Stock,
    Category,
    Supplier,
    SiteID,
  } = req.body;

  try {
    await sql.connect(dbConfig);

    const request = new sql.Request();
    request.input("Barcode", sql.NVarChar, Barcode);
    request.input("ProductName", sql.NVarChar, ProductName);
    request.input("Description", sql.NVarChar, Description);
    request.input("Price", sql.Decimal(18, 2), Price);
    request.input("PurchasePrice", sql.Decimal(18, 2), PurchasePrice);
    request.input("Stock", sql.Int, Stock);
    request.input("Category", sql.NVarChar, Category);
    request.input("Supplier", sql.NVarChar, Supplier);
    request.input("SiteID", sql.Int, SiteID);
    request.output("ProductID", sql.Int);

    const result = await request.execute("spAddProduct");
    res.json(result.output.ProductID);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/products/edit", async (req, res) => {
  const {
    ProductID,
    Barcode,
    ProductName,
    Description,
    Price,
    PurchasePrice,
    Stock,
    Category,
    Supplier,
    SiteID,
  } = req.body;

  try {
    await sql.connect(dbConfig);

    const request = new sql.Request();
    request.input("ProductID", sql.Int, ProductID);
    request.input("Barcode", sql.NVarChar, Barcode);
    request.input("ProductName", sql.NVarChar, ProductName);
    request.input("Description", sql.NVarChar, Description);
    request.input("Price", sql.Decimal(18, 2), Price);
    request.input("PurchasePrice", sql.Decimal(18, 2), PurchasePrice);
    request.input("Stock", sql.Int, Stock);
    request.input("Category", sql.NVarChar, Category);
    request.input("Supplier", sql.NVarChar, Supplier);
    request.input("SiteID", sql.Int, SiteID);

    await request.execute("spEditProduct");
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Edit product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/delete", async (req, res) => {
  const { ProductID } = req.body;

  try {
    await sql.connect(dbConfig);
    await sql.query`
      EXEC spSoftDeleteProduct @ProductID=${ProductID}`;

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
