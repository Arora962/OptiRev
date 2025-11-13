import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #3f51b5 0%, #9c27b0 100%)",
        boxShadow: "0 4px 20px rgba(63,81,181,0.3)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <motion.span
            animate={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: 0.5,
              }}
            >
              OptiRev
            </Typography>
          </motion.span>
        </Box>

        <Box>
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
