import "./assets/scss/all.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import { Tooltip } from "bootstrap/dist/js/bootstrap.min.js";

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
);
