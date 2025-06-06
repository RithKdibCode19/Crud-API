import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaMoneyBillWave,
} from "react-icons/fa";
import axiosClient from "./axios-client";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  CircularProgress,
} from "@mui/material";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalSales: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosClient.get("/dashboard-summary"),
      axiosClient.get("/orders", { params: { limit: 5 } }),
    ])
      .then(([summaryRes, ordersRes]) => {
        setSummary({
          totalSales: summaryRes.data.totalSales ?? 0,
          orders: summaryRes.data.orders ?? 0,
          products: summaryRes.data.products ?? 0,
          customers: summaryRes.data.customers ?? 0,
        });
        setRecentOrders(ordersRes.data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Overview Title */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        Dashboard Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton
                variant="rounded"
                height={110}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  bgcolor: "#1976d2",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    ${summary.totalSales.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <FaMoneyBillWave size={28} />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  bgcolor: "#388e3c",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Orders
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {summary.orders}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <FaShoppingCart size={28} />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  bgcolor: "#0288d1",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Products
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {summary.products}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <FaBox size={28} />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  bgcolor: "#ff9800",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    Customers
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {summary.customers}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <FaUsers size={28} />
                </Avatar>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>

      {/* Recent Transactions Table */}
      <Paper elevation={4} sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Transactions
        </Typography>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box color="error.main" textAlign="center" py={4}>
            {error}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No recent transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer?.name || "-"}</TableCell>
                      <TableCell>
                        {order.items ? `${order.items.length} items` : "-"}
                      </TableCell>
                      <TableCell>
                        ${Number(order.total_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)
                          }
                          color={
                            order.status === "completed"
                              ? "success"
                              : order.status === "pending"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;
