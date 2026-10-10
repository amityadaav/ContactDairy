
// const Contact = require("../Models/contact");

// exports.createContact = async (req, res) => {
//   try {
//     const {
//       fname,
//       lname,
//       email,
//       Phone,
//       workplace,
//       Address,
//       Notes,
//       favorite = false,
//     } = req.body;

//     console.log("Received data:", req.body);

//     // Validate required fields (favorite is optional)
//     if (
//       !fname?.trim() ||
//       !lname?.trim() ||
//       !email?.trim() ||
//       !Phone?.trim() ||
//       !workplace?.trim() ||
//       !Address?.trim() ||
//       !Notes?.trim()
//     ) {
//       return res.status(400).json({
//         message: "All contact fields are required.",
//       });
//     }

//     const contact = await Contact.create({
//       fname: fname.trim(),
//       lname: lname.trim(),
//       email: email.trim(),
//       Phone: Phone.trim(),
//       workplace: workplace.trim(),
//       Address: Address.trim(),
//       Notes: Notes.trim(),
//       favorite: Boolean(favorite),
//     });

//     return res.status(201).json({
//       message: "Contact created successfully.",
//       data: contact,
//     });
//   } catch (error) {
//     console.error("Error creating contact:", error);

//     return res.status(500).json({
//       message: "Error creating contact.",
//       error: error.message,
//     });
//   }
// };


// exports.UpdateContact = async (req, res) => {
//   try {
//     const {
//       fname,
//       lname,
//       email,
//       Phone,
//       workplace,
//       Address,
//       Notes,
//       favorite,
//     } = req.body;

//     const updatedData = {};

//     if (fname !== undefined) updatedData.fname = fname;
//     if (lname !== undefined) updatedData.lname = lname;
//     if (email !== undefined) updatedData.email = email;
//     if (Phone !== undefined) updatedData.Phone = Phone;
//     if (workplace !== undefined) updatedData.workplace = workplace;
//     if (Address !== undefined) updatedData.Address = Address;
//     if (Notes !== undefined) updatedData.Notes = Notes;
//     if (favorite !== undefined) updatedData.favorite = favorite;

//     if (Object.keys(updatedData).length === 0) {
//       return res.status(400).json({
//         message: "Please provide at least one field to update",
//       });
//     }

//     const payload = await Contact.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedData },
//       { new: true, runValidators: true }
//     );

//     if (!payload) {
//       return res.status(404).json({
//         message: "Contact not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Contact updated successfully",
//       payload,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// exports.allContacts = async (req, res) => {
//     try {
//         const payload = await Contact.find();

//         if (payload.length === 0) {
//             return res.status(404).json({
//                 message: "Contacts not available. Please add at least one."
//             });
//         }

//         return res.status(200).json({
//             message: "All contacts fetched successfully",
//             payload
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// };


// exports.SingleContact = async (req, res) => {
//     try {
//         const payload = await Contact.findById(req.params.id);

//         if (!payload) {
//             return res.status(404).json({
//                 message: "Contact not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Contact fetched successfully",
//             payload
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// };



// exports.DeleteSingleContact = async (req, res) => {
//     try {
//         const payload = await Contact.deleteOne();

//         if (!payload) {
//             return res.status(404).json({
//                 message: "Contact not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Contact Deleted successfully",
//             payload
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// };

// const deleteContact = async (contact) => {
//   if (!window.confirm("Are you sure you want to delete this contact?")) {
//     return;
//   }

//   try {
//     const response = await fetch(`${CONTACTS_URL}/${contact._id}`, {
//       method: "DELETE",
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Failed to delete contact");
//     }

//     setContacts((previous) =>
//       previous.filter((item) => item._id !== contact._id)
//     );
//   } catch (error) {
//     alert(error.message);
//   }
// };

// exports.UpdateContact = async (req, res) => {
//     try {
//        const { fname, lname, Phone, loc } = req.body;
//        const updatedData={}
//        if(fname!==undefined) updatedData.fname=fname;
//        if(lname!==undefined) updatedData.lname=lname;
//        if(Phone!==undefined) updatedData.Phone=Phone;
//        if(loc!==undefined) updatedData.loc=loc;

//         if(Object.keys(updatedData).length===0){
//           return res.status(400).json({
//                 message: "Please Provide atleast one field to update"
//             });
//         }


//         const payload = await Contact.findByIdAndUpdate(req.params.id,{$set:updatedData},{new :true,runValidators:true});
        

//         if (!payload) {
//             return res.status(404).json({
//                 message: "Contact not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Contact Updated successfully",
//             payload
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// };



// exports.DeleteContactById = async (req, res) => {
//     try {
//         const payload = await Contact.findByIdAndDelete(req.params.id);

//         if (!payload) {
//             return res.status(404).json({
//                 message: "Contact not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Contact Deleted successfully",
//             payload
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             message: "Server Error",
//             error: error.message
//         });
//     }
// };


// ==================================================
// IMPORT CONTACT MODEL
// ==================================================

// Import the Mongoose model used to interact with MongoDB.
const Contact = require("../Models/contact");


// ==================================================
// 1. CREATE CONTACT
// ==================================================

// POST /api/contact
// Saves a new contact in MongoDB.
exports.createContact = async (req, res) => {
  try {
    // Extract contact fields from the frontend request.
    const {
      fname,
      lname,
      email,
      Phone,
      workplace,
      Address,
      Notes,
      favorite = false,
    } = req.body;

    // Check that all required fields are non-empty strings.
    const requiredFields = {
      fname,
      lname,
      email,
      Phone,
      workplace,
      Address,
      Notes,
    };

    const missingField = Object.values(requiredFields).some(
      (value) => typeof value !== "string" || !value.trim()
    );

    if (missingField) {
      return res.status(400).json({
        message: "All contact fields are required.",
      });
    }

    // Ensure favorite is a boolean instead of coercing strings like "false".
    if (typeof favorite !== "boolean") {
      return res.status(400).json({
        message: "Favorite must be true or false.",
      });
    }

    // Create and save the contact document.
    const contact = await Contact.create({
      fname: fname.trim(),
      lname: lname.trim(),
      email: email.trim(),
      Phone: Phone.trim(),
      workplace: workplace.trim(),
      Address: Address.trim(),
      Notes: Notes.trim(),
      favorite,
    });

    // Return the created contact.
    return res.status(201).json({
      message: "Contact created successfully.",
      payload: contact,
    });
  } catch (error) {
    // Log errors for debugging.
    console.error("Create contact error:", error);

    // Return a server error.
    return res.status(500).json({
      message: "Error creating contact.",
      error: error.message,
    });
  }
};


// ==================================================
// 2. GET ALL CONTACTS
// ==================================================

// GET /api/contact
// Returns all contacts stored in MongoDB.
exports.allContacts = async (req, res) => {
  try {
    // Retrieve every contact.
    const payload = await Contact.find();

    // An empty address book is a successful response.
    return res.status(200).json({
      message: payload.length
        ? "All contacts fetched successfully."
        : "No contacts available.",
      payload,
    });
  } catch (error) {
    // Log database errors.
    console.error("Fetch contacts error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ==================================================
// 3. GET SINGLE CONTACT
// ==================================================

// GET /api/contact/:id
// Finds one contact using its MongoDB document ID.
exports.SingleContact = async (req, res) => {
  try {
    // Search for the requested contact.
    const payload = await Contact.findById(req.params.id);

    // Return 404 if the contact does not exist.
    if (!payload) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    // Return the requested contact.
    return res.status(200).json({
      message: "Contact fetched successfully.",
      payload,
    });
  } catch (error) {
    console.error("Fetch single contact error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ==================================================
// 4. UPDATE CONTACT
// ==================================================

// PATCH /api/contact/:id
// Updates supplied fields, including the favorite status.
exports.UpdateContact = async (req, res) => {
  try {
    // Only these fields are allowed to be updated.
    const allowedFields = [
      "fname",
      "lname",
      "email",
      "Phone",
      "workplace",
      "Address",
      "Notes",
      "favorite",
    ];

    // Build an object containing only permitted fields.
    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updatedData[field] = req.body[field];
      }
    }

    // Reject requests that contain no valid fields.
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        message: "Please provide at least one valid field to update.",
      });
    }

    // Validate favorite before saving it.
    if (
      updatedData.favorite !== undefined &&
      typeof updatedData.favorite !== "boolean"
    ) {
      return res.status(400).json({
        message: "Favorite must be true or false.",
      });
    }

    // Update the document and return its new version.
    const payload = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      {
        new: true,
        runValidators: true,
      }
    );

    // Return 404 if the requested contact does not exist.
    if (!payload) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    // Return the updated document.
    return res.status(200).json({
      message: "Contact updated successfully.",
      payload,
    });
  } catch (error) {
    console.error("Update contact error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// ==================================================
// 5. DELETE CONTACT BY ID
// ==================================================

// DELETE /api/contact/:id
// Deletes only the contact matching the supplied MongoDB ID.
exports.DeleteContactById = async (req, res) => {
  try {
    // Find the contact and delete it from the database.
    const payload = await Contact.findByIdAndDelete(req.params.id);

    // Return 404 when no matching contact exists.
    if (!payload) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }

    // Return the deleted document for confirmation.
    return res.status(200).json({
      message: "Contact deleted successfully.",
      payload,
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
