import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
} from "react-icons/fa";
import axiosClient from "../axios-client";
import {
  Alert,
  AlertTitle,
  Skeleton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Paper,
  IconButton,
  Badge,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SIDEBAR_WIDTH = 320;

const POS = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLoading(true);
    axiosClient.get("/products").then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
    axiosClient
      .get("/categories")
      .then(({ data }) =>
        setCategories([{ id: "all", name: "All" }, ...data.categories])
      );
    axiosClient
      .get("/customers")
      .then(({ data }) => setCustomers(data.customers || []));
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const stock = product.qty ?? product.stock;
    if (existingItem) {
      if (existingItem.quantity < stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else if (stock > 0) {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const stock = item.qty ?? item.stock;
          const newQuantity = item.quantity + change;
          if (newQuantity > stock) return item;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category_id == selectedCategory);

  // Modal handlers
  const handleProcessPayment = () => {
    setOrderError(null);
    setOrderSuccess(null);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleConfirmOrder = () => {
    setLoading(true);
    setOrderError(null);

    const customer_id = customerId ? Number(customerId) : null;
    const orderData = {
      customer_id,
      payment_method: paymentMethod,
      total_amount: getTotal(),
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };
    axiosClient
      .post("/orders", orderData)
      .then(() => {
        setOrderSuccess("Order placed successfully!");
        setShowModal(false);
        setCart([]);
        setCustomerId("");
        setPaymentMethod("cash");
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          setOrderError(
            Object.values(err.response.data.errors).flat().join(" ")
          );
        } else {
          setOrderError(
            err.response?.data?.message ||
              "Failed to place order. Please try again."
          );
        }
      })
      .finally(() => setLoading(false));
  };

  // Count total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Product Cards Area */}
      <Box
        sx={{
          flex: 1,
          pr: orderSummaryOpen && !isMobile ? `${SIDEBAR_WIDTH}px` : 0,
          p: 3,
          width:
            orderSummaryOpen && !isMobile
              ? `calc(100% - ${SIDEBAR_WIDTH}px)`
              : "100%",
          transition: "all 0.3s",
        }}
      >
        {/* Toggle Button (show when closed) */}
        {!orderSummaryOpen && (
          <IconButton
            onClick={() => setOrderSummaryOpen(true)}
            sx={{
              position: "fixed",
              right: 16,
              top: 24,
              zIndex: 1201,
              bgcolor: "#fff",
              boxShadow: 2,
              borderRadius: 2,
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            <Badge
              badgeContent={cartCount > 0 ? cartCount : null}
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <FaShoppingCart size={22} />
            </Badge>
          </IconButton>
        )}

        {/* Category Buttons */}
        <Box mb={2}>
          <Grid container spacing={1}>
            {categories.map((category) => (
              <Grid item key={category.id}>
                <Button
                  variant={
                    selectedCategory == category.id ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  {category.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Product Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  width={225}
                  height={320}
                  sx={{ borderRadius: 4 }}
                />
              ))
            : filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    width: 225,
                    minHeight: 320,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    boxShadow: 6,
                    borderRadius: 4,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.03)",
                      boxShadow: 12,
                    },
                    bgcolor: "#fff",
                  }}
                >
                  {product.image && (
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="130"
                        image={`http://localhost:8000/${product.image}`}
                        alt={product.name}
                        sx={{
                          objectFit: "cover",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      />
                      <Chip
                        label={
                          product.qty ? `Stock: ${product.qty}` : "Out of stock"
                        }
                        color={product.qty ? "info" : "error"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          fontWeight: 700,
                          bgcolor: product.qty ? "#e3f2fd" : "#ffebee",
                          color: product.qty ? "#1976d2" : "#d32f2f",
                        }}
                      />
                    </Box>
                  )}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        mb: 0.5,
                        fontSize: 13,
                      }}
                    >
                      {product.category_name || ""}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      gutterBottom
                      sx={{
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      color="success.main"
                      sx={{
                        mb: 2,
                        fontSize: 24,
                        letterSpacing: 1,
                        textShadow: "0 1px 0 #fff, 0 2px 8px #b9f6ca",
                      }}
                    >
                      ${Number(product.price).toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => addToCart(product)}
                      disabled={(product.qty ?? product.stock) <= 0}
                      sx={{
                        mt: "auto",
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: 2,
                        py: 1,
                        fontSize: 16,
                        textTransform: "none",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </Box>
      </Box>

      {/* Order Summary Sidebar (Right) */}
      <Paper
        elevation={4}
        sx={{
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          maxWidth: SIDEBAR_WIDTH,
          height: "100vh",
          position: "fixed",
          right: orderSummaryOpen ? 0 : `-${SIDEBAR_WIDTH}px`,
          top: 0,
          borderRadius: 0,
          p: 3,
          display: "flex",
          flexDirection: "column",
          zIndex: 1200,
          transition: "right 0.3s",
          boxShadow: orderSummaryOpen ? 4 : 0,
          ...(isMobile && {
            width: "100vw",
            minWidth: "100vw",
            maxWidth: "100vw",
            right: orderSummaryOpen ? 0 : "-100vw",
          }),
        }}
      >
        {/* Toggle Button (hide when open) */}
        <IconButton
          onClick={() => setOrderSummaryOpen(false)}
          sx={{
            position: "absolute",
            left: 8,
            top: 16,
            zIndex: 1300,
            bgcolor: "#fff",
            boxShadow: 2,
            borderRadius: 2,
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
        >
          <Badge
            badgeContent={cartCount > 0 ? cartCount : null}
            color="error"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <FaShoppingCart size={22} />
          </Badge>
        </IconButton>
        <Typography variant="h6" fontWeight={700} mb={2} sx={{ mt: 1 }}>
          Order Summary
        </Typography>
        {orderSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Success</AlertTitle>
            {orderSuccess}
          </Alert>
        )}
        {orderError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {orderError}
          </Alert>
        )}
        {cart.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No items in cart
          </Typography>
        ) : (
          <>
            <Box mb={2} sx={{ flex: 1, overflowY: "auto" }}>
              {cart.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    boxShadow: 1,
                    gap: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                  }}
                >
                  {/* Product Image */}
                  {item.image && (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        overflow: "hidden",
                        mr: 2,
                        flexShrink: 0,
                        border: "1px solid #e0e0e0",
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={`http://localhost:8000/${item.image}`}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                  {/* Product Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      fontWeight={700}
                      sx={{ fontSize: 16, color: "#222" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 13, mb: 0.5 }}
                    >
                      <span style={{ color: "#43a047", fontWeight: 700 }}>
                        ${Number(item.price).toFixed(2)}
                      </span>{" "}
                      &middot;{" "}
                      <Chip
                        label={`Stock: ${item.qty ?? item.stock}`}
                        size="small"
                        color="default"
                        sx={{
                          fontWeight: 600,
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", fontSize: 12 }}
                    >
                      Category: {item.category_name || "-"}
                    </Typography>
                  </Box>
                  {/* Quantity Controls */}
                  <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      sx={{ minWidth: 32, px: 0.5, mr: 1 }}
                    >
                      <FaMinus size={12} />
                    </Button>
                    <Typography mx={1} sx={{ fontWeight: 700 }}>
                      {item.quantity}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= (item.qty ?? item.stock)}
                      sx={{ minWidth: 32, px: 0.5, mr: 1 }}
                    >
                      <FaPlus size={12} />
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      sx={{ minWidth: 32, px: 0.5, ml: 1 }}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${getTotal().toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleProcessPayment}
              disabled={cart.length === 0}
            >
              Process Payment
            </Button>
          </>
        )}
      </Paper>

      {/* Payment Modal */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Process Payment</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please select a customer and payment method to complete the order.
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="customer-label">Customer</InputLabel>
            <Select
              labelId="customer-label"
              value={customerId}
              label="Customer"
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <MenuItem value="">Walk-in Customer</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="payment-label">Payment Method</InputLabel>
            <Select
              labelId="payment-label"
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="ewallet">E-Wallet</MenuItem>
            </Select>
          </FormControl>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Total:
            </Typography>
            <Typography variant="h6" color="success.main" fontWeight={900}>
              ${getTotal().toFixed(2)}
            </Typography>
          </Box>
          {orderError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {orderError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrder}
            color="success"
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={18} color="inherit" />
            }
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default POS;
