import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Switch,
  FormControlLabel,
  LinearProgress,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";

const ProductForm = () => {
  let { id } = useParams();
  const [products, setProducts] = useState({
    id: null,
    name: "",
    price: null,
    qty: null,
    status: "active",
    image: null,
    category_id: null,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const { setNotification } = useStateContext();
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  // Fetch product if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProducts(data.product);
          // If product has image, show toggle and preview
          if (data.product.image) {
            setIsToggled(true);
            setImagePreview(
              `${import.meta.env.VITE_API_BASE_URL}/${data.product.image}`
            );
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Fetch categories
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/categories")
      .then(({ data }) => {
        setLoading(false);
        setCategories(data.categories);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Drag & Drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProducts({ ...products, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProducts({
      ...products,
      image: file,
    });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else if (products.image && typeof products.image === "string") {
      setImagePreview(`/${products.image}`);
    } else {
      setImagePreview(null);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitData = products;
    let config = {};

    if (isToggled) {
      submitData = new FormData();
      Object.entries(products).forEach(([key, value]) => {
        if (key === "image") {
          if (value instanceof File) {
            submitData.append("image", value);
          }
        } else if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });
      config.headers = { "Content-Type": "multipart/form-data" };
      config.onUploadProgress = (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      };
    }

    setProgress(0);

    if (products.id) {
      axiosClient
        .post(`/products/${products.id}?_method=PUT`, submitData, config)
        .then(() => {
          setNotification("Product was successfully updated");
          setOpen(true);
          setTimeout(() => navigate("/products"), 1500);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/products", submitData, config)
        .then(() => {
          setNotification("Product was successfully created");
          setOpen(true);
          setTimeout(() => navigate("/products"), 1500);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 2 }}>
      <Grid item xs={12} md={8} lg={6}>
        <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>
              {products.id ? `Update Product: ${products.name}` : "New Product"}
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Product Name"
                    value={products.name}
                    onChange={(e) =>
                      setProducts({ ...products, name: e.target.value })
                    }
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name && errors.name[0]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    value={products.price || ""}
                    onChange={(e) =>
                      setProducts({ ...products, price: e.target.value })
                    }
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price && errors.price[0]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity"
                    value={products.qty || ""}
                    onChange={(e) =>
                      setProducts({ ...products, qty: e.target.value })
                    }
                    fullWidth
                    error={!!errors.qty}
                    helperText={errors.qty && errors.qty[0]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      value={products.category_id || ""}
                      label="Category"
                      onChange={(e) =>
                        setProducts({
                          ...products,
                          category_id: e.target.value,
                        })
                      }
                      error={!!errors.category_id}
                    >
                      <MenuItem value="" disabled>
                        Select Category
                      </MenuItem>
                      {categories &&
                        categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      value={products.status}
                      label="Status"
                      onChange={(e) =>
                        setProducts({ ...products, status: e.target.value })
                      }
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isToggled}
                        onChange={() => setIsToggled(!isToggled)}
                        color="primary"
                      />
                    }
                    label="Insert Image?"
                  />
                </Grid>
                {isToggled && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={imagePreview ? 3 : 1}
                      sx={{
                        p: 2,
                        border: "2px dashed #1976d2",
                        borderRadius: 3,
                        textAlign: "center",
                        bgcolor: "#f8fafc",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                        "&:hover": { borderColor: "#512da8" },
                      }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FaCloudUploadAlt size={36} color="#1976d2" />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Drag & drop or click to select an image
                        </Typography>
                        {imagePreview && (
                          <Avatar
                            src={imagePreview}
                            alt="Preview"
                            sx={{
                              width: 120,
                              height: 120,
                              mt: 2,
                              border: "2px solid #1976d2",
                            }}
                            variant="rounded"
                          />
                        )}
                      </Box>
                    </Paper>
                    {progress > 0 && progress < 100 && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ mt: 1, display: "block", textAlign: "center" }}
                        >
                          Uploading: {progress}%
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      boxShadow: 2,
                      textTransform: "capitalize",
                      fontSize: 18,
                      mt: 2,
                    }}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 3 }}
              >
                <LinearProgress sx={{ width: "100%" }} />
              </Box>
            )}
          </CardContent>
        </Card>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Product saved successfully!
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default ProductForm;
