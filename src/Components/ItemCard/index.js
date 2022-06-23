import {
  Button,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import "./index.css";
import * as yup from "yup";
import { useFormik } from "formik";
import { ref, update } from "firebase/database";
import { db } from "../../Configs/firebase";

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

function ItemCard({
  obj: { name, category, variation, price, cost, stocks, id },
  deleteItem,
  itemIdx,
  snackbarMess,
  fakeCategory,
  fakeVariation,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayVariation, setDisplayVariation] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDisplayVariation(variation);
  }, [variation]);

  const handleEdit = () => setIsEditing(!isEditing);
  const handleModalOpen = () => {
    setIsModalOpen(true);
    console.log("init var", variation);
  };
  const handleModalClose = () => {
    formik.resetForm();
    setIsModalOpen(false);
    setIsEditing(false);
    setDisplayVariation(variation);
  };

  const formik = useFormik({
    initialValues: {
      name: name,
      category: category,
      variation: variation,
      price: price,
      cost: cost,
      stocks: stocks,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      update(ref(db, `/items/${id}`), { ...values, id: id });
      snackbarMess(`${name} item updated.`);
      handleModalClose();
    },
    enableReinitialize: true,
  });

  return (
    <>
      <div className="card-container" onClick={handleModalOpen}>
        <h1 className="card-name">{name}</h1>
        <div className="card-category">{category}</div>
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
              <h1 className="modal-text">Item details</h1>
              <div className="item-action-container">
                <Tooltip title="Edit Item">
                  <ModeEditIcon
                    color="primary"
                    onClick={handleEdit}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Tooltip
                  title="Delete Item"
                  color="primary"
                  style={{ cursor: "pointer" }}
                >
                  <DeleteIcon
                    onClick={() => {
                      deleteItem(itemIdx);
                      snackbarMess(`${name} item deleted.`);
                      handleModalClose();
                    }}
                  />
                </Tooltip>
              </div>
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
                      inputProps={{ readOnly: !isEditing }}
                      className="add-modal-textfield"
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className="grid-item">
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
                      inputProps={{ readOnly: !isEditing }}
                      className="add-modal-select"
                    >
                      {fakeCategory.map((curr) => (
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
                      inputProps={{ readOnly: !isEditing }}
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
                      inputProps={{ readOnly: !isEditing }}
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
                      inputProps={{ readOnly: !isEditing }}
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
                        setDisplayVariation(e.target.value);
                      }}
                      error={
                        formik.touched.variation &&
                        Boolean(formik.errors.variation)
                      }
                      helperText={
                        formik.touched.variation && formik.errors.variation
                      }
                      className="add-modal-select"
                      inputProps={{ readOnly: !isEditing }}
                    >
                      <MenuItem value={false}>None</MenuItem>
                      {fakeVariation.map((curr) => (
                        <MenuItem value={curr}>{curr.variationName}</MenuItem>
                      ))}
                    </TextField>
                  </div>
                </Grid>
              </Grid>
            </div>
            {displayVariation && (
              <div className="variation-display">
                <b>Variation Name : </b>
                <span>{`${displayVariation.variationName}`}</span>
                <br />
                <b>Item subtypes : </b>
                <span>{`${displayVariation.variationTypes}`}</span>
              </div>
            )}
            {isEditing && (
              <div className="modal-btn">
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </div>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
}

export default ItemCard;
