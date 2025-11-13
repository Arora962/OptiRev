import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [productURL, setProductURL] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productURL.trim() === "") return;
    navigate("/dashboard", { state: { productURL } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow:
                "0 0 25px rgba(63,81,181,0.25), 0 0 40px rgba(156,39,176,0.15)",
              "&:hover": {
                boxShadow:
                  "0 0 35px rgba(63,81,181,0.35), 0 0 55px rgba(156,39,176,0.25)",
              },
              transition: "0.4s ease",
              backgroundColor: "#fff",
              textAlign: "center",
              p: 4,
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#3f51b5",
                }}
              >
                OptiRev 😶‍🌫️
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "#555" }}
              >
                Paste a product link below and let AI break down what customers
                really think!
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Enter Product URL"
                  variant="outlined"
                  fullWidth
                  value={productURL}
                  onChange={(e) => setProductURL(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background:
                        "linear-gradient(90deg, #3f51b5 0%, #9c27b0 100%)",
                      color: "#fff",
                      fontWeight: "bold",
                      py: 1.2,
                      borderRadius: "12px",
                      boxShadow:
                        "0 4px 15px rgba(63,81,181,0.3), 0 4px 30px rgba(156,39,176,0.2)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #3949ab 0%, #8e24aa 100%)",
                      },
                    }}
                  >
                    Analyze Reviews
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
