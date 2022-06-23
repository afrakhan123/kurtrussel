import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Alert,
  Snackbar,
  Tooltip,
  FormControl,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ItemCard from "../ItemCard/index";
import React, { useEffect, useState } from "react";
import "./index.css";
import logo from "../../assets/logo.png";
import noitems from "../../assets/no-items-img.png"
import LoadComponent from '../LoadComponent/index'
import { useFormik, formik } from "formik";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../Configs/firebase";
import { onValue, ref, remove, set, update } from "firebase/database";

const sampleCategory = ["Burger", "Fries", "Drinks"];
const sampleVariation = [
  {
    variationName: "Meal Type",
    variationTypes: ["Regular", " Ala Carte"],
  },
  {
    variationName: "Beverage Sizes",
    variationTypes: ["Small", " Medium", " Large"],
  },
];
const sampleObj = [
  {
    name: "Hotdog Sandwich",
    category: sampleCategory[0],
    variation: sampleVariation[0],
    price: 23,
    cost: 45,
    stocks: 13,
  },
  {
    name: "Egg Sandwich",
    category: sampleCategory[0],
    variation: sampleVariation[0],
    price: 2,
    cost: 245,
    stocks: 193,
  },
  {
    name: "MilkShake",
    category: sampleCategory[2],
    variation: sampleVariation[1],
    price: 22,
    cost: 5,
    stocks: 213,
  },
];

const validationSchema = yup.object({
  name: yup.string("Enter item name").required("Name is required"),
  category: yup.string("Enter item category").required("Category is required"),
  price: yup
    .number("Enter item price")
    .required("Price is required")
    .typeError("you must specify a number"),
  cost: yup
    .number("Enter item cost")
    .required("Cost is required")
    .typeError("you must specify a number"),
  stocks: yup
    .number("Enter item password")
    .required("Stocks is required")
    .typeError("you must specify a number"),
  variation: yup.lazy((value) =>
    typeof value === "object"
      ? yup.object().required("Required field").typeError("Required field")
      : yup.boolean().required("Required field")
  ),
});

function MainComponent() {
  const [category, setCategory] = useState("All");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarMess, setSnackbarMess] = useState("");
  const [items, setItems] = useState(null);
  const [filteredItems, setFilteredItems] = useState(null);
  const [variation, setVariation] = useState(null);

  useEffect(() => {
    onValue(ref(db, "/items/"), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data) {
        const res = Object.values(data);
        setItems(res);
      } else {
        setItems([]);
        setFilteredItems([]);
      }
    });
  }, []);

useEffect(()=>{
  if(category==="All"){
    setFilteredItems(items)
  }else{
    setFilteredItems(()=>items.filter((curr,idx)=>curr.category == category))
  }
},[items])
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setVariation(null);
    formik.resetForm();
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (event.target.value == "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(() => {
        return items.filter((curr) => curr.category == event.target.value);
      });
    }
  };

  function handleItemDelete(idx) {
    remove(ref(db,`/items/${filteredItems[idx].id}`))
  }

  function handleSnackbarMess(mess) {
    setSnackbarMess(mess);
    setIsSnackbarOpen(true);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      variation: "",
      price: "",
      cost: "",
      stocks: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const uid = uuidv4();
      set(ref(db, `/items/${uid}`), { id: uid, ...values });
      setSnackbarMess(`${values.name} item has been added.`);
      setIsSnackbarOpen(true);
      handleModalClose();
      resetForm({ values: "" });
    },
  });
  if (items == null || filteredItems == null) return <LoadComponent/>;
  return (
    <>
      <div className="main-container">
        <div className="header-nav-container">
          <img src={logo} className="logo" />
          <div className="filter-container">
            <Tooltip title="Add Item" className="add-btn">
              <AddIcon
                style={{ cursor: "pointer" }}
                onClick={handleModalOpen}
              />
            </Tooltip>

            <TextField
              id="demo-simple-select"
              value={category}
              label="Filter by category"
              select
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <MenuItem value={"All"}>All</MenuItem>
              {sampleCategory.map((curr) => (
                <MenuItem value={curr}>{curr}</MenuItem>
              ))}
            </TextField>
          </div>
        </div>

        <div className="items-container">
          {filteredItems.length !==0?
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >

              {filteredItems.map((curr, idx) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={idx}>
                    <div>
                    <ItemCard
                      obj={curr}
                      deleteItem={handleItemDelete}
                      itemIdx={idx}
                      snackbarMess={handleSnackbarMess}
                      fakeCategory={sampleCategory}
                      fakeVariation={sampleVariation}
                    />
                    </div>
                  </Grid>
                );
              })}
          </Grid>:
          <div className="no-items-container">
            <img src={noitems} className="no-items-img"/>
            <div>No items to display</div>
          </div>
          }
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal-box">
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-header">
              <h1 className="modal-text">Add Item</h1>
            </div>
            <div className="grid-container">
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={12} md={6} className="grid-item">
                  <div className="textfield-container">
                    <TextField
                      id="name"
                      name="name"
                      label="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      className="add-modal-textfield"
                    />
                  </div>
                </Grid>
                <Grid item xs={13} md={6} className="grid-item">
                  <div className="textfield-container">
                    <TextField
                      id="category"
                      select
                      name="category"
                      label="Category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                      helperText={
                        formik.touched.category && formik.errors.category
                      }
                      className="add-modal-select"
                    >
                      {sampleCategory.map((curr) => (
                        <MenuItem value={curr}>{curr}</MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className="grid-item">
                  <div className="textfield-container">
                    <TextField
                      id="price"
                      name="price"
                      label="Price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                      helperText={formik.touched.price && formik.errors.price}
                      className="add-modal-textfield"
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className="grid-item">
                  <div className="textfield-container">
                    <TextField
                      id="cost"
                      name="cost"
                      label="Cost"
                      value={formik.values.cost}
                      onChange={formik.handleChange}
                      error={formik.touched.cost && Boolean(formik.errors.cost)}
                      helperText={formik.touched.cost && formik.errors.cost}
                      className="add-modal-textfield"
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="textfield-container">
                    <TextField
                      id="stocks"
                      name="stocks"
                      label="Stocks"
                      value={formik.values.stocks}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.stocks && Boolean(formik.errors.stocks)
                      }
                      helperText={formik.touched.stocks && formik.errors.stocks}
                      className="add-modal-textfield"
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className="grid-item">
                  <div className="textfield-container">
                    <TextField
                      id="variation"
                      name="variation"
                      label="Variation"
                      select
                      value={formik.values.variation}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setVariation(e.target.value);
                      }}
                      error={
                        formik.touched.variation &&
                        Boolean(formik.errors.variation)
                      }
                      helperText={
                        formik.touched.variation && formik.errors.variation
                      }
                      className="add-modal-select"
                    >
                      <MenuItem value={false}>None</MenuItem>
                      {sampleVariation.map((curr) => (
                        <MenuItem value={curr}>{curr.variationName}</MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Grid>
              </Grid>
            </div>
            {variation && (
              <div className="variation-display">
                <b>Variation Name : </b>
                <span>{`${variation.variationName}`}</span>
                <br />
                <b>Item subtypes : </b>
                <span>{`${variation.variationTypes}`}</span>
              </div>
            )}
            <div className="modal-btn">
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMess}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MainComponent;
