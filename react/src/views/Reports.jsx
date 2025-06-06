import React, { useEffect, useState } from "react";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosClient from "../axios-client";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Snackbar,
  Alert,
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    revenue: 0,
    totalOrders: 0,
    avgOrder: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterReportType, setFilterReportType] = useState("daily");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [startDate, endDate, reportType]);

  const fetchOrders = () => {
    setLoading(true);
    axiosClient
      .get("/orders", {
        params: {
          start_date: startDate,
          end_date: endDate,
          report_type: reportType,
        },
      })
      .then(({ data }) => {
        setOrders(data.orders || []);
        // Calculate summary
        const totalOrders = data.orders.length;
        const revenue = data.orders.reduce(
          (sum, o) => sum + Number(o.total_amount),
          0
        );
        const avgOrder = totalOrders ? revenue / totalOrders : 0;
        setSummary({
          revenue,
          totalOrders,
          avgOrder,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Export Functions

  const handleExportExcel = () => {
    if (!orders.length) {
      setSnackbar({
        open: true,
        message: "No data to export!",
        severity: "warning",
      });
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        Date: order.created_at?.slice(0, 10),
        "Order ID": order.id,
        Customer: order.customer?.name || "",
        Items: `${order.items?.length || 0} items`,
        Amount: Number(order.total_amount).toFixed(2),
        Status: order.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "sales_report.xlsx"
    );
  };

  const handleExportCSV = () => {
    if (!orders.length) {
      setSnackbar({
        open: true,
        message: "No data to export!",
        severity: "warning",
      });
      return;
    }
    const headers = [
      "Date",
      "Order ID",
      "Customer",
      "Items",
      "Amount",
      "Status",
    ];
    const rows = orders.map((order) => [
      order.created_at?.slice(0, 10),
      order.id,
      order.customer?.name || "",
      `${order.items?.length || 0} items`,
      Number(order.total_amount).toFixed(2),
      order.status,
    ]);
    let csvContent =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales_report.csv");
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Only fetch when filter button is clicked
  const handleFilter = () => {
    setStartDate(filterStartDate);
    setEndDate(filterEndDate);
    setReportType(filterReportType);
  };

  return (
    <div>
      <h2 className="mb-4">Reports & Analytics</h2>

      {/* Date Range Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="end"
          >
            <TextField
              label="Start Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              sx={{ minWidth: 150 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                label="Report Type"
                value={filterReportType}
                onChange={(e) => setFilterReportType(e.target.value)}
              >
                <MenuItem value="daily">Daily Sales</MenuItem>
                <MenuItem value="weekly">Weekly Sales</MenuItem>
                <MenuItem value="monthly">Monthly Sales</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={{ minWidth: 100 }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              color="success"
              endIcon={<FaFileExcel />}
              onClick={handleExportExcel}
              sx={{ minWidth: 100 }}
            >
              Excel
            </Button>
            <Button
              variant="contained"
              color="info"
              endIcon={<FaFileCsv />}
              onClick={handleExportCSV}
              sx={{ minWidth: 100 }}
            >
              CSV
            </Button>
          </Stack>
        </div>
      </div>

      {/* Summary Cards */}
      <Box display="flex" gap={3} flexWrap="wrap" mb={4}>
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            minWidth: 250,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            p: 3,
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Total Revenue
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              ${summary.revenue.toLocaleString()}
            </Typography>
          </Box>
          <FaChartLine size={36} />
        </Paper>
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            minWidth: 250,
            bgcolor: "success.main",
            color: "success.contrastText",
            p: 3,
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Total Orders
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {summary.totalOrders}
            </Typography>
          </Box>
          <FaChartBar size={36} />
        </Paper>
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            minWidth: 250,
            bgcolor: "info.main",
            color: "info.contrastText",
            p: 3,
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Avg Order Value
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              ${summary.avgOrder.toFixed(2)}
            </Typography>
          </Box>
          <FaChartPie size={36} />
        </Paper>
      </Box>

      {/* Sales Table */}
      <Paper elevation={4} sx={{ borderRadius: 3, boxShadow: 4 }}>
        <Box p={2}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Sales Details
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.created_at?.slice(0, 10)}</TableCell>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer?.name || ""}</TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Reports;
