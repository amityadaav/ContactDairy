// const express = require("express");
// const { createContact, allContacts, SingleContact, DeleteSingleContact,DeleteContactById ,UpdateContact } = require("../controller/cntController");

// const router = express.Router();

// router.post("/contact", createContact);
// router.get("/contact", allContacts);
// router.get("/contact/:id", SingleContact);
// router.delete("/contact/", DeleteSingleContact);
// router.delete("/contact/:id", DeleteContactById);
// router.patch("/contact/:id", UpdateContact)

// module.exports = router;


// ======================================================
// IMPORT EXPRESS AND CONTROLLER FUNCTIONS
// ======================================================



const express = require("express");
const router = express.Router();

const {
  createContact,
  allContacts,
  SingleContact,
  UpdateContact,
  DeleteContactById,
} = require("../controller/cntController");

router.post("/contact", createContact);
router.get("/contact", allContacts);
router.get("/contact/:id", SingleContact);
router.patch("/contact/:id", UpdateContact);
router.delete("/contact/:id", DeleteContactById);

module.exports = router;
